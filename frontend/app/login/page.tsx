"use client";
import Image from "next/image";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google/login`;
  };

  return (
    <main className="min-h-screen bg-[#E8D8C4] text-[#561C24]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
          <section className="space-y-8">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-[#6D2932]/30 bg-[#C7B7A3]/60 px-4 py-2 text-sm font-medium text-[#6D2932]">
                AI-powered career inbox assistant
              </div>

              <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                Turn job emails into actions.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-[#6D2932]">
                InboxPilot AI reads your job-related emails, tracks application
                progress, creates interview events, and summarizes what matters.
              </p>
            </div>

            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              {[
                "Gmail intelligence",
                "Job status tracking",
                "Calendar automation",
                "AI career digest",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#C7B7A3] bg-[#F4E8D8]/70 p-4 shadow-sm"
                >
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#C7B7A3] bg-[#F4E8D8]/80 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Welcome back</h2>
              <p className="mt-2 text-[#6D2932]">
                Sign in with Google to sync your inbox and manage your career
                pipeline.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#561C24] px-6 py-4 font-semibold text-[#E8D8C4] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#6D2932]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#561C24]">
                G
              </span>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-[#6D2932]">
              Secure Google OAuth. Your data is used only to power your
              dashboard and automations.
            </p>

            <div className="mt-8 rounded-2xl bg-[#C7B7A3]/60 p-4 text-sm text-[#561C24]">
              <p className="font-semibold">What happens after login?</p>
              <p className="mt-1 text-[#6D2932]">
                Sync recent emails, extract job updates, create interview events,
                and generate your AI career digest.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}