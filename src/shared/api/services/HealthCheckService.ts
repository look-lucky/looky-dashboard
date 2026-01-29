/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthCheckService {
    /**
     * [공통] 서버 헬스 체크
     * 서버가 정상적으로 동작 중인지 확인합니다.
     * @returns any OK
     * @throws ApiError
     */
    public static healthCheck(): CancelablePromise<Record<string, Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
