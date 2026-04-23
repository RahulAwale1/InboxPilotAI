from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.email_log import EmailLog
from app.models.google_token import GoogleToken
from app.models.user import User
from app.schemas.sync_schema import SyncResponse
from app.services.gmail_service import get_latest_emails
from app.services.llm_service import analyze_email
from app.models.job import Job
from app.models.event import Event
from app.services.calendar_service import create_calendar_event
from app.services.job_service import find_existing_job, merge_job_status
from app.services.google_api_utils import is_google_auth_error
from app.services.google_token_service import refresh_google_access_token
from app.services.event_service import find_existing_event
from app.services.event_service import find_existing_event, cancel_events_for_job

router = APIRouter(tags=["sync"])


@router.post("/sync", response_model=SyncResponse)
def sync_inbox(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    google_token = (
        db.query(GoogleToken)
        .filter(GoogleToken.user_id == current_user.id)
        .first()
    )

    if not google_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token not found for this user",
        )

    try:
        emails = get_latest_emails(
            access_token=google_token.access_token,
            max_results=10,
        )
    except Exception as e:
        print("INITIAL GMAIL FETCH FAILED:", repr(e))
        if is_google_auth_error(e):
            try:
                new_access_token = refresh_google_access_token(db, google_token)
                print("REFRESHED ACCESS TOKEN, RETRYING GMAIL FETCH")
                emails = get_latest_emails(
                    access_token=new_access_token,
                    max_results=10,
                )
            except Exception as refresh_error:
                print("REFRESH OR RETRY FAILED:", repr(refresh_error))
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to refresh Google token or fetch Gmail messages: {str(refresh_error)}",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch Gmail messages: {str(e)}",
            )

    inserted_count = 0
    skipped_count = 0

    for email in emails:
        existing_log = (
            db.query(EmailLog)
            .filter(EmailLog.gmail_message_id == email["gmail_message_id"])
            .first()
        )

        if existing_log:
            skipped_count += 1
            continue

        job_data = None
        event_data = None
        category = "other"

        try:
            analysis = analyze_email(
                subject=email["subject"] or "",
                body_preview=email["body_preview"] or "",
            )
            print("SUBJECT:", email["subject"])
            print("ANALYSIS:", analysis)
            
            category = analysis.get("category", "other")
            job_data = analysis.get("job")
            event_data = analysis.get("event")
        except Exception as e:
            print(f"AI analysis failed for email {email['gmail_message_id']}: {e}")

        new_log = EmailLog(
            user_id=current_user.id,
            gmail_message_id=email["gmail_message_id"],
            sender=email["sender"] or "Unknown Sender",
            subject=email["subject"] or "(No Subject)",
            body_preview=email["body_preview"] or "",
            category=category,
            action_taken=None,
            status="fetched",
        )

        db.add(new_log)
        db.flush()

        if category == "job" and job_data:
            company = job_data.get("company")
            role = job_data.get("role")
            status_value = job_data.get("status")

            existing_job = find_existing_job(
                db=db,
                user_id=current_user.id,
                company=company,
                role=role,
            )

            if existing_job:
                old_status = existing_job.status
                new_status = merge_job_status(existing_job.status, status_value)

                existing_job.status = new_status
                existing_job.source_email_id = new_log.id

                if company and existing_job.company in ["Unknown", "Unknown Company"]:
                    existing_job.company = company

                if role and existing_job.job_title in ["Unknown Role", "Unknown"]:
                    existing_job.job_title = role

                if new_status == "rejected" and old_status != "rejected":
                    cancelled_count = cancel_events_for_job(
                        db=db,
                        user_id=current_user.id,
                        job_id=existing_job.id,
                    )
                    print(f"Cancelled {cancelled_count} event(s) for rejected job {existing_job.id}")

                job_record = existing_job

            else:
                new_job = Job(
                    user_id=current_user.id,
                    source_email_id=new_log.id,
                    company=company or "Unknown Company",
                    job_title=role or "Unknown Role",
                    status=status_value or "applied",
                )
                db.add(new_job)
                db.flush()
                job_record = new_job

        if event_data:
            title = event_data.get("title")
            date = event_data.get("date")
            time = event_data.get("time")

            if title and date:
                existing_event = find_existing_event(
                    db=db,
                    user_id=current_user.id,
                    title=title,
                    event_date=date,
                    event_time=time,
                )

                if existing_event:
                    print(f"Skipping duplicate event: {title} on {date} {time}")
                else:
                    calendar_event_id = None

                    try:
                        calendar_response = create_calendar_event(
                            access_token=google_token.access_token,
                            title=title,
                            event_date=date,
                            event_time=time,
                            description=f"Created from email: {email['subject']}",
                        )
                        calendar_event_id = calendar_response.get("id")
                    except Exception as e:
                        if is_google_auth_error(e):
                            try:
                                new_access_token = refresh_google_access_token(db, google_token)
                                calendar_response = create_calendar_event(
                                    access_token=new_access_token,
                                    title=title,
                                    event_date=date,
                                    event_time=time,
                                    description=f"Created from email: {email['subject']}",
                                )
                                calendar_event_id = calendar_response.get("id")
                            except Exception as refresh_error:
                                print(f"Calendar event creation failed after token refresh: {refresh_error}")
                        else:
                            print(f"Calendar event creation failed: {e}")

                    linked_job_id = None
                    if category == "job" and 'job_record' in locals():
                        linked_job_id = job_record.id

                    new_event = Event(
                        user_id=current_user.id,
                        email_log_id=new_log.id,
                        job_id=linked_job_id,
                        title=title,
                        event_date=date,
                        event_time=time,
                        description=f"Created from email: {email['subject']}",
                        calendar_event_id=calendar_event_id,
                        status="active",
                    )
                    db.add(new_event)

        inserted_count += 1

    db.commit()

    return SyncResponse(
        message="Inbox synced successfully",
        user_id=current_user.id,
        email=current_user.email,
        has_google_token=True,
        fetched_count=len(emails),
        inserted_count=inserted_count,
        skipped_count=skipped_count,
    )