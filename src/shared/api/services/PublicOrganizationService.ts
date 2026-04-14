/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListOrganizationResponse } from '../models/CommonResponseListOrganizationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicOrganizationService {
    /**
     * [공통] 특정 대학의 소속 목록 조회
     * 대학의 모든 소속을 조회합니다.
     * @param universityId 대학 ID
     * @returns CommonResponseListOrganizationResponse 조회 성공
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
            errors: {
                404: `대학 없음`,
            },
        });
    }
    /**
     * [공통] 특정 단과대학의 학과 목록 조회
     * 단과대학에 속한 학과 목록을 조회합니다.
     * @param collegeId 단과대학 ID
     * @returns CommonResponseListOrganizationResponse 조회 성공
     * @throws ApiError
     */
    public static getDepartmentsByCollege(
        collegeId: number,
    ): CancelablePromise<CommonResponseListOrganizationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/organizations/{collegeId}/departments',
            path: {
                'collegeId': collegeId,
            },
            errors: {
                404: `단과대학 없음`,
            },
        });
    }
}
