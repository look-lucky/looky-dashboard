/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentOrganizationService {
    /**
     * [학생] 소속 가입
     * 학생이 특정 소속에 가입합니다.
     * @param organizationId 소속 ID
     * @returns CommonResponseVoid 가입 성공
     * @throws ApiError
     */
    public static joinOrganization(
        organizationId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/organizations/{organizationId}/membership',
            path: {
                'organizationId': organizationId,
            },
            errors: {
                400: `잘못된 요청`,
                403: `학생 권한 필요`,
                404: `소속 없음`,
                409: `이미 가입된 소속`,
            },
        });
    }
    /**
     * [학생] 소속 탈퇴
     * 학생이 특정 소속에서 탈퇴합니다.
     * @param organizationId 소속 ID
     * @returns void
     * @throws ApiError
     */
    public static leaveOrganization(
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/student/organizations/{organizationId}/membership',
            path: {
                'organizationId': organizationId,
            },
            errors: {
                403: `학생 권한 필요`,
                404: `소속 없음 또는 미가입`,
            },
        });
    }
    /**
     * [학생] 소속 변경
     * 학생이 소속을 변경합니다. 기존 동종 소속은 자동 탈퇴됩니다.
     * @param organizationId 소속 ID
     * @returns CommonResponseVoid 변경 성공
     * @throws ApiError
     */
    public static changeOrganization(
        organizationId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/student/organizations/{organizationId}/membership',
            path: {
                'organizationId': organizationId,
            },
            errors: {
                400: `잘못된 요청`,
                403: `학생 권한 필요`,
                404: `소속 없음`,
            },
        });
    }
}
