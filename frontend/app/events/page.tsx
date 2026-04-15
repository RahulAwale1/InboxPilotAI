import Layout from "@/components/Layout";
import { fetchEvents } from "@/lib/api";

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Events</h1>
          <p className="mt-2 text-[#6D2932]">
            Events extracted from synced emails.
          </p>
        </div>

        <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#6D2932]">
                <th className="py-3">Title</th>
                <th className="py-3">Date</th>
                <th className="py-3">Time</th>
                <th className="py-3">Calendar ID</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event.id} className="border-b border-[#E8D8C4]">
                  <td className="py-3">{event.title}</td>
                  <td className="py-3">{event.event_date}</td>
                  <td className="py-3">{event.event_time || "-"}</td>
                  <td className="py-3">{event.calendar_event_id || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}