import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminOrganizationService } from '../../shared/api/services/AdminOrganizationService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import { CreateOrganizationRequest } from '../../shared/api/models/CreateOrganizationRequest';
import type { UpdateOrganizationRequest } from '../../shared/api/models/UpdateOrganizationRequest';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';

interface OrganizationModalProps {
    universityId: number;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: OrganizationResponse | null;
    defaultCategory?: CreateOrganizationRequest.category;
    defaultParentId?: number;
    fixedCategory?: boolean;
    fixedParentId?: boolean;
}

export function OrganizationModal({
    universityId,
    onClose,
    onSuccess,
    initialData,
    defaultCategory,
    defaultParentId,
    fixedCategory = false,
    fixedParentId = false
}: OrganizationModalProps) {
    const [category, setCategory] = useState<CreateOrganizationRequest.category | ''>(
        defaultCategory || (initialData?.category as unknown as CreateOrganizationRequest.category) || ''
    );
    const [name, setName] = useState('');
    const [bulkNames, setBulkNames] = useState('');
    const [isBulk, setIsBulk] = useState(false);
    const [parentId, setParentId] = useState<string>(
        defaultParentId ? String(defaultParentId) :
            initialData?.parentId ? String(initialData.parentId) : ''
    );
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<OrganizationResponse[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            if (initialData.category) {
                setCategory(initialData.category as unknown as CreateOrganizationRequest.category);
            }
            if (initialData.parentId) {
                setParentId(String(initialData.parentId));
            }
        }
    }, [initialData]);

    // Fetch colleges when modal opens
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await PublicOrganizationService.getOrganizations(universityId);
                if (response.data) {
                    // Filter only colleges
                    const collegeList = response.data.filter(org => org.category === 'COLLEGE');
                    setColleges(collegeList);
                }
            } catch (error) {
                console.error('Failed to fetch organizations', error);
            }
        };

        if (universityId) {
            fetchOrganizations();
        }
    }, [universityId]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (category === '') {
            alert('유형을 선택해주세요.');
            return;
        }

        if (isBulk) {
            if (!bulkNames.trim()) {
                alert('등록할 이름을 입력해주세요.');
                return;
            }
        } else {
            if (!name) {
                alert('이름을 입력해주세요.');
                return;
            }
        }

        if (category === CreateOrganizationRequest.category.DEPARTMENT && !parentId) {
            alert('소속될 단과대학을 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            if (isBulk) {
                const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
                if (names.length === 0) {
                    alert('유효한 이름이 없습니다.');
                    setLoading(false);
                    return;
                }

                const promises = names.map(n => {
                    const payload = {
                        category: category as CreateOrganizationRequest.category,
                        name: n,
                        parentId: (category === CreateOrganizationRequest.category.DEPARTMENT && parentId) ? Number(parentId) : undefined
                    };
                    return AdminOrganizationService.createOrganization1(universityId, payload);
                });

                await Promise.all(promises);
                alert(`${names.length}건이 등록되었습니다.`);
            } else {
                const payload = {
                    category: category as CreateOrganizationRequest.category,
                    name,
                    parentId: (category === CreateOrganizationRequest.category.DEPARTMENT && parentId) ? Number(parentId) : undefined
                };

                if (initialData && initialData.id) {
                    await AdminOrganizationService.updateOrganization1(initialData.id, payload as unknown as UpdateOrganizationRequest);
                    alert('수정되었습니다.');
                } else {
                    await AdminOrganizationService.createOrganization1(universityId, payload);
                    alert('등록되었습니다.');
                }
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '소속 정보 수정' : '소속 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value as CreateOrganizationRequest.category);
                                // Reset parentId when category changes
                                if (e.target.value !== CreateOrganizationRequest.category.DEPARTMENT) {
                                    setParentId('');
                                }
                            }}
                            disabled={fixedCategory}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            <option value="">유형을 선택하세요</option>
                            <option value={CreateOrganizationRequest.category.UNIVERSITY_COUNCIL}>총학생회</option>
                            <option value={CreateOrganizationRequest.category.COLLEGE}>단과대학</option>
                            <option value={CreateOrganizationRequest.category.DEPARTMENT}>학과</option>
                            <option value={CreateOrganizationRequest.category.CLUB_ASSOCIATION}>총동아리연합회</option>
                        </select>
                    </div>

                    {category === CreateOrganizationRequest.category.DEPARTMENT && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">소속 단과대학</label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                disabled={fixedParentId}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                required={category === CreateOrganizationRequest.category.DEPARTMENT}
                            >
                                <option value="">단과대학 선택</option>
                                {colleges.map((college) => (
                                    <option key={college.id} value={college.id}>
                                        {college.name}
                                    </option>
                                ))}
                            </select>
                            {colleges.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">등록된 단과대학이 없습니다. 단과대학을 먼저 등록해주세요.</p>
                            )}
                        </div>
                    )}

                    {!initialData && (
                        <div className="flex items-center mb-2">
                            <input
                                id="isBulk"
                                type="checkbox"
                                checked={isBulk}
                                onChange={(e) => setIsBulk(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label htmlFor="isBulk" className="ml-2 text-sm font-medium text-gray-900">
                                여러 개 한 번에 등록하기
                            </label>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isBulk ? '이름 (줄바꿈으로 구분)' : '이름'}
                        </label>
                        {isBulk ? (
                            <textarea
                                value={bulkNames}
                                onChange={(e) => setBulkNames(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px]"
                                placeholder={`예:\n컴퓨터공학과\n소프트웨어학과\n인공지능학과`}
                                required
                            />
                        ) : (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="예: 공과대학, 컴퓨터공학과, 총학생회"
                                required
                            />
                        )}
                        {isBulk && (
                            <p className="mt-1 text-xs text-gray-500">
                                한 줄에 하나의 이름을 입력해주세요.
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                        >
                            {loading ? '처리중...' : (initialData ? '수정하기' : '등록하기')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
