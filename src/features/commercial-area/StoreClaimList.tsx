import { useState, useEffect, useCallback } from 'react';
import { AdminStoreClaimService } from '../../shared/api/services/AdminStoreClaimService';
import type { AdminStoreClaimResponse } from '../../shared/api/models/AdminStoreClaimResponse';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatKoreanPhoneNumber } from '../../shared/utils/phoneNumber';
import { Pagination } from '../../shared/components/Pagination';
import { ModalWrapper } from '../../shared/components/ModalWrapper';

export function StoreClaimList() {
    const [currentTab, setCurrentTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
    const [completedFilter, setCompletedFilter] = useState<'ALL' | 'APPROVED' | 'REJECTED'>('ALL');

    const [claims, setClaims] = useState<AdminStoreClaimResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedClaim, setSelectedClaim] = useState<AdminStoreClaimResponse | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchClaims = useCallback(async () => {
        setLoading(true);
        try {
            if (currentTab === 'COMPLETED' && completedFilter === 'ALL') {
                // Fetch APPROVED and REJECTED separately and combine them for accurate pagination if backend supports it.
                // Since our backend doesn't support multiple statuses in a single request, 
                // and fetching all to filter locally breaks pagination, we will fetch both and merge them for the current page
                const [approvedResponse, rejectedResponse] = await Promise.all([
                    AdminStoreClaimService.getStoreClaims(
                        { page, size: pageSize, sort: ['createdAt,desc'] },
                        'APPROVED'
                    ),
                    AdminStoreClaimService.getStoreClaims(
                        { page, size: pageSize, sort: ['createdAt,desc'] },
                        'REJECTED'
                    )
                ]);

                if (approvedResponse.data && rejectedResponse.data) {
                    const approvedClaims = approvedResponse.data.content || [];
                    const rejectedClaims = rejectedResponse.data.content || [];
                    
                    // Combine and sort by createdAt descending
                    const combinedClaims = [...approvedClaims, ...rejectedClaims].sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });
                    
                    // Slice to match page size (Note: This is still a workaround and might not be perfectly standard pagination 
                    // if there are many pages, but it's better than showing PENDING items)
                    setClaims(combinedClaims.slice(0, pageSize));
                    
                    const totalElements = (approvedResponse.data.totalElements || 0) + (rejectedResponse.data.totalElements || 0);
                    setTotalElements(totalElements);
                    setTotalPages(Math.ceil(totalElements / pageSize));
                }
            } else {
                const status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED' | undefined =
                    currentTab === 'PENDING'
                        ? 'PENDING'
                        : completedFilter === 'ALL'
                            ? undefined
                            : completedFilter;

                const response = await AdminStoreClaimService.getStoreClaims(
                    { page, size: pageSize, sort: ['createdAt,desc'] },
                    status
                );

                if (response.data) {
                    setClaims(response.data.content || []);
                    setTotalPages(response.data.totalPages || 0);
                    setTotalElements(response.data.totalElements || 0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setLoading(false);
        }
    }, [currentTab, completedFilter, page, pageSize]);

    useEffect(() => {
        void fetchClaims();
    }, [fetchClaims]);

    const handleApprove = async () => {
        if (!selectedClaim?.id) return;
        if (!confirm('정말 승인하시겠습니까?')) return;

        try {
            await AdminStoreClaimService.approve(selectedClaim.id);
            toast.success('승인되었습니다.');
            closeModal();
            void fetchClaims();
        } catch (e) {
            console.error(e);
            toast.error('승인에 실패했습니다.');
        }
    };

    const handleReject = async () => {
        if (!selectedClaim?.id) return;
        if (!rejectReason.trim()) {
            toast.error('반려 사유를 입력해주세요.');
            return;
        }

        try {
            await AdminStoreClaimService.reject(selectedClaim.id, { reason: rejectReason });
            toast.success('반려되었습니다.');
            closeModal();
            void fetchClaims();
        } catch (e) {
            console.error(e);
            toast.error('반려에 실패했습니다.');
        }
    };

    const openModal = (claim: AdminStoreClaimResponse) => {
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
                            className={`px-3 py-1 rounded-full text-xs font-medium ${completedFilter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => { setCompletedFilter('ALL'); setPage(0); }}
                        >
                            전체
                        </button>
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
                                                {claim.status === 'PENDING' ? '대기중' : claim.status === 'APPROVED' ? '승인' : '반려'}
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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalElements={totalElements}
                onPageChange={setPage}
            />

            {/* Modal */}
            {selectedClaim && (
                <ModalWrapper title="점유 심사 상세 정보" onClose={closeModal} maxWidth="max-w-lg">
                    <div className="flex-1 overflow-y-auto p-6 min-h-0">
                        <div className="space-y-3">
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
                                <span className="text-sm text-gray-900 col-span-2">{selectedClaim.storePhone ? formatKoreanPhoneNumber(selectedClaim.storePhone) : '-'}</span>
                            </div>
                            {selectedClaim.licenseImageUrl && (
                                <div className="mt-4">
                                    <span className="block text-sm font-medium text-gray-500 mb-2">사업자등록증</span>
                                    <img src={selectedClaim.licenseImageUrl} alt="Business License" className="max-w-full h-auto rounded border border-gray-200" />
                                </div>
                            )}

                            {selectedClaim.status === 'REJECTED' && selectedClaim.adminMemo && (
                                <div className="mt-4 p-3 bg-red-50 rounded-md">
                                    <span className="block text-sm font-bold text-red-800 mb-1">반려 사유</span>
                                    <p className="text-sm text-red-700">{selectedClaim.adminMemo}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {currentTab === 'PENDING' && (
                        <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50">
                            {isRejecting ? (
                                <div>
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
                </ModalWrapper>
            )}
        </div>
    );
}
