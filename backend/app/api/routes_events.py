from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.event import Event
from app.models.user import User
from app.schemas.event_schema import EventResponse
from app.schemas.pagination_schema import PaginatedResponse, build_paginated_response

router = APIRouter()


@router.get("/events", response_model=PaginatedResponse[EventResponse])
def get_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status_filter: str | None = Query(None),
):
    query = db.query(Event).filter(Event.user_id == current_user.id)

    if status_filter:
        query = query.filter(Event.status == status_filter)

    query = query.order_by(Event.created_at.desc())

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return build_paginated_response(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )