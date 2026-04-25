import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AdminEventService } from '../../shared/api/services/AdminEventService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import type { AdminEventResponse } from '../../shared/api/models/AdminEventResponse';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';
import type { CreateEventRequest } from '../../shared/api/models/CreateEventRequest';
import type { UpdateEventRequest } from '../../shared/api/models/UpdateEventRequest';
import type { TargetOrganizationInfo } from '../../shared/api/models/TargetOrganizationInfo';
import { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import { uploadImage, uploadImages } from '../../shared/utils/uploadImage';
import { ImageCropper } from '../../shared/components/ImageCropper';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';
import { formatDateForInput } from '../../shared/utils/date';
import { ImageDropZone } from '../../shared/components/ImageDropZone';
import { useUniversity } from '../../shared/contexts/UniversityContext';

interface EventModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: AdminEventResponse | null;
}

type EventType = 'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP';
type EventTargetRequestFields = {
    targetOrganizationIds?: Array<number | null> | null;
};

const EVENT_TYPES: { value: EventType; label: string }[] = [
    { value: 'SCHOOL_EVENT', label: '학교 주관 이벤트' },
    { value: 'STUDENT_EVENT', label: '학생 주관 이벤트' },
    { value: 'FOOD_EVENT', label: '푸드 이벤트' },
    { value: 'FLEA_MARKET', label: '플리마켓' },
    { value: 'PERFORMANCE', label: '공연/전시/버스킹' },
    { value: 'BRAND_POPUP', label: '브랜드 팝업' }
];

export function EventModal({ onClose, onSuccess, initialData }: EventModalProps) {
    const { selectedUniversityId, universities: contextUniversities } = useUniversity();
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [universityId, setUniversityId] = useState<number | null>(selectedUniversityId);
    const [universities, setUniversities] = useState<UniversityResponse[]>(contextUniversities);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [organizationsLoading, setOrganizationsLoading] = useState(false);
    const [targetOrganizationIds, setTargetOrganizationIds] = useState<number[]>([]);
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

    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const syncOrganizationTargets = (nextIds: number[], orgs = organizations) => {
        const orgById = new Map(
            orgs
                .filter((org) => org.id != null)
                .map((org) => [org.id as number, org]),
        );
        const normalizedIds = new Set(nextIds.filter((id) => orgById.has(id)));

        for (const id of [...normalizedIds]) {
            const org = orgById.get(id);
            if (!org || org.category !== OrganizationResponse.category.DEPARTMENT || !org.parentId) {
                continue;
            }

            if (orgById.has(org.parentId)) {
                normalizedIds.add(org.parentId);
            }
        }

        return [...normalizedIds];
    };

    const updateOrganizationTargets = (updater: (prev: number[]) => number[]) => {
        setTargetOrganizationIds((prev) => syncOrganizationTargets(updater(prev)));
    };

    useEffect(() => {
        setUniversities(contextUniversities);
    }, [contextUniversities]);

    useEffect(() => {
        if (!initialData && selectedUniversityId) {
            setUniversityId(selectedUniversityId);
        }
    }, [initialData, selectedUniversityId]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setSubtitle(initialData.subtitle || '');
            setDescription(initialData.description || '');
            setPlace(initialData.place || '');
            setUniversityId(initialData.universityId ?? initialData.targetUniversity?.id ?? null);
            setSelectedTypes(initialData.eventTypes as EventType[] || []);
            setLatitude(initialData.latitude || 37.5665);
            setLongitude(initialData.longitude || 126.9780);
            setStartDateTime(formatDateForInput(initialData.startDateTime || ''));
            setEndDateTime(formatDateForInput(initialData.endDateTime || ''));
            setTargetOrganizationIds((initialData.targetOrganizations ?? []).map((o: TargetOrganizationInfo) => o.id!).filter((id) => id != null));
            const existingBanner = initialData.bannerImageUrl || null;
            const existingImgs = initialData.imageUrls || [];
            setExistingBannerUrl(existingBanner);
            setExistingImageUrls(existingImgs);
            setPreviewUrls(existingImgs);
        }
    }, [initialData]);

    useEffect(() => {
        if (!universityId) {
            setOrganizations([]);
            setTargetOrganizationIds([]);
            return;
        }

        let active = true;
        setOrganizationsLoading(true);
        PublicOrganizationService.getOrganizations(universityId)
            .then((response) => {
                if (!active) return;
                const nextOrganizations = (response.data || []).filter((org) =>
                    org.category === OrganizationResponse.category.COLLEGE ||
                    org.category === OrganizationResponse.category.DEPARTMENT
                );
                setOrganizations(nextOrganizations);
                setTargetOrganizationIds((prev) => syncOrganizationTargets(prev, nextOrganizations));
            })
            .catch((error) => {
                if (!active) return;
                console.error('Failed to fetch organizations', error);
                toast.error('단과대/학과 정보를 불러오지 못했습니다.');
            })
            .finally(() => {
                if (active) {
                    setOrganizationsLoading(false);
                }
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [universityId]);

    const handleBannerFiles = (files: File[]) => {
        if (files.length > 0) {
            const objectUrl = URL.createObjectURL(files[0]);
            setOriginalBannerSrc(objectUrl);
            setShowCropper(true);
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

    const handleImageFiles = (files: File[]) => {
        setNewImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
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
            toast.error('필수 정보를 모두 입력해주세요.');
            return;
        }

        // Date Validation
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);
        if (end <= start) {
            toast.error('종료 일시는 시작 일시보다 이후여야 합니다.');
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
                    targetOrganizationIds: targetOrganizationIds.length > 0 ? targetOrganizationIds : null,
                } as unknown as UpdateEventRequest & EventTargetRequestFields;
                await AdminEventService.updateEvent(initialData.id, requestData);
                toast.success('이벤트가 수정되었습니다.');
            } else {
                const requestData: CreateEventRequest & EventTargetRequestFields = {
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
                    targetOrganizationIds: targetOrganizationIds.length > 0 ? targetOrganizationIds : null,
                };
                await AdminEventService.createEvent(requestData);
                toast.success('이벤트가 등록되었습니다.');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            title={initialData ? '이벤트 수정' : '이벤트 등록'}
            onClose={onClose}
            maxWidth="max-w-2xl"
            onPaste={handlePaste}
        >

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

                    {/* 타겟 설정 */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700">타겟 설정 <span className="text-gray-400 font-normal">(미설정 시 전체 대상, 단과대/학과 복수 선택 가능)</span></p>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">대학</label>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUniversityId(null);
                                        setTargetOrganizationIds([]);
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                        universityId == null
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    전체
                                </button>
                                {universities.filter((u) => u.id != null).map((uni) => {
                                    const uniId = uni.id as number;
                                    const selected = universityId === uniId;
                                    return (
                                        <button
                                            key={uniId}
                                            type="button"
                                            onClick={() => {
                                                setUniversityId(selected ? null : uniId);
                                                setTargetOrganizationIds([]);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                selected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {uni.name}
                                        </button>
                                    );
                                })}
                                {universities.length === 0 && <span className="text-xs text-gray-400">로딩 중...</span>}
                            </div>
                        </div>

                        {universityId != null && (
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-gray-600">단과대 / 학과</label>
                                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                    <p className="text-xs text-gray-400 mb-1.5 font-medium">
                                        {universities.find((uni) => uni.id === universityId)?.name ?? ''}
                                    </p>
                                    {organizationsLoading ? (
                                        <span className="text-xs text-gray-300">로딩 중...</span>
                                    ) : organizations.length === 0 ? (
                                        <span className="text-xs text-gray-300">등록된 단과대/학과가 없습니다.</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setTargetOrganizationIds([])}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                    targetOrganizationIds.length === 0
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                전체
                                            </button>
                                            <div className="flex flex-col gap-3">
                                                {organizations
                                                    .filter((org) => org.category === OrganizationResponse.category.COLLEGE)
                                                    .map((college) => {
                                                        const collegeId = college.id as number;
                                                        const collegeSelected = targetOrganizationIds.includes(collegeId);
                                                        const collegeDepartments = organizations.filter((department) =>
                                                            department.category === OrganizationResponse.category.DEPARTMENT &&
                                                            department.parentId === collegeId
                                                        );

                                                        return (
                                                            <div key={collegeId} className="flex flex-col gap-1.5 p-2 rounded-lg border border-gray-100 bg-gray-50/50">
                                                                <div className="flex">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (collegeSelected) {
                                                                                updateOrganizationTargets((prev) => prev.filter((id) => id !== collegeId && !collegeDepartments.some((department) => department.id === id)));
                                                                            } else {
                                                                                updateOrganizationTargets((prev) => [...prev, collegeId]);
                                                                            }
                                                                        }}
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                                            collegeSelected
                                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        {college.name}
                                                                    </button>
                                                                </div>
                                                                {collegeSelected && collegeDepartments.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 ml-3 pl-3 border-l-2 border-gray-200 mt-1">
                                                                        {collegeDepartments.map((department) => {
                                                                            const departmentId = department.id as number;
                                                                            const departmentSelected = targetOrganizationIds.includes(departmentId);
                                                                            return (
                                                                                <button
                                                                                    key={departmentId}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (departmentSelected) {
                                                                                            updateOrganizationTargets((prev) => prev.filter((id) => id !== departmentId));
                                                                                        } else {
                                                                                            updateOrganizationTargets((prev) => [...prev, collegeId, departmentId]);
                                                                                        }
                                                                                    }}
                                                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                                                                                        departmentSelected
                                                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                                                    }`}
                                                                                >
                                                                                    {department.name}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                {organizations.some((org) =>
                                                    org.category === OrganizationResponse.category.DEPARTMENT &&
                                                    !organizations.some((college) => college.id === org.parentId)
                                                ) && (
                                                    <p className="text-[11px] text-amber-600">
                                                        연결된 단과대학이 없는 학과는 선택 대상에서 제외됩니다.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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
                                            }}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!bannerPreviewUrl && (
                                    <ImageDropZone onFiles={handleBannerFiles} label="배너 추가" />
                                )}
                            </div>
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
                                <ImageDropZone
                                    onFiles={handleImageFiles}
                                    label="이미지 추가"
                                    className="w-20 h-20"
                                    multiple
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <ModalFooter
                            onClose={onClose}
                            loading={loading}
                            submitType="submit"
                            submitText={initialData ? '수정하기' : '등록하기'}
                        />
                    </div>
                </form>

            {showCropper && originalBannerSrc && (
                <ImageCropper
                    imageSrc={originalBannerSrc}
                    aspectRatio={2.2933} // 2.2933:1 ratio
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </ModalWrapper>
    );
}
