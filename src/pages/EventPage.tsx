import { useState } from 'react';
import { Plus } from 'lucide-react';
import { EventList } from '../features/events/EventList';
import { EventModal } from '../features/events/EventModal';
import type { EventResponse } from '../shared/api/models/EventResponse';
import { useUniversity } from '../shared/contexts/UniversityContext';

export function EventPage() {
    // University State
    const { selectedUniversityId, universities } = useUniversity();

    // Event State
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEdit = (event: EventResponse) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCreate = () => {
        if (!selectedUniversityId) {
            alert('대학을 먼저 선택해주세요.');
            return;
        }
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleSuccess = () => {
        setShowModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedEvent(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">이벤트 관리</h1>
                <button
                    onClick={handleCreate}
                    disabled={!selectedUniversityId}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    이벤트 등록
                </button>
            </div>



            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        이벤트 목록 {selectedUniversityId && universities.find(u => u.id === selectedUniversityId)?.name ? `- ${universities.find(u => u.id === selectedUniversityId)?.name}` : ''}
                    </h2>
                </div>
                {selectedUniversityId ? (
                    <EventList refreshTrigger={refreshTrigger} onEdit={handleEdit} />
                ) : (
                    <div className="p-12 text-center text-gray-500">대학을 선택해주세요.</div>
                )}
            </div>

            {showModal && (
                <EventModal
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                    initialData={selectedEvent}
                />
            )}
        </div>
    );
}
