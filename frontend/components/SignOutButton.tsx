"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg bg-[#561C24] px-4 py-2 text-sm font-medium text-[#E8D8C4] hover:bg-[#6D2932] transition"
    >
      Sign out
    </button>
  );
}