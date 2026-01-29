import { X, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { EventService } from '../../shared/api/services/EventService';
import type { EventResponse, EventType } from '../../shared/api/models/Event';

interface EventModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: EventResponse | null;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
    { value: 'FOOD_EVENT', label: '푸드 이벤트' },
    { value: 'POPUP_STORE', label: '팝업 스토어' },
    { value: 'SCHOOL_EVENT', label: '학교 행사' },
    { value: 'FLEA_MARKET', label: '플리마켓' },
    { value: 'PERFORMANCE', label: '공연' },
    { value: 'COMMUNITY', label: '커뮤니티' }
];

export function EventModal({ onClose, onSuccess, initialData }: EventModalProps) {
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
    const [latitude, setLatitude] = useState<number>(37.5665);
    const [longitude, setLongitude] = useState<number>(126.9780);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    // Image Handling
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setSelectedTypes(initialData.eventTypes);
            setLatitude(initialData.latitude);
            setLongitude(initialData.longitude);
            setStartDateTime(formatDateForInput(initialData.startDateTime));
            setEndDateTime(formatDateForInput(initialData.endDateTime));
            setPreviewUrls(initialData.imageUrls || []);
        }
    }, [initialData]);

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages([...images, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const toggleType = (type: EventType) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || selectedTypes.length === 0 || !startDateTime || !endDateTime) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const eventData = {
                title,
                description,
                eventTypes: selectedTypes,
                latitude,
                longitude,
                startDateTime: new Date(startDateTime).toISOString(),
                endDateTime: new Date(endDateTime).toISOString(),
            };

            if (initialData && initialData.id) {
                console.log('Update not fully implemented with images, sending JSON');
                alert('수정 기능은 현재 구현 중입니다. (이미지 제외 텍스트 수정 가능 예상)');
            } else {
                await EventService.createEvent(eventData, images);
                alert('이벤트가 등록되었습니다.');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '이벤트 수정' : '이벤트 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="이벤트 제목"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">설명 *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px]"
                            placeholder="이벤트 상세 설명"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이벤트 타입 *</label>
                        <div className="flex flex-wrap gap-2">
                            {EVENT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => toggleType(type.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedTypes.includes(type.value)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">시작 일시 *</label>
                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">종료 일시 *</label>
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">위도 (Latitude) *</label>
                            <input
                                type="number"
                                step="any"
                                value={latitude}
                                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">경도 (Longitude) *</label>
                            <input
                                type="number"
                                step="any"
                                value={longitude}
                                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
                        <div className="flex flex-wrap gap-4 mb-3">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500"
                            >
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-xs">추가</span>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                        >
                            {loading ? '처리중...' : (initialData ? '수정하기' : '등록하기')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
