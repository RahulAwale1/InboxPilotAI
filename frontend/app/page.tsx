import Layout from "@/components/Layout";
import SummaryCard from "@/components/SummaryCard";
import { fetchEvents, fetchJobs, fetchLogs } from "@/lib/api";

export default async function HomePage() {
  const [events, jobs, logs] = await Promise.all([
    fetchEvents(),
    fetchJobs(),
    fetchLogs(),
  ]);

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
              {events.slice(0, 3).map((event: any) => (
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
              {jobs.slice(0, 3).map((job: any) => (
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