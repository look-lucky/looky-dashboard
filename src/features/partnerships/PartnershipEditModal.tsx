import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPartnershipService } from '../../shared/api/services/AdminPartnershipService';
import type { PartnershipResponse } from '../../shared/api/models/PartnershipResponse';
import type { UpdatePartnershipRequest } from '../../shared/api/models/UpdatePartnershipRequest';

interface PartnershipEditModalProps {
    partnership: PartnershipResponse;
    onClose: () => void;
    onSuccess: () => void;
}

export function PartnershipEditModal({ partnership, onClose, onSuccess }: PartnershipEditModalProps) {
    const [benefit, setBenefit] = useState(partnership.benefit || '');
    const [startsAt, setStartsAt] = useState('');
    const [endsAt, setEndsAt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!benefit) {
            alert('혜택 내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                benefit,
                startsAt: startsAt || undefined,
                endsAt: endsAt || undefined,
            } as unknown as UpdatePartnershipRequest;

            await AdminPartnershipService.updatePartnershipBenefit(partnership.id!, payload);
            alert('제휴 혜택이 수정되었습니다.');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">제휴 혜택 수정</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Info */}
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium text-gray-700">상점:</span> {partnership.storeName || '-'}</div>
                        <div><span className="font-medium text-gray-700">조직:</span> {partnership.organizationName}</div>
                    </div>

                    {/* Benefit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">혜택 내용</label>
                        <textarea
                            rows={3}
                            value={benefit}
                            onChange={(e) => setBenefit(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="예: 모든 메뉴 10% 할인"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                            <input
                                type="date"
                                value={startsAt}
                                onChange={(e) => setStartsAt(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                            <input
                                type="date"
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? '처리중...' : '수정하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
