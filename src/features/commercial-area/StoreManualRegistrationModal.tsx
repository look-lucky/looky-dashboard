import { X, Save, Search } from 'lucide-react';
import { useState } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { CreateStoreRequest } from '../../shared/api/models/CreateStoreRequest';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { useNaverGeocoding } from '../../shared/hooks/useNaverGeocoding';

interface StoreManualRegistrationModalProps {
    onClose: () => void;
}

export function StoreManualRegistrationModal({ onClose }: StoreManualRegistrationModalProps) {
    const { universities, selectedUniversityId } = useUniversity();
    const { geocodeAddress } = useNaverGeocoding();

    const [loading, setLoading] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [formData, setFormData] = useState<{
        name: string;
        branch: string;
        address: string;
        jibunAddress: string;
        category: 'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC';
        description: string;
        phone: string;
        latitude: number;
        longitude: number;
        universityIds: number[];
    }>({
        name: '',
        branch: '',
        address: '',
        jibunAddress: '',
        category: 'ETC',
        description: '',
        phone: '',
        latitude: 0,
        longitude: 0,
        universityIds: selectedUniversityId ? [selectedUniversityId] : [],
    });

    const handleAddressComplete = async (data: any) => {
        const roadAddr = data.roadAddress;
        const jibunAddr = data.jibunAddress;

        // Update form with address first
        setFormData(prev => ({
            ...prev,
            address: roadAddr,
            jibunAddress: jibunAddr
        }));

        // Trigger Geocoding
        const coords = await geocodeAddress(roadAddr);
        if (coords) {
            setFormData(prev => ({
                ...prev,
                latitude: coords.latitude,
                longitude: coords.longitude,
                // Ensure jibun is set if Daum didn't provide one (unlikely but safe)
                jibunAddress: prev.jibunAddress || coords.jibunAddress
            }));
        }
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
                bizRegNo: '000-00-00000', // Dummy
                roadAddress: formData.address,
                jibunAddress: formData.jibunAddress,
                storeCategories: [formData.category],
                storePhone: formData.phone,
                introduction: formData.description,
                latitude: formData.latitude,
                longitude: formData.longitude,
                operatingHours: '',
                storeMoods: [],
                universityIds: formData.universityIds
            };

            await StoreService.createStore({
                request: requestPayload,
                images: []
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
        setFormData(prev => ({
            ...prev,
            [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
        }));
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">가게 개별 등록</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    {/* University Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">대학 선택 (복수 선택 가능)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                            {universities.map(uni => (
                                <div key={uni.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`uni-${uni.id}`}
                                        checked={formData.universityIds.includes(uni.id!)}
                                        onChange={() => uni.id && handleUniversityToggle(uni.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`uni-${uni.id}`} className="ml-2 block text-sm text-gray-900">
                                        {uni.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">기본 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">상점명 *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    placeholder="상점 이름을 입력하세요"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                >
                                    <option value="RESTAURANT">음식점</option>
                                    <option value="CAFE">카페</option>
                                    <option value="BAR">주점</option>
                                    <option value="ENTERTAINMENT">문화/여가</option>
                                    <option value="BEAUTY_HEALTH">뷰티/헬스</option>
                                    <option value="ETC">기타</option>
                                </select>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지번 주소</label>
                            <input
                                type="text"
                                name="jibunAddress"
                                value={formData.jibunAddress}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="지번 주소"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">위도 (Latitude)</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">경도 (Longitude)</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">추가 정보</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="02-1234-5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="상점에 대한 간단한 설명을 입력하세요."
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
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
            </div>

            <AddressSearchModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={handleAddressComplete}
            />
        </div>
    );
}
