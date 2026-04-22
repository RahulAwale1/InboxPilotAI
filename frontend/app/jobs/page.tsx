"use client";

import Layout from "@/components/Layout";
import PaginationControls from "@/components/PaginationControls";
import StatusBadge from "@/components/StatusBadge";
import { fetchJobs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type JobItem = {
  id: number;
  company: string;
  job_title: string;
  status: string;
  last_updated: string;
};

type PaginatedJobs = {
  items: JobItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export default function JobsPage() {
  const router = useRouter();
  const [jobsData, setJobsData] = useState<PaginatedJobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const data = await fetchJobs(page, 10, statusFilter, search);
        setJobsData(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadData();
  }, [router, page, statusFilter, search]);

  if (loading) {
    return (
      <Layout>
        <p className="text-lg">Loading jobs...</p>
      </Layout>
    );
  }

  const jobs = jobsData?.items || [];
  const totalPages = jobsData?.total_pages || 1;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Job Tracker</h1>
          <p className="mt-2 text-[#6D2932]">
            Job applications detected and updated from emails.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search company or role..."
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
          {jobs.length === 0 ? (
            <p className="text-sm text-[#6D2932]">No jobs tracked yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#6D2932]">
                  <th className="py-3">Company</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-[#E8D8C4]">
                    <td className="py-3">{job.company}</td>
                    <td className="py-3">{job.job_title}</td>
                    <td className="py-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-3">
                      {new Date(job.last_updated).toLocaleString()}
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