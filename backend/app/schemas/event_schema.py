from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class EventResponse(BaseModel):
    id: int
    user_id: int
    email_log_id: int
    title: str
    event_date: date
    event_time: Optional[str] = None
    description: Optional[str] = None
    calendar_event_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True