type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800",
    interview: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    offer: "bg-green-100 text-green-800",
  };

  const badgeStyle = styles[normalized] || "bg-gray-200 text-gray-800";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStyle}`}
    >
      {status}
    </span>
  );
}