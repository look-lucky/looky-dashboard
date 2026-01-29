import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { AdminService } from '../../shared/api/services/AdminService';

interface CommercialAreaUploadProps {
    onSuccess: () => void;
}

export function CommercialAreaUpload({ onSuccess }: CommercialAreaUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setError('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            setFile(null);
            return;
        }
        setError(null);
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            await AdminService.uploadStoreData({ file });
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('업로드 중 오류가 발생했습니다. 파일을 확인해주세요.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {file ? <FileSpreadsheet className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                    </div>

                    {file ? (
                        <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium text-gray-900">파일을 드래그하거나 클릭하여 선택하세요</p>
                            <p className="text-sm text-gray-500 mt-1">지원 형식: .xlsx, .xls</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {file && (
                <div className="flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                업로드 중...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                데이터 업로드
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
