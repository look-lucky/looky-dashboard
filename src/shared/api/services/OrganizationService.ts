/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListOrganizationResponse } from '../models/CommonResponseListOrganizationResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateOrganizationRequest } from '../models/CreateOrganizationRequest';
import type { UpdateOrganizationRequest } from '../models/UpdateOrganizationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationService {
    /**
     * [공통] 특정 대학의 소속 목록 조회
     * 대학의 모든 소속을 조회합니다.
     * @param universityId
     * @returns CommonResponseListOrganizationResponse OK
     * @throws ApiError
     */
    public static getOrganizations(
        universityId: number,
    ): CancelablePromise<CommonResponseListOrganizationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/universities/{universityId}/organizations',
            path: {
                'universityId': universityId,
            },
        });
    }
    /**
     * [학생회] 특정 대학에 소속 등록
     * 대학에 새로운 소속(단과대, 학과 등)을 등록합니다.
     * @param universityId
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static createOrganization(
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
        });
    }
    /**
     * [학생] 소속 가입
     * 학생이 특정 소속에 가입합니다.
     * @param organizationId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static joinOrganization(
        organizationId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/organizations/{organizationId}/membership',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * [학생] 소속 탈퇴
     * 학생이 특정 소속에서 탈퇴합니다.
     * @param organizationId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static leaveOrganization(
        organizationId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/organizations/{organizationId}/membership',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * [학생회] 소속 삭제
     * 소속을 삭제합니다.
     * @param organizationId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static deleteOrganization(
        organizationId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/organizations/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * [학생회] 소속 수정
     * 소속 정보를 수정합니다.
     * @param organizationId
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static updateOrganization(
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
        });
    }
}
