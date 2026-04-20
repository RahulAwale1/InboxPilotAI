"use client";

import Layout from "@/components/Layout";
import SummaryCard from "@/components/SummaryCard";
import { fetchEvents, fetchJobs, fetchLogs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const [eventsData, jobsData, logsData] = await Promise.all([
          fetchEvents(),
          fetchJobs(),
          fetchLogs(),
        ]);

        setEvents(eventsData);
        setJobs(jobsData);
        setLogs(logsData);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="mt-2 text-[#6D2932]">
            Overview of processed emails, detected events, and tracked job applications.
          </p>
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
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="rounded-xl bg-[#E8D8C4] p-4">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-[#6D2932]">
                    {event.event_date} {event.event_time ? `• ${event.event_time}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Recent Job Updates</h2>
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="rounded-xl bg-[#E8D8C4] p-4">
                  <p className="font-semibold">
                    {job.company} — {job.job_title}
                  </p>
                  <p className="text-sm text-[#6D2932]">{job.status}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}