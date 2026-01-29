import { useState } from 'react';
import { StoreClaimList } from '../features/reviews/StoreClaimList';
import clsx from 'clsx';

export function StoreReviewPage() {
    const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">가게 점유 심사</h1>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('PENDING')}
                        className={clsx(
                            activeTab === 'PENDING'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                        )}
                        aria-current={activeTab === 'PENDING' ? 'page' : undefined}
                    >
                        심사 대기
                    </button>
                    <button
                        onClick={() => setActiveTab('APPROVED')}
                        className={clsx(
                            activeTab === 'APPROVED'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                        )}
                        aria-current={activeTab === 'APPROVED' ? 'page' : undefined}
                    >
                        심사 승인
                    </button>
                    <button
                        onClick={() => setActiveTab('REJECTED')}
                        className={clsx(
                            activeTab === 'REJECTED'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                        )}
                        aria-current={activeTab === 'REJECTED' ? 'page' : undefined}
                    >
                        심사 반려
                    </button>
                </nav>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <StoreClaimList status={activeTab} />
            </div>
        </div>
    );
}
