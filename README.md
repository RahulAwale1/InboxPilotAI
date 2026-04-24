# 🚀 InboxPilot AI

> AI-powered email assistant that transforms your job search inbox into actionable insights, structured data, and automated workflows.

---

## 🌐 Live Demo

- 🔗 Frontend: https://inboxai.rahulawale.com  
- 🔗 Backend API: https://inboxapi.rahulawale.com  

> ⚠️ Note: Google OAuth is currently in testing mode. Access is limited to approved test users.

---

## 🧠 Overview

InboxPilot AI connects to your Gmail account and automatically:

- 📩 Fetches job-related emails  
- 🤖 Classifies them using AI  
- 📊 Tracks job application status  
- 📅 Creates interview events in Google Calendar  
- 🧾 Stores structured logs for analysis  
- 🧠 Generates an AI-powered Career Digest  

---

## ✨ Features

### 🔐 Google OAuth Integration
- Secure login with Gmail
- Access to Gmail + Calendar APIs

### 📬 Inbox Sync Engine
- Fetches latest emails from Gmail
- Processes emails in real-time

### 🤖 AI Email Classification
- Categorizes emails into job, event, other
- Extracts structured data (company, role, status)

### 📊 Job Tracking System
- Tracks lifecycle of applications
- Handles deduplication and updates

### 📅 Calendar Automation
- Automatically creates interview events
- Syncs with Google Calendar

### 🔁 Token Refresh System
- Handles expired tokens seamlessly

### 📈 AI Career Digest
- Summarizes job activity and suggests actions

---

## 🏗️ Architecture

Frontend (Next.js - Vercel)
        ↓
FastAPI Backend (Render)
        ↓
PostgreSQL (Render)
        ↓
External APIs:
  - Gmail API
  - Google Calendar API
  - OpenAI API

---

## 🛠️ Tech Stack

Frontend: Next.js, Tailwind CSS  
Backend: FastAPI, SQLAlchemy  
AI: OpenAI API  
Database: PostgreSQL  
DevOps: Docker, Render, Vercel  

---

## ⚙️ Local Development

```bash
git clone https://github.com/yourusername/inboxpilot-ai.git
cd inboxpilot-ai
docker compose up --build
```

---

## 👨‍💻 Author

Rahul Awale  
https://rahulawale.com
