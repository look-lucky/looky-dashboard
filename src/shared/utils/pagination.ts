export const getVisiblePageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisiblePages = 5
): number[] => {
    if (totalPages <= 0) return [];

    const visibleCount = Math.min(maxVisiblePages, totalPages);
    const leftWindow = Math.floor(visibleCount / 2);

    let start = currentPage - leftWindow;
    if (start < 0) start = 0;
    if (start + visibleCount > totalPages) start = totalPages - visibleCount;

    return Array.from({ length: visibleCount }, (_, i) => start + i);
};