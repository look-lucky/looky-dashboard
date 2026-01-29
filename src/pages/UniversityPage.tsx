import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UniversityList } from '../features/universities/UniversityList';
import { UniversityModal } from '../features/universities/UniversityModal';
import type { UniversityResponse } from '../shared/api/models/UniversityResponse';

export function UniversityPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEdit = (university: UniversityResponse) => {
        setSelectedUniversity(university);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedUniversity(null);
        setShowModal(true);
    };

    const handleSuccess = () => {
        setShowModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUniversity(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">대학 관리</h1>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    대학 등록
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">등록된 대학 목록</h2>
                </div>
                <UniversityList refreshTrigger={refreshTrigger} onEdit={handleEdit} />
            </div>

            {showModal && (
                <UniversityModal
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                    initialData={selectedUniversity}
                />
            )}
        </div>
    );
}
