import { X, Search, Store as StoreIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminPartnershipService } from '../../shared/api/services/AdminPartnershipService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import { AdminStoreService } from '../../shared/api/services/AdminStoreService';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import type { StoreResponse } from '../../shared/api/models/StoreResponse';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';

interface PartnershipCreateModalProps {
    universityId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function PartnershipCreateModal({ universityId, onClose, onSuccess }: PartnershipCreateModalProps) {
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<string>('');

    // Store Search State
    const [keyword, setKeyword] = useState('');
    const [stores, setStores] = useState<StoreResponse[]>([]);
    const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Form State
    const [benefit, setBenefit] = useState('');
    const [startsAt, setStartsAt] = useState('');
    const [endsAt, setEndsAt] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch Organizations
    useEffect(() => {
        async function fetchOrganizations() {
            try {
                const response = await PublicOrganizationService.getOrganizations(universityId);
                if (response.data) {
                    setOrganizations(response.data);
                    if (response.data.length > 0) {
                        setSelectedOrgId(response.data[0].id?.toString() || '');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch organizations', error);
            }
        }
        if (universityId) {
            fetchOrganizations();
        }
    }, [universityId]);

    // Store Search Effect
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (keyword.trim().length < 2) {
                setStores([]);
                return;
            }

            setIsSearching(true);
            try {
                // Assuming page 0, size 5 for search preview
                const response = await AdminStoreService.getStores1(
                    keyword,
                    undefined,
                    universityId,
                    undefined,
                    undefined,
                    0,
                    5
                );
                if (response.data && response.data.content) {
                    setStores(response.data.content);
                }
            } catch (error) {
                console.error('Failed to search stores', error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword]);

    const handleSubmit = async () => {
        if (!selectedStore || !selectedOrgId || !benefit || !startsAt || !endsAt) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            await AdminPartnershipService.createPartnership(
                universityId,
                Number(selectedOrgId),
                {
                    storeId: selectedStore.id!,
                    organizationId: Number(selectedOrgId),
                    benefit,
                    startsAt,
                    endsAt
                }
            );
            alert('제휴가 등록되었습니다.');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('제휴 등록 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            title="제휴 등록"
            onClose={onClose}
            maxWidth="max-w-lg"
            footer={<ModalFooter onClose={onClose} onSubmit={handleSubmit} loading={loading} submitText="등록하기" />}
        >
                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Store Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상점 검색</label>
                        {!selectedStore ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="상점명 검색 (2글자 이상)"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                    </div>
                                )}
                                {stores.length > 0 && (
                                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {stores.map(store => (
                                            <li
                                                key={store.id}
                                                onClick={() => {
                                                    setSelectedStore(store);
                                                    setKeyword('');
                                                    setStores([]);
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            >
                                                <div className="font-medium text-sm text-gray-900">{store.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{store.roadAddress}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <StoreIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-blue-900">{selectedStore.name}</div>
                                        <div className="text-xs text-blue-600/80">{selectedStore.roadAddress}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStore(null)}
                                    className="text-blue-400 hover:text-blue-600 p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Organization Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">대상 조직</label>
                        <select
                            value={selectedOrgId}
                            onChange={(e) => setSelectedOrgId(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value="" disabled>조직을 선택하세요</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>
                                    {org.name} ({org.category})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Benefit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">혜택 내용</label>
                        <textarea
                            rows={3}
                            value={benefit}
                            onChange={(e) => setBenefit(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="예: 모든 메뉴 10% 할인"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                            <input
                                type="date"
                                value={startsAt}
                                onChange={(e) => setStartsAt(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                            <input
                                type="date"
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

        </ModalWrapper>
    );
}
