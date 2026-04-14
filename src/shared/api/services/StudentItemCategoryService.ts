/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListItemCategoryResponse } from '../models/CommonResponseListItemCategoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentItemCategoryService {
    /**
     * [학생] 상품 카테고리 목록 조회
     * 매장의 상품 카테고리 목록을 조회합니다.
     * @param storeId
     * @returns CommonResponseListItemCategoryResponse OK
     * @throws ApiError
     */
    public static getItemCategories3(
        storeId: number,
    ): CancelablePromise<CommonResponseListItemCategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/{storeId}/item-categories',
            path: {
                'storeId': storeId,
            },
        });
    }
}
