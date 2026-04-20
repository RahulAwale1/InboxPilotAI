from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.job import Job
from app.models.user import User
from app.schemas.job_schema import JobResponse

router = APIRouter()


@router.get("/jobs", response_model=List[JobResponse])
def get_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .order_by(Job.last_updated.desc())
        .all()
    )
    return jobs