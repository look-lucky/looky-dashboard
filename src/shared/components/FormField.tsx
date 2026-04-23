import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const INPUT_CLASS = 'w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm';

interface FormFieldProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );
}

type FormInputProps = {
    label: string;
    fieldClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ label, fieldClassName, className, ...props }: FormInputProps) {
    return (
        <FormField label={label} className={fieldClassName}>
            <input className={className || INPUT_CLASS} {...props} />
        </FormField>
    );
}

type FormTextareaProps = {
    label: string;
    fieldClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ label, fieldClassName, className, ...props }: FormTextareaProps) {
    return (
        <FormField label={label} className={fieldClassName}>
            <textarea className={className || INPUT_CLASS} {...props} />
        </FormField>
    );
}

type FormSelectProps = {
    label: string;
    fieldClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({ label, fieldClassName, className, children, ...props }: FormSelectProps) {
    return (
        <FormField label={label} className={fieldClassName}>
            <select className={className || `${INPUT_CLASS} bg-white`} {...props}>
                {children}
            </select>
        </FormField>
    );
}
