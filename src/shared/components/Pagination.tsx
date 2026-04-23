import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getVisiblePageNumbers } from '../utils/pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalElements,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const page = Math.min(Math.max(currentPage, 0), totalPages - 1);
    const startItem = totalElements === 0 ? 0 : page * pageSize + 1;
    const endItem = Math.min((page + 1) * pageSize, totalElements);

    const goToPage = (nextPage: number) => {
        onPageChange(Math.min(Math.max(nextPage, 0), totalPages - 1));
    };

    return (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 0}
                    className="relative inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="inline-flex items-center text-sm text-gray-700">
                    <span className="font-medium">{page + 1}</span>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="font-medium">{totalPages}</span>
                </span>
                <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages - 1}
                    className="relative inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                    <span className="font-medium">{startItem}</span>
                    <span> - </span>
                    <span className="font-medium">{endItem}</span>
                    <span> / </span>
                    <span className="font-medium">{totalElements}</span>
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        type="button"
                        onClick={() => goToPage(0)}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="First page"
                    >
                        <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {getVisiblePageNumbers(page, totalPages).map((pageNumber) => (
                        <button
                            type="button"
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === pageNumber
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                            aria-current={page === pageNumber ? 'page' : undefined}
                        >
                            {pageNumber + 1}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => goToPage(totalPages - 1)}
                        disabled={page === totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Last page"
                    >
                        <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>
        </div>
    );
}
