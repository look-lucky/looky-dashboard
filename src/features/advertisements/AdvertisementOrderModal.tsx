import { GripVertical, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AdminAdvertisementService } from '../../shared/api/services/AdminAdvertisementService';
import type { AdminAdvertisementResponse } from '../../shared/api/models/AdminAdvertisementResponse';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';

type AdvertisementType = 'POPUP' | 'BANNER' | 'FLOATING';

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

const STATUS_LABELS: Record<string, string> = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    SCHEDULED: '예약',
    ENDED: '종료',
};

export function AdvertisementOrderModal({ initialType, onClose, onSuccess }: AdvertisementOrderModalProps) {
    const [selectedType, setSelectedType] = useState<AdvertisementType>(initialType ?? 'POPUP');
    const [items, setItems] = useState<AdminAdvertisementResponse[]>([]);
    const [originalOrder, setOriginalOrder] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // 드래그 상태 — state로 관리해 시각적 피드백 제공
    const [dragFrom, setDragFrom] = useState<number | null>(null);
    const [dragTo, setDragTo] = useState<number | null>(null);
    const dragFromRef = useRef<number | null>(null); // stale closure 방지

    useEffect(() => {
        setLoading(true);
        setDragFrom(null);
        setDragTo(null);
        dragFromRef.current = null;
        AdminAdvertisementService.getAdvertisements({ page: 0, size: 100 }, selectedType, 'ACTIVE')
            .then(res => {
                const sorted = [...(res.data?.content ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
                setItems(sorted);
                setOriginalOrder(sorted.map(ad => ad.id!));
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [selectedType]);

    // ─── Drag handlers ────────────────────────────────────────────────────────
    // onDrop 기반: 드래그 중 setItems를 호출하지 않아 리렌더링으로 인한
    // 브라우저 드래그 상태 초기화 문제 없음
    const handleDragStart = (index: number) => {
        dragFromRef.current = index; // ref는 항상 최신값 보장
        setDragFrom(index);
        setDragTo(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault(); // drop 허용에 필수
        if (dragTo !== index) setDragTo(index);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const from = dragFromRef.current; // ref에서 읽어 stale closure 방지
        if (from === null || from === dropIndex) {
            dragFromRef.current = null;
            setDragFrom(null);
            setDragTo(null);
            return;
        }
        setItems(prev => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(dropIndex, 0, moved);
            return next;
        });
        dragFromRef.current = null;
        setDragFrom(null);
        setDragTo(null);
    };

    const handleDragEnd = () => {
        dragFromRef.current = null;
        setDragFrom(null);
        setDragTo(null);
    };
    // ──────────────────────────────────────────────────────────────────────────

    const isDirty = items.some((ad, i) => ad.id !== originalOrder[i]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = items
                .map((ad, index) => ({ ad, newOrder: index }))
                .filter(({ ad, newOrder }) => originalOrder.indexOf(ad.id!) !== newOrder);

            await Promise.all(
                updates.map(({ ad, newOrder }) =>
                    AdminAdvertisementService.updateAdvertisement(ad.id!, { displayOrder: newOrder } as any)
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
        <ModalWrapper
            title="광고 노출 순서 관리"
            onClose={onClose}
            maxHeight="max-h-[80vh]"
            footer={
                <ModalFooter
                    onClose={onClose}
                    onSubmit={handleSave}
                    loading={saving}
                    disabled={!isDirty}
                    submitText={saving ? '저장 중...' : '순서 저장'}
                />
            }
        >

                {/* 타입 탭 */}
                <div className="flex gap-1 px-6 pt-4">
                    {AD_TYPES.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setSelectedType(t.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${selectedType === t.value
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <p className="px-6 pt-3 pb-1 text-xs text-gray-400">
                    드래그하여 순서를 변경하고 저장하세요. 위쪽이 먼저 노출됩니다.
                </p>

                {/* 목록 */}
                <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1">
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
                        items.map((ad, index) => {
                            const isDragging = dragFrom === index;
                            const isDropTarget = dragTo === index && dragFrom !== null && dragFrom !== index;

                            return (
                                <div
                                    key={ad.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={e => handleDragOver(e, index)}
                                    onDrop={e => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center gap-3 p-3 rounded-xl border select-none transition-all cursor-grab active:cursor-grabbing ${isDragging
                                        ? 'opacity-40 bg-gray-50 border-dashed border-gray-300'
                                        : isDropTarget
                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.01]'
                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                        }`}
                                >
                                    {/* 자식 요소에 pointer-events-none: 드래그 이벤트가 부모 div에만 전달됨 */}
                                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 pointer-events-none" />
                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 pointer-events-none">
                                        {index + 1}
                                    </span>
                                    {ad.imageUrl && (
                                        <img
                                            src={ad.imageUrl}
                                            alt={ad.title}
                                            className="w-10 h-8 object-cover rounded-md border border-gray-100 flex-shrink-0 pointer-events-none"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0 pointer-events-none">
                                        <p className="text-sm font-medium text-gray-900 truncate">{ad.title}</p>
                                        <p className="text-xs text-gray-400">{STATUS_LABELS[(ad.status as string) || 'ACTIVE'] ?? ad.status}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

        </ModalWrapper>
    );
}
