type RecentEventCardProps = {
  title: string;
  eventDate: string;
  eventTime?: string | null;
};

export default function RecentEventCard({
  title,
  eventDate,
  eventTime,
}: RecentEventCardProps) {
  return (
    <div className="rounded-2xl bg-[#E8D8C4] p-4 shadow-sm border border-[#C7B7A3]">
      <p className="text-base font-semibold text-[#561C24]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#6D2932]">
        <span className="rounded-full bg-[#C7B7A3] px-3 py-1">{eventDate}</span>
        {eventTime && (
          <span className="rounded-full bg-[#C7B7A3] px-3 py-1">{eventTime}</span>
        )}
      </div>
    </div>
  );
}