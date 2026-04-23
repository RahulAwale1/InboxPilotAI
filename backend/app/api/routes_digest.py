from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.email_log import EmailLog
from app.models.event import Event
from app.models.job import Job
from app.models.user import User
from app.schemas.digest_schema import CareerDigestResponse
from app.services.digest_service import generate_career_digest

router = APIRouter(tags=["digest"])


@router.get("/digest", response_model=CareerDigestResponse)
def get_career_digest(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recent_logs = (
        db.query(EmailLog)
        .filter(
            EmailLog.user_id == current_user.id,
            EmailLog.category.in_(["job", "event"])
        )
        .order_by(EmailLog.processed_at.desc())
        .limit(10)
        .all()
    )

    current_jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .order_by(Job.last_updated.desc())
        .limit(10)
        .all()
    )

    recent_events = (
        db.query(Event)
        .filter(Event.user_id == current_user.id, Event.status == "active")
        .order_by(Event.created_at.desc())
        .limit(10)
        .all()
    )

    logs_data = [
        {
            "sender": log.sender,
            "subject": log.subject,
            "category": log.category,
            "action_taken": log.action_taken,
            "processed_at": str(log.processed_at),
        }
        for log in recent_logs
    ]

    jobs_data = [
        {
            "company": job.company,
            "job_title": job.job_title,
            "status": job.status,
            "last_updated": str(job.last_updated),
        }
        for job in current_jobs
    ]

    events_data = [
        {
            "title": event.title,
            "event_date": str(event.event_date),
            "event_time": event.event_time,
            "calendar_event_id": event.calendar_event_id,
        }
        for event in recent_events
    ]

    try:
        digest = generate_career_digest(
            logs=logs_data,
            jobs=jobs_data,
            events=events_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career digest: {str(e)}",
        )

    return CareerDigestResponse(**digest)