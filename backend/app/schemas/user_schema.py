from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    image_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True