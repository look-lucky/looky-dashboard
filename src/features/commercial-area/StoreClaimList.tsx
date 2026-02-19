import { useState, useEffect } from 'react';
import { StoreClaimService } from '../../shared/api/services/StoreClaimService';
import type { StoreClaimResponse } from '../../shared/api/models/StoreClaimResponse';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle } from 'lucide-react';

export function StoreClaimList() {
    const [currentTab, setCurrentTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
    const [completedFilter, setCompletedFilter] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

    const [claims, setClaims] = useState<StoreClaimResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(0);

    const [selectedClaim, setSelectedClaim] = useState<StoreClaimResponse | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    useEffect(() => {
        fetchClaims();
    }, [currentTab, completedFilter, page]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            let status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

            if (currentTab === 'PENDING') {
                status = 'PENDING';
            } else {
                status = completedFilter;
            }

            const response = await StoreClaimService.getStoreClaims(
                { page, size: pageSize, sort: ['createdAt,desc'] },
                status
            );

            if (response.data) {
                setClaims(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedClaim?.id) return;
        if (!confirm('정말 승인하시겠습니까?')) return;

        try {
            await StoreClaimService.approve(selectedClaim.id);
            alert('승인되었습니다.');
            closeModal();
            fetchClaims();
        } catch (e) {
            console.error(e);
            alert('승인에 실패했습니다.');
        }
    };

    const handleReject = async () => {
        if (!selectedClaim?.id) return;
        if (!rejectReason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        try {
            await StoreClaimService.reject(selectedClaim.id, { reason: rejectReason });
            alert('반려되었습니다.');
            closeModal();
            fetchClaims();
        } catch (e) {
            console.error(e);
            alert('반려에 실패했습니다.');
        }
    };

    const openModal = (claim: StoreClaimResponse) => {
        setSelectedClaim(claim);
        setIsRejecting(false);
        setRejectReason('');
    };

    const closeModal = () => {
        setSelectedClaim(null);
        setIsRejecting(false);
        setRejectReason('');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">가게 점유 심사</h3>

                {/* Main Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${currentTab === 'PENDING' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setCurrentTab('PENDING'); setPage(0); }}
                    >
                        심사 대기
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${currentTab === 'COMPLETED' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setCurrentTab('COMPLETED'); setPage(0); }}
                    >
                        심사 완료
                    </button>
                </div>

                {/* Sub Tabs for Completed */}
                {currentTab === 'COMPLETED' && (
                    <div className="flex mt-4 space-x-2">
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${completedFilter === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => { setCompletedFilter('APPROVED'); setPage(0); }}
                        >
                            승인
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${completedFilter === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => { setCompletedFilter('REJECTED'); setPage(0); }}
                        >
                            반려
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상점명</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사업자번호</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {claims.length > 0 ? (
                                claims.map((claim) => (
                                    <tr key={claim.id} onClick={() => openModal(claim)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.storeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.representativeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.bizRegNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    claim.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination is simplified here for brevity, can duplicate StoreList pagination if needed */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1 flex justify-between">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-700 self-center">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page === totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">

                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button type="button" onClick={closeModal} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        점유 심사 상세 정보
                                    </h3>
                                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <span className="text-sm font-medium text-gray-500">상점명</span>
                                            <span className="text-sm text-gray-900 col-span-2">{selectedClaim.storeName}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <span className="text-sm font-medium text-gray-500">신청자</span>
                                            <span className="text-sm text-gray-900 col-span-2">{selectedClaim.representativeName}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <span className="text-sm font-medium text-gray-500">사업자번호</span>
                                            <span className="text-sm text-gray-900 col-span-2">{selectedClaim.bizRegNo}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <span className="text-sm font-medium text-gray-500">전화번호</span>
                                            <span className="text-sm text-gray-900 col-span-2">{selectedClaim.storePhone}</span>
                                        </div>
                                        {selectedClaim.licenseImageUrl && (
                                            <div className="mt-4">
                                                <span className="block text-sm font-medium text-gray-500 mb-2">사업자등록증</span>
                                                <img src={selectedClaim.licenseImageUrl} alt="Business License" className="max-w-full h-auto rounded border border-gray-200" />
                                            </div>
                                        )}

                                        {/* Show Reject Reason if Rejected */}
                                        {selectedClaim.status === 'REJECTED' && selectedClaim.adminMemo && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-md">
                                                <span className="block text-sm font-bold text-red-800 mb-1">반려 사유</span>
                                                <p className="text-sm text-red-700">{selectedClaim.adminMemo}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions ONLY for PENDING status */}
                            {currentTab === 'PENDING' && (
                                <div className="mt-5 sm:mt-4">
                                    {isRejecting ? (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">반려 사유를 입력하세요</label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                rows={3}
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="예: 사업자등록증 식별 불가"
                                            />
                                            <div className="mt-3 flex justify-end gap-2">
                                                <button
                                                    onClick={() => setIsRejecting(false)}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={handleReject}
                                                    className="px-3 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                                                >
                                                    반려 확정
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row-reverse gap-2">
                                            <button
                                                type="button"
                                                onClick={handleApprove}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                승인
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsRejecting(true)}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                반려
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Read-only footer for Completed items */}
                            {currentTab === 'COMPLETED' && (
                                <div className="mt-5 sm:mt-4 border-t pt-4 text-center">
                                    <span className="text-sm text-gray-500 flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        심사가 완료된 건은 수정할 수 없습니다.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
