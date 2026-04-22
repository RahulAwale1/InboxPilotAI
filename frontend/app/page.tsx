"use client";

import Layout from "@/components/Layout";
import SummaryCard from "@/components/SummaryCard";
import SyncInboxButton from "@/components/SyncInboxButton";
import { fetchEvents, fetchJobs, fetchLogs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

type EventItem = {
  id: number;
  title: string;
  event_date: string;
  event_time?: string | null;
};

type JobItem = {
  id: number;
  company: string;
  job_title: string;
  status: string;
};

type LogItem = {
  id: number;
};

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  image_url?: string | null;
};

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const me = await fetchMe();
    const [eventsData, jobsData, logsData] = await Promise.all([
      fetchEvents(),
      fetchJobs(),
      fetchLogs(),
    ]);

    setUser(me);
    setEvents(eventsData);
    setJobs(jobsData);
    setLogs(logsData);
  };

  useEffect(() => {
    async function init() {
      try {
        await loadData();
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <p className="text-lg">Loading dashboard...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-2 text-[#6D2932]">
              Overview of processed emails, detected events, and tracked job applications.
            </p>
            {user && (
              <p className="mt-2 text-sm text-[#6D2932]">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
            )}
          </div>

          <SyncInboxButton onSyncComplete={loadData} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard title="Events Detected" value={events.length} />
          <SummaryCard title="Jobs Tracked" value={jobs.length} />
          <SummaryCard title="Emails Processed" value={logs.length} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Recent Events</h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-sm text-[#6D2932]">No events yet.</p>
              ) : (
                events.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-xl bg-[#E8D8C4] p-4">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-[#6D2932]">
                      {event.event_date} {event.event_time ? `• ${event.event_time}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Recent Job Updates</h2>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <p className="text-sm text-[#6D2932]">No jobs tracked yet.</p>
              ) : (
                jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="rounded-xl bg-[#E8D8C4] p-4">
                    <p className="font-semibold">
                      {job.company} — {job.job_title}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}