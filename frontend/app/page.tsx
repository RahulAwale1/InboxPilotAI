"use client";

import Layout from "@/components/Layout";
import SummaryCard from "@/components/SummaryCard";
import SyncInboxButton from "@/components/SyncInboxButton";
import { fetchEvents, fetchJobs, fetchLogs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import RecentEventCard from "@/components/RecentEventCard";
import RecentJobCard from "@/components/RecentJobCard";

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
  const [logsTotal, setLogsTotal] = useState(0);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [eventsTotal, setEventsTotal] = useState(0);

  const loadData = async () => {
    const me = await fetchMe();
    const [eventsResponse, jobsResponse, logsResponse] = await Promise.all([
      fetchEvents(1,10),
      fetchJobs(1,10),
      fetchLogs(1,10),
    ]);

    setUser(me);
    setEvents(eventsResponse.items);
    setJobs(jobsResponse.items);
    setLogs(logsResponse.items);


    setEventsTotal(eventsResponse.total);
    setJobsTotal(jobsResponse.total);
    setLogsTotal(logsResponse.total);
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

          <div className="w-full md:w-auto">
            <SyncInboxButton onSyncComplete={loadData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard title="Events Detected" value={eventsTotal} />
          <SummaryCard title="Jobs Tracked" value={jobsTotal} />
          <SummaryCard title="Emails Processed" value={logsTotal} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Events</h2>
              <span className="text-sm text-[#6D2932]">{events.length} total</span>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <EmptyState
                  title="No events yet"
                  description="When event-related emails are processed, they’ll appear here."
                />
              ) : (
                events.slice(0, 3).map((event) => (
                  <RecentEventCard
                    key={event.id}
                    title={event.title}
                    eventDate={event.event_date}
                    eventTime={event.event_time}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Job Updates</h2>
              <span className="text-sm text-[#6D2932]">{jobs.length} total</span>
            </div>

            <div className="space-y-4">
              {jobs.length === 0 ? (
                <EmptyState
                  title="No jobs tracked yet"
                  description="Job-related emails will create or update entries here after syncing."
                />
              ) : (
                jobs.slice(0, 3).map((job) => (
                  <RecentJobCard
                    key={job.id}
                    company={job.company}
                    jobTitle={job.job_title}
                    status={job.status}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}