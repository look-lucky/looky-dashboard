import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrganizationService } from '../../shared/api/services/OrganizationService';
import { CreateOrganizationRequest } from '../../shared/api/models/CreateOrganizationRequest';
import { UpdateOrganizationRequest } from '../../shared/api/models/UpdateOrganizationRequest';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';

interface OrganizationModalProps {
    universityId: number;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: OrganizationResponse | null;
    defaultCategory?: CreateOrganizationRequest.category;
    defaultParentId?: number;
}

export function OrganizationModal({ universityId, onClose, onSuccess, initialData, defaultCategory, defaultParentId }: OrganizationModalProps) {
    const [category, setCategory] = useState<CreateOrganizationRequest.category>(
        defaultCategory || CreateOrganizationRequest.category.DEPARTMENT
    );
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState<string>(defaultParentId ? String(defaultParentId) : '');
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<OrganizationResponse[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            // Mapping response category to request category enum
            if (initialData.category) {
                setCategory(initialData.category as unknown as CreateOrganizationRequest.category);
            }
            // if initialData has parentId, set it here
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((initialData as any).parentId) {
                setParentId(String((initialData as any).parentId));
            }
        }
    }, [initialData]);

    // Fetch colleges when modal opens
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await OrganizationService.getOrganizations(universityId);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (category === CreateOrganizationRequest.category.DEPARTMENT && !parentId) {
            alert('소속될 단과대학을 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                category,
                name,
                parentId: (category === CreateOrganizationRequest.category.DEPARTMENT && parentId) ? Number(parentId) : undefined
            };

            if (initialData && initialData.id) {
                await OrganizationService.updateOrganization(initialData.id, payload as UpdateOrganizationRequest);
                alert('수정되었습니다.');
            } else {
                await OrganizationService.createOrganization(universityId, payload);
                alert('등록되었습니다.');
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

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value={CreateOrganizationRequest.category.COLLEGE}>단과대학</option>
                            <option value={CreateOrganizationRequest.category.DEPARTMENT}>학과</option>
                            <option value={CreateOrganizationRequest.category.STUDENT_COUNCIL}>학생회(총학생회/총동아리연합회 등)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder={category === 'DEPARTMENT' ? "예: 컴퓨터공학과" : "예: 공과대학 or 총학생회"}
                            required
                        />
                    </div>

                    {category === CreateOrganizationRequest.category.DEPARTMENT && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">소속 단과대학</label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
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

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                        >
                            {loading ? '처리중...' : (initialData ? '수정하기' : '등록하기')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
