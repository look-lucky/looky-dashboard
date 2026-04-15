import { X, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AdminEventService } from '../../shared/api/services/AdminEventService';
import { PublicUniversityService } from '../../shared/api/services/PublicUniversityService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import type { AdminEventResponse } from '../../shared/api/models/AdminEventResponse';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import type { CreateEventRequest } from '../../shared/api/models/CreateEventRequest';
import { uploadImage, uploadImages } from '../../shared/utils/uploadImage';
import { ImageCropper } from '../../shared/components/ImageCropper';

interface EventModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: AdminEventResponse | null;
}

type EventType = 'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP';

const EVENT_TYPES: { value: EventType; label: string }[] = [
    { value: 'SCHOOL_EVENT', label: '학교 주관 이벤트' },
    { value: 'STUDENT_EVENT', label: '학생 주관 이벤트' },
    { value: 'FOOD_EVENT', label: '푸드 이벤트' },
    { value: 'FLEA_MARKET', label: '플리마켓' },
    { value: 'PERFORMANCE', label: '공연/전시/버스킹' },
    { value: 'BRAND_POPUP', label: '브랜드 팝업' }
];

export function EventModal({ onClose, onSuccess, initialData }: EventModalProps) {
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [universityId, setUniversityId] = useState<number | null>(null);
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [targetOrgIds, setTargetOrgIds] = useState<number[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
    const [latitude, setLatitude] = useState<number>(37.5665);
    const [longitude, setLongitude] = useState<number>(126.9780);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    // Image Handling
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
    const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(null);
    const [originalBannerSrc, setOriginalBannerSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setSubtitle(initialData.subtitle || '');
            setDescription(initialData.description || '');
            setPlace(initialData.place || '');
            setUniversityId(initialData.targetUniversity?.id ?? null);
            setSelectedTypes(initialData.eventTypes as EventType[] || []);
            setLatitude(initialData.latitude || 37.5665);
            setLongitude(initialData.longitude || 126.9780);
            setStartDateTime(formatDateForInput(initialData.startDateTime || ''));
            setEndDateTime(formatDateForInput(initialData.endDateTime || ''));
            const existingBanner = initialData.bannerImageUrl || null;
            const existingImgs = initialData.imageUrls || [];
            setExistingBannerUrl(existingBanner);
            setExistingImageUrls(existingImgs);
            setPreviewUrls(existingImgs);
            
            if (initialData.targetOrganizations) {
                setTargetOrgIds(initialData.targetOrganizations.map(org => org.id!));
            } else {
                setTargetOrgIds([]);
            }
        }

        const fetchUniversities = async () => {
            try {
                const response = await PublicUniversityService.getUniversities();
                setUniversities(response.data || []);
            } catch (error) {
                console.error('Failed to fetch universities', error);
            }
        };

        fetchUniversities();
    }, [initialData]);

    useEffect(() => {
        if (!universityId) {
            setOrganizations([]);
            setTargetOrgIds([]);
            return;
        }

        const fetchOrgs = async () => {
            try {
                const response = await PublicOrganizationService.getOrganizations(universityId);
                const rawOrgs = response.data || [];
                const sortedOrgs = rawOrgs.filter(org => org.category === 'COLLEGE' || org.category === 'DEPARTMENT').sort((a, b) => {
                    const catA = a.category || '';
                    const catB = b.category || '';
                    if (catA === catB) {
                        return (a.name || '').localeCompare(b.name || '', 'ko');
                    }
                    return catA.localeCompare(catB, 'ko');
                });
                setOrganizations(sortedOrgs);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrgs();
    }, [universityId]);

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setOriginalBannerSrc(objectUrl);
            setShowCropper(true);
        }
        // clear input value so same file can trigger change again
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleCropComplete = (croppedImageUrl: string, blob: Blob) => {
        const croppedFile = new File([blob], 'banner-cropped.jpg', { type: blob.type });
        setBannerFile(croppedFile);
        setExistingBannerUrl(null);
        setBannerPreviewUrl(croppedImageUrl);
        setShowCropper(false);
        setOriginalBannerSrc(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalBannerSrc(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setNewImageFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (!e.clipboardData?.files.length) return;
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length === 0) return;

        if (!bannerPreviewUrl && pastedFiles.length === 1) {
            const objectUrl = URL.createObjectURL(pastedFiles[0]);
            setOriginalBannerSrc(objectUrl);
            setShowCropper(true);
        } else {
            setNewImageFiles(prev => [...prev, ...pastedFiles]);
            const newPreviews = pastedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const handleBannerDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const objectUrl = URL.createObjectURL(file);
                setOriginalBannerSrc(objectUrl);
                setShowCropper(true);
            }
        }
    };

    const handleImagesDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (newFiles.length > 0) {
                setNewImageFiles(prev => [...prev, ...newFiles]);
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                setPreviewUrls(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
        if (!title || !description || !place || selectedTypes.length === 0 || !startDateTime || !endDateTime) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        // Date Validation
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);
        if (end <= start) {
            alert('종료 일시는 시작 일시보다 이후여야 합니다.');
            return;
        }

        setLoading(true);
        try {
            // Upload banner if new file selected
            let bannerImageUrl: string | undefined = existingBannerUrl || undefined;
            if (bannerFile) {
                bannerImageUrl = await uploadImage(bannerFile);
            }

            // Upload new general images, preserve existing URLs
            const newUploadedUrls = newImageFiles.length > 0 ? await uploadImages(newImageFiles) : [];
            const allImageUrls = [...existingImageUrls, ...newUploadedUrls];

            if (initialData && initialData.id) {
                const requestData = {
                    title,
                    subtitle: subtitle || undefined,
                    description,
                    place,
                    universityId,
                    eventTypes: selectedTypes,
                    latitude,
                    longitude,
                    startDateTime: new Date(startDateTime).toISOString().slice(0, 19),
                    endDateTime: new Date(endDateTime).toISOString().slice(0, 19),
                    bannerImageUrl,
                    imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
                    targetOrganizationIds: targetOrgIds.length > 0 ? targetOrgIds : undefined,
                } as any;
                await AdminEventService.updateEvent(initialData.id, requestData);
                alert('이벤트가 수정되었습니다.');
            } else {
                const requestData: CreateEventRequest = {
                    title,
                    subtitle: subtitle || undefined,
                    description,
                    place,
                    universityId,
                    eventTypes: selectedTypes,
                    latitude,
                    longitude,
                    startDateTime: new Date(startDateTime).toISOString().slice(0, 19),
                    endDateTime: new Date(endDateTime).toISOString().slice(0, 19),
                    bannerImageUrl,
                    imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
                    targetOrganizationIds: targetOrgIds.length > 0 ? targetOrgIds : undefined,
                };
                await AdminEventService.createEvent(requestData);
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onPaste={handlePaste}
        >
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="이벤트 부제목 (선택)"
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
                                onChange={(e) => {
                                    setStartDateTime(e.target.value);
                                    // If end date is before new start date, update it (optional user experience preference, here we just validate on submit or min)
                                    if (endDateTime && new Date(endDateTime) < new Date(e.target.value)) {
                                        setEndDateTime('');
                                    }
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">종료 일시 *</label>
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                min={startDateTime} // Prevent selecting a date before start date
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">장소 *</label>
                            <input
                                type="text"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="장소 입력 (예: 학생회관 1층)"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">대상 대학교 *</label>
                            <select
                                value={universityId === null ? '' : universityId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setUniversityId(val === '' ? null : parseInt(val));
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                                <option value="">모든 학교</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                        {uni.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {universityId && organizations.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">타겟 단과대/학과 (선택)</label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {organizations.map(org => (
                                        <div key={org.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`org-${org.id}`}
                                                checked={targetOrgIds.includes(org.id!)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setTargetOrgIds(prev => [...prev, org.id!]);
                                                    else setTargetOrgIds(prev => prev.filter(id => id !== org.id));
                                                }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`org-${org.id}`} className="ml-2 block text-xs text-gray-900 truncate" title={`${org.name} (${org.category})`}>
                                                {org.name} <span className="text-gray-500">({org.category === 'COLLEGE' ? '단과대' : '학과'})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지 (최대 1장)</label>
                            <div className="flex gap-4">
                                {bannerPreviewUrl && (
                                    <div className="relative w-40 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={bannerPreviewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBannerFile(null);
                                                setExistingBannerUrl(null);
                                                setBannerPreviewUrl(null);
                                                if (bannerInputRef.current) bannerInputRef.current.value = '';
                                            }}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!bannerPreviewUrl && (
                                    <div
                                        onClick={() => bannerInputRef.current?.click()}
                                        onDrop={handleBannerDrop}
                                        onDragOver={handleDragOver}
                                        className="cursor-pointer w-40 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500"
                                    >
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-xs">배너 추가</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={bannerInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleBannerChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">일반 이미지</label>
                            <div className="flex flex-wrap gap-4 mb-3">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPreviews = [...previewUrls];
                                                newPreviews.splice(index, 1);
                                                setPreviewUrls(newPreviews);

                                                // Check if it's an existing URL or a new file preview
                                                if (index < existingImageUrls.length) {
                                                    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
                                                } else {
                                                    const newFileIndex = index - existingImageUrls.length;
                                                    setNewImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
                                                }
                                            }}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleImagesDrop}
                                    onDragOver={handleDragOver}
                                    className="cursor-pointer w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500"
                                >
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-xs">이미지 추가</span>
                                </div>
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

            {showCropper && originalBannerSrc && (
                <ImageCropper
                    imageSrc={originalBannerSrc}
                    aspectRatio={2.2933} // 2.2933:1 ratio
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
