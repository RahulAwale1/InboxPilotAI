from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app import models
from app.config import settings
from app.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up application...")
    Base.metadata.create_all(bind=engine)
    yield
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