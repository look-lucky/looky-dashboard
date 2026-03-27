import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdvertisementList } from '../features/advertisements/AdvertisementList';
import { AdvertisementModal } from '../features/advertisements/AdvertisementModal';
import type { AdminAdvertisementResponse } from '../shared/api/services/AdminAdvertisementService';

export function AdvertisementPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedAd, setSelectedAd] = useState<AdminAdvertisementResponse | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEdit = (ad: AdminAdvertisementResponse) => {
        setSelectedAd(ad);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedAd(null);
        setShowModal(true);
    };

    const handleSuccess = () => {
        setShowModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedAd(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">광고 관리</h1>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    광고 등록
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">광고 목록</h2>
                </div>
                <div className="p-6">
                    <AdvertisementList refreshTrigger={refreshTrigger} onEdit={handleEdit} />
                </div>
            </div>

            {showModal && (
                <AdvertisementModal
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                    initialData={selectedAd}
                />
            )}
        </div>
    );
}
