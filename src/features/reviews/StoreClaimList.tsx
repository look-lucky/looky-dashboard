import { useEffect, useState } from 'react';
import { StoreClaimService } from '../../shared/api/services/StoreClaimService';
import { StoreClaimResponse } from '../../shared/api/models/StoreClaimResponse';
import { Building2, User, Search } from 'lucide-react';
import clsx from 'clsx';
import { StoreClaimDetailModal } from './StoreClaimDetailModal';

interface StoreClaimListProps {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function StoreClaimList({ status }: StoreClaimListProps) {
    const [claims, setClaims] = useState<StoreClaimResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<StoreClaimResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClaims = claims.filter(claim =>
        claim.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.bizRegNo?.includes(searchTerm)
    );

    useEffect(() => {
        fetchClaims();
    }, [status]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const response = await StoreClaimService.getStoreClaims({ page: 0, size: 20 }, status);
            if (response.data?.content) {
                setClaims(response.data.content);
            }
        } catch (error) {
            console.error('Failed to fetch store claims', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <div>
                {status !== 'PENDING' && (
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex gap-2">
                        <span className="text-sm text-gray-500">
                            {status === 'APPROVED' ? '승인된' : '반려된'} 심사 이력을 조회합니다.
                        </span>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="상점명, 신청자 또는 사업자번호 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요청 상점</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사업자 번호</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청 일시</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClaims.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    {searchTerm ? '검색 결과가 없습니다.' : '데이터가 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            filteredClaims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{claim.storeName}</div>
                                                <div className="text-sm text-gray-500">ID: {claim.storeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-900">{claim.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {claim.bizRegNo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={clsx(
                                            "px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full",
                                            status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                status === 'APPROVED' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        )}>
                                            {status === 'PENDING' ? '대기중' : status === 'APPROVED' ? '승인됨' : '반려됨'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedClaim(claim);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedClaim && (
                <StoreClaimDetailModal
                    claim={selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    onUpdate={fetchClaims}
                />
            )}
        </>
    );
}
