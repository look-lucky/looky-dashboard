import { Edit2, Trash2, Users, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { AdminOrganizationService } from '../../shared/api/services/AdminOrganizationService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';

interface OrganizationListProps {
    universityId: number;
    refreshTrigger: number;
    onEdit: (org: OrganizationResponse) => void;
    categoryFilter?: string;
    parentIdFilter?: number;
    collegeSelectMode?: boolean;
    selectedCollegeId?: number;
    onCollegeSelect?: (org: OrganizationResponse) => void;
}

export function OrganizationList({
    universityId,
    refreshTrigger,
    onEdit,
    categoryFilter,
    parentIdFilter,
    collegeSelectMode,
    selectedCollegeId,
    onCollegeSelect,
}: OrganizationListProps) {
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Reset selection when filters change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [universityId, categoryFilter, parentIdFilter]);

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredOrganizations.length && filteredOrganizations.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredOrganizations.map(org => org.id!).filter(Boolean)));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedIds.size}개의 소속을 정말 삭제하시겠습니까?`)) return;

        try {
            await Promise.all(Array.from(selectedIds).map(id => AdminOrganizationService.deleteOrganization1(id)));
            // Refresh logic
            if (universityId) {
            void fetchOrganizations();
            }
            setSelectedIds(new Set());
        } catch (error) {
            console.error(error);
            alert('일부 소속 삭제에 실패했습니다.');
        }
    };

    const filteredOrganizations = organizations.filter(org => {
        // Category filter
        if (categoryFilter && org.category !== categoryFilter) return false;
        // Parent ID filter (for departments under a specific college)
        if (parentIdFilter !== undefined && org.parentId !== parentIdFilter) return false;
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (org.name || '').toLowerCase().includes(term) ||
                (org.category || '').toLowerCase().includes(term);
        }
        return true;
    });

    const fetchOrganizations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await PublicOrganizationService.getOrganizations(universityId);
            if (response.data) {
                setOrganizations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    }, [universityId]);

    useEffect(() => {
        if (universityId) {
            void fetchOrganizations();
        }
    }, [universityId, refreshTrigger, fetchOrganizations]);

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까? 관련 데이터가 모두 삭제될 수 있습니다.')) return;

        try {
            await AdminOrganizationService.deleteOrganization1(id);
            void fetchOrganizations();
        } catch (error) {
            console.error(error);
            alert('소속 삭제에 실패했습니다.');
        }
    };

    const getCategoryLabel = (category?: string) => {
        switch (category) {
            case 'COLLEGE': return '단과대학';
            case 'DEPARTMENT': return '학과';
            case 'UNIVERSITY_COUNCIL': return '총학생회';
            case 'CLUB_ASSOCIATION': return '총동아리연합회';
            default: return category;
        }
    };

    if (loading) {
        return <div className="py-8 text-center text-gray-500">로딩 중...</div>;
    }

    if (organizations.length === 0) {
        return <div className="py-8 text-center text-gray-500">등록된 소속/단체가 없습니다.</div>;
    }

    // College select mode: simplified clickable list for the left panel in department view
    if (collegeSelectMode) {
        const colleges = filteredOrganizations;
        if (colleges.length === 0) {
            return <div className="py-8 text-center text-gray-500 text-sm">등록된 단과대학이 없습니다.</div>;
        }
        return (
            <div className="divide-y divide-gray-100">
                {colleges.map((org) => (
                    <div
                        key={org.id}
                        onClick={() => onCollegeSelect?.(org)}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${selectedCollegeId === org.id
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-medium ${selectedCollegeId === org.id ? 'text-blue-900' : 'text-gray-700'
                                }`}>
                                {org.name}
                            </span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(org); }}
                            className="text-gray-400 hover:text-blue-600 p-1"
                            title="수정"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // Normal table view
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="이름 또는 유형 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {selectedIds.size > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {selectedIds.size}개 삭제
                    </button>
                )}
            </div>

            {filteredOrganizations.length === 0 ? (
                <div className="py-8 text-center text-gray-500">조건에 맞는 소속이 없습니다.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={filteredOrganizations.length > 0 && selectedIds.size === filteredOrganizations.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상위조직 ID</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrganizations.map((org) => (
                                <tr key={org.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(org.id!) ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={!!org.id && selectedIds.has(org.id)}
                                            onChange={() => org.id && toggleSelect(org.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
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
                                        {org.parentId ? `#${org.parentId}` : '-'}
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
            )}
        </div>
    );
}
