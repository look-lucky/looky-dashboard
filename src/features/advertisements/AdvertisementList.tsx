import { Edit2, Trash2, Calendar, ExternalLink, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AdminAdvertisementService } from '../../shared/api/services/AdminAdvertisementService';
import type { AdminAdvertisementResponse } from '../../shared/api/models/AdminAdvertisementResponse';

type AdvertisementType = 'POPUP' | 'BANNER' | 'FLOATING';
type AdvertisementStatus = 'SCHEDULED' | 'ACTIVE' | 'INACTIVE' | 'ENDED';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import { AdvertisementOrderModal } from './AdvertisementOrderModal';
import { Pagination } from '../../shared/components/Pagination';
import { SearchInput } from '../../shared/components/SearchInput';
import { formatDate } from '../../shared/utils/date';
import { usePaginatedQuery } from '../../shared/hooks/usePaginatedQuery';

interface AdvertisementListProps {
    refreshTrigger: number;
    onEdit: (ad: AdminAdvertisementResponse) => void;
}

const TYPE_LABELS: Record<AdvertisementType, string> = {
    POPUP: '팝업',
    BANNER: '배너',
    FLOATING: '플로팅',
};

const TYPE_COLORS: Record<AdvertisementType, string> = {
    POPUP: 'bg-purple-100 text-purple-800',
    BANNER: 'bg-blue-100 text-blue-800',
    FLOATING: 'bg-green-100 text-green-800',
};

const STATUS_LABELS: Record<AdvertisementStatus, string> = {
    SCHEDULED: '예약',
    ACTIVE: '활성',
    INACTIVE: '비활성',
    ENDED: '종료',
};

const STATUS_COLORS: Record<AdvertisementStatus, string> = {
    SCHEDULED: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    INACTIVE: 'bg-gray-100 text-gray-600',
    ENDED: 'bg-red-100 text-red-700',
};


const AD_STATUSES: { value: '' | AdvertisementStatus; label: string }[] = [
    { value: '', label: '전체 상태' },
    { value: 'SCHEDULED', label: '예약' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'INACTIVE', label: '비활성' },
    { value: 'ENDED', label: '종료' },
];

const TABS: { value: '' | AdvertisementType; label: string }[] = [
    { value: '', label: '전체' },
    { value: 'POPUP', label: '팝업' },
    { value: 'BANNER', label: '배너' },
    { value: 'FLOATING', label: '플로팅' },
];

export function AdvertisementList({ refreshTrigger, onEdit }: AdvertisementListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'' | AdvertisementType>('');
    const [statusFilter, setStatusFilter] = useState<'' | AdvertisementStatus>('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orgUnivMap, setOrgUnivMap] = useState<Record<number, number>>({});
    const fetchedUnivIdsRef = useRef<Set<number>>(new Set());

    const fetchAds = useCallback(
        (page: number, size: number) =>
            AdminAdvertisementService.getAdvertisements({ page, size }, activeTab || undefined, statusFilter || undefined),
        [activeTab, statusFilter],
    );

    const { items: ads, loading, page, setPage, totalPages, totalElements, pageSize, refetch } = usePaginatedQuery<AdminAdvertisementResponse>({
        fetchFn: fetchAds,
        refreshTrigger,
        resetDeps: [activeTab, statusFilter],
    });

    const filteredAds = ads.filter(ad =>
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ads가 바뀌면 targetUniversities 기준으로 org→univ 매핑 fetch
    useEffect(() => {
        const univIds = new Set<number>();
        ads.forEach(ad => (ad.targetUniversities ?? []).forEach(u => univIds.add(u.id!)));
        univIds.forEach(univId => {
            if (fetchedUnivIdsRef.current.has(univId)) return;
            fetchedUnivIdsRef.current.add(univId);
            PublicOrganizationService.getOrganizations(univId)
                .then(res => {
                    const orgs = res.data ?? [];
                    setOrgUnivMap(prev => {
                        const next = { ...prev };
                        orgs.forEach(o => { if (o.id != null) next[o.id] = univId; });
                        return next;
                    });
                })
                .catch(() => { fetchedUnivIdsRef.current.delete(univId); });
        });
    }, [ads]);

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await AdminAdvertisementService.deleteAdvertisement(id);
            void refetch();
        } catch (error) {
            console.error(error);
            toast.error('광고 삭제에 실패했습니다.');
        }
    };

    if (loading && ads.length === 0) {
        return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
    }

    return (
        <div className="space-y-4">
            {/* 탭 */}
            <div className="flex items-center border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                            activeTab === tab.value
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
                {activeTab !== '' && (
                    <button
                        onClick={() => setShowOrderModal(true)}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        순서 관리
                    </button>
                )}
            </div>

            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="광고 제목 검색..."
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as '' | AdvertisementStatus)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                >
                    {AD_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {filteredAds.length === 0 ? (
                <div className="p-8 text-center text-gray-500">등록된 광고가 없습니다.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타겟</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAds.map((ad) => (
                                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {ad.imageUrl ? (
                                            <img
                                                src={ad.imageUrl}
                                                alt={ad.title}
                                                className={`object-cover rounded-lg border ${
                                                    ad.advertisementType === 'FLOATING'
                                                        ? 'w-12 h-12 rounded-full'
                                                        : ad.advertisementType === 'BANNER'
                                                        ? 'w-24 h-10'
                                                        : 'w-16 h-12'
                                                }`}
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                                        {ad.landingUrl && (
                                            <a
                                                href={ad.landingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-0.5 truncate max-w-xs"
                                            >
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                {ad.landingUrl}
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[(ad.advertisementType as AdvertisementType) || 'POPUP']}`}>
                                            {TYPE_LABELS[(ad.advertisementType as AdvertisementType) || 'POPUP']}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[(ad.status as AdvertisementStatus) || 'ACTIVE']}`}>
                                            {STATUS_LABELS[(ad.status as AdvertisementStatus) || 'ACTIVE']}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ad.status === 'ACTIVE' ? ad.displayOrder : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex flex-col gap-1 min-w-[120px]">
                                            {ad.targetUniversities && ad.targetUniversities.length > 0 ? (
                                                ad.targetUniversities.map(u => {
                                                    const univOrgs = (ad.targetOrganizations ?? []).filter(
                                                        o => orgUnivMap[o.id!] === u.id
                                                    );
                                                    return (
                                                        <div key={u.id} className="flex flex-col gap-0.5">
                                                            <span className="font-medium text-gray-700 truncate max-w-[140px]" title={u.name}>
                                                                {u.name}
                                                            </span>
                                                            {univOrgs.map(o => (
                                                                <span key={o.id} className="text-xs text-gray-400 truncate max-w-[140px] pl-2" title={o.name}>
                                                                    └ {o.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-gray-300">전체 대학</span>
                                            )}
                                            <span className="text-xs text-gray-400 mt-0.5">
                                                {String(ad.targetGender) === 'MALE' ? '남성' : String(ad.targetGender) === 'FEMALE' ? '여성' : '전체 성별'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <div className="flex flex-col">
                                                <span>{formatDate(ad.startAt || '')}</span>
                                                <span className="text-xs">~ {formatDate(ad.endAt || '')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(ad)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ad.id!)}
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
            )}

            {showOrderModal && (
                <AdvertisementOrderModal
                    initialType={activeTab || undefined}
                    onClose={() => setShowOrderModal(false)}
                    onSuccess={() => {
                        setShowOrderModal(false);
                        void refetch();
                    }}
                />
            )}

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
