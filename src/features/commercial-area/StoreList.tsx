import { useState, useEffect, useMemo } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { StoreResponse } from '../../shared/api/models/StoreResponse';
import type { UpdateStoreRequest } from '../../shared/api/models/UpdateStoreRequest';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Store as StoreIcon, X, Edit2, Trash2, Save, AlertTriangle } from 'lucide-react';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { AdminService } from '../../shared/api/services/AdminService';

interface StoreListProps {
    universityId: number;
}

const CATEGORY_MAP: Record<string, string> = {
    'BAR': '주점',
    'CAFE': '카페',
    'RESTAURANT': '맛집',
    'ENTERTAINMENT': '문화/여가',
    'BEAUTY_HEALTH': '뷰티/건강',
    'ETC': '기타'
};

const CATEGORY_KEYS = Object.keys(CATEGORY_MAP) as Array<keyof typeof CATEGORY_MAP>;

type StoreStatusFilter = '' | 'UNCLAIMED' | 'ACTIVE' | 'BANNED';
type PartnershipFilter = 'all' | 'yes' | 'no';

export function StoreList({ universityId }: StoreListProps) {
    const [allStores, setAllStores] = useState<StoreResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StoreStatusFilter>('');
    const [partnershipFilter, setPartnershipFilter] = useState<PartnershipFilter>('all');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // Modal State
    const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState<UpdateStoreRequest>({});
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Address Search State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleAddressComplete = async (data: any) => {
        const roadAddr = data.roadAddress;
        const jibunAddr = data.jibunAddress;

        // Trigger Geocoding
        try {
            const response = await AdminService.getGeocode(roadAddr);
            const coords = response.data || response;
            setEditForm(prev => ({
                ...prev,
                roadAddress: roadAddr,
                jibunAddress: jibunAddr || coords?.jibunAddress || prev.jibunAddress,
                latitude: coords?.latitude ?? prev.latitude,
                longitude: coords?.longitude ?? prev.longitude
            }));
        } catch (error) {
            console.error('Geocoding failed:', error);
            setEditForm(prev => ({
                ...prev,
                roadAddress: roadAddr,
                jibunAddress: jibunAddr || prev.jibunAddress
            }));
        }
    };

    useEffect(() => {
        if (universityId) {
            fetchAllStores();
        }
    }, [universityId, partnershipFilter]);

    const fetchAllStores = async () => {
        setLoading(true);
        const hasPartnership =
            partnershipFilter === 'yes' ? true :
            partnershipFilter === 'no' ? false :
            undefined;
        try {
            const response = await StoreService.getStores(
                { page: 0, size: 2000, sort: ['id,asc'] },
                undefined,
                undefined,
                undefined,
                universityId,
                hasPartnership
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
            const branchMatch = store.branch?.toLowerCase().includes(searchLower);
            const textMatch = nameMatch || roadAddrMatch || jibunAddrMatch || branchMatch;

            const statusMatch = statusFilter === '' || store.storeStatus === statusFilter;

            return textMatch && statusMatch;
        });
    }, [allStores, searchTerm, statusFilter]);

    const totalElements = filteredStores.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, statusFilter, partnershipFilter]);

    const currentStores = useMemo(() => {
        const start = page * pageSize;
        return filteredStores.slice(start, start + pageSize);
    }, [filteredStores, page, pageSize]);

    // Modal Handlers
    const openModal = async (store: StoreResponse) => {
        try {
            const detailedStore = await StoreService.getStore(store.id!);
            setSelectedStore(detailedStore.data || store);
            setEditForm({});
            setIsEditMode(false);
            setDeleteConfirm(false);
        } catch (e) {
            console.error(e);
            setSelectedStore(store);
        }
    };

    const closeModal = () => {
        setSelectedStore(null);
        setIsEditMode(false);
        setDeleteConfirm(false);
    };

    const handleEditClick = () => {
        if (!selectedStore) return;
        setEditForm({
            name: selectedStore.name,
            branch: selectedStore.branch || '',
            roadAddress: selectedStore.roadAddress,
            jibunAddress: selectedStore.jibunAddress,
            phone: selectedStore.phone || '',
            introduction: selectedStore.introduction || '',
            storeCategories: selectedStore.storeCategories || [],
        });
        setIsEditMode(true);
    };

    const handleSave = async () => {
        if (!selectedStore?.id || !editForm) return;
        try {
            await StoreService.updateStore(selectedStore.id, { request: editForm, images: [] });
            alert('상점 정보가 수정되었습니다.');
            closeModal();
            fetchAllStores();
        } catch (e) {
            console.error(e);
            alert('수정에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        if (!selectedStore?.id) return;
        try {
            await StoreService.deleteStore(selectedStore.id);
            alert('상점이 삭제되었습니다.');
            closeModal();
            fetchAllStores();
        } catch (e) {
            console.error(e);
            alert('삭제에 실패했습니다. (본인 소유 상점이 아닐 수 있습니다)');
        }
    };

    const handleInputChange = (field: keyof UpdateStoreRequest, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCategoryToggle = (category: 'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC') => {
        setEditForm(prev => {
            const currentCategories = prev.storeCategories || [];
            if (currentCategories.includes(category)) {
                return { ...prev, storeCategories: currentCategories.filter(c => c !== category) };
            } else {
                return { ...prev, storeCategories: [...currentCategories, category] };
            }
        });
    };

    if (loading && allStores.length === 0) {
        return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">등록된 상점 목록 ({totalElements})</h3>

                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="상점명, 지점명, 주소 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상점명 (지점)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주소</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStores.length > 0 ? (
                            currentStores.map((store) => (
                                <tr key={store.id} onClick={() => openModal(store)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                <StoreIcon className="w-4 h-4" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {store.name}
                                                    {store.branch && <span className="text-gray-500 font-normal ml-1">({store.branch})</span>}
                                                </div>
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

            {/* Pagination Controls */}
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
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let p = page - 2 + i;
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

            {/* Detail Modal */}
            {selectedStore && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">

                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button type="button" onClick={closeModal} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {isEditMode ? '상점 정보 수정' : selectedStore.name}
                                    </h3>

                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        {deleteConfirm ? (
                                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                                <h4 className="text-red-700 font-bold text-lg mb-2">정말 삭제하시겠습니까?</h4>
                                                <p className="text-red-600 mb-4">
                                                    상점이 **완전히 삭제**되며, 이 작업은 되돌릴 수 없습니다.<br />
                                                    리뷰, 소식 등 모든 관련 데이터가 함께 사라질 수 있습니다.
                                                </p>
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">취소</button>
                                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">확인 (삭제)</button>
                                                </div>
                                            </div>
                                        ) : isEditMode ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">상점명</label>
                                                        <input type="text" value={editForm.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">지점명</label>
                                                        <input type="text" value={editForm.branch || ''} onChange={e => handleInputChange('branch', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="예: 본점, 강남점" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 (중복 선택 가능)</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {CATEGORY_KEYS.map((key) => (
                                                            <div key={key} className="flex items-center">
                                                                <input
                                                                    id={`category-${key}`}
                                                                    name="storeCategories"
                                                                    type="checkbox"
                                                                    checked={editForm.storeCategories?.includes(key as any)}
                                                                    onChange={() => handleCategoryToggle(key as any)}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                />
                                                                <label htmlFor={`category-${key}`} className="ml-2 block text-sm text-gray-900">
                                                                    {CATEGORY_MAP[key]}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">도로명 주소</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={editForm.roadAddress || ''}
                                                            onClick={() => setIsAddressModalOpen(true)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 cursor-pointer"
                                                            placeholder="주소를 검색하세요"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAddressModalOpen(true)}
                                                            className="mt-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 text-sm font-medium whitespace-nowrap"
                                                        >
                                                            <Search className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">지번 주소</label>
                                                    <input type="text" value={editForm.jibunAddress || ''} onChange={e => handleInputChange('jibunAddress', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded text-xs text-gray-500">
                                                    <div>위도: {editForm.latitude}</div>
                                                    <div>경도: {editForm.longitude}</div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">전화번호</label>
                                                    <input type="text" value={editForm.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">소개</label>
                                                    <textarea value={editForm.introduction || ''} onChange={e => handleInputChange('introduction', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" rows={3} />
                                                </div>
                                            </div>
                                        ) : (
                                            <dl className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">{selectedStore.id}</dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">상점명</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">
                                                        {selectedStore.name}
                                                        {selectedStore.branch && <span className="text-gray-500 ml-1">({selectedStore.branch})</span>}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">카테고리</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">
                                                        {selectedStore.storeCategories?.map(c => CATEGORY_MAP[c] || c).join(', ') || '-'}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">주소</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">
                                                        {selectedStore.roadAddress}<br />
                                                        <span className="text-gray-400 text-xs">{selectedStore.jibunAddress}</span>
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">전화번호</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">{selectedStore.phone || '-'}</dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">소개</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">{selectedStore.introduction || '-'}</dd>
                                                </div>
                                            </dl>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!deleteConfirm && (
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                저장
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditMode(false)}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {selectedStore.storeStatus === 'ACTIVE' ? (
                                                <div className="w-full text-center sm:text-right text-sm text-gray-500 py-2">
                                                    * 입점된 상점은 수정/삭제할 수 없습니다.
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handleEditClick}
                                                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-indigo-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-2" />
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirm(true)}
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AddressSearchModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={handleAddressComplete}
            />
        </div>
    );
}

