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

            existing_job = (
                db.query(Job)
                .filter(
                    Job.user_id == current_user.id,
                    Job.company == (company or "Unknown"),
                    Job.job_title == (role or "Unknown Role"),
                )
                .first()
            )

            if existing_job:
                if status_value:
                    existing_job.status = status_value
            else:
                new_job = Job(
                    user_id=current_user.id,
                    source_email_id=new_log.id,
                    company=company or "Unknown",
                    job_title=role or "Unknown Role",
                    status=status_value or "applied",
                )
                db.add(new_job)

        if event_data:
            title = event_data.get("title")
            date = event_data.get("date")
            time = event_data.get("time")

            if title and date:
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
                    print(f"Calendar event creation failed: {e}")

                new_event = Event(
                    user_id=current_user.id,
                    email_log_id=new_log.id,
                    title=title,
                    event_date=date,
                    event_time=time,
                    description=f"Created from email: {email['subject']}",
                    calendar_event_id=calendar_event_id,
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