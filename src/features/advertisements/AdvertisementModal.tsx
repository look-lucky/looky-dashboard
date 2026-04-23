import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AdminAdvertisementService } from '../../shared/api/services/AdminAdvertisementService';
import type { AdminAdvertisementResponse } from '../../shared/api/models/AdminAdvertisementResponse';
import type { UpdateAdvertisementRequest } from '../../shared/api/models/UpdateAdvertisementRequest';
import type { CreateAdvertisementRequest } from '../../shared/api/models/CreateAdvertisementRequest';
import type { TargetUniversityInfo } from '../../shared/api/models/TargetUniversityInfo';
import type { TargetOrganizationInfo } from '../../shared/api/models/TargetOrganizationInfo';

type AdvertisementType = 'POPUP' | 'BANNER' | 'FLOATING';
type AdvertisementStatus = 'SCHEDULED' | 'ACTIVE' | 'INACTIVE' | 'ENDED';
type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';
import { PublicUniversityService } from '../../shared/api/services/PublicUniversityService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';
import { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import { uploadImage } from '../../shared/utils/uploadImage';
import { ImageCropper } from '../../shared/components/ImageCropper';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';
import { formatDateForInput } from '../../shared/utils/date';
import { ImageDropZone } from '../../shared/components/ImageDropZone';

interface AdvertisementModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: AdminAdvertisementResponse | null;
}

const AD_TYPES: { value: AdvertisementType; label: string; ratio: string; aspectRatio: number }[] = [
    { value: 'POPUP', label: '팝업', ratio: '4:3', aspectRatio: 4 / 3 },
    { value: 'BANNER', label: '배너', ratio: '5:1', aspectRatio: 5 / 1 },
    { value: 'FLOATING', label: '플로팅', ratio: '1:1', aspectRatio: 1 / 1 },
];

const EDITABLE_STATUSES: { value: AdvertisementStatus; label: string }[] = [
    { value: 'ACTIVE', label: '활성' },
    { value: 'INACTIVE', label: '비활성' },
];

export function AdvertisementModal({ onClose, onSuccess, initialData }: AdvertisementModalProps) {
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [advertisementType, setAdvertisementType] = useState<AdvertisementType>('POPUP');
    const [landingUrl, setLandingUrl] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [status, setStatus] = useState<AdvertisementStatus>('ACTIVE');

    // Target States
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);
    const [organizationsByUniv, setOrganizationsByUniv] = useState<Record<number, OrganizationResponse[]>>({});
    const [targetUniversityIds, setTargetUniversityIds] = useState<number[]>([]);
    const [targetOrganizationIds, setTargetOrganizationIds] = useState<number[]>([]);
    const [targetGender, setTargetGender] = useState<Gender | null>(null);

    // Image Handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // 이미 fetch 요청을 보낸 대학 ID 추적 (중복 요청 방지)
    const fetchedUnivIds = useRef<Set<number>>(new Set());

    const selectedTypeInfo = AD_TYPES.find(t => t.value === advertisementType)!;

    const syncOrganizationTargets = (
        nextIds: number[],
        orgsByUniv: Record<number, OrganizationResponse[]>,
        activeUniversityIds: number[],
    ) => {
        const activeUniversityIdSet = new Set(activeUniversityIds);
        const allowedOrganizations = Object.entries(orgsByUniv)
            .filter(([univId]) => activeUniversityIdSet.has(Number(univId)))
            .flatMap(([, orgs]) => orgs)
            .filter((org) => org.id != null);

        const orgById = new Map(allowedOrganizations.map((org) => [org.id as number, org]));
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

    const updateOrganizationTargets = (
        updater: (prev: number[]) => number[],
        universityIds = targetUniversityIds,
        orgMap = organizationsByUniv,
    ) => {
        setTargetOrganizationIds((prev) => syncOrganizationTargets(updater(prev), orgMap, universityIds));
    };

    useEffect(() => {
        PublicUniversityService.getUniversities().then(res => {
            setUniversities(res.data || []);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        targetUniversityIds.forEach(univId => {
            if (fetchedUnivIds.current.has(univId)) return;
            fetchedUnivIds.current.add(univId);
            PublicOrganizationService.getOrganizations(univId).then(res => {
                setOrganizationsByUniv(prev => ({
                    ...prev,
                    [univId]: (res.data || []).filter(o => 
                        o.category === OrganizationResponse.category.COLLEGE || 
                        o.category === OrganizationResponse.category.DEPARTMENT
                    ),
                }));
            }).catch(() => {
                fetchedUnivIds.current.delete(univId);
            });
        });
    }, [targetUniversityIds]);

    useEffect(() => {
        setTargetOrganizationIds((prev) => syncOrganizationTargets(prev, organizationsByUniv, targetUniversityIds));
    }, [organizationsByUniv, targetUniversityIds]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAdvertisementType((initialData.advertisementType as AdvertisementType) || 'POPUP');
            setLandingUrl(initialData.landingUrl || '');
            setStartAt(formatDateForInput(initialData.startAt || ''));
            setEndAt(formatDateForInput(initialData.endAt || ''));
            setStatus((initialData.status as AdvertisementStatus) === 'ACTIVE' || (initialData.status as AdvertisementStatus) === 'INACTIVE' ? (initialData.status as AdvertisementStatus) : 'ACTIVE');
            setExistingImageUrl(initialData.imageUrl || null);
            setImagePreviewUrl(initialData.imageUrl || null);
            setTargetUniversityIds((initialData.targetUniversities ?? []).map((u: TargetUniversityInfo) => u.id!));
            setTargetOrganizationIds((initialData.targetOrganizations ?? []).map((o: TargetOrganizationInfo) => o.id!));
            setTargetGender(initialData.targetGender as Gender | null);
        }
    }, [initialData]);

    const handleImageFiles = (files: File[]) => {
        if (files.length > 0) {
            const objectUrl = URL.createObjectURL(files[0]);
            setOriginalImageSrc(objectUrl);
            setShowCropper(true);
        }
    };

    const handleCropComplete = (croppedImageUrl: string, blob: Blob) => {
        const croppedFile = new File([blob], 'ad-image-cropped.jpg', { type: blob.type });
        setImageFile(croppedFile);
        setExistingImageUrl(null);
        setImagePreviewUrl(croppedImageUrl);
        setShowCropper(false);
        setOriginalImageSrc(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalImageSrc(null);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (!e.clipboardData?.files.length) return;
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length === 0) return;
        const objectUrl = URL.createObjectURL(pastedFiles[0]);
        setOriginalImageSrc(objectUrl);
        setShowCropper(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !startAt || !endAt) {
            toast.error('필수 정보를 모두 입력해주세요.');
            return;
        }

        if (!imageFile && !existingImageUrl) {
            toast.error('이미지를 등록해주세요.');
            return;
        }

        const start = new Date(startAt);
        const end = new Date(endAt);
        if (end <= start) {
            toast.error('종료 일시는 시작 일시보다 이후여야 합니다.');
            return;
        }

        setLoading(true);
        try {
            let imageUrl: string = existingImageUrl || '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            if (initialData && initialData.id) {
                // UPDATE: targeting 필드는 초기값과 다를 때만 포함
                // (JsonNullable 패턴: 필드 미포함 = 변경 없음, null = 전체 초기화, 배열 = 지정)
                const initialUnivIds = (initialData.targetUniversities ?? []).map(u => u.id!).sort((a, b) => a - b);
                const initialOrgIds = (initialData.targetOrganizations ?? []).map(o => o.id!).sort((a, b) => a - b);
                const currentUnivIds = [...targetUniversityIds].sort((a, b) => a - b);
                const currentOrgIds = [...targetOrganizationIds].sort((a, b) => a - b);
                const univChanged = JSON.stringify(initialUnivIds) !== JSON.stringify(currentUnivIds);
                const orgChanged = JSON.stringify(initialOrgIds) !== JSON.stringify(currentOrgIds);

                const requestData = {
                    title,
                    imageUrl,
                    landingUrl: landingUrl || null,
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                    status,
                    ...(univChanged ? { targetUniversityIds: targetUniversityIds.length > 0 ? targetUniversityIds : null } : {}),
                    ...(orgChanged ? { targetOrganizationIds: targetOrganizationIds.length > 0 ? targetOrganizationIds : null } : {}),
                    targetGender,
                } as unknown as UpdateAdvertisementRequest;
                await AdminAdvertisementService.updateAdvertisement(initialData.id, requestData);
                toast.success('광고가 수정되었습니다.');
            } else {
                const requestData = {
                    title,
                    advertisementType,
                    imageUrl,
                    landingUrl: landingUrl || null,
                    displayOrder: 0,
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                    targetUniversityIds: targetUniversityIds.length > 0 ? targetUniversityIds : null,
                    targetOrganizationIds: targetOrganizationIds.length > 0 ? targetOrganizationIds : null,
                    targetGender,
                } as unknown as CreateAdvertisementRequest;
                await AdminAdvertisementService.createAdvertisement(requestData);
                toast.success('광고가 등록되었습니다.');
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
            title={initialData ? '광고 수정' : '광고 등록'}
            onClose={onClose}
            maxWidth="max-w-2xl"
            onPaste={handlePaste}
        >
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* 제목 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="광고 제목"
                            required
                        />
                    </div>

                    {/* 광고 타입 (등록 시에만 변경 가능) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">광고 타입 *</label>
                        <div className="flex gap-2">
                            {AD_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => {
                                        if (!initialData) {
                                            setAdvertisementType(type.value as AdvertisementType);
                                            setImageFile(null);
                                            setImagePreviewUrl(null);
                                            setExistingImageUrl(null);
                                        }
                                    }}
                                    disabled={!!initialData}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                        advertisementType === type.value
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } disabled:cursor-not-allowed disabled:opacity-70`}
                                >
                                    {type.label}
                                    <span className="ml-1 text-xs opacity-70">({type.ratio})</span>
                                </button>
                            ))}
                        </div>
                        {initialData && (
                            <p className="text-xs text-gray-400 mt-1">광고 타입은 등록 후 변경할 수 없습니다.</p>
                        )}
                    </div>

                    {/* 상태 (수정 시에만 표시) */}
                    {initialData && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                            <div className="flex gap-2">
                                {EDITABLE_STATUSES.map((s) => (
                                    <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => setStatus(s.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                            status === s.value
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                            {(initialData.status === 'SCHEDULED' || initialData.status === 'ENDED') && (
                                <p className="text-xs text-gray-400 mt-1">
                                    현재 상태: {initialData.status === 'SCHEDULED' ? '예약 중' : '종료됨'} (활성/비활성만 직접 변경 가능)
                                </p>
                            )}
                        </div>
                    )}

                    {/* 이미지 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            광고 이미지 * <span className="text-gray-400 font-normal">({selectedTypeInfo.ratio} 비율 권장)</span>
                        </label>
                        <div className="flex gap-4">
                            {imagePreviewUrl ? (
                                <div className={`relative bg-gray-100 rounded-lg overflow-hidden border ${
                                    advertisementType === 'FLOATING' ? 'w-20 h-20' :
                                    advertisementType === 'BANNER' ? 'w-40 h-8' : 'w-32 h-24'
                                }`}>
                                    <img
                                        src={imagePreviewUrl}
                                        alt="광고 이미지 미리보기"
                                        className={`w-full h-full object-cover ${advertisementType === 'FLOATING' ? 'rounded-full' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setExistingImageUrl(null);
                                            setImagePreviewUrl(null);
                                        }}
                                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-gray-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <ImageDropZone
                                    onFiles={handleImageFiles}
                                    accept="image/jpeg,image/png,image/webp"
                                    hint="JPG, PNG, WebP"
                                />
                            )}
                        </div>
                    </div>

                    {/* 랜딩 URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">랜딩 URL <span className="text-gray-400 font-normal">(선택)</span></label>
                        <input
                            type="url"
                            value={landingUrl}
                            onChange={(e) => setLandingUrl(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="https://example.com"
                        />
                        <p className="text-xs text-gray-400 mt-1">입력하지 않으면 광고 클릭 시 이동 없음</p>
                    </div>

                    {/* 타겟 설정 */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700">타겟 설정 <span className="text-gray-400 font-normal">(미설정 시 전체 대상, 복수 선택 가능)</span></p>

                        {/* 대학 선택 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">대학</label>
                            <div className="flex flex-wrap gap-1.5">
                                {/* 전체 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTargetUniversityIds([]);
                                        setTargetOrganizationIds([]);
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                        targetUniversityIds.length === 0
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    전체
                                </button>
                                {universities.filter(u => u.id != null).map(u => {
                                    const univId = u.id as number;
                                    const selected = targetUniversityIds.includes(univId);
                                    return (
                                        <button
                                            key={univId}
                                            type="button"
                                            onClick={() => {
                                                if (selected) {
                                                    const nextUniversityIds = targetUniversityIds.filter(id => id !== univId);
                                                    setTargetUniversityIds(nextUniversityIds);
                                                    updateOrganizationTargets(
                                                        (prev) => {
                                                            const orgIds = new Set((organizationsByUniv[univId] || []).flatMap((org) => org.id != null ? [org.id] : []));
                                                            return prev.filter((id) => !orgIds.has(id));
                                                        },
                                                        nextUniversityIds,
                                                    );
                                                } else {
                                                    const nextUniversityIds = [...targetUniversityIds, univId];
                                                    setTargetUniversityIds(nextUniversityIds);
                                                    updateOrganizationTargets((prev) => prev, nextUniversityIds);
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                selected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {u.name}
                                        </button>
                                    );
                                })}
                                {universities.length === 0 && <span className="text-xs text-gray-400">로딩 중...</span>}
                            </div>
                        </div>

                        {/* 단과대/학과 선택 — 대학별로 그룹화 */}
                        {targetUniversityIds.length > 0 && (
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-gray-600">단과대 / 학과</label>
                                {targetUniversityIds.map(univId => {
                                    const univName = universities.find(u => u.id === univId)?.name ?? '';
                                    const orgs = (organizationsByUniv[univId] || []).filter(o => o.id != null);
                                    const colleges = orgs.filter(o => o.category === OrganizationResponse.category.COLLEGE || o.category === OrganizationResponse.category.UNIVERSITY_COUNCIL || !o.category || (o.category as string) === '');
                                    const departments = orgs.filter(o => o.category === OrganizationResponse.category.DEPARTMENT);
                                    const selectedCollegeIds = colleges
                                        .map((college) => college.id as number)
                                        .filter((collegeId) => targetOrganizationIds.includes(collegeId));
                                    const noneSelected = selectedCollegeIds.length === 0 && departments.every((dept) => !targetOrganizationIds.includes(dept.id as number));
                                    const collegeIds = new Set(colleges.map(c => c.id));
                                    const hasUnlinkedDepartments = departments.some((dept) => !dept.parentId || !collegeIds.has(dept.parentId));

                                    return (
                                        <div key={univId} className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                            <p className="text-xs text-gray-400 mb-1.5 font-medium">{univName}</p>
                                            {orgs.length === 0 ? (
                                                <span className="text-xs text-gray-300">로딩 중...</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {/* 단과대/학과 전체 버튼 */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            updateOrganizationTargets((prev) => prev.filter((id) => !orgs.some((org) => org.id === id)));
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                            noneSelected
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        전체
                                                    </button>
                                                    <div className="flex flex-col gap-3">
                                                        {colleges.map(college => {
                                                            const colId = college.id as number;
                                                            const colSelected = targetOrganizationIds.includes(colId);
                                                            const collegeDepts = departments.filter(d => d.parentId === colId);
                                                            
                                                            return (
                                                                <div key={colId} className="flex flex-col gap-1.5 p-2 rounded-lg border border-gray-100 bg-gray-50/50">
                                                                    <div className="flex">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (colSelected) {
                                                                                    updateOrganizationTargets((prev) => prev.filter((id) => id !== colId && !collegeDepts.some((dept) => dept.id === id)));
                                                                                } else {
                                                                                    updateOrganizationTargets((prev) => [...prev, colId]);
                                                                                }
                                                                            }}
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                                                colSelected
                                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {college.name}
                                                                        </button>
                                                                    </div>
                                                                    {colSelected && collegeDepts.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1.5 ml-3 pl-3 border-l-2 border-gray-200 mt-1">
                                                                            {collegeDepts.map(dept => {
                                                                                const deptId = dept.id as number;
                                                                                const deptSelected = targetOrganizationIds.includes(deptId);
                                                                                return (
                                                                                    <button
                                                                                        key={deptId}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            if (deptSelected) {
                                                                                                updateOrganizationTargets((prev) => prev.filter(id => id !== deptId));
                                                                                            } else {
                                                                                                updateOrganizationTargets((prev) => [...prev, colId, deptId]);
                                                                                            }
                                                                                        }}
                                                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                                                                                            deptSelected
                                                                                                ? 'bg-blue-500 text-white border-blue-500'
                                                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                                                        }`}
                                                                                    >
                                                                                        {dept.name}
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        {hasUnlinkedDepartments && (
                                                            <p className="text-[11px] text-amber-600">
                                                                연결된 단과대학이 없는 학과는 선택 대상에서 제외됩니다.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 성별 선택 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">성별</label>
                            <div className="flex gap-2">
                                {([['', '전체'], ['MALE', '남성'], ['FEMALE', '여성']] as const).map(([val, label]) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setTargetGender(val === '' ? null : val as Gender)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                            (val === '' ? targetGender == null : targetGender === val)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 노출 기간 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">시작 일시 *</label>
                            <input
                                type="datetime-local"
                                value={startAt}
                                onChange={(e) => {
                                    setStartAt(e.target.value);
                                    if (endAt && new Date(endAt) < new Date(e.target.value)) {
                                        setEndAt('');
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
                                value={endAt}
                                min={startAt}
                                onChange={(e) => setEndAt(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                            />
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

            {showCropper && originalImageSrc && (
                <ImageCropper
                    imageSrc={originalImageSrc}
                    aspectRatio={selectedTypeInfo.aspectRatio}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </ModalWrapper>
    );
}
