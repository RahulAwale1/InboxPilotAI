from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.email_log import EmailLog
from app.models.user import User
from app.schemas.email_schema import EmailLogResponse
from app.schemas.pagination_schema import PaginatedResponse, build_paginated_response

router = APIRouter()


@router.get("/logs", response_model=PaginatedResponse[EmailLogResponse])
def get_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category_filter: str | None = Query(None),
    search: str | None = Query(None),
):
    query = db.query(EmailLog).filter(EmailLog.user_id == current_user.id)

    if category_filter:
        query = query.filter(EmailLog.category == category_filter)

    if search:
        query = query.filter(
            or_(
                EmailLog.sender.ilike(f"%{search}%"),
                EmailLog.subject.ilike(f"%{search}%"),
            )
        )

    query = query.order_by(EmailLog.processed_at.desc())

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return build_paginated_response(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )