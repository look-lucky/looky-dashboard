import { Check, X, Building2, User, FileText, Calendar } from 'lucide-react';
import { useState } from 'react';
import { StoreClaimService } from '../../shared/api/services/StoreClaimService';
import { StoreClaimResponse } from '../../shared/api/models/StoreClaimResponse';

interface StoreClaimDetailModalProps {
    claim: StoreClaimResponse;
    onClose: () => void;
    onUpdate: () => void;
}

export function StoreClaimDetailModal({ claim, onClose, onUpdate }: StoreClaimDetailModalProps) {
    const [processLoading, setProcessLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    const handleApprove = async () => {
        if (!claim.id) return;
        if (!confirm('정말로 이 요청을 승인하시겠습니까?')) return;

        setProcessLoading(true);
        try {
            await StoreClaimService.approve(claim.id);
            alert('승인되었습니다.');
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            setProcessLoading(false);
        }
    };

    const handleReject = async () => {
        if (!claim.id) return;
        if (!showRejectInput) {
            setShowRejectInput(true);
            return;
        }
        if (!rejectReason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        setProcessLoading(true);
        try {
            await StoreClaimService.reject(claim.id, { reason: rejectReason });
            alert('반려되었습니다.');
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            setProcessLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">심사 상세 정보</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-100">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Store Info</p>
                                <div className="flex items-center mb-1">
                                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="font-bold text-gray-900 text-lg">{claim.storeName}</span>
                                </div>
                                <p className="text-sm text-gray-500 pl-6">ID: {claim.storeId}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Applicant</p>
                                <div className="flex items-center mb-1">
                                    <User className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="font-semibold text-gray-900 text-lg">{claim.name}</span>
                                </div>
                                <p className="text-sm text-gray-500 pl-6">사업자명: {claim.representativeName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                사업자 등록증
                            </h3>
                            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative group">
                                {claim.licenseImageUrl ? (
                                    <img src={claim.licenseImageUrl} alt="Business License" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-gray-400">이미지가 없습니다</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">사업자 등록번호</p>
                                <p className="font-mono font-medium text-gray-900">{claim.bizRegNo}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">연락처</p>
                                <p className="font-medium text-gray-900">{claim.storePhone || '-'}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            신청일: {claim.createdAt ? new Date(claim.createdAt).toLocaleString() : '-'}
                        </div>
                    </div>

                    {showRejectInput && (
                        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-medium text-red-900 mb-2">반려 사유 입력</label>
                            <textarea
                                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                rows={3}
                                placeholder="반려 사유를 구체적으로 입력해주세요."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    {showRejectInput ? (
                        <>
                            <button
                                onClick={() => setShowRejectInput(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                disabled={processLoading}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center"
                                disabled={processLoading}
                            >
                                {processLoading ? '처리중...' : '반려 확정'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                                disabled={processLoading}
                            >
                                반려
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center"
                                disabled={processLoading}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                승인
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
