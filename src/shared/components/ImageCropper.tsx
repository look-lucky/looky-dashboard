import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

interface ImageCropperProps {
    imageSrc: string;
    aspectRatio?: number;
    onCropComplete: (croppedImageBase64: string, croppedBlob: Blob) => void;
    onCancel: () => void;
}

export function ImageCropper({ imageSrc, aspectRatio = 2.2933, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropCompleteHandler = useCallback((_croppedArea: Area, nextCroppedAreaPixels: Area) => {
        setCroppedAreaPixels(nextCroppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels || !imageSrc) return;

        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedBlob) {
                const objectUrl = URL.createObjectURL(croppedBlob);
                onCropComplete(objectUrl, croppedBlob);
            } else {
                alert('이미지 편집에 실패했습니다.');
            }
        } catch (e) {
            console.error(e);
            alert('이미지 편집 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">이미지 조절</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative flex-1 bg-gray-900 w-full h-full">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                        showGrid={true}
                    />
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 min-w-12">확대</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        {isProcessing ? '처리중...' : (
                            <>
                                <Check className="w-4 h-4" /> 적용하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
