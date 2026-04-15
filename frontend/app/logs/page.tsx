import Layout from "@/components/Layout";
import { fetchLogs } from "@/lib/api";

export default async function LogsPage() {
  const logs = await fetchLogs();

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
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b border-[#E8D8C4]">
                  <td className="py-3">{log.sender}</td>
                  <td className="py-3">{log.subject}</td>
                  <td className="py-3">{log.category}</td>
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