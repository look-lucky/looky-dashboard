import { useState, useCallback, useEffect } from 'react';

interface PaginatedResponse<T> {
    content?: T[];
    totalPages?: number;
    totalElements?: number;
}

interface UsePaginatedQueryOptions<T> {
    fetchFn: (page: number, size: number) => Promise<{ data?: PaginatedResponse<T> }>;
    pageSize?: number;
    resetDeps?: unknown[];
    enabled?: boolean;
    refreshTrigger?: number;
}

interface UsePaginatedQueryResult<T> {
    items: T[];
    loading: boolean;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    refetch: () => void;
}

export function usePaginatedQuery<T>({
    fetchFn,
    pageSize = 10,
    resetDeps = [],
    enabled = true,
    refreshTrigger = 0,
}: UsePaginatedQueryOptions<T>): UsePaginatedQueryResult<T> {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchData = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        try {
            const response = await fetchFn(page, pageSize);
            if (response.data) {
                setItems(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
            setItems([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFn, page, pageSize, enabled]);

    useEffect(() => {
        void fetchData();
    }, [fetchData, refreshTrigger]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setPage(0); }, resetDeps);

    return { items, loading, page, setPage, totalPages, totalElements, pageSize, refetch: fetchData };
}
