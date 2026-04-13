from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app import models
from app.api.routes_events import router as events_router
from app.api.routes_jobs import router as jobs_router
from app.api.routes_logs import router as logs_router
from app.config import settings
from app.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up application...")
    Base.metadata.create_all(bind=engine)
    yield
    print("Shutting down application...")


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.include_router(events_router)
app.include_router(jobs_router)
app.include_router(logs_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {"status": "ok", "database_response": value}