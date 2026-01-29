/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListPartnershipResponse } from '../models/CommonResponseListPartnershipResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreatePartnershipRequest } from '../models/CreatePartnershipRequest';
import type { UpdatePartnershipRequest } from '../models/UpdatePartnershipRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartnershipService {
    /**
     * 조직별 제휴 목록 조회
     * 특정 대학의 특정 조직의 모든 제휴를 조회합니다.
     * @param universityId 대학 ID
     * @param organizationId 조직 ID
     * @returns CommonResponseListPartnershipResponse 조회 성공
     * @throws ApiError
     */
    public static getPartnershipsByOrganization(
        universityId: number,
        organizationId: number,
    ): CancelablePromise<CommonResponseListPartnershipResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/universities/{universityId}/organizations/{organizationId}/partnerships',
            path: {
                'universityId': universityId,
                'organizationId': organizationId,
            },
        });
    }
    /**
     * [관리자] 제휴 등록
     * 특정 대학의 특정 조직에 제휴를 등록합니다.
     * @param universityId 대학 ID
     * @param organizationId 조직 ID
     * @param requestBody
     * @returns CommonResponseLong 제휴 등록 성공
     * @throws ApiError
     */
    public static createPartnership(
        universityId: number,
        organizationId: number,
        requestBody: CreatePartnershipRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/universities/{universityId}/organizations/{organizationId}/partnerships',
            path: {
                'universityId': universityId,
                'organizationId': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음 (관리자 아님)`,
                404: `상점 또는 조직 없음`,
                409: `이미 등록된 제휴`,
            },
        });
    }
    /**
     * [관리자] 제휴 삭제
     * 제휴를 삭제합니다.
     * @param partnershipId 제휴 ID
     * @returns void
     * @throws ApiError
     */
    public static deletePartnership(
        partnershipId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/partnerships/{partnershipId}',
            path: {
                'partnershipId': partnershipId,
            },
            errors: {
                403: `권한 없음`,
                404: `제휴 정보 없음`,
            },
        });
    }
    /**
     * [관리자] 제휴 혜택 수정
     * 제휴 내용을 수정합니다.
     * @param partnershipId 제휴 ID
     * @param requestBody
     * @returns CommonResponseVoid 제휴 혜택 수정 성공
     * @throws ApiError
     */
    public static updatePartnershipBenefit(
        partnershipId: number,
        requestBody: UpdatePartnershipRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/partnerships/{partnershipId}',
            path: {
                'partnershipId': partnershipId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 (관리자 아님)`,
                404: `제휴 정보 없음`,
            },
        });
    }
    /**
     * 대학별 제휴 목록 조회
     * 특정 대학의 모든 제휴를 조회합니다.
     * @param universityId 대학 ID
     * @returns CommonResponseListPartnershipResponse 조회 성공
     * @throws ApiError
     */
    public static getPartnershipsByUniversity(
        universityId: number,
    ): CancelablePromise<CommonResponseListPartnershipResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/universities/{universityId}/partnerships',
            path: {
                'universityId': universityId,
            },
        });
    }
}
