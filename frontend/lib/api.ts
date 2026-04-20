const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  return response.json();
}

export async function fetchMe() {
  const response = await fetch(`${BACKEND_URL}/auth/me`, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function fetchEvents() {
  const response = await fetch(`${BACKEND_URL}/events`, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function fetchJobs() {
  const response = await fetch(`${BACKEND_URL}/jobs`, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function fetchLogs() {
  const response = await fetch(`${BACKEND_URL}/logs`, {
    credentials: "include",
  });

  return handleResponse(response);
}