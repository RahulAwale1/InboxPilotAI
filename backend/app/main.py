from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.config import settings
from app.db import Base, engine
from app.models import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up application...")

    Base.metadata.create_all(bind=engine)

    yield

    # Shutdown logic (optional for now)
    print("Shutting down application...")

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {"status": "ok", "database_response": value}