import { StoreClaimList } from '../features/commercial-area/StoreClaimList';

export function StoreReviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">가게 점유 심사</h1>
            </div>

            <StoreClaimList />
        </div>
    );
}
