import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { StoreResponse } from '../../shared/api/models/StoreResponse';
import { Store as StoreIcon, Trash2 } from 'lucide-react';
import { AdminStoreService } from '../../shared/api/services/AdminStoreService';
import { Pagination } from '../../shared/components/Pagination';
import { SearchInput } from '../../shared/components/SearchInput';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { StoreDetailModal } from './StoreDetailModal';

interface StoreListProps {
    universityId: number;
}

type StoreCategory = NonNullable<StoreResponse['storeCategories']>[number];

const CATEGORY_MAP: Record<StoreCategory, string> = {
    'BAR': '주점',
    'CAFE': '카페',
    'RESTAURANT': '식당',
    'ENTERTAINMENT': '놀거리',
    'BEAUTY_HEALTH': '뷰티•헬스',
    'ETC': '기타'
};

type StoreStatusFilter = '' | 'UNCLAIMED' | 'ACTIVE' | 'BANNED';
type PartnershipFilter = 'all' | 'yes' | 'no';

export function StoreList({ universityId }: StoreListProps) {
    const [stores, setStores] = useState<StoreResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm);
    const [statusFilter, setStatusFilter] = useState<StoreStatusFilter>('');
    const [partnershipFilter, setPartnershipFilter] = useState<PartnershipFilter>('all');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // 체크박스 선택 state
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        const hasPartnership =
            partnershipFilter === 'yes' ? true :
                partnershipFilter === 'no' ? false :
                    undefined;

        try {
            const response = await AdminStoreService.getStores1(
                debouncedSearchTerm || undefined,
                undefined, // categories
                universityId,
                statusFilter || undefined,
                hasPartnership,
                page,
                pageSize,
                ['id,asc']
            );

            if (response.data) {
                setStores(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
            }
        } catch (error) {
            console.error('Failed to fetch stores', error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, page, pageSize, partnershipFilter, statusFilter, universityId]);

    useEffect(() => {
        if (universityId) {
            void fetchStores();
        }
    }, [universityId, fetchStores]);

    const totalPages = Math.ceil(totalElements / pageSize);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchTerm, statusFilter, partnershipFilter, universityId]);

    // 필터/페이지 변경 시 선택 초기화
    useEffect(() => {
        setSelectedIds(new Set());
    }, [debouncedSearchTerm, statusFilter, partnershipFilter, page, universityId]);

    const currentStores = stores;

    // 현재 페이지에서 선택 가능한 가게 (입점 완료 제외)
    const selectableCurrentStores = useMemo(
        () => currentStores.filter(s => s.storeStatus !== 'ACTIVE'),
        [currentStores]
    );
    const allCurrentSelectable =
        selectableCurrentStores.length > 0 &&
        selectableCurrentStores.every(s => selectedIds.has(s.id!));
    const someCurrentSelected = selectableCurrentStores.some(s => selectedIds.has(s.id!));

    // 전체선택 체크박스 indeterminate 처리
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someCurrentSelected && !allCurrentSelectable;
        }
    }, [someCurrentSelected, allCurrentSelectable]);

    // 체크박스 개별 토글
    const handleCheckboxChange = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // 현재 페이지 전체선택/해제
    const handleSelectAll = () => {
        if (allCurrentSelectable) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                selectableCurrentStores.forEach(s => next.delete(s.id!));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                selectableCurrentStores.forEach(s => next.add(s.id!));
                return next;
            });
        }
    };

    // 일괄 삭제
    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        if (!window.confirm(`선택한 ${count}개의 상점을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
        setBulkDeleting(true);
        const ids = Array.from(selectedIds);
        const results = await Promise.allSettled(ids.map(id => AdminStoreService.deleteStore2(id)));
        const failed = results.filter(r => r.status === 'rejected').length;
        setBulkDeleting(false);
        setSelectedIds(new Set());
        if (failed > 0) {
            alert(`${count - failed}개 삭제 완료, ${failed}개 삭제 실패`);
        } else {
            alert(`${count}개 삭제 완료`);
        }
        void fetchStores();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">등록된 상점 목록 ({totalElements})</h3>
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={bulkDeleting}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-md transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {bulkDeleting ? '삭제 중...' : `${selectedIds.size}개 삭제`}
                            </button>
                        )}
                    </div>

                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="상점명, 지점명, 주소 검색"
                        className="w-full sm:w-64 sm:flex-none"
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-500">필터:</span>

                    {/* 입점 상태 필터 */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StoreStatusFilter)}
                        className="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">입점 상태 전체</option>
                        <option value="ACTIVE">입점 완료</option>
                        <option value="UNCLAIMED">미입점</option>
                        <option value="BANNED">정지</option>
                    </select>

                    {/* 제휴 여부 필터 */}
                    <select
                        value={partnershipFilter}
                        onChange={(e) => setPartnershipFilter(e.target.value as PartnershipFilter)}
                        className="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">제휴 여부 전체</option>
                        <option value="yes">제휴 있음</option>
                        <option value="no">제휴 없음</option>
                    </select>

                    {/* 활성 필터 표시 */}
                    {(statusFilter !== '' || partnershipFilter !== 'all') && (
                        <button
                            onClick={() => { setStatusFilter(''); setPartnershipFilter('all'); }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                            필터 초기화
                        </button>
                    )}
                </div>
            </div>

            <div className="relative overflow-x-auto min-h-[570px]">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            불러오는 중...
                        </div>
                    </div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-12 px-4 py-3">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={allCurrentSelectable}
                                    onChange={handleSelectAll}
                                    disabled={selectableCurrentStores.length === 0}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상호명 (지점명)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주소</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStores.length > 0 ? (
                            currentStores.map((store) => {
                                const isDeleteDisabled = store.storeStatus === 'ACTIVE';
                                const isChecked = selectedIds.has(store.id!);
                                return (
                                    <tr
                                        key={store.id}
                                        onClick={() => setSelectedStore(store)}
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}
                                    >
                                        <td className="w-12 px-4 py-4" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(store.id!)}
                                                disabled={isDeleteDisabled}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {store.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                    <StoreIcon className="w-4 h-4" />
                                                </div>
                                                <div className="ml-3 text-left">
                                                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                                                    {store.branch && <div className="text-sm text-gray-500">{store.branch}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {store.storeCategories?.map(c => CATEGORY_MAP[c] || c).join(', ') || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {store.storeStatus === 'ACTIVE' ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    입점 완료
                                                </span>
                                            ) : store.storeStatus === 'BANNED' ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    정지
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    미입점
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {store.roadAddress || store.jibunAddress || '-'}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    {loading ? '' : '검색 결과가 없습니다.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalElements={totalElements}
                onPageChange={setPage}
            />

            {selectedStore && (
                <StoreDetailModal
                    store={selectedStore}
                    onClose={() => setSelectedStore(null)}
                    onSaved={() => {
                        setSelectedStore(null);
                        void fetchStores();
                    }}
                />
            )}
        </div>
    );
}





