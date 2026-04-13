from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.email_log import EmailLog
from app.schemas.email_schema import EmailLogResponse

router = APIRouter()


@router.get("/logs", response_model=List[EmailLogResponse])
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(EmailLog).order_by(EmailLog.processed_at.desc()).all()
    return logs