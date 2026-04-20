"use client";

import Layout from "@/components/Layout";
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

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const data = await fetchJobs();
        setJobs(data);
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
        <p className="text-lg">Loading jobs...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Job Tracker</h1>
          <p className="mt-2 text-[#6D2932]">
            Job applications detected and updated from emails.
          </p>
        </div>

        <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm overflow-x-auto">
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
                  <td className="py-3">{job.status}</td>
                  <td className="py-3">
                    {new Date(job.last_updated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}