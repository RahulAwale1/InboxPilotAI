from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.jwt import create_access_token
from app.auth.oauth import oauth
from app.config import settings
from app.db import get_db
from app.models.google_token import GoogleToken
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authentication failed: {str(e)}",
        )

    userinfo = token.get("userinfo")
    if not userinfo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve user info from Google",
        )

    email = userinfo.get("email")
    name = userinfo.get("name") or "Google User"
    image_url = userinfo.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email not available",
        )

    user = db.query(User).filter(User.email == email).first()

    if user:
        user.name = name
        user.image_url = image_url
    else:
        user = User(
            name=name,
            email=email,
            image_url=image_url,
        )
        db.add(user)
        db.flush()

    google_token = db.query(GoogleToken).filter(GoogleToken.user_id == user.id).first()

    if google_token:
        google_token.access_token = token.get("access_token", "")
        google_token.refresh_token = token.get("refresh_token")
        google_token.token_type = token.get("token_type")
        google_token.expires_at = token.get("expires_at")
        google_token.scope = token.get("scope")
    else:
        google_token = GoogleToken(
            user_id=user.id,
            access_token=token.get("access_token", ""),
            refresh_token=token.get("refresh_token"),
            token_type=token.get("token_type"),
            expires_at=token.get("expires_at"),
            scope=token.get("scope"),
        )
        db.add(google_token)

    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
        }
    )

    response = RedirectResponse(url=settings.FRONTEND_URL, status_code=302)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # set True in production with HTTPS
        samesite="lax",
        max_age=60 * settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        path="/",
    )
    return response


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "image_url": current_user.image_url,
    }


@router.post("/logout")
def logout():
    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/login", status_code=302)
    response.delete_cookie(key="access_token", path="/")
    return response