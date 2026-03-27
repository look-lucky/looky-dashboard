import { X, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
    AdminAdvertisementService,
    type AdminAdvertisementResponse,
    type AdvertisementType,
    type AdvertisementStatus,
    type CreateAdvertisementRequest,
    type UpdateAdvertisementRequest,
} from '../../shared/api/services/AdminAdvertisementService';
import { uploadImage } from '../../shared/utils/uploadImage';
import { ImageCropper } from '../../shared/components/ImageCropper';

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
    const [displayOrder, setDisplayOrder] = useState(0);
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [status, setStatus] = useState<AdvertisementStatus>('ACTIVE');

    // Image Handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const selectedTypeInfo = AD_TYPES.find(t => t.value === advertisementType)!;

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAdvertisementType(initialData.advertisementType);
            setLandingUrl(initialData.landingUrl || '');
            setDisplayOrder(initialData.displayOrder ?? 0);
            setStartAt(formatDateForInput(initialData.startAt || ''));
            setEndAt(formatDateForInput(initialData.endAt || ''));
            setStatus(initialData.status === 'ACTIVE' || initialData.status === 'INACTIVE' ? initialData.status : 'ACTIVE');
            setExistingImageUrl(initialData.imageUrl || null);
            setImagePreviewUrl(initialData.imageUrl || null);
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setOriginalImageSrc(objectUrl);
            setShowCropper(true);
        }
        if (e.target) {
            e.target.value = '';
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

    const handleImageDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const objectUrl = URL.createObjectURL(file);
                setOriginalImageSrc(objectUrl);
                setShowCropper(true);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        if (!imageFile && !existingImageUrl) {
            alert('이미지를 등록해주세요.');
            return;
        }

        const start = new Date(startAt);
        const end = new Date(endAt);
        if (end <= start) {
            alert('종료 일시는 시작 일시보다 이후여야 합니다.');
            return;
        }

        setLoading(true);
        try {
            let imageUrl: string = existingImageUrl || '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            if (initialData && initialData.id) {
                const requestData: UpdateAdvertisementRequest = {
                    title,
                    imageUrl,
                    landingUrl: landingUrl || null,
                    displayOrder,
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                    status,
                };
                await AdminAdvertisementService.updateAdvertisement(initialData.id, requestData);
                alert('광고가 수정되었습니다.');
            } else {
                const requestData: CreateAdvertisementRequest = {
                    title,
                    advertisementType,
                    imageUrl,
                    landingUrl: landingUrl || null,
                    displayOrder,
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                };
                await AdminAdvertisementService.createAdvertisement(requestData);
                alert('광고가 등록되었습니다.');
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
                        {initialData ? '광고 수정' : '광고 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

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
                                            setAdvertisementType(type.value);
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
                                            if (imageInputRef.current) imageInputRef.current.value = '';
                                        }}
                                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-gray-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    onDrop={handleImageDrop}
                                    onDragOver={handleDragOver}
                                    className="cursor-pointer w-40 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500"
                                >
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-xs">이미지 추가</span>
                                    <span className="text-xs text-gray-300 mt-0.5">JPG, PNG, WebP</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={imageInputRef}
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                        />
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

                    {/* 노출 순서 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">노출 순서 *</label>
                        <input
                            type="number"
                            min={0}
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">숫자가 낮을수록 우선 노출됩니다.</p>
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

            {showCropper && originalImageSrc && (
                <ImageCropper
                    imageSrc={originalImageSrc}
                    aspectRatio={selectedTypeInfo.aspectRatio}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
