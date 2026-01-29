import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PartnershipService } from '../../shared/api/services/PartnershipService';
import type { PartnershipResponse } from '../../shared/api/models/PartnershipResponse';

interface PartnershipListProps {
    universityId: number;
    refreshTrigger: number;
}

export function PartnershipList({ universityId, refreshTrigger }: PartnershipListProps) {
    const [partnerships, setPartnerships] = useState<PartnershipResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (universityId) {
            fetchPartnerships();
        }
    }, [universityId, refreshTrigger]);

    const fetchPartnerships = async () => {
        setIsLoading(true);
        try {
            const response = await PartnershipService.getPartnershipsByUniversity(universityId);
            if (response.data) {
                setPartnerships(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch partnerships:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                await PartnershipService.deletePartnership(id);
                fetchPartnerships();
            } catch (error) {
                console.error('Failed to delete partnership:', error);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">데이터를 불러오는 중...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상 조직</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">혜택 내용</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {partnerships.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                등록된 제휴 혜택이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        partnerships.map((partnership) => (
                            <tr key={partnership.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {partnership.organizationName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {partnership.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {partnership.benefit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => partnership.id && handleDelete(partnership.id)}
                                        className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
