from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.job import Job
from app.models.user import User
from app.schemas.job_schema import JobResponse
from app.schemas.pagination_schema import PaginatedResponse, build_paginated_response

router = APIRouter()


@router.get("/jobs", response_model=PaginatedResponse[JobResponse])
def get_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status_filter: str | None = Query(None),
    search: str | None = Query(None),
):
    query = db.query(Job).filter(Job.user_id == current_user.id)

    if status_filter:
        query = query.filter(Job.status == status_filter)

    if search:
        query = query.filter(
            or_(
                Job.company.ilike(f"%{search}%"),
                Job.job_title.ilike(f"%{search}%"),
            )
        )

    query = query.order_by(Job.last_updated.desc())

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return build_paginated_response(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )