import json
from openai import OpenAI

from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def generate_career_digest(logs: list[dict], jobs: list[dict], events: list[dict]) -> dict:
    prompt = f"""
You are an AI career assistant.

Your task is to generate a concise and useful career digest for a user based on:
- recent email logs
- current tracked jobs
- recent events

Return valid JSON only in this format:
{{
  "headline": string,
  "summary": string,
  "highlights": [string, string, ...],
  "action_items": [string, string, ...]
}}

Rules:
- Keep the headline short and useful.
- Keep the summary to 2-4 sentences.
- Highlights should be important developments only.
- Action items should be practical next steps for the user.
- If there are no meaningful updates, say so clearly.
- Focus on job applications, interview progress, rejections, offers, and scheduled events.

Recent email logs:
{json.dumps(logs, indent=2)}

Current jobs:
{json.dumps(jobs, indent=2)}

Recent events:
{json.dumps(events, indent=2)}
""".strip()

    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt,
        text={
            "format": {
                "type": "json_schema",
                "name": "career_digest",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "headline": {"type": "string"},
                        "summary": {"type": "string"},
                        "highlights": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "action_items": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["headline", "summary", "highlights", "action_items"],
                    "additionalProperties": False
                }
            }
        }
    )

    return json.loads(response.output_text)