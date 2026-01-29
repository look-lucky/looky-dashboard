/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListUniversityResponse } from '../models/CommonResponseListUniversityResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateUniversityRequest } from '../models/CreateUniversityRequest';
import type { UpdateUniversityRequest } from '../models/UpdateUniversityRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UniversityService {
    /**
     * [공통] 대학 목록 조회
     * 전체 대학 목록을 조회합니다.
     * @returns CommonResponseListUniversityResponse OK
     * @throws ApiError
     */
    public static getUniversities(): CancelablePromise<CommonResponseListUniversityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/universities',
        });
    }
    /**
     * [관리자] 대학 등록
     * 새로운 대학을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static createUniversity(
        requestBody: CreateUniversityRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/universities',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [관리자] 대학 삭제
     * 대학을 삭제합니다.
     * @param universityId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static deleteUniversity(
        universityId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/universities/{universityId}',
            path: {
                'universityId': universityId,
            },
        });
    }
    /**
     * [관리자] 대학 수정
     * 대학 정보를 수정합니다.
     * @param universityId
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static updateUniversity(
        universityId: number,
        requestBody: UpdateUniversityRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/universities/{universityId}',
            path: {
                'universityId': universityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
