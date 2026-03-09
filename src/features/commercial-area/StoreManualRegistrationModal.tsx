import { X, Save, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { AddressSearchFields } from '../../shared/components/AddressSearchFields';
import { AdminService } from '../../shared/api/services/AdminService';
import { OperatingHoursEditor } from './OperatingHoursEditor';
import { StoreMenuEditor, type MenuCategoryState, type MenuItemState } from './StoreMenuEditor';
import { ItemService } from '../../shared/api/services/ItemService';
import type { CreateStoreRequest } from '../../shared/api/models/CreateStoreRequest';
import type { AddressSearchResultData, GeocodeResult } from '../../shared/types/address';
import type { CreateItemRequest } from '../../shared/api/models/CreateItemRequest';
import { formatKoreanPhoneNumber } from '../../shared/utils/phoneNumber';
import { uploadImage, uploadImages } from '../../shared/utils/uploadImage';
import { ItemCategoryService } from '../../shared/api/services/ItemCategoryService';

interface StoreManualRegistrationModalProps {
    onClose: () => void;
}

type StoreCategory = NonNullable<CreateStoreRequest['storeCategories']>[number];

const CATEGORY_MAP: Record<StoreCategory, string> = {
    'RESTAURANT': '식당',
    'BAR': '주점',
    'CAFE': '카페',
    'ENTERTAINMENT': '놀거리',
    'BEAUTY_HEALTH': '뷰티•헬스',
    'ETC': '기타'
};

const CATEGORY_KEYS = Object.keys(CATEGORY_MAP) as StoreCategory[];

export function StoreManualRegistrationModal({ onClose }: StoreManualRegistrationModalProps) {
    const { universities, selectedUniversityId } = useUniversity();

    const [loading, setLoading] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [menuItems, setMenuItems] = useState<MenuItemState[]>([]);
    const [menuCategories, setMenuCategories] = useState<MenuCategoryState[]>([]);

    const [formData, setFormData] = useState<{
        name: string;
        branch: string;
        address: string;
        jibunAddress: string;
        storeCategories: StoreCategory[];
        description: string;
        phone: string;
        latitude: number | '';
        longitude: number | '';
        operatingHours: string;
        universityIds: number[];
    }>({
        name: '',
        branch: '',
        address: '',
        jibunAddress: '',
        storeCategories: [],
        description: '',
        phone: '',
        latitude: '',
        longitude: '',
        operatingHours: '',
        universityIds: selectedUniversityId ? [selectedUniversityId] : [],
    });

    const handleAddressComplete = async (data: AddressSearchResultData) => {
        const roadAddr = data.roadAddress;
        const jibunAddr = data.jibunAddress || data.autoJibunAddress || '';

        // Update form with address first
        setFormData((prev) => ({
            ...prev,
            address: roadAddr,
            jibunAddress: jibunAddr,
        }));

        // Trigger Geocoding
        try {
            const response = await AdminService.getGeocode(roadAddr);
            const coords = (response.data ?? (response as unknown as GeocodeResult)) as GeocodeResult;
            if (coords.latitude && coords.longitude) {
                setFormData((prev) => ({
                    ...prev,
                    latitude: coords.latitude ?? prev.latitude,
                    longitude: coords.longitude ?? prev.longitude,
                    jibunAddress: prev.jibunAddress || coords.jibunAddress || '',
                }));
            }
        } catch (error) {
            console.error('Geocoding failed:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (!e.clipboardData?.files.length) return;
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length > 0) {
            setImages(prev => [...prev, ...pastedFiles]);
            const newPreviews = pastedFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleImagesDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (newFiles.length > 0) {
                setImages(prev => [...prev, ...newFiles]);
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                setImagePreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        const invalidMenuCategory = menuCategories.find((category) => !category.isDeleted && category.name.trim() === '');
        if (invalidMenuCategory) {
            alert('메뉴 카테고리 이름을 입력하거나 삭제해주세요.');
            return;
        }

        setLoading(true);
        try {
            const uploadedImageUrls = images.length > 0 ? await uploadImages(images) : [];

            const requestPayload: CreateStoreRequest = {
                name: formData.name,
                roadAddress: formData.address,
                jibunAddress: formData.jibunAddress,
                storeCategories: formData.storeCategories,
                storePhone: formData.phone,
                introduction: formData.description,
                latitude: formData.latitude === '' ? 0 : Number(formData.latitude),
                longitude: formData.longitude === '' ? 0 : Number(formData.longitude),
                operatingHours: formData.operatingHours,
                storeMoods: [],
                universityIds: formData.universityIds,
                profileImageUrl: uploadedImageUrls[0],
                imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
            };

            const storeId = await StoreService.createStore(requestPayload);

            const createdStoreId = typeof storeId?.data === 'number' ? storeId.data : undefined;

            const categoryIdMap = new Map<string, number>();
            if (createdStoreId) {
                const categoryResults = await Promise.allSettled(
                    menuCategories
                        .filter((category) => !category.isDeleted)
                        .map(async (category) => {
                            const createdCategory = await ItemCategoryService.createItemCategory(createdStoreId, {
                                name: category.name.trim(),
                            });

                            if (typeof createdCategory.data !== 'number') {
                                throw new Error('Category ID was not returned from createItemCategory.');
                            }

                            categoryIdMap.set(category.localId, createdCategory.data);
                        }),
                );

                const categoryFailureCount = categoryResults.filter((result) => result.status === 'rejected').length;

                // If menu items exist, save them after categories are prepared.
                let itemFailureCount = 0;

                const menuItemResults = await Promise.allSettled(
                    menuItems
                        .filter(item => !item.isDeleted && item.name.trim() !== '')
                        .map(async (item) => {
                            const categoryId = item.categoryLocalId
                                ? categoryIdMap.get(item.categoryLocalId)
                                : undefined;

                            if (item.categoryLocalId && !categoryId) {
                                throw new Error(`Failed to resolve category for item "${item.name}".`);
                            }

                            let imageUrl: string | undefined;
                            if (item.imageFile) {
                                imageUrl = await uploadImage(item.imageFile);
                            }

                            const itemRequest: CreateItemRequest = {
                                name: item.name,
                                price: item.price,
                                description: item.description,
                                badge: item.badge,
                                itemOrder: item.itemOrder,
                                itemCategoryId: categoryId,
                                imageUrl,
                            };

                            await ItemService.createItem(createdStoreId, itemRequest);
                        }),
                );

                itemFailureCount = menuItemResults.filter((result) => result.status === 'rejected').length;

                if (categoryFailureCount > 0 || itemFailureCount > 0) {
                    console.error('Menu/category create failures', { categoryResults, menuItemResults });
                    alert(`상점은 등록되었으나, 메뉴/카테고리 ${categoryFailureCount + itemFailureCount}건 처리에 실패했습니다.`);
                    onClose();
                    return;
                }
            }

            alert('상점이 성공적으로 등록되었습니다.');
            onClose();
        } catch (error) {
            console.error(error);
            alert('상점 등록에 실패했습니다. (API 확인 필요)');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'latitude' || name === 'longitude') {
            // Allow empty string or numbers, also allow decimal points correctly
            if (value === '') {
                setFormData(prev => ({ ...prev, [name]: '' }));
            } else if (!isNaN(Number(value))) {
                setFormData(prev => ({ ...prev, [name]: Number(value) }));
            }
            return;
        }

        if (name === 'phone') {
            setFormData(prev => ({
                ...prev,
                phone: formatKoreanPhoneNumber(value)
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryToggle = (category: StoreCategory) => {
        setFormData(prev => {
            const currentCategories = prev.storeCategories;
            if (currentCategories.includes(category)) {
                return { ...prev, storeCategories: currentCategories.filter(c => c !== category) };
            } else {
                return { ...prev, storeCategories: [...currentCategories, category] };
            }
        });
    };

    const handleUniversityToggle = (id: number) => {
        setFormData(prev => {
            const isSelected = prev.universityIds.includes(id);
            if (isSelected) {
                return { ...prev, universityIds: prev.universityIds.filter(uid => uid !== id) };
            } else {
                return { ...prev, universityIds: [...prev.universityIds, id] };
            }
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onPaste={handlePaste}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">가게 개별 등록</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* University Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">대학 선택 (복수 선택 가능)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                            {universities.map(uni => (
                                <div key={uni.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`uni-${uni.id}`}
                                        checked={formData.universityIds.includes(uni.id!)}
                                        onChange={() => uni.id && handleUniversityToggle(uni.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`uni-${uni.id}`} className="ml-2 block text-sm text-gray-900 truncate" title={uni.name}>
                                        {uni.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Section 1: Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-sm font-semibold text-gray-900">섹션 1: 기본 정보</h3>
                                <span className="text-xs text-gray-500">* 필수 입력</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">상점명 *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="상점/법인 명"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">지점명</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="예: 강남점"
                                    />
                                </div>
                                <AddressSearchFields
                                    label="매장 주소"
                                    placeholder="클릭해서 매장 주소를 검색하세요"
                                    roadAddress={formData.address}
                                    jibunAddress={formData.jibunAddress}
                                    onOpen={() => setIsAddressModalOpen(true)}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">위도</label>
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={formData.latitude === '' ? '' : formData.latitude}
                                            onChange={handleChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="예: 37.1234"
                                            pattern="^-?[0-9]*\.?[0-9]+$"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">경도</label>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={formData.longitude === '' ? '' : formData.longitude}
                                            onChange={handleChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="예: 127.1234"
                                            pattern="^-?[0-9]*\.?[0-9]+$"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px bg-gray-200" />

                        {/* Section 2: Additional Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-sm font-semibold text-gray-900">섹션 2: 추가 정보</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 (중복 선택 가능)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CATEGORY_KEYS.map((key) => (
                                            <div key={key} className="flex items-center">
                                                <input
                                                    id={`reg-category-${key}`}
                                                    type="checkbox"
                                                    checked={formData.storeCategories.includes(key)}
                                                    onChange={() => handleCategoryToggle(key)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`reg-category-${key}`} className="ml-2 block text-sm text-gray-900">
                                                    {CATEGORY_MAP[key]}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        maxLength={14}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="010-1234-5678"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">영업 시간</label>
                                    <OperatingHoursEditor
                                        value={formData.operatingHours}
                                        onChange={(val) => setFormData(prev => ({ ...prev, operatingHours: val }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                                        placeholder="상점에 대한 간단한 소개를 입력하세요"
                                    />
                                </div>

                                {/* Images Upload */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">상점 이미지</label>
                                        <span className="text-xs text-gray-500">첫 번째 이미지가 배너가 됩니다.</span>
                                    </div>

                                    <div
                                        onClick={handleImageClick}
                                        onDrop={handleImagesDrop}
                                        onDragOver={handleDragOver}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">클릭하거나 이미지를 드래그 앤 드롭해서 업로드하세요</p>
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
                                                <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
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
                    </div>

                    {/* Section 3: Menu Info */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">섹션 3: 메뉴 정보</h3>
                            <span className="text-xs text-gray-500">선택 사항</span>
                        </div>
                        <StoreMenuEditor
                            items={menuItems}
                            onChange={setMenuItems}
                            categories={menuCategories}
                            onCategoriesChange={setMenuCategories}
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                등록하기
                            </>
                        )}
                    </button>
                </div>

                <AddressSearchModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onComplete={handleAddressComplete}
                />
            </div>
        </div>
    );
}





