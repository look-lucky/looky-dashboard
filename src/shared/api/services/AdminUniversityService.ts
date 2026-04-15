/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateUniversityRequest } from '../models/CreateUniversityRequest';
import type { UpdateUniversityRequest } from '../models/UpdateUniversityRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUniversityService {
    /**
     * [관리자] 대학 등록
     * 새로운 대학을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 등록 성공
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
            errors: {
                403: `관리자 권한 필요`,
            },
        });
    }
    /**
     * [관리자] 대학 삭제
     * 대학을 삭제합니다.
     * @param universityId 대학 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteUniversity(
        universityId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/universities/{universityId}',
            path: {
                'universityId': universityId,
            },
            errors: {
                400: `소속이 있어 삭제 불가`,
                403: `관리자 권한 필요`,
                404: `대학 없음`,
            },
        });
    }
    /**
     * [관리자] 대학 수정
     * 대학 정보를 수정합니다.
     * @param universityId 대학 ID
     * @param requestBody
     * @returns CommonResponseVoid 수정 성공
     * @throws ApiError
     */
    public static updateUniversity2(
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
            errors: {
                403: `관리자 권한 필요`,
                404: `대학 없음`,
            },
        });
    }
}
