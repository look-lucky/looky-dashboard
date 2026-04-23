import { Upload, FileSpreadsheet, Loader2, AlertCircle, Download, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { AdminPartnershipService } from '../../shared/api/services/AdminPartnershipService';
import { PublicOrganizationService } from '../../shared/api/services/PublicOrganizationService';
import { OrganizationResponse } from '../../shared/api/models/OrganizationResponse';
import { useAuthStore } from '../../shared/lib/auth/authStore';
import { OpenAPI } from '../../shared/api/core/OpenAPI';
import axios from 'axios';

interface PartnershipUploadProps {
    universityId: number | null;
    onSuccess: () => void;
}

export function PartnershipUpload({ universityId, onSuccess }: PartnershipUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loadingTemplate, setLoadingTemplate] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | ''>('');
    const [loadingOrgs, setLoadingOrgs] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            if (!universityId) {
                setOrganizations([]);
                setSelectedOrganizationId('');
                return;
            }

            setLoadingOrgs(true);
            try {
                const response = await PublicOrganizationService.getOrganizations(universityId);
                const rawOrgs = response.data || [];
                // 카테고리별 가나다순, 동일 카테고리 내에서는 조직명 가나다순 정렬
                const sortedOrgs = rawOrgs.sort((a, b) => {
                    const catA = a.category || '';
                    const catB = b.category || '';
                    if (catA === catB) {
                        const nameA = a.name || '';
                        const nameB = b.name || '';
                        return nameA.localeCompare(nameB, 'ko');
                    }
                    return catA.localeCompare(catB, 'ko');
                });
                setOrganizations(sortedOrgs);
                setSelectedOrganizationId('');
            } catch (err) {
                console.error('Failed to fetch organizations', err);
                setError('조직 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoadingOrgs(false);
            }
        };

        fetchOrganizations();
    }, [universityId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                setError('엑셀 파일만 가능합니다.');
                return;
            }
            setFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!selectedOrganizationId) {
            setError('조직을 선택해주세요.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            await AdminPartnershipService.uploadPartnershipData(Number(selectedOrganizationId), { file });
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success('업로드가 완료되었습니다.');
            onSuccess();
        } catch (err: any) {
            console.error('Upload Error:', err);
            
            // API에서 발생한 상세 에러 메시지 추출
            const responseData = err.body || err.response?.data;
            const apiMessage = responseData?.data?.message || responseData?.message;
            
            if (apiMessage) {
                setError(apiMessage);
            } else {
                setError('업로드 중 오류가 발생했습니다.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        if (!universityId) {
            toast.error('대학을 선택해주세요.');
            return;
        }

        setLoadingTemplate(true);
        try {
            const token = useAuthStore.getState().accessToken;
            const response = await axios.get(`${OpenAPI.BASE}/api/admin/partnerships/template`, {
                params: { universityId },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
                responseType: 'blob',
            });
            const blobData = new Blob([response.data]);
            const url = window.URL.createObjectURL(blobData);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `partnerships_template_${universityId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to download template', err);
            toast.error('템플릿 다운로드 실패');
        } finally {
            setLoadingTemplate(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleDownloadTemplate}
                    disabled={!universityId || loadingTemplate}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                    {loadingTemplate ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    템플릿 양식 다운로드
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    제휴 등록 대상 조직
                </label>
                <select
                    value={selectedOrganizationId}
                    onChange={(e) => setSelectedOrganizationId(e.target.value ? Number(e.target.value) : '')}
                    disabled={loadingOrgs || !universityId}
                    className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                >
                    <option value="">조직을 선택하세요</option>
                    {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                            {org.name} ({org.category})
                        </option>
                    ))}
                </select>
                {loadingOrgs && <p className="text-xs text-gray-500">조직 목록을 불러오는 중...</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <div
                        className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-md">
                                <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{file ? file.name : '엑셀 파일 선택'}</p>
                                <p className="text-xs text-gray-500">{file ? `${(file.size / 1024).toFixed(1)} KB` : '여기를 클릭하여 파일을 선택하세요.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading || !selectedOrganizationId}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    업로드
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start text-sm text-red-600 mt-2 mb-2">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-wrap flex-1">{error}</span>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    엑셀 작성 팁
                </p>
                <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
                    <li>날짜 입력 시 <strong>yyyy-MM-dd</strong> 형식을 정확히 지켜주세요 (예: 2026-02-08).</li>
                </ul>
            </div>
        </div>
    );
}
