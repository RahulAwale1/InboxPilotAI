"use client";

import Layout from "@/components/Layout";
import { fetchLogs, fetchMe } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryBadge from "@/components/CategoryBadge";

type LogItem = {
  id: number;
  sender: string;
  subject: string;
  category: string;
  action_taken?: string | null;
  processed_at: string;
};

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await fetchMe();
        const data = await fetchLogs();
        setLogs(data);
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
        <p className="text-lg">Loading logs...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Email Logs</h1>
          <p className="mt-2 text-[#6D2932]">
            History of processed emails and actions taken.
          </p>
        </div>

        <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm overflow-x-auto">
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
        </div>
      </div>
    </Layout>
  );
}