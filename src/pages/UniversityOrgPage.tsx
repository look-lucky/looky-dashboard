import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { UniversityList } from '../features/universities/UniversityList';
import { UniversityModal } from '../features/universities/UniversityModal';
import { OrganizationList } from '../features/organizations/OrganizationList';
import { OrganizationModal } from '../features/organizations/OrganizationModal';
import { CreateOrganizationRequest } from '../shared/api/models/CreateOrganizationRequest';
import { PublicUniversityService } from '../shared/api/services/PublicUniversityService';
import type { UniversityResponse } from '../shared/api/models/UniversityResponse';
import type { OrganizationResponse } from '../shared/api/models/OrganizationResponse';

type ActiveTab = 'university' | 'organization';
type CategoryFilter = 'ALL' | 'COLLEGE' | 'DEPARTMENT' | 'UNIVERSITY_COUNCIL' | 'CLUB_ASSOCIATION';

export function UniversityOrgPage() {
    // Tab State
    const [activeTab, setActiveTab] = useState<ActiveTab>('university');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
    const [selectedCollege, setSelectedCollege] = useState<OrganizationResponse | null>(null);

    // University State
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null);
    const [showUniModal, setShowUniModal] = useState(false);
    const [uniRefreshTrigger, setUniRefreshTrigger] = useState(0);
    const [editingUniversity, setEditingUniversity] = useState<UniversityResponse | null>(null);

    // Organization State
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [orgRefreshTrigger, setOrgRefreshTrigger] = useState(0);
    const [editingOrg, setEditingOrg] = useState<OrganizationResponse | null>(null);

    // University Handlers
    const handleUniEdit = (university: UniversityResponse) => {
        setEditingUniversity(university);
        setShowUniModal(true);
    };

    const handleUniCreate = () => {
        setEditingUniversity(null);
        setShowUniModal(true);
    };

    const handleUniSuccess = () => {
        setShowUniModal(false);
        setUniRefreshTrigger(prev => prev + 1);
    };

    const handleUniSelect = (university: UniversityResponse) => {
        setSelectedUniversity(university);
    };

    // Organization Handlers
    const handleOrgEdit = (org: OrganizationResponse) => {
        setEditingOrg(org);
        setShowOrgModal(true);
    };

    const handleOrgCreate = () => {
        if (!selectedUniversity?.id) {
            toast.error('먼저 대학을 선택해주세요.');
            return;
        }
        setEditingOrg(null);
        setShowOrgModal(true);
    };

    const handleOrgSuccess = () => {
        setShowOrgModal(false);
        setOrgRefreshTrigger(prev => prev + 1);
    };

    const handleCategoryChange = (cat: CategoryFilter) => {
        setCategoryFilter(cat);
        setSelectedCollege(null);
    };

    const categoryButtons: { key: CategoryFilter; label: string }[] = [
        { key: 'ALL', label: '전체' },
        { key: 'COLLEGE', label: '단과대학' },
        { key: 'DEPARTMENT', label: '학과' },
        { key: 'UNIVERSITY_COUNCIL', label: '총학생회' },
        { key: 'CLUB_ASSOCIATION', label: '총동아리연합회' },
    ];

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900 shrink-0">대학 및 소속 관리</h1>

            {/* Tab Bar */}
            <div className="border-b border-gray-200 shrink-0">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('university')}
                        className={clsx(
                            activeTab === 'university'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                        )}
                        aria-current={activeTab === 'university' ? 'page' : undefined}
                    >
                        대학 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('organization')}
                        className={clsx(
                            activeTab === 'organization'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                        )}
                        aria-current={activeTab === 'organization' ? 'page' : undefined}
                    >
                        소속 관리
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'university' && (
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                        <h2 className="font-semibold text-gray-900">대학 목록</h2>
                        <button
                            onClick={handleUniCreate}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                        >
                            <Plus className="w-4 h-4" />
                            대학 등록
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <UniversityList
                            refreshTrigger={uniRefreshTrigger}
                            onEdit={handleUniEdit}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'organization' && (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* University selector + Category filter */}
                    <div className="flex flex-col gap-3 shrink-0 mb-4">
                        {/* University selector */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 shrink-0">대학 선택</label>
                                <div className="flex-1">
                                    <UniversitySelector
                                        selected={selectedUniversity}
                                        onSelect={handleUniSelect}
                                        refreshTrigger={uniRefreshTrigger}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category filter */}
                        {selectedUniversity && (
                            <div className="flex items-center gap-2">
                                {categoryButtons.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => handleCategoryChange(key)}
                                        className={clsx(
                                            'px-3 py-1.5 text-sm rounded-lg transition-colors border',
                                            categoryFilter === key
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Organization Content */}
                    {!selectedUniversity?.id ? (
                        <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500">
                            관리할 대학을 선택해주세요.
                        </div>
                    ) : categoryFilter === 'DEPARTMENT' ? (
                        /* Department view: left panel (colleges) + right panel (departments) */
                        <div className="flex-1 flex gap-4 min-h-0">
                            {/* Left: College list */}
                            <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200 bg-gray-50 shrink-0">
                                    <h3 className="font-semibold text-sm text-gray-900">단과대학</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <OrganizationList
                                        universityId={selectedUniversity.id}
                                        refreshTrigger={orgRefreshTrigger}
                                        onEdit={handleOrgEdit}
                                        categoryFilter="COLLEGE"
                                        collegeSelectMode
                                        selectedCollegeId={selectedCollege?.id}
                                        onCollegeSelect={setSelectedCollege}
                                    />
                                </div>
                            </div>

                            {/* Right: Department list */}
                            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm text-gray-900">학과 목록</h3>
                                        {selectedCollege && (
                                            <span className="text-xs text-gray-500">
                                                - {selectedCollege.name}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleOrgCreate}
                                        disabled={!selectedCollege}
                                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        학과 등록
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    {selectedCollege?.id ? (
                                        <OrganizationList
                                            universityId={selectedUniversity.id}
                                            refreshTrigger={orgRefreshTrigger}
                                            onEdit={handleOrgEdit}
                                            categoryFilter="DEPARTMENT"
                                            parentIdFilter={selectedCollege.id}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                            왼쪽에서 단과대학을 선택해주세요.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Normal list view (ALL, COLLEGE, STUDENT_COUNCIL) */
                        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                                <h2 className="font-semibold text-gray-900">소속 목록</h2>
                                <button
                                    onClick={handleOrgCreate}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    {categoryFilter === 'COLLEGE' ? '단과대학 등록' :
                                        categoryFilter === 'UNIVERSITY_COUNCIL' ? '총학생회 등록' :
                                            categoryFilter === 'CLUB_ASSOCIATION' ? '총동아리연합회 등록' :
                                                '소속 등록'}
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <OrganizationList
                                    universityId={selectedUniversity.id}
                                    refreshTrigger={orgRefreshTrigger}
                                    onEdit={handleOrgEdit}
                                    categoryFilter={categoryFilter === 'ALL' ? undefined : categoryFilter}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* University Modal */}
            {showUniModal && (
                <UniversityModal
                    onClose={() => setShowUniModal(false)}
                    onSuccess={handleUniSuccess}
                    initialData={editingUniversity}
                />
            )}

            {/* Organization Modal */}
            {showOrgModal && selectedUniversity?.id && (
                <OrganizationModal
                    universityId={selectedUniversity.id}
                    onClose={() => setShowOrgModal(false)}
                    onSuccess={handleOrgSuccess}
                    initialData={editingOrg}
                    defaultCategory={
                        categoryFilter === 'COLLEGE' ? CreateOrganizationRequest.category.COLLEGE :
                            categoryFilter === 'DEPARTMENT' ? CreateOrganizationRequest.category.DEPARTMENT :
                                categoryFilter === 'UNIVERSITY_COUNCIL' ? CreateOrganizationRequest.category.UNIVERSITY_COUNCIL :
                                    categoryFilter === 'CLUB_ASSOCIATION' ? CreateOrganizationRequest.category.CLUB_ASSOCIATION :
                                        undefined
                    }
                    defaultParentId={categoryFilter === 'DEPARTMENT' && !editingOrg && selectedCollege?.id ? selectedCollege.id : undefined}
                    fixedCategory={categoryFilter !== 'ALL' && !editingOrg}
                    fixedParentId={categoryFilter === 'DEPARTMENT' && !!selectedCollege && !editingOrg}
                />
            )}
        </div>
    );
}

/* Inline University Selector dropdown component */
function UniversitySelector({
    selected,
    onSelect,
    refreshTrigger,
}: {
    selected: UniversityResponse | null;
    onSelect: (uni: UniversityResponse) => void;
    refreshTrigger: number;
}) {
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await PublicUniversityService.getUniversities();
                if (response.data) {
                    setUniversities(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch universities', error);
            }
        })();
    }, [refreshTrigger]);

    return (
        <select
            value={selected?.id ?? ''}
            onChange={(e) => {
                const uni = universities.find(u => u.id === Number(e.target.value));
                if (uni) onSelect(uni);
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
            <option value="">대학을 선택하세요</option>
            {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                    {uni.name}
                </option>
            ))}
        </select>
    );
}
