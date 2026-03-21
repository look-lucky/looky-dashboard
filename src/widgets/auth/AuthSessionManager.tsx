import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../shared/lib/auth/authStore';

export function AuthSessionManager() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAuthReady = useAuthStore((state) => state.setAuthReady);
    const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);
    const bootstrappedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        if (bootstrappedRef.current) {
            return;
        }

        bootstrappedRef.current = true;

        const bootstrapAuth = async () => {
            try {
                if (!accessToken) {
                    await refreshAccessToken({ markSessionExpiredOnFailure: false });
                }
            } catch {
                // Ignore bootstrap refresh errors and let the guard redirect if needed.
            } finally {
                if (!cancelled) {
                    setAuthReady(true);
                }
            }
        };

        void bootstrapAuth();

        return () => {
            cancelled = true;
        };
    }, [accessToken, refreshAccessToken, setAuthReady]);

    return null;
}
