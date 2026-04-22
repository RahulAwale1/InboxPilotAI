"use client";

import Layout from "@/components/Layout";
import CategoryBadge from "@/components/CategoryBadge";
import PaginationControls from "@/components/PaginationControls";
import { fetchLogs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LogItem = {
  id: number;
  sender: string;
  subject: string;
  category: string;
  action_taken?: string | null;
  processed_at: string;
};

type PaginatedLogs = {
  items: LogItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export default function LogsPage() {
  const router = useRouter();
  const [logsData, setLogsData] = useState<PaginatedLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const data = await fetchLogs(page, 10, categoryFilter, search);
        setLogsData(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadData();
  }, [router, page, categoryFilter, search]);

  if (loading) {
    return (
      <Layout>
        <p className="text-lg">Loading logs...</p>
      </Layout>
    );
  }

  const logs = logsData?.items || [];
  const totalPages = logsData?.total_pages || 1;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Email Logs</h1>
          <p className="mt-2 text-[#6D2932]">
            History of processed emails and actions taken.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#561C24]">Filter by category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setPage(1);
                setCategoryFilter(e.target.value);
              }}
              className="rounded-lg border border-[#6D2932] bg-[#E8D8C4] px-3 py-2 text-sm text-[#561C24]"
            >
              <option value="">All</option>
              <option value="job">Job</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search sender or subject..."
              className="rounded-lg border border-[#6D2932] bg-[#E8D8C4] px-3 py-2 text-sm text-[#561C24] placeholder:text-[#6D2932] w-64"
            />
            <button
              onClick={() => {
                setPage(1);
                setSearch(searchInput);
              }}
              className="rounded-lg bg-[#561C24] px-4 py-2 text-sm font-medium text-[#E8D8C4] hover:bg-[#6D2932] transition"
            >
              Search
            </button>

            <button
              onClick={() => {
                setPage(1);
                setSearchInput("");
                setSearch("");
              }}
              className="rounded-lg border border-[#6D2932] px-4 py-2 text-sm font-medium text-[#561C24] hover:bg-[#E8D8C4] transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm overflow-x-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-[#6D2932]">No logs yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#6D2932]">
                  <th className="py-3">Sender</th>
                  <th className="py-3">Subject</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Action</th>
                  <th className="py-3">Processed At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#E8D8C4]">
                    <td className="py-3">{log.sender}</td>
                    <td className="py-3">{log.subject}</td>
                    <td className="py-3">
                      <CategoryBadge category={log.category} />
                    </td>
                    <td className="py-3">{log.action_taken || "-"}</td>
                    <td className="py-3">
                      {new Date(log.processed_at).toLocaleString()}
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