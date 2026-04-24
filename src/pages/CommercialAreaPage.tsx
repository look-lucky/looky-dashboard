import { useState } from 'react';
import { toast } from 'sonner';
import { CommercialAreaUpload } from '../features/commercial-area/CommercialAreaUpload';
import { StoreManualRegistrationModal } from '../features/commercial-area/StoreManualRegistrationModal';
import { StoreList } from '../features/commercial-area/StoreList';

import { Plus } from 'lucide-react';
import { useUniversity } from '../shared/contexts/UniversityContext';

export function CommercialAreaPage() {
    const { selectedUniversityId } = useUniversity();
    const [showManualModal, setShowManualModal] = useState(false);

    const handleUploadSuccess = () => {
        toast.success('업로드가 성공적으로 완료되었습니다.');
    };

    if (!selectedUniversityId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                상권을 관리할 대학을 선택해주세요.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">기초 상권 관리</h1>
                <button
                    onClick={() => setShowManualModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    가게 개별 등록
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상권 데이터 엑셀 업로드</h2>
                <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                    <p className="font-medium mb-1">📢 엑셀 업로드 안내</p>
                    <p>상권 분석 데이터와 상점 정보를 포함한 엑셀 파일을 업로드해주세요.</p>
                    <p>업로드가 완료되면 데이터가 즉시 반영됩니다.</p>
                </div>
                {/* TODO: If upload needs universityId, pass it here */}
                <CommercialAreaUpload onSuccess={handleUploadSuccess} />
            </div>



            {/* Store List Section */}
            <StoreList universityId={selectedUniversityId} />

            {showManualModal && (
                <StoreManualRegistrationModal onClose={() => setShowManualModal(false)} />
            )}
        </div>
    );
}
