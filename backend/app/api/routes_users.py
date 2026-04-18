from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserResponse

router = APIRouter()


@router.post("/users/sync", response_model=UserResponse)
def sync_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        existing_user.name = user_data.name
        existing_user.image_url = user_data.image_url
        db.commit()
        db.refresh(existing_user)
        return existing_user

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        image_url=user_data.image_url,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from datetime import timedelta
from app.auth.jwt import create_access_token


@router.get("/test-token")
def test_token():
    token = create_access_token(
        data={"sub": "1", "email": "test@example.com"},
        expires_delta=timedelta(minutes=60),
    )
    return {"token": token}

from app.auth.dependencies import get_current_user


@router.get("/test-protected")
def test_protected(current_user = Depends(get_current_user)):
    return {"user": current_user.email}