type CategoryBadgeProps = {
  category: string;
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const normalized = category.toLowerCase();

  const styles: Record<string, string> = {
    job: "bg-purple-100 text-purple-800",
    event: "bg-orange-100 text-orange-800",
    other: "bg-gray-200 text-gray-800",
    unclassified: "bg-gray-200 text-gray-800",
  };

  const badgeStyle = styles[normalized] || "bg-gray-200 text-gray-800";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStyle}`}
    >
      {category}
    </span>
  );
}