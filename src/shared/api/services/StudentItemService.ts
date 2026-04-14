/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseItemResponse } from '../models/CommonResponseItemResponse';
import type { CommonResponseListItemResponse } from '../models/CommonResponseListItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentItemService {
    /**
     * [학생] 상점별 상품 목록 조회
     * 특정 상점의 모든 상품을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListItemResponse 성공
     * @throws ApiError
     */
    public static getItems3(
        storeId: number,
    ): CancelablePromise<CommonResponseListItemResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/{storeId}/items',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [학생] 상품 단건 조회
     * 상품 ID로 상품의 상세 정보를 조회합니다.
     * @param itemId 상품 ID
     * @returns CommonResponseItemResponse 성공
     * @throws ApiError
     */
    public static getItem3(
        itemId: number,
    ): CancelablePromise<CommonResponseItemResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            errors: {
                404: `상품 없음`,
            },
        });
    }
}
