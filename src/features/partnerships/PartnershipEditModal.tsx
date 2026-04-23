import { useState } from 'react';
import { AdminPartnershipService } from '../../shared/api/services/AdminPartnershipService';
import type { AdminPartnershipResponse as PartnershipResponse } from '../../shared/api/models/AdminPartnershipResponse';
import type { UpdatePartnershipRequest } from '../../shared/api/models/UpdatePartnershipRequest';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';

interface PartnershipEditModalProps {
    partnership: PartnershipResponse;
    onClose: () => void;
    onSuccess: () => void;
}

export function PartnershipEditModal({ partnership, onClose, onSuccess }: PartnershipEditModalProps) {
    const [benefit, setBenefit] = useState(partnership.benefit || '');
    const [startsAt, setStartsAt] = useState(partnership.startsAt || '');
    const [endsAt, setEndsAt] = useState(partnership.endsAt || '');
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
        <ModalWrapper
            title="제휴 혜택 수정"
            onClose={onClose}
            maxWidth="max-w-lg"
            footer={<ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} submitText="수정하기" />}
        >
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
        </ModalWrapper>
    );
}
