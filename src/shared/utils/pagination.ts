export const getVisiblePageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisiblePages = 5
): number[] => {
    const pages: number[] = [];
    const visiblePages = Math.min(maxVisiblePages, totalPages);
    const leftWindow = Math.floor(maxVisiblePages / 2);
    const tailThreshold = totalPages - (maxVisiblePages - leftWindow);

    for (let index = 0; index < visiblePages; index += 1) {
        let pageNumber = currentPage - leftWindow + index;

        if (currentPage < leftWindow) {
            pageNumber = index;
        }

        if (currentPage > tailThreshold) {
            pageNumber = totalPages - maxVisiblePages + index;
        }

        if (pageNumber < 0 || pageNumber >= totalPages) {
            continue;
        }

        pages.push(pageNumber);
    }

    return pages;
};