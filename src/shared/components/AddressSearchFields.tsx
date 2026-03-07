import { Search } from 'lucide-react';

interface AddressSearchFieldsProps {
    onOpen: () => void;
    required?: boolean;
    mode?: 'split' | 'single';
    label?: string;
    placeholder?: string;
    roadAddress?: string;
    jibunAddress?: string;
    value?: string;
    helperText?: string;
}

const FIELD_BUTTON_CLASS =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

function HelperText({ text }: { text: string }) {
    return <p className="mt-1 text-xs text-gray-500">{text}</p>;
}

export function AddressSearchFields({
    onOpen,
    required = false,
    mode = 'split',
    label,
    placeholder = '클릭해서 주소를 검색하세요',
    roadAddress,
    jibunAddress,
    value,
    helperText,
}: AddressSearchFieldsProps) {
    if (mode === 'single') {

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label || '주소 검색'}{required ? ' *' : ''}
                </label>
                <button
                    type="button"
                    onClick={onOpen}
                    className={`${FIELD_BUTTON_CLASS} flex items-center justify-between gap-3 text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}
                >
                    <span className="truncate">{value || placeholder}</span>
                    <Search className="h-4 w-4 shrink-0 text-blue-600" />
                </button>
            </div>
        );
    }

    const hasAddress = Boolean(roadAddress || jibunAddress);

    if (!hasAddress) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label || '주소 검색'}{required ? ' *' : ''}
                </label>
                <button
                    type="button"
                    onClick={onOpen}
                    className={`${FIELD_BUTTON_CLASS} flex items-center justify-between gap-3 text-sm text-gray-500`}
                >
                    <span>{placeholder}</span>
                    <Search className="h-4 w-4 text-blue-600" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    도로명 주소{required ? ' *' : ''}
                </label>
                <button
                    type="button"
                    onClick={onOpen}
                    className={`${FIELD_BUTTON_CLASS} text-sm text-gray-900`}
                >
                    {roadAddress || '도로명 주소가 없습니다'}
                </button>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지번 주소</label>
                <button
                    type="button"
                    onClick={onOpen}
                    className={`${FIELD_BUTTON_CLASS} text-sm text-gray-900`}
                >
                    {jibunAddress || '지번 주소가 없습니다'}
                </button>
            </div>
        </div>
    );
}
