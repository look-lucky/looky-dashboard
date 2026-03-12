import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../shared/lib/auth/authStore';
import { getRefreshDelayMs, isTokenExpired, refreshAccessToken } from '../../shared/lib/auth/tokenSession';

export function AuthSessionManager() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAuthReady = useAuthStore((state) => state.setAuthReady);
    const bootstrappedRef = useRef(false);
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (bootstrappedRef.current) {
            return;
        }

        bootstrappedRef.current = true;

        const bootstrapAuth = async () => {
            try {
                if (!accessToken || isTokenExpired(accessToken, 30)) {
                    await refreshAccessToken();
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
    }, [accessToken, setAuthReady]);

    useEffect(() => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }

        if (!accessToken) {
            return;
        }

        const delayMs = getRefreshDelayMs(accessToken, 60);

        if (delayMs === 0) {
            void refreshAccessToken().catch(() => undefined);
            return;
        }

        refreshTimerRef.current = setTimeout(() => {
            void refreshAccessToken().catch(() => undefined);
        }, delayMs);

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
        };
    }, [accessToken]);

    return null;
}
