import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAPI } from '../../api/core/OpenAPI';

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            isAuthenticated: false,
            login: (token: string) => {
                set({ accessToken: token, isAuthenticated: true });
                OpenAPI.TOKEN = token;
            },
            logout: () => {
                set({ accessToken: null, isAuthenticated: false });
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

// Initialize token from storage if exists (handled by persist middleware but good to force init if needed)
const token = localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.accessToken : null;
if (token) {
    OpenAPI.TOKEN = token;
}
