import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UniversityService } from '../../shared/api/services/UniversityService';
import type { UniversityResponse } from '../../shared/api/models/UniversityResponse';

interface UniversityModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: UniversityResponse | null;
}

export function UniversityModal({ onClose, onSuccess, initialData }: UniversityModalProps) {
    const [name, setName] = useState('');
    const [emailDomain, setEmailDomain] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEmailDomain(initialData.emailDomain || '');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !emailDomain) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            if (initialData && initialData.id) {
                await UniversityService.updateUniversity(initialData.id, {
                    name,
                    emailDomain
                });
                alert('수정되었습니다.');
            } else {
                await UniversityService.createUniversity({
                    name,
                    emailDomain
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '대학 정보 수정' : '대학 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">대학명 *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="예: 한국대학교"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일 도메인 *</label>
                        <input
                            type="text"
                            value={emailDomain}
                            onChange={(e) => setEmailDomain(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="예: korea.ac.kr"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">학생 인증 시 사용되는 이메일 도메인입니다.</p>
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
