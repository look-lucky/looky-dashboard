import { useState, useEffect } from 'react';
import { PartnershipList } from '../features/partnerships/PartnershipList';
import { PartnershipUpload } from '../features/partnerships/PartnershipUpload';
import { PartnershipCreateModal } from '../features/partnerships/PartnershipCreateModal';
import { Plus, School } from 'lucide-react';
import { UniversityService } from '../shared/api/services/UniversityService';
import type { UniversityResponse } from '../shared/api/models/UniversityResponse';

export function PartnershipPage() {
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);
    const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        async function fetchUniversities() {
            try {
                const response = await UniversityService.getUniversities();
                if (response.data) {
                    setUniversities(response.data);
                    if (response.data.length > 0) {
                        setSelectedUniversityId(response.data[0].id || null);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUniversities();
    }, []);

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
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">대학 선택</label>
                    <div className="relative">
                        <select
                            value={selectedUniversityId || ''}
                            onChange={(e) => setSelectedUniversityId(Number(e.target.value))}
                            className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                        >
                            <option value="" disabled>대학을 선택하세요</option>
                            {universities.map((uni) => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <School className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

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
