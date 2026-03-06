import { ArrowUpRight, TrendingUp, Users, Store, Loader2, Clock, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoreClaimService } from '../shared/api/services/StoreClaimService';
import { StoreService } from '../shared/api/services/StoreService';
import { UniversityService } from '../shared/api/services/UniversityService';
import type { StoreClaimResponse } from '../shared/api/models/StoreClaimResponse';

export function HomePage() {
    const [stats, setStats] = useState({
        pendingClaims: 0,
        totalStores: 0,
        totalUniversities: 0,
    });
    const [recentClaims, setRecentClaims] = useState<StoreClaimResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetching of stats
                const [claimsRes, storesRes, uniRes, recentClaimsRes] = await Promise.all([
                    // 1. Pending Claims Count (Page 0, Size 1 is enough to get totalElements)
                    StoreClaimService.getStoreClaims({ page: 0, size: 1 }, 'PENDING'),
                    // 2. Total Stores Count
                    StoreService.getStores({ page: 0, size: 1 }),
                    // 3. Total Universities
                    UniversityService.getUniversities(),
                    // 4. Recent Pending Claims (for list)
                    StoreClaimService.getStoreClaims({ page: 0, size: 5, sort: ['createdAt,desc'] }, 'PENDING')
                ]);

                setStats({
                    pendingClaims: claimsRes.data?.totalElements || 0,
                    totalStores: storesRes.data?.totalElements || 0,
                    totalUniversities: uniRes.data?.length || 0,
                });

                if (recentClaimsRes.data && recentClaimsRes.data.content) {
                    setRecentClaims(recentClaimsRes.data.content);
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl shadow-blue-900/20 text-white">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">환영합니다, 관리자님! 👋</h1>
                    <p className="text-blue-100 max-w-2xl text-lg">
                        Looky 서비스의 현황을 한눈에 확인하고 관리하세요.
                        {stats.pendingClaims > 0 ? (
                            <span> 오늘은 <span className="font-semibold text-white">{stats.pendingClaims}건</span>의 새로운 심사 요청이 있습니다.</span>
                        ) : (
                            <span> 현재 대기 중인 심사 요청이 없습니다.</span>
                        )}
                    </p>

                    <Link to="/reviews" className="mt-6 w-fit px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all active:scale-95 flex items-center text-sm cursor-pointer">
                        심사하러 가기 <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/reviews">
                    <DashboardCard
                        title="심사 대기"
                        value={stats.pendingClaims.toLocaleString()}
                        label="건"
                        icon={TrendingUp}
                        color="text-orange-500"
                        bg="bg-orange-50"
                        footer="처리가 필요한 요청입니다"
                    />
                </Link>
                <Link to="/commercial-areas">
                    <DashboardCard
                        title="등록된 가게"
                        value={stats.totalStores.toLocaleString()}
                        label="개"
                        icon={Store}
                        color="text-emerald-500"
                        bg="bg-emerald-50"
                        footer="전체 등록된 상점 수"
                    />
                </Link>
                <Link to="/universities">
                    <DashboardCard
                        title="제휴 대학"
                        value={stats.totalUniversities.toLocaleString()}
                        label="개교"
                        icon={Users}
                        color="text-violet-500"
                        bg="bg-violet-50"
                        footer="서비스 이용 대학 수"
                    />
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">최근 심사 요청</h3>
                    <Link to="/reviews" className="text-sm text-blue-600 hover:text-blue-800 font-medium">전체보기 &rarr;</Link>
                </div>

                <div className="space-y-4">
                    {recentClaims.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                            최근 접수된 심사 요청이 없습니다.
                        </div>
                    ) : (
                        recentClaims.map((claim) => (
                            <Link key={claim.id} to="/reviews" className="block">
                                <div className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            <span className="font-bold">{claim.storeName}</span> 상점의 소유권 요청이 접수되었습니다.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            요청일: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : '-'}
                                            <span className="mx-2">•</span>
                                            사업자번호: {claim.bizRegNo}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                                        심사하기
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    footer: string;
}

function DashboardCard({ title, value, label, icon: Icon, color, bg, footer }: DashboardCardProps) {
    return (
        <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    <span className="ml-1 text-gray-500 text-sm">{label}</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs font-medium text-gray-400">{footer}</p>
            </div>
        </div>
    );
}