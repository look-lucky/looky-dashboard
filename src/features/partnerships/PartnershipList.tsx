import { Trash2, Search, Pencil } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { AdminPartnershipService } from '../../shared/api/services/AdminPartnershipService';
import type { PartnershipResponse } from '../../shared/api/models/PartnershipResponse';
import { PartnershipEditModal } from './PartnershipEditModal';

interface PartnershipListProps {
    universityId: number;
    organizationId?: number | null;
    refreshTrigger: number;
}

export function PartnershipList({ universityId, organizationId, refreshTrigger }: PartnershipListProps) {
    const [partnerships, setPartnerships] = useState<PartnershipResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPartnership, setEditingPartnership] = useState<PartnershipResponse | null>(null);

    const filteredPartnerships = partnerships.filter(p =>
        p.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.benefit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchPartnerships = useCallback(async () => {
        setIsLoading(true);
        try {
            let response;
            if (organizationId) {
                response = await AdminPartnershipService.getPartnershipsByOrganization(universityId, organizationId);
            } else {
                response = await AdminPartnershipService.getPartnershipsByUniversity(universityId);
            }

            if (response.data) {
                setPartnerships(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch partnerships:', error);
        } finally {
            setIsLoading(false);
        }
    }, [organizationId, universityId]);

    useEffect(() => {
        if (universityId) {
            void fetchPartnerships();
        }
    }, [universityId, organizationId, refreshTrigger, fetchPartnerships]);

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                await AdminPartnershipService.deletePartnership(id);
                void fetchPartnerships();
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
        <>
        {editingPartnership && (
            <PartnershipEditModal
                partnership={editingPartnership}
                onClose={() => setEditingPartnership(null)}
                onSuccess={() => {
                    setEditingPartnership(null);
                void fetchPartnerships();
                }}
            />
        )}
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="상점명, 조직명, 분류 또는 혜택 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상 조직</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상점</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">혜택 내용</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPartnerships.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 제휴 혜택이 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            filteredPartnerships.map((partnership) => (
                                <tr key={partnership.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {partnership.organizationName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {partnership.storeName || '-'}
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
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setEditingPartnership(partnership)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-full"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => partnership.id && handleDelete(partnership.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}
