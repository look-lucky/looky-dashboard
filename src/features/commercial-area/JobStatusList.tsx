import { AlertCircle } from 'lucide-react';

interface JobStatusListProps {
    refreshTrigger: number;
}

export function JobStatusList({ }: JobStatusListProps) {
    return (
        <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">업로드 상태</h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <p>
                            현재 파일 업로드 상태 조회 API가 준비 중입니다. 업로드 결과는 잠시 후 상권/상점 목록에서 확인해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
