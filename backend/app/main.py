from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app import models
from app.api.routes_events import router as events_router
from app.api.routes_jobs import router as jobs_router
from app.api.routes_logs import router as logs_router
from app.api.routes_users import router as users_router
from app.api.routes_auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware
from app.config import settings
from app.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up application...")
    Base.metadata.create_all(bind=engine)
    yield
    print("Shutting down application...")


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET_KEY,
)

app.include_router(events_router)
app.include_router(jobs_router)
app.include_router(logs_router)
app.include_router(users_router)
app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {"status": "ok", "database_response": value}