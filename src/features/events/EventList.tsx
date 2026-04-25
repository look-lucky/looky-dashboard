import { Edit2, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { AdminEventService } from '../../shared/api/services/AdminEventService';
import type { AdminEventResponse } from '../../shared/api/models/AdminEventResponse';

import { useUniversity } from '../../shared/contexts/UniversityContext';
import { Pagination } from '../../shared/components/Pagination';
import { SearchInput } from '../../shared/components/SearchInput';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { usePaginatedQuery } from '../../shared/hooks/usePaginatedQuery';

interface EventListProps {
    refreshTrigger: number;
    onEdit: (event: AdminEventResponse) => void;
}

export function EventList({ refreshTrigger, onEdit }: EventListProps) {
    const { selectedUniversityId } = useUniversity();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm);

    const fetchEvents = useCallback(
        (page: number, size: number) =>
            AdminEventService.getEvents({ page, size }, debouncedSearchTerm || undefined, undefined, undefined, selectedUniversityId!),
        [debouncedSearchTerm, selectedUniversityId],
    );

    const { items: events, loading, page, setPage, totalPages, totalElements, pageSize, refetch } = usePaginatedQuery<AdminEventResponse>({
        fetchFn: fetchEvents,
        enabled: !!selectedUniversityId,
        refreshTrigger,
        resetDeps: [debouncedSearchTerm, selectedUniversityId],
    });

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await AdminEventService.deleteEvent(id);
            // Refresh list
            void refetch();
        } catch (error) {
            console.error(error);
            toast.error('이벤트 삭제에 실패했습니다.');
        }
    };

    if (loading && events.length === 0) {
        return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
    }

    if (events.length === 0) {
        return <div className="p-8 text-center text-gray-500">등록된 이벤트가 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="이벤트 제목 또는 설명 검색..."
            />

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목/설명</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {event.imageUrls && event.imageUrls.length > 0 ? (
                                        <img src={event.imageUrls[0]} alt={event.title} className="h-16 w-16 object-cover rounded-lg" />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            No Img
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        Lat: {event.latitude}, Lon: {event.longitude}
                                        {event.place && ` (${event.place})`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {(event.eventTypes || []).map(type => (
                                            <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
                                                <Tag className="w-3 h-3 mr-1" /> {type}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <div className="flex flex-col">
                                            <span>{event.startDateTime ? new Date(event.startDateTime).toLocaleDateString() : '-'}</span>
                                            <span className="text-xs">~ {event.endDateTime ? new Date(event.endDateTime).toLocaleDateString() : '-'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(event)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => event.id && handleDelete(event.id)}
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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalElements={totalElements}
                onPageChange={setPage}
            />

        </div>
    );
}
