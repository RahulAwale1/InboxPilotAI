import re
from typing import Optional

from sqlalchemy.orm import Session

from app.models.job import Job


def normalize_text(value: Optional[str]) -> str:
    if not value:
        return ""

    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s]", "", value)
    value = re.sub(r"\s+", " ", value)
    return value


def find_existing_job(
    db: Session,
    user_id: int,
    company: Optional[str],
    role: Optional[str],
) -> Optional[Job]:
    normalized_company = normalize_text(company)
    normalized_role = normalize_text(role)

    jobs = db.query(Job).filter(Job.user_id == user_id).all()

    for job in jobs:
        job_company = normalize_text(job.company)
        job_role = normalize_text(job.job_title)

        # Strongest match: both company and role match
        if normalized_company and normalized_role:
            if job_company == normalized_company and job_role == normalized_role:
                return job

        # Fallback: role matches and company is missing on one side
        if normalized_role and job_role == normalized_role:
            return job

        # Fallback: company matches and role is missing on one side
        if normalized_company and job_company == normalized_company:
            return job

    return None


def merge_job_status(old_status: str, new_status: Optional[str]) -> str:
    if not new_status:
        return old_status

    priority = {
        "applied": 1,
        "interview": 2,
        "rejected": 3,
        "offer": 4,
    }

    old_score = priority.get(old_status, 0)
    new_score = priority.get(new_status, 0)

    return new_status if new_score >= old_score else old_status