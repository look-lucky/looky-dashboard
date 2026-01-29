import { Edit2, Trash2, School } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UniversityService } from '../../shared/api/services/UniversityService';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';

interface UniversityListProps {
    refreshTrigger: number;
    onEdit: (university: UniversityResponse) => void;
    onSelect?: (university: UniversityResponse) => void;
    selectedId?: number;
}

export function UniversityList({ refreshTrigger, onEdit, onSelect, selectedId }: UniversityListProps) {
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUniversities();
    }, [refreshTrigger]);

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const response = await UniversityService.getUniversities();
            if (response.data) {
                setUniversities(response.data);
                // Auto-select first one if none selected and onSelect provided? 
                // Let's leave that to parent if desired.
            }
        } catch (error) {
            console.error('Failed to fetch universities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까? 관련 데이터가 모두 삭제될 수 있습니다.')) return;

        try {
            await UniversityService.deleteUniversity(id);
            fetchUniversities();
        } catch (error) {
            console.error(error);
            alert('대학 삭제에 실패했습니다.');
        }
    };

    if (loading && universities.length === 0) {
        return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
    }

    if (universities.length === 0) {
        return <div className="p-8 text-center text-gray-500">등록된 대학이 없습니다.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대학명</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도메인</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {universities.map((uni) => (
                        <tr
                            key={uni.id}
                            onClick={() => onSelect && onSelect(uni)}
                            className={`transition-colors cursor-pointer ${selectedId === uni.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${selectedId === uni.id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <School className="w-4 h-4" />
                                    </div>
                                    <div className="ml-3">
                                        <div className={`text-sm font-medium ${selectedId === uni.id ? 'text-blue-900' : 'text-gray-900'
                                            }`}>{uni.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">@{uni.emailDomain}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(uni); }}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); uni.id && handleDelete(uni.id); }}
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
    );
}
