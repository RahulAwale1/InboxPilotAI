from datetime import date

from app.db import SessionLocal
from app.models.user import User
from app.models.email_log import EmailLog
from app.models.event import Event
from app.models.job import Job


def seed_data():
    db = SessionLocal()

    try:
        # Prevent duplicate seeding
        existing_user = db.query(User).filter(User.email == "demo@inboxpilot.ai").first()
        if existing_user:
            print("Seed data already exists. Skipping.")
            return

        # Create test user
        user = User(
            name="Demo User",
            email="demo@inboxpilot.ai",
            image_url=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create email logs
        email_log_1 = EmailLog(
            user_id=user.id,
            gmail_message_id="gmail_msg_001",
            sender="recruiter@shopify.com",
            subject="Interview Scheduled for ML Intern Role",
            body_preview="We would like to invite you for an interview on April 18 at 2 PM.",
            category="event",
            action_taken="create_event",
            status="processed"
        )

        email_log_2 = EmailLog(
            user_id=user.id,
            gmail_message_id="gmail_msg_002",
            sender="careers@amazon.com",
            subject="Application Received - Data Analyst Intern",
            body_preview="Thank you for applying to Amazon. Your application has been received.",
            category="job",
            action_taken="update_job",
            status="processed"
        )

        email_log_3 = EmailLog(
            user_id=user.id,
            gmail_message_id="gmail_msg_003",
            sender="recruiting@meta.com",
            subject="Update on your application",
            body_preview="We regret to inform you that we will not be moving forward.",
            category="job",
            action_taken="update_job",
            status="processed"
        )

        db.add_all([email_log_1, email_log_2, email_log_3])
        db.commit()

        db.refresh(email_log_1)
        db.refresh(email_log_2)
        db.refresh(email_log_3)

        # Create event
        event = Event(
            user_id=user.id,
            email_log_id=email_log_1.id,
            title="Interview with Shopify",
            event_date=date(2026, 4, 18),
            event_time="2:00 PM",
            description="ML Intern interview scheduled via email.",
            calendar_event_id="calendar_evt_001"
        )

        db.add(event)

        # Create jobs
        job_1 = Job(
            user_id=user.id,
            source_email_id=email_log_2.id,
            company="Amazon",
            job_title="Data Analyst Intern",
            status="Applied"
        )

        job_2 = Job(
            user_id=user.id,
            source_email_id=email_log_3.id,
            company="Meta",
            job_title="Machine Learning Intern",
            status="Rejected"
        )

        db.add_all([job_1, job_2])
        db.commit()

        print("Seed data inserted successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error while seeding data: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()