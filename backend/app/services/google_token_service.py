import requests
from sqlalchemy.orm import Session

from app.config import settings
from app.models.google_token import GoogleToken

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


def refresh_google_access_token(db: Session, google_token: GoogleToken) -> str:
    if not google_token.refresh_token:
        raise ValueError("No refresh token available for this user")

    payload = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": google_token.refresh_token,
        "grant_type": "refresh_token",
    }

    response = requests.post(GOOGLE_TOKEN_URL, data=payload, timeout=30)

    if not response.ok:
        response.raise_for_status()

    token_data = response.json()

    new_access_token = token_data.get("access_token")
    if not new_access_token:
        raise ValueError("No access token returned from Google refresh")

    google_token.access_token = new_access_token

    if token_data.get("scope"):
        google_token.scope = token_data["scope"]

    if token_data.get("token_type"):
        google_token.token_type = token_data["token_type"]

    db.commit()
    db.refresh(google_token)

    return new_access_token