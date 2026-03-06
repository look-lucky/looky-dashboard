import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './services/AuthService';
import { OpenAPI } from './core/OpenAPI';
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

// 실패한 요청들을 큐에 담는 함수
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
    // Response Interceptor
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequestConfig | undefined;

            // originalRequest가 없으면 에러 반환
            if (!originalRequest) {
                return Promise.reject(error);
            }

            // 401 에러이고, 이미 재시도한 요청이 아니고, 로그인/리프레시 요청이 아닌 경우
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url?.includes('/login') &&
                !originalRequest.url?.includes('/refresh')
            ) {
                if (isRefreshing) {
                    // 이미 리프레시 중이라면 큐에 담음
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
                    // 리프레시 토큰 요청
                    const response = await AuthService.refresh();

                    if (response.isSuccess && response.data?.accessToken) {
                        const { accessToken } = response.data;

                        // 토큰 저장 및 상태 업데이트
                        OpenAPI.TOKEN = accessToken;
                        useAuthStore.getState().login(accessToken);

                        // 오리지널 요청 헤더 업데이트
                        originalRequest.headers = originalRequest.headers ?? {};
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        // 큐 처리
                        processQueue(undefined, accessToken);

                        // 원래 요청 재시도
                        return axios(originalRequest);
                    }

                    throw new Error('Token refresh failed');
                } catch (refreshError: unknown) {
                    // 리프레시 실패 시 로그아웃 및 큐 에러 처리
                    processQueue(refreshError, null);
                    useAuthStore.getState().logout();
                    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};