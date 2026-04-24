import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface ImageDropZoneProps {
    onFiles: (files: File[]) => void;
    label?: string;
    accept?: string;
    hint?: string;
    className?: string;
    multiple?: boolean;
}

export function ImageDropZone({
    onFiles,
    label = '이미지 추가',
    accept = 'image/*',
    hint,
    className = 'w-40 h-20',
    multiple = false,
}: ImageDropZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const imageFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (imageFiles.length > 0) onFiles(multiple ? imageFiles : [imageFiles[0]]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFiles(Array.from(e.target.files));
        }
        if (e.target) e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500 ${className}`}
            >
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">{label}</span>
                {hint && <span className="text-xs text-gray-300 mt-0.5">{hint}</span>}
            </div>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
            />
        </>
    );
}
