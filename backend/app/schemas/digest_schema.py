from pydantic import BaseModel


class CareerDigestResponse(BaseModel):
    headline: str
    summary: str
    highlights: list[str]
    action_items: list[str]