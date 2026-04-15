/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListStorePartnershipResponse } from '../models/CommonResponseListStorePartnershipResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartnershipService {
    /**
     * [학생] 특정 상점의 제휴 혜택 목록 조회
     * 특정 상점이 맺고 있는 전체 제휴 혜택과 내가 받을 수 있는 혜택인지 여부를 함께 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListStorePartnershipResponse 조회 성공
     * @throws ApiError
     */
    public static getStorePartnerships(
        storeId: number,
    ): CancelablePromise<CommonResponseListStorePartnershipResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/partnerships',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
}
