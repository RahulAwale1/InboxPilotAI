type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={page <= 1}
        className="rounded-lg bg-[#561C24] px-4 py-2 text-sm font-medium text-[#E8D8C4] hover:bg-[#6D2932] transition disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-sm text-[#6D2932]">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-lg bg-[#561C24] px-4 py-2 text-sm font-medium text-[#E8D8C4] hover:bg-[#6D2932] transition disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}