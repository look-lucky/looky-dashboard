/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseItemResponse } from '../models/CommonResponseItemResponse';
import type { CommonResponseListItemResponse } from '../models/CommonResponseListItemResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateItemRequest } from '../models/CreateItemRequest';
import type { UpdateItemRequest } from '../models/UpdateItemRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminItemService {
    /**
     * [관리자] 상점별 상품 목록 조회
     * 특정 상점의 모든 상품을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListItemResponse 성공
     * @throws ApiError
     */
    public static getItems2(
        storeId: number,
    ): CancelablePromise<CommonResponseListItemResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/items',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [관리자] 상품 등록
     * UNCLAIMED 상태의 가게에 상품을 등록합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseLong 상품 등록 성공
     * @throws ApiError
     */
    public static createItem2(
        storeId: number,
        requestBody: CreateItemRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/items',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [관리자] 상품 단건 조회
     * 상품 ID로 상품의 상세 정보를 조회합니다.
     * @param itemId 상품 ID
     * @returns CommonResponseItemResponse 성공
     * @throws ApiError
     */
    public static getItem2(
        itemId: number,
    ): CancelablePromise<CommonResponseItemResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            errors: {
                404: `상품 없음`,
            },
        });
    }
    /**
     * [관리자] 상품 삭제
     * UNCLAIMED 상태의 가게 상품을 삭제합니다.
     * @param itemId 상품 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteItem2(
        itemId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            errors: {
                403: `권한 없음`,
                404: `상품 없음`,
            },
        });
    }
    /**
     * [관리자] 상품 수정
     * UNCLAIMED 상태의 가게 상품을 수정합니다.
     * @param itemId 상품 ID
     * @param requestBody
     * @returns CommonResponseVoid 상품 수정 성공
     * @throws ApiError
     */
    public static updateItem2(
        itemId: number,
        requestBody: UpdateItemRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음`,
                404: `상품 없음`,
            },
        });
    }
}
