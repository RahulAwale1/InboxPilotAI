import StatusBadge from "./StatusBadge";

type RecentJobCardProps = {
  company: string;
  jobTitle: string;
  status: string;
};

export default function RecentJobCard({
  company,
  jobTitle,
  status,
}: RecentJobCardProps) {
  return (
    <div className="rounded-2xl bg-[#E8D8C4] p-4 shadow-sm border border-[#C7B7A3]">
      <p className="text-base font-semibold text-[#561C24]">{company}</p>
      <p className="mt-1 text-sm text-[#6D2932]">{jobTitle}</p>
      <div className="mt-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}