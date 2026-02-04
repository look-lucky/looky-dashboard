import { Edit2, Trash2, Calendar, MapPin, Tag, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EventService } from '../../shared/api/services/EventService';
import { AdminEventService } from '../../shared/api/services/AdminEventService';
import type { EventResponse } from '../../shared/api/models/EventResponse';

interface EventListProps {
    refreshTrigger: number;
    onEdit: (event: EventResponse) => void;
}

export function EventList({ refreshTrigger, onEdit }: EventListProps) {
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger, page]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await EventService.getEvents({ page, size: 10 });
            if (response.data) {
                setEvents(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
            // Fallback for demo if API fails or structure is different
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await AdminEventService.deleteEvent(id);
            // Refresh list
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('이벤트 삭제에 실패했습니다.');
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
            <div className="relative">
                <input
                    type="text"
                    placeholder="이벤트 제목 또는 설명 검색..."
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목/설명</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEvents.map((event) => (
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

            {/* Simple Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span className="px-3 py-1">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}
