from typing import Optional

from sqlalchemy.orm import Session

from app.models.event import Event


def find_existing_event(
    db: Session,
    user_id: int,
    title: Optional[str],
    event_date: Optional[str],
    event_time: Optional[str],
) -> Optional[Event]:
    if not title or not event_date:
        return None

    query = db.query(Event).filter(
        Event.user_id == user_id,
        Event.title == title,
        Event.event_date == event_date,
    )

    if event_time:
        query = query.filter(Event.event_time == event_time)
    else:
        query = query.filter(Event.event_time.is_(None))

    return query.first()