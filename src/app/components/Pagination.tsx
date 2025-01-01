import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center mt-6">
      <button
        className="px-4 flex items-center py-2 disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Previous
      </button>
      <p className="text-sm mx-4">
        Page {currentPage} of {totalPages}
      </p>
      <button
        className="px-4 flex items-center py-2 disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
      >
        Next
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
