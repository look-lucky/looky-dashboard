/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseItemResponse } from '../models/CommonResponseItemResponse';
import type { CommonResponseListItemResponse } from '../models/CommonResponseListItemResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemService {
    /**
     * [공통] 상점별 상품 목록 조회
     * 특정 상점의 모든 상품을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListItemResponse 성공
     * @throws ApiError
     */
    public static getItems(
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
     * [점주] 상품 등록
     * 상점에 새로운 상품을 등록합니다. (본인 상점만 가능)
     * @param storeId 상품 ID
     * @param formData
     * @returns CommonResponseLong 상품 등록 성공
     * @throws ApiError
     */
    public static createItem(
        storeId: number,
        formData?: {
            /**
             * 상품 이미지
             */
            image?: Blob;
            request?: string;
        },
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/items',
            path: {
                'storeId': storeId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [공통] 상품 단건 조회
     * 상품 ID로 상품의 상세 정보를 조회합니다.
     * @param itemId 상품 ID
     * @returns CommonResponseItemResponse 성공
     * @throws ApiError
     */
    public static getItem(
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
     * [점주] 상품 삭제
     * 상품을 삭제합니다. (본인 상점만 가능)
     * @param itemId 상품 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteItem(
        itemId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상품 없음`,
            },
        });
    }
    /**
     * [점주] 상품 수정
     * 상품 정보를 수정합니다. (본인 상점만 가능)
     * @param itemId 상품 ID
     * @param formData
     * @returns CommonResponseVoid 상품 수정 성공
     * @throws ApiError
     */
    public static updateItem(
        itemId: number,
        formData?: {
            /**
             * 변경할 상품 이미지
             */
            image?: Blob;
            request?: string;
        },
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상품 없음`,
            },
        });
    }
}
