from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.email_log import EmailLog
from app.models.user import User
from app.schemas.email_schema import EmailLogResponse

router = APIRouter()


@router.get("/logs", response_model=List[EmailLogResponse])
def get_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(EmailLog)
        .filter(EmailLog.user_id == current_user.id)
        .order_by(EmailLog.processed_at.desc())
        .all()
    )
    return logs