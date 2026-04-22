type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#6D2932] bg-[#E8D8C4] p-6 text-center">
      <h3 className="text-lg font-semibold text-[#561C24]">{title}</h3>
      <p className="mt-2 text-sm text-[#6D2932]">{description}</p>
    </div>
  );
}