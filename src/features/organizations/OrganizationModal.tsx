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
}

export function OrganizationModal({ universityId, onClose, onSuccess, initialData }: OrganizationModalProps) {
    const [category, setCategory] = useState<CreateOrganizationRequest.category>(CreateOrganizationRequest.category.DEPARTMENT);
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            // Mapping response category to request category enum
            if (initialData.category) {
                setCategory(initialData.category as unknown as CreateOrganizationRequest.category);
            }
            // if initialData has parentId, set it here
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert('이름을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                category,
                name,
                parentId: parentId ? Number(parentId) : undefined
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
                            onChange={(e) => setCategory(e.target.value as CreateOrganizationRequest.category)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value={CreateOrganizationRequest.category.COLLEGE}>단과대학</option>
                            <option value={CreateOrganizationRequest.category.DEPARTMENT}>학과</option>
                            <option value={CreateOrganizationRequest.category.STUDENT_COUNCIL}>상위기구(총학/단과대)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="예: 컴퓨터공학과"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상위 조직 ID (선택)</label>
                        <input
                            type="number"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="상위 조직 ID 입력"
                        />
                        <p className="text-xs text-gray-500 mt-1">예: 공과대학(ID:10) 소속인 경우 10 입력</p>
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
