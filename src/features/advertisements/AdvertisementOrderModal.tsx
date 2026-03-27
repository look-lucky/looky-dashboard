import { X, GripVertical, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
    AdminAdvertisementService,
    type AdminAdvertisementResponse,
    type AdvertisementType,
} from '../../shared/api/services/AdminAdvertisementService';

interface AdvertisementOrderModalProps {
    initialType?: AdvertisementType;
    onClose: () => void;
    onSuccess: () => void;
}

const AD_TYPES: { value: AdvertisementType; label: string }[] = [
    { value: 'POPUP', label: '팝업' },
    { value: 'BANNER', label: '배너' },
    { value: 'FLOATING', label: '플로팅' },
];

export function AdvertisementOrderModal({ initialType, onClose, onSuccess }: AdvertisementOrderModalProps) {
    const [selectedType, setSelectedType] = useState<AdvertisementType>(initialType ?? 'POPUP');
    const [items, setItems] = useState<AdminAdvertisementResponse[]>([]);
    const [originalOrder, setOriginalOrder] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const dragIndex = useRef<number | null>(null);
    const dragOverIndex = useRef<number | null>(null);

    useEffect(() => {
        setLoading(true);
        AdminAdvertisementService.getAdvertisements(0, 100, selectedType)
            .then(res => {
                const sorted = [...(res.data?.content ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
                setItems(sorted);
                setOriginalOrder(sorted.map(ad => ad.id));
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [selectedType]);

    const handleDragStart = (index: number) => {
        dragIndex.current = index;
    };

    const handleDragEnter = (index: number) => {
        dragOverIndex.current = index;
        if (dragIndex.current === null || dragIndex.current === index) return;

        setItems(prev => {
            const next = [...prev];
            const [moved] = next.splice(dragIndex.current!, 1);
            next.splice(index, 0, moved);
            return next;
        });
        dragIndex.current = index;
    };

    const handleDragEnd = () => {
        dragIndex.current = null;
        dragOverIndex.current = null;
    };

    const isDirty = items.some((ad, i) => ad.id !== originalOrder[i]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = items
                .map((ad, index) => ({ ad, newOrder: index }))
                .filter(({ ad, newOrder }) => {
                    const originalIndex = originalOrder.indexOf(ad.id);
                    return originalIndex !== newOrder;
                });

            await Promise.all(
                updates.map(({ ad, newOrder }) =>
                    AdminAdvertisementService.updateAdvertisement(ad.id, { displayOrder: newOrder })
                )
            );

            onSuccess();
        } catch {
            alert('순서 저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                {/* 헤더 */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">광고 노출 순서 관리</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 타입 탭 */}
                <div className="flex gap-1 px-6 pt-4">
                    {AD_TYPES.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setSelectedType(t.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                selectedType === t.value
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 안내 */}
                <p className="px-6 pt-3 pb-1 text-xs text-gray-400">
                    드래그하여 순서를 변경하세요. 위쪽이 먼저 노출됩니다.
                </p>

                {/* 목록 */}
                <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            로딩 중...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            등록된 광고가 없습니다.
                        </div>
                    ) : (
                        items.map((ad, index) => (
                            <div
                                key={ad.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragEnter={() => handleDragEnter(index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={e => e.preventDefault()}
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-sm transition-all select-none"
                            >
                                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {index + 1}
                                </span>
                                {ad.imageUrl && (
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        className="w-10 h-8 object-cover rounded-md border border-gray-100 flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{ad.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {ad.status === 'ACTIVE' ? '활성' : ad.status === 'INACTIVE' ? '비활성' : ad.status === 'SCHEDULED' ? '예약' : '종료'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 푸터 */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {saving ? '저장 중...' : '순서 저장'}
                    </button>
                </div>
            </div>
        </div>
    );
}
