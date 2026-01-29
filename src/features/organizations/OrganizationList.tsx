import { Edit2, Trash2, Users, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrganizationService } from '../../shared/api/services/OrganizationService';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';

interface OrganizationListProps {
    universityId: number;
    refreshTrigger: number;
    onEdit: (org: OrganizationResponse) => void;
}

export function OrganizationList({ universityId, refreshTrigger, onEdit }: OrganizationListProps) {
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrganizations = organizations.filter(org =>
        (org.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (universityId) {
            fetchOrganizations();
        }
    }, [universityId, refreshTrigger]);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const response = await OrganizationService.getOrganizations(universityId);
            if (response.data) {
                setOrganizations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까? 관련 데이터가 모두 삭제될 수 있습니다.')) return;

        try {
            await OrganizationService.deleteOrganization(id);
            fetchOrganizations();
        } catch (error) {
            console.error(error);
            alert('소속 삭제에 실패했습니다.');
        }
    };

    const getCategoryLabel = (category?: string) => {
        switch (category) {
            case 'COLLEGE': return '단과대학';
            case 'DEPARTMENT': return '학과';
            case 'STUDENT_COUNCIL': return '학생회';
            default: return category;
        }
    };

    if (loading) {
        return <div className="py-8 text-center text-gray-500">로딩 중...</div>;
    }

    if (organizations.length === 0) {
        return <div className="py-8 text-center text-gray-500">등록된 소속/단체가 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="이름 또는 유형 검색..."
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상위조직 ID</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrganizations.map((org) => (
                            <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{org.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${org.category === 'COLLEGE' ? 'bg-purple-100 text-purple-800' :
                                        org.category === 'DEPARTMENT' ? 'bg-blue-100 text-blue-800' :
                                            'bg-orange-100 text-orange-800'
                                        }`}>
                                        {getCategoryLabel(org.category)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Assuming API response doesn't strictly adhere to TS definition or we use parentId if available in future */}
                                    {/* org.parentId ? `#${org.parentId}` : '-' */}
                                    -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(org)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => org.id && handleDelete(org.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
