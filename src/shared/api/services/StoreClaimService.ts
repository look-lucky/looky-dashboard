/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BizVerificationRequest } from '../models/BizVerificationRequest';
import type { CommonResponseBizVerificationResponse } from '../models/CommonResponseBizVerificationResponse';
import type { CommonResponseListMyStoreClaimResponse } from '../models/CommonResponseListMyStoreClaimResponse';
import type { CommonResponseListStoreResponse } from '../models/CommonResponseListStoreResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageStoreClaimResponse } from '../models/CommonResponsePageStoreClaimResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { StoreClaimRejectionRequest } from '../models/StoreClaimRejectionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreClaimService {
    /**
     * [점주] 상점 소유 요청 등록
     * 사장님이 상점에 대해 소유를 요청하여 심사 대상이 됩니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static createStoreClaims(
        requestBody?: {
            request: string;
            /**
             * 사업자등록증 이미지
             */
            image: Blob;
        },
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/store-claims',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [점주] 사업자등록번호 유효성 검증
     * 사업자등록번호의 유효성을 검증합니다.
     * @param requestBody
     * @returns CommonResponseBizVerificationResponse OK
     * @throws ApiError
     */
    public static verifyBizRegNo(
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
     * [관리자] 상점 소유권 요청 반려
     * 상점 소유권 요청을 반려합니다.
     * @param claimId
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static reject(
        claimId: number,
        requestBody: StoreClaimRejectionRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/store-claims/{claimId}/reject',
            path: {
                'claimId': claimId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [관리자] 상점 소유권 요청 승인
     * 상점 소유권 요청을 승인합니다.
     * @param claimId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static approve(
        claimId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/store-claims/{claimId}/approve',
            path: {
                'claimId': claimId,
            },
        });
    }
    /**
     * [관리자] 상점 소유권 요청 관리자 메모 등록 및 수정
     * 상점 소유권 요청에 관리자 메모를 남깁니다.
     * @param claimId
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static updateMemo(
        claimId: number,
        requestBody: string,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/store-claims/{claimId}/memo',
            path: {
                'claimId': claimId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
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
     * [점주] 내 상점 소유 요청 목록 조회
     * 점주가 자신이 신청한 상점 소유 요청 목록을 조회합니다.
     * @returns CommonResponseListMyStoreClaimResponse OK
     * @throws ApiError
     */
    public static getMyStoreClaims(): CancelablePromise<CommonResponseListMyStoreClaimResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/store-claims/my',
        });
    }
    /**
     * [관리자] 상점 소유권 요청 목록 조회
     * 상점 소유권 요청 목록을 조회합니다. status 파라미터로 상태별 조회가 가능합니다.
     * @param pageable
     * @param status 요청 상태 (PENDING, APPROVED, REJECTED, CANCELED)
     * @returns CommonResponsePageStoreClaimResponse OK
     * @throws ApiError
     */
    public static getStoreClaims(
        pageable: Pageable,
        status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED',
    ): CancelablePromise<CommonResponsePageStoreClaimResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/store-claims',
            query: {
                'status': status,
                'pageable': pageable,
            },
        });
    }
}
