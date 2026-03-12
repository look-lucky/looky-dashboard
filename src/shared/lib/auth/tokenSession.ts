import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../api/services/AuthService';
import { OpenAPI } from '../../api/core/OpenAPI';
import { useAuthStore } from './authStore';

interface DecodedToken {
    role: string;
    sub: string;
    username: string;
    type: string;
    exp: number;
    iat: number;
}

let refreshPromise: Promise<string> | null = null;

export const decodeAccessToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export const isTokenExpired = (token: string, skewSeconds = 0): boolean => {
    const decoded = decodeAccessToken(token);

    if (!decoded?.exp) {
        return true;
    }

    return decoded.exp <= Math.floor(Date.now() / 1000) + skewSeconds;
};

export const getRefreshDelayMs = (token: string, skewSeconds = 60): number => {
    const decoded = decodeAccessToken(token);

    if (!decoded?.exp) {
        return 0;
    }

    return Math.max(decoded.exp * 1000 - Date.now() - skewSeconds * 1000, 0);
};

export const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = AuthService.refresh()
        .then((response) => {
            const accessToken = response.data?.accessToken;

            if (!response.isSuccess || !accessToken) {
                throw new Error('Token refresh failed');
            }

            OpenAPI.TOKEN = accessToken;
            useAuthStore.getState().login(accessToken);
            return accessToken;
        })
        .catch((error) => {
            useAuthStore.getState().logout();
            throw error;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};
