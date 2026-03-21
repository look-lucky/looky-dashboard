import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { OpenAPI } from '../../api/core/OpenAPI';
import { AuthService } from '../../api/services/AuthService';

interface DecodedToken {
    role: string;
    sub: string;
    username: string;
    type: string;
    exp: number;
    iat: number;
}

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    role: string | null;
    authReady: boolean;
    hadAuthenticatedSession: boolean;
    sessionExpired: boolean;
    login: (token: string) => void;
    logout: () => void;
    setAuthReady: (ready: boolean) => void;
    markSessionExpired: () => void;
    clearSessionExpired: () => void;
    refreshAccessToken: (options?: { markSessionExpiredOnFailure?: boolean }) => Promise<string | null>;
}

const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;
let refreshTimer: number | null = null;
let refreshPromise: Promise<string | null> | null = null;

const clearRefreshTimer = () => {
    if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
    }
};

const scheduleAccessTokenRefresh = (token: string) => {
    clearRefreshTimer();

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const expiresAtMs = decoded.exp * 1000;
        const msUntilExpiry = expiresAtMs - Date.now();
        const refreshDelay = Math.max(msUntilExpiry - ACCESS_TOKEN_REFRESH_BUFFER_MS, 0);

        refreshTimer = window.setTimeout(() => {
            void useAuthStore.getState().refreshAccessToken();
        }, refreshDelay);
    } catch (error) {
        console.error('Failed to schedule token refresh:', error);
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            isAuthenticated: false,
            role: null,
            authReady: false,
            hadAuthenticatedSession: false,
            sessionExpired: false,
            login: (token: string) => {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    set({
                        accessToken: token,
                        isAuthenticated: true,
                        role: decoded.role,
                        hadAuthenticatedSession: true,
                        sessionExpired: false,
                    });
                    OpenAPI.TOKEN = token;
                    scheduleAccessTokenRefresh(token);
                    return;
                } catch (error) {
                    console.error('Invalid token:', error);
                }

                set({
                    accessToken: null,
                    isAuthenticated: false,
                    role: null,
                    hadAuthenticatedSession: false,
                    sessionExpired: false,
                });
            },
            logout: () => {
                clearRefreshTimer();
                set({
                    accessToken: null,
                    isAuthenticated: false,
                    role: null,
                    hadAuthenticatedSession: false,
                    sessionExpired: false,
                });
                OpenAPI.TOKEN = undefined;
            },
            setAuthReady: (ready: boolean) => {
                set({ authReady: ready });
            },
            markSessionExpired: () => {
                clearRefreshTimer();
                set({
                    accessToken: null,
                    isAuthenticated: false,
                    role: null,
                    hadAuthenticatedSession: true,
                    sessionExpired: true,
                });
                OpenAPI.TOKEN = undefined;
            },
            clearSessionExpired: () => {
                set({ sessionExpired: false });
            },
            refreshAccessToken: async (options) => {
                const { markSessionExpiredOnFailure = true } = options ?? {};

                if (refreshPromise) {
                    return refreshPromise;
                }

                refreshPromise = AuthService.refresh()
                    .then((response) => {
                        const nextToken = response.data?.accessToken;

                        if (!response.isSuccess || !nextToken) {
                            throw new Error('Token refresh failed');
                        }

                        get().login(nextToken);
                        return nextToken;
                    })
                    .catch((error) => {
                        console.error('Access token refresh failed:', error);
                        if (markSessionExpiredOnFailure) {
                            get().markSessionExpired();
                        }
                        return null;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });

                return refreshPromise;
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
                hadAuthenticatedSession: state.hadAuthenticatedSession,
                sessionExpired: state.sessionExpired,
            }),
            onRehydrateStorage: () => (state) => {
                if (state?.accessToken) {
                    OpenAPI.TOKEN = state.accessToken;
                    scheduleAccessTokenRefresh(state.accessToken);
                    return;
                }

                OpenAPI.TOKEN = undefined;
            },
        }
    )
);

const storage = localStorage.getItem('auth-storage');
if (storage) {
    const parsed = JSON.parse(storage);
    const token = parsed.state?.accessToken;
    if (token) {
        OpenAPI.TOKEN = token;
        scheduleAccessTokenRefresh(token);
    }
}
