import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../lib/auth/authStore';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((pending) => {
        if (error) {
            pending.reject(error);
            return;
        }

        if (token) {
            pending.resolve(token);
            return;
        }

        pending.reject(new Error('Token refresh failed'));
    });

    failedQueue = [];
};

export const setupInterceptors = () => {
    axios.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequestConfig | undefined;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url?.includes('/login') &&
                !originalRequest.url?.includes('/refresh')
            ) {
                if (isRefreshing) {
                    return new Promise<string>((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then((token) => {
                        originalRequest.headers = originalRequest.headers ?? {};
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const accessToken = await useAuthStore.getState().refreshAccessToken();

                    if (!accessToken) {
                        throw new Error('Token refresh failed');
                    }

                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    processQueue(undefined, accessToken);

                    return axios(originalRequest);
                } catch (refreshError: unknown) {
                    processQueue(refreshError, null);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};
