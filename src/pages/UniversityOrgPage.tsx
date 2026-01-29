import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UniversityList } from '../features/universities/UniversityList';
import { UniversityModal } from '../features/universities/UniversityModal';
import { OrganizationList } from '../features/organizations/OrganizationList';
import { OrganizationModal } from '../features/organizations/OrganizationModal';
import type { UniversityResponse } from '../shared/api/models/UniversityResponse';
import type { OrganizationResponse } from '../shared/api/models/OrganizationResponse';

export function UniversityOrgPage() {
    // University State
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null);
    const [showUniModal, setShowUniModal] = useState(false);
    const [uniRefreshTrigger, setUniRefreshTrigger] = useState(0);
    const [editingUniversity, setEditingUniversity] = useState<UniversityResponse | null>(null);

    // Organization State
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [orgRefreshTrigger, setOrgRefreshTrigger] = useState(0);
    const [editingOrg, setEditingOrg] = useState<OrganizationResponse | null>(null);

    // University Handlers
    const handleUniEdit = (university: UniversityResponse) => {
        setEditingUniversity(university);
        setShowUniModal(true);
    };

    const handleUniCreate = () => {
        setEditingUniversity(null);
        setShowUniModal(true);
    };

    const handleUniSuccess = () => {
        setShowUniModal(false);
        setUniRefreshTrigger(prev => prev + 1);
        // If editing currently selected uni, update selection too? 
        // Best to just refresh list. UniversityList handles fetching.
    };

    const handleUniSelect = (university: UniversityResponse) => {
        setSelectedUniversity(university);
    };

    // Organization Handlers
    const handleOrgEdit = (org: OrganizationResponse) => {
        setEditingOrg(org);
        setShowOrgModal(true);
    };

    const handleOrgCreate = () => {
        if (!selectedUniversity?.id) {
            alert('먼저 대학을 선택해주세요.');
            return;
        }
        setEditingOrg(null);
        setShowOrgModal(true);
    };

    const handleOrgSuccess = () => {
        setShowOrgModal(false);
        setOrgRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900 shrink-0">대학 및 소속 관리</h1>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Left Panel: Universities */}
                <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                        <h2 className="font-semibold text-gray-900">대학 목록</h2>
                        <button
                            onClick={handleUniCreate}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="대학 등록"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <UniversityList
                            refreshTrigger={uniRefreshTrigger}
                            onEdit={handleUniEdit}
                            onSelect={handleUniSelect}
                            selectedId={selectedUniversity?.id}
                        />
                    </div>
                </div>

                {/* Right Panel: Organizations */}
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-gray-900">소속/단체 목록</h2>
                            {selectedUniversity && (
                                <span className="text-sm text-gray-500 font-normal">
                                    - {selectedUniversity.name}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleOrgCreate}
                            disabled={!selectedUniversity}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="소속 등록"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedUniversity?.id ? (
                            <OrganizationList
                                universityId={selectedUniversity.id}
                                refreshTrigger={orgRefreshTrigger}
                                onEdit={handleOrgEdit}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                관리할 대학을 왼쪽에서 선택해주세요.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* University Modal */}
            {showUniModal && (
                <UniversityModal
                    onClose={() => setShowUniModal(false)}
                    onSuccess={handleUniSuccess}
                    initialData={editingUniversity}
                />
            )}

            {/* Organization Modal */}
            {showOrgModal && selectedUniversity?.id && (
                <OrganizationModal
                    universityId={selectedUniversity.id}
                    onClose={() => setShowOrgModal(false)}
                    onSuccess={handleOrgSuccess}
                    initialData={editingOrg}
                />
            )}
        </div>
    );
}
