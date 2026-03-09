import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAPI } from '../../api/core/OpenAPI';
import { AuthService } from '../../api/services/AuthService';
import { jwtDecode } from 'jwt-decode';

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
    sessionExpired: boolean;
    login: (token: string) => void;
    logout: () => void;
    markSessionExpired: () => void;
    clearSessionExpired: () => void;
    refreshAccessToken: () => Promise<string | null>;
}

const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;
let refreshTimer: number | null = null;

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
            sessionExpired: false,
            login: (token: string) => {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    set({
                        accessToken: token,
                        isAuthenticated: true,
                        role: decoded.role,
                        sessionExpired: false,
                    });
                    OpenAPI.TOKEN = token;
                    scheduleAccessTokenRefresh(token);
                } catch (error) {
                    console.error("Invalid token:", error);
                }
            },
            logout: () => {
                clearRefreshTimer();
                set({ accessToken: null, isAuthenticated: false, role: null, sessionExpired: false });
                OpenAPI.TOKEN = undefined;
            },
            markSessionExpired: () => {
                clearRefreshTimer();
                set({ sessionExpired: true });
                OpenAPI.TOKEN = undefined;
            },
            clearSessionExpired: () => set({ sessionExpired: false }),
            refreshAccessToken: async () => {
                try {
                    const response = await AuthService.refresh();
                    const nextToken = response.data?.accessToken;

                    if (response.isSuccess && nextToken) {
                        get().login(nextToken);
                        return nextToken;
                    }

                    throw new Error('Token refresh failed');
                } catch (error) {
                    console.error('Access token refresh failed:', error);
                    get().markSessionExpired();
                    return null;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
            }),
            onRehydrateStorage: () => (state) => {
                if (state?.accessToken) {
                    OpenAPI.TOKEN = state.accessToken;
                    scheduleAccessTokenRefresh(state.accessToken);
                }
            }
        }
    )
);

// Initialize token from storage if exists
const storage = localStorage.getItem('auth-storage');
if (storage) {
    const parsed = JSON.parse(storage);
    const token = parsed.state?.accessToken;
    if (token) {
        OpenAPI.TOKEN = token;
        scheduleAccessTokenRefresh(token);
    }
}
