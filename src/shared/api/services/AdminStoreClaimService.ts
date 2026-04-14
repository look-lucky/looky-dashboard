/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponsePageAdminStoreClaimResponse } from '../models/CommonResponsePageAdminStoreClaimResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { StoreClaimRejectionRequest } from '../models/StoreClaimRejectionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminStoreClaimService {
    /**
     * [관리자] 상점 소유권 요청 반려
     * 상점 소유권 요청을 반려합니다.
     * @param claimId 소유 요청 ID
     * @param requestBody
     * @returns CommonResponseVoid 반려 성공
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
            errors: {
                403: `관리자 권한 필요`,
                404: `요청 없음`,
                409: `대기 중인 요청이 아님`,
            },
        });
    }
    /**
     * [관리자] 상점 소유권 요청 승인
     * 상점 소유권 요청을 승인합니다.
     * @param claimId 소유 요청 ID
     * @returns CommonResponseVoid 승인 성공
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
            errors: {
                403: `관리자 권한 필요`,
                404: `요청 없음`,
                409: `대기 중인 요청이 아님`,
            },
        });
    }
    /**
     * [관리자] 상점 소유권 요청 관리자 메모 등록 및 수정
     * 상점 소유권 요청에 관리자 메모를 남깁니다.
     * @param claimId 소유 요청 ID
     * @param requestBody
     * @returns CommonResponseVoid 메모 저장 성공
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
            errors: {
                403: `관리자 권한 필요`,
                404: `요청 없음`,
            },
        });
    }
    /**
     * [관리자] 상점 소유권 요청 목록 조회
     * 상점 소유권 요청 목록을 조회합니다. status 파라미터로 상태별 조회가 가능합니다.
     * @param pageable
     * @param status 요청 상태 (PENDING, APPROVED, REJECTED, CANCELED)
     * @returns CommonResponsePageAdminStoreClaimResponse 조회 성공
     * @throws ApiError
     */
    public static getStoreClaims(
        pageable: Pageable,
        status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED',
    ): CancelablePromise<CommonResponsePageAdminStoreClaimResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/store-claims',
            query: {
                'status': status,
                'pageable': pageable,
            },
            errors: {
                403: `관리자 권한 필요`,
            },
        });
    }
}
