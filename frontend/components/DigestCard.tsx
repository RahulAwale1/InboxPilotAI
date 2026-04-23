type Digest = {
  headline: string;
  summary: string;
  highlights: string[];
  action_items: string[];
};

type Props = {
  digest: Digest | null;
  loading: boolean;
  onRefresh: () => void;
};

export default function DigestCard({ digest, loading, onRefresh }: Props) {
  return (
    <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">AI Career Digest</h2>
        <button
          onClick={onRefresh}
          className="rounded-lg bg-[#561C24] px-3 py-2 text-sm text-[#E8D8C4] hover:bg-[#6D2932]"
        >
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      {!digest ? (
        <p className="text-sm text-[#6D2932]">
          No digest yet. Click refresh to generate.
        </p>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-[#561C24]">
            {digest.headline}
          </h3>

          <p className="text-sm text-[#6D2932]">{digest.summary}</p>

          <div>
            <h4 className="font-medium mt-3">Highlights</h4>
            <ul className="list-disc ml-5 text-sm text-[#6D2932]">
              {digest.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mt-3">Action Items</h4>
            <ul className="list-disc ml-5 text-sm text-[#6D2932]">
              {digest.action_items.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}