/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListItemCategory } from '../models/CommonResponseListItemCategory';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemCategoryService {
    /**
     * [공통] 상품 카테고리 목록 조회
     * 매장의 상품 카테고리 목록을 조회합니다.
     * @param storeId
     * @returns CommonResponseListItemCategory OK
     * @throws ApiError
     */
    public static getItemCategories(
        storeId: number,
    ): CancelablePromise<CommonResponseListItemCategory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/item-categories',
            path: {
                'storeId': storeId,
            },
        });
    }
    /**
     * [점주] 상품 카테고리 등록
     * 매장에 새로운 상품 카테고리를 등록합니다.
     * @param storeId
     * @param requestBody
     * @returns CommonResponseLong 카테고리 등록 성공
     * @throws ApiError
     */
    public static createItemCategory(
        storeId: number,
        requestBody: Record<string, string>,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/item-categories',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음`,
                404: `매장 없음`,
            },
        });
    }
    /**
     * [점주] 상품 카테고리 삭제
     * 상품 카테고리를 삭제합니다. (사용 중인 상품이 있으면 삭제 불가)
     * @param storeId
     * @param categoryId
     * @returns void
     * @throws ApiError
     */
    public static deleteItemCategory(
        storeId: number,
        categoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/stores/{storeId}/item-categories/{categoryId}',
            path: {
                'storeId': storeId,
                'categoryId': categoryId,
            },
            errors: {
                409: `상품이 연결되어 있어 삭제 불가`,
            },
        });
    }
    /**
     * [점주] 상품 카테고리 수정
     * 상품 카테고리 이름을 수정합니다.
     * @param storeId
     * @param categoryId
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static updateItemCategory(
        storeId: number,
        categoryId: number,
        requestBody: Record<string, string>,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/stores/{storeId}/item-categories/{categoryId}',
            path: {
                'storeId': storeId,
                'categoryId': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
