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
export class StoreClaimService {
    /**
     * @deprecated
     * [점주] 상점 소유 요청 등록
     * 사장님이 상점에 대해 소유를 요청하여 심사 대상이 됩니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static createStoreClaims(
        requestBody: StoreClaimRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/store-claims',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * [점주] 사업자등록번호 유효성 검증
     * 사업자등록번호의 유효성을 검증합니다.
     * @param requestBody
     * @returns CommonResponseBizVerificationResponse OK
     * @throws ApiError
     */
    public static verifyBizRegNo1(
        requestBody: BizVerificationRequest,
    ): CancelablePromise<CommonResponseBizVerificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/biz-reg-no/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * [점주] 미등록 상점 검색
     * 시스템에 등록된 미등록 상점을 이름 또는 주소로 검색합니다.
     * @param keyword
     * @returns CommonResponseListStoreResponse OK
     * @throws ApiError
     */
    public static searchUnclaimedStores(
        keyword: string,
    ): CancelablePromise<CommonResponseListStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/store-claims/search',
            query: {
                'keyword': keyword,
            },
        });
    }
    /**
     * @deprecated
     * [점주] 내 상점 소유 요청 목록 조회
     * 점주가 자신이 신청한 상점 소유 요청 목록을 조회합니다.
     * @returns CommonResponseListMyStoreClaimResponse OK
     * @throws ApiError
     */
    public static getMyStoreClaims1(): CancelablePromise<CommonResponseListMyStoreClaimResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/store-claims/my',
        });
    }
}
