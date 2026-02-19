import { useState, useEffect, useMemo } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { StoreResponse } from '../../shared/api/models/StoreResponse';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Store as StoreIcon } from 'lucide-react';

interface StoreListProps {
    universityId: number;
}

export function StoreList({ universityId }: StoreListProps) {
    const [allStores, setAllStores] = useState<StoreResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        if (universityId) {
            fetchAllStores();
        }
    }, [universityId]);

    const fetchAllStores = async () => {
        setLoading(true);
        try {
            // Fetch a large number to get "all" stores for client-side filtering
            const response = await StoreService.getStores(
                { page: 0, size: 2000, sort: ['id,asc'] }, // ID Ascending
                undefined, // keyword
                undefined, // categories
                undefined, // moods
                universityId
            );
            if (response.data) {
                setAllStores(response.data.content || []);
            }
        } catch (error) {
            console.error('Failed to fetch stores', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and Sort
    const filteredStores = useMemo(() => {
        return allStores.filter(store => {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = store.name?.toLowerCase().includes(searchLower);
            const roadAddrMatch = store.roadAddress?.toLowerCase().includes(searchLower);
            const jibunAddrMatch = store.jibunAddress?.toLowerCase().includes(searchLower);

            return nameMatch || roadAddrMatch || jibunAddrMatch;
        });
    }, [allStores, searchTerm]);

    const totalElements = filteredStores.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    // Reset page when search changes
    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    // Current Page Data
    const currentStores = useMemo(() => {
        const start = page * pageSize;
        return filteredStores.slice(start, start + pageSize);
    }, [filteredStores, page, pageSize]);

    if (loading && allStores.length === 0) {
        return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">등록된 상점 목록 ({totalElements})</h3>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="상점명, 주소 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상점명</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주소</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStores.length > 0 ? (
                            currentStores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                <StoreIcon className="w-4 h-4" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{store.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.storeCategories?.join(', ') || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.roadAddress || store.jibunAddress || '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            이전
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page === totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            다음
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">{page * pageSize + 1}</span> - <span className="font-medium">{Math.min((page + 1) * pageSize, totalElements)}</span> / <span className="font-medium">{totalElements}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(0)}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">First</span>
                                    <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>

                                {/* Simple window pagination */}
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let p = page - 2 + i;
                                    // Adjust window to stay within bounds
                                    if (page < 2) p = i;
                                    if (page > totalPages - 3) p = totalPages - 5 + i;

                                    if (p < 0 || p >= totalPages) return null;

                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p + 1}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page === totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages - 1)}
                                    disabled={page === totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Last</span>
                                    <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
