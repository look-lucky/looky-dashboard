/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BizVerificationRequest } from '../models/BizVerificationRequest';
import type { CommonResponseBizVerificationResponse } from '../models/CommonResponseBizVerificationResponse';
import type { CommonResponseListMyStoreClaimResponse } from '../models/CommonResponseListMyStoreClaimResponse';
import type { CommonResponseListStoreResponse } from '../models/CommonResponseListStoreResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { StoreClaimRequest } from '../models/StoreClaimRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OwnerStoreClaimService {
    /**
     * [점주] 내 상점 소유 요청 목록 조회
     * 점주가 자신이 신청한 상점 소유 요청 목록을 조회합니다.
     * @returns CommonResponseListMyStoreClaimResponse 조회 성공
     * @throws ApiError
     */
    public static getMyStoreClaims(): CancelablePromise<CommonResponseListMyStoreClaimResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/store-claims',
            errors: {
                403: `점주 권한 필요`,
            },
        });
    }
    /**
     * [점주] 상점 소유 요청 등록
     * 점주가 상점에 대해 소유를 요청하여 심사 대상이 됩니다.
     * @param requestBody
     * @returns CommonResponseLong 소유 요청 등록 성공
     * @throws ApiError
     */
    public static createStoreClaims1(
        requestBody: StoreClaimRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/store-claims',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `점주 권한 필요`,
                404: `상점 없음`,
                409: `이미 대기 중인 요청 존재`,
            },
        });
    }
    /**
     * [점주] 사업자등록번호 유효성 검증
     * 사업자등록번호의 유효성을 검증합니다.
     * @param requestBody
     * @returns CommonResponseBizVerificationResponse 검증 성공
     * @throws ApiError
     */
    public static verifyBizRegNo(
        requestBody: BizVerificationRequest,
    ): CancelablePromise<CommonResponseBizVerificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/biz-reg-no/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `사업자 정보 불일치`,
                422: `휴업 또는 폐업 사업자`,
            },
        });
    }
    /**
     * [점주] 미등록 상점 검색
     * 시스템에 등록된 미등록 상점을 이름 또는 주소로 검색합니다.
     * @param keyword
     * @returns CommonResponseListStoreResponse 검색 성공
     * @throws ApiError
     */
    public static searchUnclaimedStores1(
        keyword: string,
    ): CancelablePromise<CommonResponseListStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/store-claims/search',
            query: {
                'keyword': keyword,
            },
        });
    }
}
