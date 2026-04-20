from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.email_log import EmailLog
from app.models.google_token import GoogleToken
from app.models.user import User
from app.schemas.sync_schema import SyncResponse
from app.services.gmail_service import get_latest_emails

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

        new_log = EmailLog(
            user_id=current_user.id,
            gmail_message_id=email["gmail_message_id"],
            sender=email["sender"] or "Unknown Sender",
            subject=email["subject"] or "(No Subject)",
            body_preview=email["body_preview"] or "",
            category="unclassified",
            action_taken=None,
            status="fetched",
        )

        db.add(new_log)
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