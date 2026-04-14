/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseAdminAdvertisementResponse } from '../models/CommonResponsePageResponseAdminAdvertisementResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateAdvertisementRequest } from '../models/CreateAdvertisementRequest';
import type { Pageable } from '../models/Pageable';
import type { UpdateAdvertisementRequest } from '../models/UpdateAdvertisementRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAdvertisementService {
    /**
     * [관리자] 광고 목록 조회
     * 광고 목록을 조회합니다. 타입과 상태 필터를 지원합니다.
     * @param pageable
     * @param type 광고 타입 필터 (POPUP / BANNER / FLOATING)
     * @param status 광고 상태 필터 (SCHEDULED / ACTIVE / INACTIVE / ENDED)
     * @returns CommonResponsePageResponseAdminAdvertisementResponse 조회 성공
     * @throws ApiError
     */
    public static getAdvertisements(
        pageable: Pageable,
        type?: 'POPUP' | 'BANNER' | 'FLOATING',
        status?: 'SCHEDULED' | 'ACTIVE' | 'INACTIVE' | 'ENDED',
    ): CancelablePromise<CommonResponsePageResponseAdminAdvertisementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/advertisements',
            query: {
                'type': type,
                'status': status,
                'pageable': pageable,
            },
            errors: {
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 광고 등록
     * 새로운 광고를 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 광고 등록 성공
     * @throws ApiError
     */
    public static createAdvertisement(
        requestBody: CreateAdvertisementRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/advertisements',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 광고 삭제
     * 광고를 삭제합니다. S3 이미지도 함께 삭제합니다.
     * @param advertisementId 광고 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteAdvertisement(
        advertisementId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/advertisements/{advertisementId}',
            path: {
                'advertisementId': advertisementId,
            },
            errors: {
                403: `권한 없음`,
                404: `광고 없음`,
            },
        });
    }
    /**
     * [관리자] 광고 수정
     * 광고 정보와 상태를 수정합니다. 상태는 활성/비활성만 직접 변경할 수 있습니다.
     * @param advertisementId 광고 ID
     * @param requestBody
     * @returns CommonResponseVoid 광고 수정 성공
     * @throws ApiError
     */
    public static updateAdvertisement(
        advertisementId: number,
        requestBody: UpdateAdvertisementRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/advertisements/{advertisementId}',
            path: {
                'advertisementId': advertisementId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
                404: `광고 없음`,
            },
        });
    }
}
