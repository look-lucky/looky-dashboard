import { Outlet } from 'react-router-dom';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { School } from 'lucide-react';

export function UniversityLayout() {
    const { universities, selectedUniversityId, setSelectedUniversityId, isLoading } = useUniversity();

    if (isLoading) {
        return <div className="p-6">Loading universities...</div>;
    }

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <School className="w-5 h-5" />
                        <span>관리할 대학 선택:</span>
                    </div>
                    <select
                        value={selectedUniversityId || ''}
                        onChange={(e) => setSelectedUniversityId(Number(e.target.value))}
                        className="flex-1 max-w-xs py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                        {universities.map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
