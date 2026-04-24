import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalWrapperProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
    maxHeight?: string;
    onPaste?: (e: React.ClipboardEvent) => void;
}

export function ModalWrapper({
    title,
    onClose,
    children,
    footer,
    maxWidth = 'max-w-md',
    maxHeight = 'max-h-[90vh]',
    onPaste,
}: ModalWrapperProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onPaste={onPaste}
        >
            <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} overflow-hidden flex flex-col ${maxHeight}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100/50 p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {children}

                {footer && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ModalFooterProps {
    onClose: () => void;
    onSubmit?: () => void;
    loading?: boolean;
    submitText?: string;
    cancelText?: string;
    submitType?: 'button' | 'submit';
    submitFormId?: string;
    disabled?: boolean;
    submitIcon?: ReactNode;
}

export function ModalFooter({
    onClose,
    onSubmit,
    loading = false,
    submitText = '등록하기',
    cancelText = '취소',
    submitType = 'button',
    submitFormId,
    disabled = false,
    submitIcon,
}: ModalFooterProps) {
    return (
        <>
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
                {cancelText}
            </button>
            <button
                type={submitType}
                form={submitFormId}
                onClick={submitType === 'button' ? onSubmit : undefined}
                disabled={loading || disabled}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitIcon && !loading && <span className="mr-2">{submitIcon}</span>}
                {loading ? '처리중...' : submitText}
            </button>
        </>
    );
}
