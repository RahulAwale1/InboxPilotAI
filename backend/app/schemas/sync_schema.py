from pydantic import BaseModel


class SyncResponse(BaseModel):
    message: str
    user_id: int
    email: str
    has_google_token: bool
    fetched_count: int
    inserted_count: int
    skipped_count: int