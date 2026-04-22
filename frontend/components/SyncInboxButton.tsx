"use client";

type SyncResult = {
  message: string;
  fetched_count: number;
  inserted_count: number;
  skipped_count: number;
};

type SyncInboxButtonProps = {
  onSyncComplete?: () => Promise<void> | void;
};

import { useState } from "react";
import { syncInbox } from "@/lib/api";

export default function SyncInboxButton({ onSyncComplete }: SyncInboxButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await syncInbox();
      setResult(data);

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
    <div className="space-y-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-xl bg-[#561C24] px-5 py-3 text-[#E8D8C4] font-semibold hover:bg-[#6D2932] transition disabled:opacity-60"
      >
        {loading ? "Syncing..." : "Sync Inbox"}
      </button>

      {result && (
        <div className="rounded-xl bg-[#C7B7A3] p-4 text-sm text-[#561C24]">
          <p className="font-semibold">{result.message}</p>
          <p>Fetched: {result.fetched_count}</p>
          <p>Inserted: {result.inserted_count}</p>
          <p>Skipped: {result.skipped_count}</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-[#C7B7A3] p-4 text-sm text-red-900">
          {error}
        </div>
      )}
    </div>
  );
}