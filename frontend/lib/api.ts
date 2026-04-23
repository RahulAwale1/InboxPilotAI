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

export async function fetchEvents(
    page = 1,
    pageSize = 10,
    statusFilter = ""
  ) {
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    if (statusFilter) {
      query.append("status_filter", statusFilter);
    }

    const response = await fetch(`${BACKEND_URL}/events?${query.toString()}`, {
      credentials: "include",
    });

    return handleResponse(response);
}

export async function fetchJobs(
  page = 1,
  pageSize = 10,
  statusFilter = "",
  search = ""
) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (statusFilter) {
    query.append("status_filter", statusFilter);
  }

  if (search.trim()) {
    query.append("search", search.trim());
  }

  const response = await fetch(`${BACKEND_URL}/jobs?${query.toString()}`, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function fetchLogs(
  page = 1,
  pageSize = 10,
  categoryFilter = "",
  search = ""
) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (categoryFilter) {
    query.append("category_filter", categoryFilter);
  }

  if (search.trim()) {
    query.append("search", search.trim());
  }

  const response = await fetch(`${BACKEND_URL}/logs?${query.toString()}`, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function syncInbox() {
  const response = await fetch(`${BACKEND_URL}/sync`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
}

export async function fetchDigest() {
  const response = await fetch(`${BACKEND_URL}/digest`, {
    credentials: "include",
  });

  return handleResponse(response);
}