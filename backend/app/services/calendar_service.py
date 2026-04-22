from datetime import datetime, timedelta

import requests


GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3/calendars/primary/events"


def create_calendar_event(
    access_token: str,
    title: str,
    event_date: str,
    event_time: str | None = None,
    description: str | None = None,
) -> dict:
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    # Default time if missing
    time_str = event_time if event_time else "09:00"

    # Combine date + time into datetime
    start_dt = datetime.fromisoformat(f"{event_date}T{time_str}")
    end_dt = start_dt + timedelta(hours=1)

    payload = {
        "summary": title,
        "description": description or "",
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": "America/Toronto",
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": "America/Toronto",
        },
    }

    response = requests.post(
        GOOGLE_CALENDAR_API_BASE,
        headers=headers,
        json=payload,
        timeout=30,
    )
    response.raise_for_status()

    return response.json()