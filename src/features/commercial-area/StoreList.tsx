import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { StoreResponse } from '../../shared/api/models/StoreResponse';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Store as StoreIcon, X, Edit2, Trash2, Save, AlertTriangle, Upload } from 'lucide-react';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { AddressSearchFields } from '../../shared/components/AddressSearchFields';
import { AdminService } from '../../shared/api/services/AdminService';
import { OperatingHoursEditor } from './OperatingHoursEditor';
import { StoreMenuEditor, type MenuCategoryState, type MenuItemState, getMenuCategoryLocalId, getMenuItemLocalId, sortMenuItemsByOrder } from './StoreMenuEditor';
import { ItemService, type UpdateItemRequest } from '../../shared/api/services/ItemService';
import type { CreateItemRequest } from '../../shared/api/models/CreateItemRequest';
import type { UpdateStoreRequest } from '../../shared/api/models/UpdateStoreRequest';
import type { AddressSearchResultData, GeocodeResult } from '../../shared/types/address';
import { formatKoreanPhoneNumber } from '../../shared/utils/phoneNumber';
import { uploadImage, uploadImages } from '../../shared/utils/uploadImage';
import { getVisiblePageNumbers } from '../../shared/utils/pagination';
import { ItemCategoryService } from '../../shared/api/services/ItemCategoryService';
import { ImageCropper } from '../../shared/components/ImageCropper';

interface StoreListProps {
    universityId: number;
}

const CATEGORY_MAP: Record<StoreCategory, string> = {
    'BAR': '주점',
    'CAFE': '카페',
    'RESTAURANT': '식당',
    'ENTERTAINMENT': '놀거리',
    'BEAUTY_HEALTH': '뷰티•헬스',
    'ETC': '기타'
};

const CATEGORY_KEYS = Object.keys(CATEGORY_MAP) as StoreCategory[];

type StoreCategory = NonNullable<UpdateStoreRequest['storeCategories']>[number];
type StoreStatusFilter = '' | 'UNCLAIMED' | 'ACTIVE' | 'BANNED';
type PartnershipFilter = 'all' | 'yes' | 'no';

interface PendingStoreImageCrop {
    fileName: string;
    fileType: string;
    src: string;
}

export function StoreList({ universityId }: StoreListProps) {
    const [stores, setStores] = useState<StoreResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StoreStatusFilter>('');
    const [partnershipFilter, setPartnershipFilter] = useState<PartnershipFilter>('all');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 체크박스 선택 state
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState<UpdateStoreRequest>({});
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Menu Items State
    const [menuItems, setMenuItems] = useState<MenuItemState[]>([]);
    const [menuCategories, setMenuCategories] = useState<MenuCategoryState[]>([]);

    // Images State
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [cropQueue, setCropQueue] = useState<PendingStoreImageCrop[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Address Search State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleAddressComplete = async (data: AddressSearchResultData) => {
        const roadAddr = data.roadAddress;
        const jibunAddr = data.jibunAddress;

        try {
            const response = await AdminService.getGeocode(roadAddr);
            const coords = (response.data ?? (response as unknown as GeocodeResult)) as GeocodeResult;
            setEditForm((prev) => ({
                ...prev,
                roadAddress: roadAddr,
                jibunAddress: jibunAddr || coords.jibunAddress || prev.jibunAddress,
                latitude: coords.latitude ?? prev.latitude,
                longitude: coords.longitude ?? prev.longitude,
            }));
        } catch (error) {
            console.error('Geocoding failed:', error);
            setEditForm((prev) => ({
                ...prev,
                roadAddress: roadAddr,
                jibunAddress: jibunAddr || prev.jibunAddress,
            }));
        }
    };

    const fetchStores = useCallback(async () => {
        setLoading(true);
        const hasPartnership =
            partnershipFilter === 'yes' ? true :
                partnershipFilter === 'no' ? false :
                    undefined;

        try {
            const response = await StoreService.getStores(
                { page, size: pageSize, sort: ['id,asc'] },
                debouncedSearchTerm || undefined,
                undefined,
                undefined,
                universityId,
                hasPartnership,
                statusFilter || undefined,
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
        const results = await Promise.allSettled(ids.map(id => StoreService.deleteStore(id)));
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

    // Modal Handlers
    const openModal = async (store: StoreResponse) => {
        try {
            const detailedStore = await StoreService.getStore(store.id!);
            setSelectedStore(detailedStore.data || store);
            setEditForm({});
            setIsEditMode(false);
            setDeleteConfirm(false);
            setImages([]);
            setImagePreviews([]);
            setMenuItems([]);
            setMenuCategories([]);

            // Load menu categories and menu items in parallel.
            const [itemsResult, categoriesResult] = await Promise.allSettled([
                ItemService.getItems(store.id!),
                ItemCategoryService.getItemCategories(store.id!),
            ]);

            const loadedCategories: MenuCategoryState[] = [];

            if (categoriesResult.status === 'fulfilled' && categoriesResult.value.data) {
                loadedCategories.push(
                    ...categoriesResult.value.data.map((category) => ({
                        id: category.id,
                        localId: getMenuCategoryLocalId(category.id!),
                        name: category.name || '',
                    })),
                );
            } else if (categoriesResult.status === 'rejected') {
                console.error('Failed to load menu categories', categoriesResult.reason);
            }

            if (itemsResult.status === 'fulfilled' && itemsResult.value.data) {
                const categoryIds = new Set(loadedCategories.map((category) => category.id));

                const loadedItems = sortMenuItemsByOrder(itemsResult.value.data.map((item) => {
                    if (item.categoryId && !categoryIds.has(item.categoryId)) {
                        loadedCategories.push({
                            id: item.categoryId,
                            localId: getMenuCategoryLocalId(item.categoryId),
                            name: item.categoryName || `카테고리 ${item.categoryId}`,
                        });
                        categoryIds.add(item.categoryId);
                    }

                    return {
                        localId: item.id ? getMenuItemLocalId(item.id) : `legacy-item-${item.name ?? 'menu'}`,
                        id: item.id,
                        name: item.name || '',
                        price: item.price,
                        description: item.description,
                        badge: item.badge as MenuItemState['badge'],
                        categoryLocalId: item.categoryId ? getMenuCategoryLocalId(item.categoryId) : undefined,
                        itemOrder: item.itemOrder,
                        imageUrl: item.imageUrl,
                    };
                }));

                setMenuItems(loadedItems);
            } else if (itemsResult.status === 'rejected') {
                console.error('Failed to load menus', itemsResult.reason);
            }

            setMenuCategories(loadedCategories);

        } catch (e) {
            console.error(e);
            setSelectedStore(store);
        }
    };

    const closeModal = () => {
        cropQueue.forEach(({ src }) => URL.revokeObjectURL(src));
        setSelectedStore(null);
        setIsEditMode(false);
        setDeleteConfirm(false);
        setImages([]);
        setImagePreviews([]);
        setMenuItems([]);
        setMenuCategories([]);
        setCropQueue([]);
    };

    const handleEditClick = () => {
        if (!selectedStore) return;
        setEditForm({
            name: selectedStore.name,
            branch: selectedStore.branch || '',
            roadAddress: selectedStore.roadAddress,
            jibunAddress: selectedStore.jibunAddress,
            phone: formatKoreanPhoneNumber(selectedStore.phone || ''),
            introduction: selectedStore.introduction || '',
            storeCategories: selectedStore.storeCategories || [],
            latitude: selectedStore.latitude,
            longitude: selectedStore.longitude,
            operatingHours: selectedStore.operatingHours || '',
            profileImageUrl: selectedStore.profileImageUrl
        });

        const existingImages = selectedStore.imageUrls || [];
        setImagePreviews(existingImages);
        setImages([]);

        setIsEditMode(true);
    };

    const handleSave = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!selectedStore?.id || !editForm) return;

        const invalidMenuCategory = menuCategories.find((category) => !category.isDeleted && category.name.trim() === '');
        if (invalidMenuCategory) {
            alert('메뉴 카테고리 이름을 입력하거나 삭제해주세요.');
            return;
        }

        try {
            // Upload new images, preserve existing URLs (non-blob)
            const existingUrls = imagePreviews.filter(url => !url.startsWith('blob:'));
            const newImageUrls = images.length > 0 ? await uploadImages(images) : [];
            const allImageUrls = [...existingUrls, ...newImageUrls];

            const requestData: UpdateStoreRequest = {
                ...editForm,
                profileImageUrl: allImageUrls[0],
                imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
            };
            if (typeof requestData.latitude !== 'number' || isNaN(requestData.latitude)) requestData.latitude = undefined;
            if (typeof requestData.longitude !== 'number' || isNaN(requestData.longitude)) requestData.longitude = undefined;

            await StoreService.updateStore(selectedStore.id, requestData);

            let failureCount = 0;
            const categoryIdMap = new Map<string, number>();

            for (const category of menuCategories) {
                if (!category.isDeleted && category.id) {
                    categoryIdMap.set(category.localId, category.id);
                }
            }

            const deleteItemResults = await Promise.allSettled(
                menuItems
                    .filter((item) => item.isDeleted && item.id)
                    .map((item) => ItemService.deleteItem(item.id!)),
            );
            failureCount += deleteItemResults.filter((result) => result.status === 'rejected').length;

            const categoryUpsertResults = await Promise.allSettled(
                menuCategories
                    .filter((category) => !category.isDeleted)
                    .map(async (category) => {
                        const trimmedName = category.name.trim();

                        if (category.id) {
                            await ItemCategoryService.updateItemCategory(selectedStore.id!, category.id, { name: trimmedName });
                            return;
                        }

                        const createdCategory = await ItemCategoryService.createItemCategory(selectedStore.id!, { name: trimmedName });
                        if (typeof createdCategory.data !== 'number') {
                            throw new Error('Category ID was not returned from createItemCategory.');
                        }

                        categoryIdMap.set(category.localId, createdCategory.data);
                    }),
            );
            failureCount += categoryUpsertResults.filter((result) => result.status === 'rejected').length;

            const itemResults = await Promise.allSettled(
                menuItems.map(async (item) => {
                    if (item.isDeleted) {
                        return;
                    }

                    const trimmedName = item.name.trim();
                    if (!item.id && trimmedName === '') {
                        return;
                    }

                    const categoryId = item.categoryLocalId
                        ? categoryIdMap.get(item.categoryLocalId)
                        : undefined;

                    if (item.categoryLocalId && !categoryId) {
                        throw new Error(`Failed to resolve category for item "${item.name}".`);
                    }

                    if (item.id) {
                        let imageUrl: string | undefined = item.imageUrl;
                        if (item.imageFile) {
                            imageUrl = await uploadImage(item.imageFile);
                        }

                        const updateReq = {
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            badge: item.badge,
                            itemOrder: item.itemOrder,
                            itemCategoryId: categoryId ?? null,
                            imageUrl,
                        } satisfies Omit<UpdateItemRequest, 'itemCategoryId'> & { itemCategoryId?: number | null };

                        return ItemService.updateItem(item.id, updateReq as UpdateItemRequest);
                    }

                    let imageUrl: string | undefined;
                    if (item.imageFile) {
                        imageUrl = await uploadImage(item.imageFile);
                    }

                    const createReq: CreateItemRequest = {
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        badge: item.badge,
                        itemOrder: item.itemOrder,
                        itemCategoryId: categoryId,
                        imageUrl,
                    };
                    return ItemService.createItem(selectedStore.id!, createReq);
                }),
            );
            failureCount += itemResults.filter((result) => result.status === 'rejected').length;

            const deleteCategoryResults = await Promise.allSettled(
                menuCategories
                    .filter((category) => category.isDeleted && category.id)
                    .map((category) => ItemCategoryService.deleteItemCategory(selectedStore.id!, category.id!)),
            );
            failureCount += deleteCategoryResults.filter((result) => result.status === 'rejected').length;

            if (failureCount > 0) {
                console.error('Menu/category save failures', {
                    deleteItemResults,
                    categoryUpsertResults,
                    itemResults,
                    deleteCategoryResults,
                });
                alert(`상점 정보는 수정되었으나, 메뉴/카테고리 ${failureCount}건 처리에 실패했습니다.`);
            } else {
                alert('상점 정보가 수정되었습니다.');
            }

            closeModal();
            void fetchStores();
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
            void fetchStores();
        } catch (e) {
            console.error(e);
            alert('삭제에 실패했습니다. (본인 소유 상점이 아닐 수 있습니다)');
        }
    };

    const handleInputChange = (
        field: keyof UpdateStoreRequest,
        value: string | number | undefined | StoreCategory[]
    ) => {
        setEditForm((prev) => {
            if (field === 'latitude' || field === 'longitude') {
                const numericValue = String(value ?? '');
                if (numericValue === '') return { ...prev, [field]: undefined };
                const num = Number(numericValue);
                return { ...prev, [field]: Number.isNaN(num) ? undefined : num };
            }

            if (field === 'phone') {
                return { ...prev, phone: formatKoreanPhoneNumber(String(value ?? '')) };
            }

            return { ...prev, [field]: value } as UpdateStoreRequest;
        });
    };

    const currentCrop = cropQueue[0] ?? null;

    const enqueueImageCrops = (files: File[]) => {
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        setCropQueue((prev) => [
            ...prev,
            ...imageFiles.map((file) => ({
                fileName: file.name,
                fileType: file.type,
                src: URL.createObjectURL(file),
            })),
        ]);
    };

    const closeCurrentCrop = () => {
        if (!currentCrop) return;
        URL.revokeObjectURL(currentCrop.src);
        setCropQueue((prev) => prev.slice(1));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            enqueueImageCrops(Array.from(e.target.files));
        }

        if (e.target) {
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        const existingCount = imagePreviews.length - images.length;

        setImagePreviews(prev => {
            const newPreviews = [...prev];
            if (index >= existingCount) {
                URL.revokeObjectURL(newPreviews[index]);
            }
            newPreviews.splice(index, 1);
            return newPreviews;
        });

        if (index >= existingCount) {
            setImages(prev => {
                const newFiles = [...prev];
                newFiles.splice(index - existingCount, 1);
                return newFiles;
            });
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (!isEditMode) return;
        if (!e.clipboardData?.files.length) return;
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length > 0) {
            enqueueImageCrops(pastedFiles);
        }
    };

    const handleImagesDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isEditMode) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (newFiles.length > 0) {
                enqueueImageCrops(newFiles);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleCropComplete = (croppedImageUrl: string, blob: Blob) => {
        if (!currentCrop) return;

        const croppedFile = new File([blob], currentCrop.fileName, {
            type: blob.type || currentCrop.fileType || 'image/jpeg',
        });

        setImages((prev) => [...prev, croppedFile]);
        setImagePreviews((prev) => [...prev, croppedImageUrl]);
        closeCurrentCrop();
    };

    const handleCropCancel = () => {
        closeCurrentCrop();
    };

    const handleCategoryToggle = (category: StoreCategory) => {
        setEditForm((prev) => {
            const currentCategories = prev.storeCategories || [];
            if (currentCategories.includes(category)) {
                return { ...prev, storeCategories: currentCategories.filter((c) => c !== category) };
            }
            return { ...prev, storeCategories: [...currentCategories, category] };
        });
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
                                const isActive = store.storeStatus === 'ACTIVE';
                                const isChecked = selectedIds.has(store.id!);
                                return (
                                    <tr
                                        key={store.id}
                                        onClick={() => openModal(store)}
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}
                                    >
                                        <td className="w-12 px-4 py-4" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(store.id!)}
                                                disabled={isActive}
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
                                {getVisiblePageNumbers(page, totalPages).map((p) => (
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
                                ))}
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
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                    onPaste={handlePaste}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${isEditMode ? 'sm:max-w-4xl' : 'sm:max-w-lg'} sm:w-full sm:p-6`}>

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
                                            <form id="store-edit-form" onSubmit={handleSave}>
                                                <div className="flex flex-col md:flex-row gap-6 text-left">
                                                    {/* Section 1: Basic Info */}
                                                    <div className="flex-1 space-y-4">
                                                        <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">섹션 1: 기본 정보</h4>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">상점명</label>
                                                            <input type="text" value={editForm.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">지점명</label>
                                                            <input type="text" value={editForm.branch || ''} onChange={e => handleInputChange('branch', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="예: 본점, 강남점" />
                                                        </div>
                                                        <AddressSearchFields
                                                            label="매장 주소"
                                                            placeholder="클릭해서 매장 주소를 검색하세요"
                                                            roadAddress={editForm.roadAddress}
                                                            jibunAddress={editForm.jibunAddress}
                                                            onOpen={() => setIsAddressModalOpen(true)}
                                                        />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">위도</label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.latitude ?? ''}
                                                                    onChange={e => handleInputChange('latitude', e.target.value)}
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">경도</label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.longitude ?? ''}
                                                                    onChange={e => handleInputChange('longitude', e.target.value)}
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="hidden md:block w-px bg-gray-200" />

                                                    {/* Section 2: Additional Info */}
                                                    <div className="flex-1 space-y-4">
                                                        <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">섹션 2: 추가 정보</h4>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 (중복 선택 가능)</label>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {CATEGORY_KEYS.map((key) => (
                                                                    <div key={key} className="flex items-center">
                                                                        <input
                                                                            id={`category-${key}`}
                                                                            name="storeCategories"
                                                                            type="checkbox"
                                                                            checked={editForm.storeCategories?.includes(key)}
                                                                            onChange={() => handleCategoryToggle(key)}
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
                                                            <label className="block text-sm font-medium text-gray-700">전화번호</label>
                                                            <input type="tel" value={editForm.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} inputMode="numeric" autoComplete="tel-national" maxLength={14} placeholder="010-1234-5678" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">영업 시간</label>
                                                            <OperatingHoursEditor
                                                                value={editForm.operatingHours || ''}
                                                                onChange={val => handleInputChange('operatingHours', val)}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">소개</label>
                                                            <textarea value={editForm.introduction || ''} onChange={e => handleInputChange('introduction', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none" rows={2} />
                                                        </div>

                                                        {/* Images Upload */}
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <label className="block text-sm font-medium text-gray-700">상점 이미지</label>
                                                                <span className="text-xs text-gray-500">첫 번째 이미지가 배너가 되며, 새 이미지는 4:3으로 크롭됩니다.</span>
                                                            </div>

                                                            <div
                                                                onClick={handleImageClick}
                                                                onDrop={handleImagesDrop}
                                                                onDragOver={handleDragOver}
                                                                className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                                            >
                                                                <Upload className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                                                                <p className="text-xs text-gray-600">클릭하거나 이미지를 드래그 앤 드롭해서 업로드하세요</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="hidden"
                                                                ref={fileInputRef}
                                                                onChange={handleImageChange}
                                                            />

                                                            {imagePreviews.length > 0 && (
                                                                <div className="mt-3 grid grid-cols-4 gap-2">
                                                                    {imagePreviews.map((preview, idx) => (
                                                                        <div key={idx} className="relative aspect-[4/3] rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
                                                                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                                                            <div className="absolute top-1 left-1">
                                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-600/80'}`}>
                                                                                    {idx === 0 ? '배너' : '일반'}
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 3: Menu Info Component Wrapper */}
                                                <div className="flex-col w-full text-left border-t border-gray-200 mt-6 pt-6 gap-6 text-left">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex justify-between items-center border-b pb-2">
                                                            <h4 className="text-sm font-semibold text-gray-900">섹션 3: 메뉴 정보</h4>
                                                            <span className="text-xs text-gray-500">선택 사항</span>
                                                        </div>
                                                        <StoreMenuEditor
                                                            items={menuItems}
                                                            onChange={setMenuItems}
                                                            categories={menuCategories}
                                                            onCategoriesChange={setMenuCategories}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <dl className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">{selectedStore.id}</dd>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">상점명</dt>
                                                    <dd className="text-sm text-gray-900 col-span-2">
                                                        <div>{selectedStore.name}</div>
                                                        {selectedStore.branch && <div className="text-gray-500 text-xs mt-0.5">{selectedStore.branch}</div>}
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
                                                    <dd className="text-sm text-gray-900 col-span-2">{selectedStore.phone ? formatKoreanPhoneNumber(selectedStore.phone) : '-'}</dd>
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
                                                type="submit"
                                                form="store-edit-form"
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

            {currentCrop && (
                <ImageCropper
                    imageSrc={currentCrop.src}
                    aspectRatio={4 / 3}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}





