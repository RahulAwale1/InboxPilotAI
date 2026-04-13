from datetime import datetime

from pydantic import BaseModel


class JobResponse(BaseModel):
    id: int
    user_id: int
    source_email_id: int
    company: str
    job_title: str
    status: str
    last_updated: datetime

    class Config:
        from_attributes = True