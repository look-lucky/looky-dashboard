import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminUniversityService } from '../../shared/api/services/AdminUniversityService';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';
import type { UpdateUniversityRequest } from '../../shared/api/models/UpdateUniversityRequest';
import { ModalWrapper, ModalFooter } from '../../shared/components/ModalWrapper';

interface UniversityModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: UniversityResponse | null;
}

export function UniversityModal({ onClose, onSuccess, initialData }: UniversityModalProps) {
    const [name, setName] = useState('');
    const [emailDomains, setEmailDomains] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEmailDomains(initialData.emailDomains && initialData.emailDomains.length > 0 ? initialData.emailDomains : ['']);
            return;
        }

        setName('');
        setEmailDomains(['']);
    }, [initialData]);

    const handleDomainChange = (index: number, value: string) => {
        setEmailDomains((prev) => prev.map((domain, domainIndex) => (
            domainIndex === index ? value : domain
        )));
    };

    const handleAddDomain = () => {
        setEmailDomains((prev) => [...prev, '']);
    };

    const handleRemoveDomain = (index: number) => {
        setEmailDomains((prev) => (
            prev.length === 1 ? [''] : prev.filter((_, domainIndex) => domainIndex !== index)
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const domains = emailDomains.map((domain) => domain.trim()).filter((domain) => domain.length > 0);

        if (!name || domains.length === 0) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            if (initialData && initialData.id) {
                const payload = {
                    name,
                    emailDomains: domains,
                } as unknown as UpdateUniversityRequest;
                await AdminUniversityService.updateUniversity2(initialData.id, payload);
                alert('수정되었습니다.');
            } else {
                await AdminUniversityService.createUniversity({
                    name,
                    emailDomains: domains,
                });
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
        <ModalWrapper title={initialData ? '대학 정보 수정' : '대학 등록'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">대학명 *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="예: 고려대학교"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일 도메인 *</label>
                    <div className="space-y-2">
                        {emailDomains.map((emailDomain, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={emailDomain}
                                    onChange={(e) => handleDomainChange(index, e.target.value)}
                                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="예: korea.ac.kr"
                                    required={index === 0}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddDomain}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                    aria-label="도메인 추가"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDomain(index)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="도메인 삭제"
                                    disabled={emailDomains.length === 1}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">도메인은 한 칸에 하나씩 입력하고, 여러 개면 추가 버튼으로 계속 늘릴 수 있습니다.</p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <ModalFooter
                        onClose={onClose}
                        loading={loading}
                        submitType="submit"
                        submitText={initialData ? '수정하기' : '등록하기'}
                    />
                </div>
            </form>
        </ModalWrapper>
    );
}
