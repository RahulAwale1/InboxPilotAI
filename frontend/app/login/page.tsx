"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E8D8C4] text-[#561C24]">
      <div className="rounded-2xl bg-[#C7B7A3] p-10 shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold">InboxPilot AI</h1>
        <p className="mt-3 text-[#6D2932]">
          Sign in with Google to access your dashboard.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-8 w-full rounded-xl bg-[#561C24] px-6 py-3 text-[#E8D8C4] font-semibold hover:bg-[#6D2932] transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}