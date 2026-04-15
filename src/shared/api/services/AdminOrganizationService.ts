/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateOrganizationRequest } from '../models/CreateOrganizationRequest';
import type { UpdateOrganizationRequest } from '../models/UpdateOrganizationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminOrganizationService {
    /**
     * [관리자] 특정 대학에 소속 등록
     * 모든 대학에 새로운 소속(단과대, 학과 등)을 등록합니다.
     * @param universityId 대학 ID
     * @param requestBody
     * @returns CommonResponseLong 등록 성공
     * @throws ApiError
     */
    public static createOrganization1(
        universityId: number,
        requestBody: CreateOrganizationRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/universities/{universityId}/organizations',
            path: {
                'universityId': universityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `관리자 권한 필요`,
                404: `대학 없음`,
                409: `소속 이름 중복`,
            },
        });
    }
    /**
     * [관리자] 소속 삭제
     * 소속을 삭제합니다.
     * @param organizationId 소속 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteOrganization1(
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/organizations/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
            errors: {
                400: `하위 조직 존재`,
                403: `관리자 권한 필요`,
                404: `소속 없음`,
            },
        });
    }
    /**
     * [관리자] 소속 수정
     * 소속 정보를 수정합니다.
     * @param organizationId 소속 ID
     * @param requestBody
     * @returns CommonResponseVoid 수정 성공
     * @throws ApiError
     */
    public static updateOrganization1(
        organizationId: number,
        requestBody: UpdateOrganizationRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/organizations/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `관리자 권한 필요`,
                404: `소속 없음`,
                409: `소속 이름 중복`,
            },
        });
    }
}
