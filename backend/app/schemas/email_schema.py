from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EmailLogResponse(BaseModel):
    id: int
    user_id: int
    gmail_message_id: str
    sender: str
    subject: str
    body_preview: Optional[str] = None
    category: str
    action_taken: Optional[str] = None
    status: str
    processed_at: datetime

    class Config:
        from_attributes = True