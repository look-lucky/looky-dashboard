import { X, Save, Search, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { CreateStoreRequest } from '../../shared/api/models/CreateStoreRequest';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { AdminService } from '../../shared/api/services/AdminService';
import { OperatingHoursEditor } from './OperatingHoursEditor';

interface StoreManualRegistrationModalProps {
    onClose: () => void;
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

export function StoreManualRegistrationModal({ onClose }: StoreManualRegistrationModalProps) {
    const { universities, selectedUniversityId } = useUniversity();

    const [loading, setLoading] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        name: string;
        branch: string;
        address: string;
        jibunAddress: string;
        storeCategories: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
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

    const handleAddressComplete = async (data: any) => {
        const roadAddr = data.roadAddress;
        const jibunAddr = data.jibunAddress || data.autoJibunAddress || '';

        // Update form with address first
        setFormData(prev => ({
            ...prev,
            address: roadAddr,
            jibunAddress: jibunAddr
        }));

        // Trigger Geocoding
        try {
            const response = await AdminService.getGeocode(roadAddr);
            const coords = response.data || response;
            if (coords && coords.latitude && coords.longitude) {
                setFormData(prev => ({
                    ...prev,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    jibunAddress: prev.jibunAddress || coords.jibunAddress || ''
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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const requestPayload: CreateStoreRequest = {
                name: formData.name,
                branch: formData.branch,
                bizRegNo: '000-00-00000',
                roadAddress: formData.address,
                jibunAddress: formData.jibunAddress,
                storeCategories: formData.storeCategories,
                storePhone: formData.phone,
                introduction: formData.description,
                latitude: formData.latitude === '' ? 0 : Number(formData.latitude),
                longitude: formData.longitude === '' ? 0 : Number(formData.longitude),
                operatingHours: formData.operatingHours,
                storeMoods: [],
                universityIds: formData.universityIds
            };

            await StoreService.createStore({
                request: requestPayload,
                images: images
            });

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

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryToggle = (category: 'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC') => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">도로명 주소 *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            readOnly
                                            value={formData.address}
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm cursor-pointer bg-gray-50"
                                            placeholder="주소를 검색하세요"
                                        />
                                        <button type="button" onClick={() => setIsAddressModalOpen(true)} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 text-sm font-medium whitespace-nowrap">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">지번 주소</label>
                                    <input
                                        type="text"
                                        name="jibunAddress"
                                        value={formData.jibunAddress}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="자동 입력됩니다"
                                    />
                                </div>

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
                                                    checked={formData.storeCategories.includes(key as any)}
                                                    onChange={() => handleCategoryToggle(key as any)}
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
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="02-0000-0000"
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
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">클릭하여 이미지를 업로드하세요</p>
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
