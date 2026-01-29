import { X, Save, Plus, Trash2, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import { StoreService } from '../../shared/api/services/StoreService';
import type { CreateStoreRequest } from '../../shared/api/models/CreateStoreRequest';

interface StoreManualRegistrationModalProps {
    onClose: () => void;
}

export function StoreManualRegistrationModal({ onClose }: StoreManualRegistrationModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        bizRegNo: string;
        address: string;
        category: 'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC';
        description: string;
        phone: string;
        latitude: number;
        longitude: number;
    }>({
        name: '',
        bizRegNo: '',
        address: '',
        category: 'ETC',
        description: '',
        phone: '',
        latitude: 0,
        longitude: 0,
    });
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.bizRegNo) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const requestPayload: CreateStoreRequest = {
                name: formData.name,
                bizRegNo: formData.bizRegNo,
                roadAddress: formData.address,
                storeCategories: [formData.category],
                storePhone: formData.phone,
                introduction: formData.description,
                latitude: formData.latitude,
                longitude: formData.longitude,
                jibunAddress: '',
                operatingHours: '',
                storeMoods: []
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
        setFormData(prev => ({
            ...prev,
            [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">사업자 등록번호 *</label>
                                <input
                                    type="text"
                                    name="bizRegNo"
                                    required
                                    value={formData.bizRegNo}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    placeholder="000-00-00000"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        placeholder="서울시 강남구 ..."
                                    />
                                    <button type="button" className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 text-sm">
                                        <MapPin className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
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
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
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
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
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

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 flex justify-between items-center">
                            <span>이미지 등록</span>
                            <span className="text-xs text-gray-500">{images.length}장 선택됨</span>
                        </h3>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-colors"
                            >
                                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">추가</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>

                            {images.map((file, index) => (
                                <div key={index} className="aspect-square rounded-lg relative group overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
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
        </div>
    );
}
