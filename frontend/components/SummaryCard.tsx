type SummaryCardProps = {
  title: string;
  value: number;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-[#C7B7A3] p-6 shadow-sm">
      <p className="text-sm font-medium text-[#6D2932]">{title}</p>
      <h2 className="mt-3 text-3xl font-bold text-[#561C24]">{value}</h2>
    </div>
  );
}