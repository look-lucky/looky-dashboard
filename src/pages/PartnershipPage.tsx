import { useState, useEffect } from 'react';
import { PartnershipList } from '../features/partnerships/PartnershipList';
import { PartnershipUpload } from '../features/partnerships/PartnershipUpload';
import { PartnershipCreateModal } from '../features/partnerships/PartnershipCreateModal';
import { Plus } from 'lucide-react';
import { useUniversity } from '../shared/contexts/UniversityContext';
import { OrganizationService } from '../shared/api/services/OrganizationService';
import type { OrganizationResponse } from '../shared/api/models/OrganizationResponse';

export function PartnershipPage() {
    const { selectedUniversityId } = useUniversity();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);

    const fetchOrganizations = async (universityId: number) => {
        try {
            const response = await OrganizationService.getOrganizations(universityId);
            if (response.data) {
                setOrganizations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations:', error);
        }
    };

    useEffect(() => {
        if (selectedUniversityId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            void fetchOrganizations(selectedUniversityId);
        } else {
            setOrganizations([]);
        }
        setSelectedCategory('');
        setSelectedOrganizationId(null);
    }, [selectedUniversityId]);

    const filteredOrganizations = organizations.filter(org =>
        !selectedCategory || org.category === selectedCategory
    );

    const handleCreateSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setShowCreateModal(false);
    };

    const handleCreateClick = () => {
        if (!selectedUniversityId) {
            alert('대학을 먼저 선택해주세요.');
            return;
        }
        setShowCreateModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">제휴 혜택 관리</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateClick}
                        disabled={!selectedUniversityId}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Plus className="-ml-1 mr-2 h-4 w-4" />
                        제휴 등록
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">제휴 혜택 일괄 등록 (Excel)</h2>
                <PartnershipUpload
                    universityId={selectedUniversityId}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">제휴 현황</h2>
                    {selectedUniversityId && (
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedOrganizationId(null);
                                }}
                                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">카테고리 전체</option>
                                <option value="UNIVERSITY_COUNCIL">총학생회</option>
                                <option value="CLUB_ASSOCIATION">총동아리연합회</option>
                                <option value="COLLEGE">단과대학</option>
                                <option value="DEPARTMENT">학과</option>
                            </select>

                            <select
                                value={selectedOrganizationId || ''}
                                onChange={(e) => setSelectedOrganizationId(e.target.value ? Number(e.target.value) : null)}
                                disabled={!selectedCategory}
                                className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                            >
                                <option value="">{selectedCategory ? '전체 (모든 조직)' : '카테고리를 먼저 선택하세요'}</option>
                                {filteredOrganizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                {selectedUniversityId ? (
                    <PartnershipList
                        universityId={selectedUniversityId}
                        organizationId={selectedOrganizationId}
                        categoryId={selectedCategory}
                        refreshTrigger={refreshTrigger}
                    />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        대학을 선택해주세요.
                    </div>
                )}
            </div>

            {showCreateModal && selectedUniversityId && (
                <PartnershipCreateModal
                    universityId={selectedUniversityId}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}