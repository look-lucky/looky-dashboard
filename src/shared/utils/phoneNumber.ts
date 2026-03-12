const NON_DIGIT_REGEX = /\D/g;

export function extractPhoneDigits(value: string): string {
    return value.replace(NON_DIGIT_REGEX, '');
}

export function formatKoreanPhoneNumber(value: string): string {
    const digits = extractPhoneDigits(value);

    if (!digits) {
        return '';
    }

    if (digits.startsWith('02')) {
        const trimmed = digits.slice(0, 10);

        if (trimmed.length <= 2) {
            return trimmed;
        }

        if (trimmed.length <= 5) {
            return `${trimmed.slice(0, 2)}-${trimmed.slice(2)}`;
        }

        if (trimmed.length <= 9) {
            return `${trimmed.slice(0, 2)}-${trimmed.slice(2, trimmed.length - 4)}-${trimmed.slice(-4)}`;
        }

        return `${trimmed.slice(0, 2)}-${trimmed.slice(2, 6)}-${trimmed.slice(6)}`;
    }

    if (/^050\d/.test(digits)) {
        const trimmed = digits.slice(0, 12);

        if (trimmed.length <= 4) {
            return trimmed;
        }

        if (trimmed.length <= 8) {
            return `${trimmed.slice(0, 4)}-${trimmed.slice(4)}`;
        }

        if (trimmed.length <= 11) {
            return `${trimmed.slice(0, 4)}-${trimmed.slice(4, trimmed.length - 4)}-${trimmed.slice(-4)}`;
        }

        return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 8)}-${trimmed.slice(8)}`;
    }

    if (/^1\d{3}/.test(digits)) {
        const trimmed = digits.slice(0, 8);

        if (trimmed.length <= 4) {
            return trimmed;
        }

        return `${trimmed.slice(0, 4)}-${trimmed.slice(4)}`;
    }

    const trimmed = digits.slice(0, 11);

    if (trimmed.length <= 3) {
        return trimmed;
    }

    if (trimmed.length <= 6) {
        return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    }

    if (trimmed.length <= 10) {
        return `${trimmed.slice(0, 3)}-${trimmed.slice(3, trimmed.length - 4)}-${trimmed.slice(-4)}`;
    }

    return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
}
