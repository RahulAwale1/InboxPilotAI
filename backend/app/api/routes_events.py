from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db import get_db
from app.models.event import Event
from app.models.user import User
from app.schemas.event_schema import EventResponse

router = APIRouter()


@router.get("/events", response_model=List[EventResponse])
def get_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    events = (
        db.query(Event)
        .filter(Event.user_id == current_user.id)
        .order_by(Event.created_at.desc())
        .all()
    )
    return events