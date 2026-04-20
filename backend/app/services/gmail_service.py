import base64
from typing import Any

import requests


GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"


def get_latest_message_ids(access_token: str, max_results: int = 10) -> list[str]:
    url = f"{GMAIL_API_BASE}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    params = {
        "maxResults": max_results,
    }

    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()

    data = response.json()
    messages = data.get("messages", [])

    return [message["id"] for message in messages]


def get_message_detail(access_token: str, message_id: str) -> dict[str, Any]:
    url = f"{GMAIL_API_BASE}/messages/{message_id}"
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    params = {
        "format": "full",
    }

    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()

    return response.json()


def extract_header(headers: list[dict[str, str]], name: str) -> str:
    for header in headers:
        if header.get("name", "").lower() == name.lower():
            return header.get("value", "")
    return ""


def extract_body(payload: dict[str, Any]) -> str:
    body_data = payload.get("body", {}).get("data")
    if body_data:
        return decode_base64_url(body_data)

    parts = payload.get("parts", [])
    for part in parts:
        mime_type = part.get("mimeType", "")
        if mime_type == "text/plain":
            data = part.get("body", {}).get("data")
            if data:
                return decode_base64_url(data)

    return ""


def decode_base64_url(data: str) -> str:
    try:
        decoded_bytes = base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))
        return decoded_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def get_latest_emails(access_token: str, max_results: int = 10) -> list[dict[str, str]]:
    message_ids = get_latest_message_ids(access_token, max_results=max_results)

    emails = []

    for message_id in message_ids:
        message = get_message_detail(access_token, message_id)
        payload = message.get("payload", {})
        headers = payload.get("headers", [])

        sender = extract_header(headers, "From")
        subject = extract_header(headers, "Subject")
        body = extract_body(payload)
        snippet = message.get("snippet", "")

        emails.append(
            {
                "gmail_message_id": message_id,
                "sender": sender,
                "subject": subject,
                "body_preview": body[:1000] if body else snippet,
            }
        )

    return emails