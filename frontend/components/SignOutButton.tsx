"use client";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function SignOutButton() {
  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-[#561C24] px-4 py-2 text-sm font-medium text-[#E8D8C4] hover:bg-[#6D2932] transition"
    >
      Sign out
    </button>
  );
}