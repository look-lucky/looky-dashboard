import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AdminOrganizationService } from '../../shared/api/services/AdminOrganizationService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import { CreateOrganizationRequest } from '../../shared/api/models/CreateOrganizationRequest';
import type { UpdateOrganizationRequest } from '../../shared/api/models/UpdateOrganizationRequest';
import type { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';
import { FormField } from '../../shared/components/FormField';

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
            toast.error('유형을 선택해주세요.');
            return;
        }

        if (isBulk) {
            if (!bulkNames.trim()) {
                toast.error('등록할 이름을 입력해주세요.');
                return;
            }
        } else {
            if (!name) {
                toast.error('이름을 입력해주세요.');
                return;
            }
        }

        if (category === CreateOrganizationRequest.category.DEPARTMENT && !parentId) {
            toast.error('소속될 단과대학을 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            if (isBulk) {
                const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
                if (names.length === 0) {
                    toast.error('유효한 이름이 없습니다.');
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
                toast.success(`${names.length}건이 등록되었습니다.`);
            } else {
                const payload = {
                    category: category as CreateOrganizationRequest.category,
                    name,
                    parentId: (category === CreateOrganizationRequest.category.DEPARTMENT && parentId) ? Number(parentId) : undefined
                };

                if (initialData && initialData.id) {
                    await AdminOrganizationService.updateOrganization1(initialData.id, payload as unknown as UpdateOrganizationRequest);
                    toast.success('수정되었습니다.');
                } else {
                    await AdminOrganizationService.createOrganization1(universityId, payload);
                    toast.success('등록되었습니다.');
                }
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper title={initialData ? '소속 정보 수정' : '소속 등록'} onClose={onClose}>
                <div className="p-6 space-y-4">
                    <FormField label="유형">
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
                    </FormField>

                    {category === CreateOrganizationRequest.category.DEPARTMENT && (
                        <FormField label="소속 단과대학">
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
                        </FormField>
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

                    <FormField label={isBulk ? '이름 (줄바꿈으로 구분)' : '이름'}>
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
                    </FormField>

                    <div className="pt-4 flex justify-end gap-3">
                        <ModalFooter
                            onClose={onClose}
                            onSubmit={() => handleSubmit()}
                            loading={loading}
                            submitText={initialData ? '수정하기' : '등록하기'}
                        />
                    </div>
                </div>
        </ModalWrapper>
    );
}
