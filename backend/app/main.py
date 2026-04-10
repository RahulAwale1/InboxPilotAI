from fastapi import FastAPI

app = FastAPI(title="InboxPilot AI API")


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}