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
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            isAuthenticated: false,
            role: null,
            login: (token: string) => {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    set({ accessToken: token, isAuthenticated: true, role: decoded.role });
                    OpenAPI.TOKEN = token;
                } catch (error) {
                    console.error("Invalid token:", error);
                }
            },
            logout: () => {
                set({ accessToken: null, isAuthenticated: false, role: null });
                OpenAPI.TOKEN = undefined;
            },
        }),
        {
            name: 'auth-storage',
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
        // Optionally re-decode or rely on persisted role
    }
}
