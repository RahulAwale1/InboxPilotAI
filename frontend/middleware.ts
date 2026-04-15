export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/", "/events", "/jobs", "/logs"],
};