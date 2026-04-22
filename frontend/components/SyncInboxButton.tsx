"use client";

import { useState } from "react";
import { syncInbox } from "@/lib/api";

type SyncResult = {
  message: string;
  fetched_count: number;
  inserted_count: number;
  skipped_count: number;
};

type SyncInboxButtonProps = {
  onSyncComplete?: () => Promise<void> | void;
};

export default function SyncInboxButton({ onSyncComplete }: SyncInboxButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await syncInbox();
      setResult(data);
      setLastSyncedAt(new Date().toLocaleString());

      if (onSyncComplete) {
        await onSyncComplete();
      }
    } catch (err) {
      console.error(err);
      setError("Sync failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="w-full rounded-xl bg-[#561C24] px-5 py-3 text-[#E8D8C4] font-semibold hover:bg-[#6D2932] transition disabled:opacity-60"
      >
        {loading ? "Syncing..." : "Sync Inbox"}
      </button>

      {lastSyncedAt && !loading && (
        <p className="text-sm text-[#6D2932]">
          Last synced: <span className="font-medium">{lastSyncedAt}</span>
        </p>
      )}

      {result && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm">
          <p className="font-semibold">{result.message}</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xs text-gray-500">Fetched</p>
              <p className="text-lg font-bold">{result.fetched_count}</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xs text-gray-500">Inserted</p>
              <p className="text-lg font-bold">{result.inserted_count}</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xs text-gray-500">Skipped</p>
              <p className="text-lg font-bold">{result.skipped_count}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm">
          <p className="font-semibold">Sync failed</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}