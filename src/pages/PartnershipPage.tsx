import { useState } from 'react';
import { PartnershipList } from '../features/partnerships/PartnershipList';
import { PartnershipUpload } from '../features/partnerships/PartnershipUpload';
import { PartnershipCreateModal } from '../features/partnerships/PartnershipCreateModal';
import { Plus } from 'lucide-react';
import { useUniversity } from '../shared/contexts/UniversityContext';

export function PartnershipPage() {
    const { selectedUniversityId } = useUniversity();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">제휴 현황</h2>
                </div>
                {selectedUniversityId ? (
                    <PartnershipList universityId={selectedUniversityId} refreshTrigger={refreshTrigger} />
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
