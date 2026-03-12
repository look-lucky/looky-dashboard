import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAPI } from '../../api/core/OpenAPI';
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
    authReady: boolean;
    login: (token: string) => void;
    logout: () => void;
    setAuthReady: (ready: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            isAuthenticated: false,
            role: null,
            authReady: false,
            login: (token: string) => {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    set({ accessToken: token, isAuthenticated: true, role: decoded.role });
                    OpenAPI.TOKEN = token;
                    return;
                } catch (error) {
                    console.error("Invalid token:", error);
                }

                set({ accessToken: null, isAuthenticated: false, role: null });
            },
            logout: () => {
                set({ accessToken: null, isAuthenticated: false, role: null });
                OpenAPI.TOKEN = undefined;
            },
            setAuthReady: (ready: boolean) => {
                set({ authReady: ready });
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
    }
}
