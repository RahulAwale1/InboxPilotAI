const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function fetchJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}

export async function fetchLogs() {
  const response = await fetch(`${API_BASE_URL}/logs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }

  return response.json();
}