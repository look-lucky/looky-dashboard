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
export class CouncilOrganizationService {
    /**
     * [학생회] 특정 대학에 소속 등록
     * 자신의 대학에 새로운 소속(단과대, 학과 등)을 등록합니다.
     * @param universityId 대학 ID
     * @param requestBody
     * @returns CommonResponseLong 등록 성공
     * @throws ApiError
     */
    public static createOrganization(
        universityId: number,
        requestBody: CreateOrganizationRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/council/universities/{universityId}/organizations',
            path: {
                'universityId': universityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `학생회 권한 필요 또는 타 대학 접근`,
                404: `대학 없음`,
                409: `소속 이름 중복`,
            },
        });
    }
    /**
     * [학생회] 소속 삭제
     * 본인이 생성한 소속을 삭제합니다.
     * @param organizationId 소속 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteOrganization(
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/council/organizations/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
            errors: {
                400: `하위 조직 존재`,
                403: `학생회 권한 필요 또는 타인 소속 접근`,
                404: `소속 없음`,
            },
        });
    }
    /**
     * [학생회] 소속 수정
     * 본인이 생성한 소속 정보를 수정합니다.
     * @param organizationId 소속 ID
     * @param requestBody
     * @returns CommonResponseVoid 수정 성공
     * @throws ApiError
     */
    public static updateOrganization(
        organizationId: number,
        requestBody: UpdateOrganizationRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/council/organizations/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `학생회 권한 필요 또는 타인 소속 접근`,
                404: `소속 없음`,
                409: `소속 이름 중복`,
            },
        });
    }
}
