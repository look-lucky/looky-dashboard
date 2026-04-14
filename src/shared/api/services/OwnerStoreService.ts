/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListOwnerStoreResponse } from '../models/CommonResponseListOwnerStoreResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseStoreRegistrationStatusResponse } from '../models/CommonResponseStoreRegistrationStatusResponse';
import type { CommonResponseStoreStatsResponse } from '../models/CommonResponseStoreStatsResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { StoreCreateRequest } from '../models/StoreCreateRequest';
import type { StoreUpdateRequest } from '../models/StoreUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OwnerStoreService {
    /**
     * [점주] 자신의 상점 목록 조회
     * 자신이 등록한 모든 상점을 조회합니다.
     * @returns CommonResponseListOwnerStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getMyStores(): CancelablePromise<CommonResponseListOwnerStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores',
        });
    }
    /**
     * [점주] 상점 등록
     * 새로운 상점을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 상점 등록 성공
     * @throws ApiError
     */
    public static createStore1(
        requestBody: StoreCreateRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/stores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                409: `이미 존재하는 상점 (상점명 + 지점명 기준)`,
            },
        });
    }
    /**
     * [점주] 상점 삭제
     * 상점을 삭제합니다. (본인 상점만 가능)
     * @param storeId 상점 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteStore1(
        storeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/owner/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 상점 정보 수정
     * 상점 정보를 수정합니다. (본인 상점만 가능)
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVoid 상점 수정 성공
     * @throws ApiError
     */
    public static updateStore1(
        storeId: number,
        requestBody: StoreUpdateRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/owner/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
                409: `이미 존재하는 상점 (상점명 + 지점명 기준)`,
            },
        });
    }
    /**
     * [점주] 상점 통계 조회
     * 상점의 통계 데이터(단골 수, 쿠폰 발행/사용 수, 리뷰 수)를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseStoreStatsResponse 조회 성공
     * @throws ApiError
     */
    public static getStoreStats1(
        storeId: number,
    ): CancelablePromise<CommonResponseStoreStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores/{storeId}/stats',
            path: {
                'storeId': storeId,
            },
            errors: {
                403: `권한 없음`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 상점 등록 상태 조회
     * 상점의 정보 및 메뉴 등록 여부를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseStoreRegistrationStatusResponse 조회 성공
     * @throws ApiError
     */
    public static getStoreRegistrationStatus1(
        storeId: number,
    ): CancelablePromise<CommonResponseStoreRegistrationStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores/{storeId}/registration-status',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
}
