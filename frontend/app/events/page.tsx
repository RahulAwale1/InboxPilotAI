"use client";

import Layout from "@/components/Layout";
import PaginationControls from "@/components/PaginationControls";
import { fetchEvents, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventStatusBadge from "@/components/EventStatusBadge";

type EventItem = {
  id: number;
  title: string;
  event_date: string;
  event_time?: string | null;
  calendar_event_id?: string | null;
  status: string;
};

type PaginatedEvents = {
  items: EventItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export default function EventsPage() {
  const router = useRouter();
  const [eventsData, setEventsData] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const data = await fetchEvents(page, 10, statusFilter);
        setEventsData(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadData();
  }, [router, page, statusFilter]);

  if (loading) {
    return (
      <Layout>
        <p className="text-lg">Loading events...</p>
      </Layout>
    );
  }

  const events = eventsData?.items || [];
  const totalPages = eventsData?.total_pages || 1;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Events</h1>
          <p className="mt-2 text-[#6D2932]">
            Events extracted from synced emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[#561C24]">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="rounded-lg border border-[#6D2932] bg-[#E8D8C4] px-3 py-2 text-sm text-[#561C24]"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm overflow-x-auto">
          {events.length === 0 ? (
            <p className="text-sm text-[#6D2932]">No events yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#6D2932]">
                  <th className="py-3">Title</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Time</th>
                  <th className="py-3">Calendar ID</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-[#E8D8C4]">
                    <td className="py-3">{event.title}</td>
                    <td className="py-3">{event.event_date}</td>
                    <td className="py-3">{event.event_time || "-"}</td>
                    <td className="py-3">{event.calendar_event_id || "-"}</td>
                    <td className="py-3">
                      <EventStatusBadge status={event.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          />
        </div>
      </div>
    </Layout>
  );
}