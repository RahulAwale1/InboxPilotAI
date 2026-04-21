import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def analyze_email(subject: str, body_preview: str) -> dict:
    prompt = f"""
You are an intelligent email analyzer for an AI workflow system.

Your task is to classify an email and extract structured information.

Categories:
- job:
  Any email related to a job application lifecycle. This includes:
  application submitted, application received, thank you for applying,
  under review, recruiter outreach, interview invitation, interview scheduling,
  rejection, offer, hiring updates, next steps, candidate communications.
- event:
  General meetings, appointments, calendar invites, webinars, sessions,
  scheduled events that are NOT primarily part of a job application process.
- other:
  Everything else.

Important rules:
1. If the email is about ANY stage of a job application process, classify it as "job".
2. Interview-related job emails must still be classified as "job".
3. If a job email contains scheduling information, also extract event information.
4. Prefer "job" over "other" whenever the email is clearly part of a hiring or application workflow.
5. Return only valid JSON.

Job status meanings:
- applied: application submitted, application received, thank you for applying, under review
- interview: interview invitation, interview scheduled, screening call, meeting for hiring process
- rejected: rejection or not moving forward
- offer: offer extended

Examples:

Example 1
Subject: Application Received - Data Analyst Intern
Body: Thank you for applying. We have received your application and our team will review it.
Output:
{{
  "category": "job",
  "job": {{
    "company": null,
    "role": "Data Analyst Intern",
    "status": "applied"
  }},
  "event": null
}}

Example 2
Subject: Interview Scheduled for ML Intern Role
Body: We would like to invite you to an interview on April 25 at 2:00 PM.
Output:
{{
  "category": "job",
  "job": {{
    "company": null,
    "role": "ML Intern",
    "status": "interview"
  }},
  "event": {{
    "title": "Interview for ML Intern Role",
    "date": "2026-04-25",
    "time": "14:00"
  }}
}}

Example 3
Subject: Team Meeting Tomorrow
Body: Our weekly team meeting will take place tomorrow at 10:00 AM.
Output:
{{
  "category": "event",
  "job": null,
  "event": {{
    "title": "Team Meeting",
    "date": null,
    "time": "10:00"
  }}
}}

Return format:
{{
  "category": "job" | "event" | "other",
  "job": {{
    "company": string or null,
    "role": string or null,
    "status": "applied" | "interview" | "rejected" | "offer" | null
  }} or null,
  "event": {{
    "title": string or null,
    "date": "YYYY-MM-DD" or null,
    "time": "HH:MM" or null
  }} or null
}}

Email subject:
{subject}

Email body:
{body_preview}
""".strip()

    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt,
        text={
            "format": {
                "type": "json_schema",
                "name": "email_analysis",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "category": {
                            "type": "string",
                            "enum": ["job", "event", "other"]
                        },
                        "job": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "company": {"type": ["string", "null"]},
                                        "role": {"type": ["string", "null"]},
                                        "status": {
                                            "type": ["string", "null"],
                                            "enum": ["applied", "interview", "rejected", "offer", None]
                                        }
                                    },
                                    "required": ["company", "role", "status"],
                                    "additionalProperties": False
                                },
                                {"type": "null"}
                            ]
                        },
                        "event": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "title": {"type": ["string", "null"]},
                                        "date": {"type": ["string", "null"]},
                                        "time": {"type": ["string", "null"]}
                                    },
                                    "required": ["title", "date", "time"],
                                    "additionalProperties": False
                                },
                                {"type": "null"}
                            ]
                        }
                    },
                    "required": ["category", "job", "event"],
                    "additionalProperties": False
                }
            }
        }
    )

    return json.loads(response.output_text)