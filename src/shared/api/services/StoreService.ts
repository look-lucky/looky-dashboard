/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListStoreResponse } from '../models/CommonResponseListStoreResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseStoreResponse } from '../models/CommonResponsePageResponseStoreResponse';
import type { CommonResponseStoreRegistrationStatusResponse } from '../models/CommonResponseStoreRegistrationStatusResponse';
import type { CommonResponseStoreResponse } from '../models/CommonResponseStoreResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateStoreRequest } from '../models/CreateStoreRequest';
import type { Pageable } from '../models/Pageable';
import type { StoreReportRequest } from '../models/StoreReportRequest';
import type { UpdateStoreRequest } from '../models/UpdateStoreRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreService {
    /**
     * [공통] 상점 목록 조회
     * 전체 상점 목록을 페이징하여 조회합니다.
     * @param pageable 페이징 정보 (page, size, sort)
     * @param keyword 검색 키워드 (상점 이름)
     * @param categories 카테고리 필터 (복수 선택 가능)
     * @param moods 분위기 필터 (복수 선택 가능)
     * @param universityId 대학(상권) ID 필터
     * @returns CommonResponsePageResponseStoreResponse 상점 목록 조회 성공
     * @throws ApiError
     */
    public static getStores(
        pageable: Pageable,
        keyword?: string,
        categories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>,
        moods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>,
        universityId?: number,
    ): CancelablePromise<CommonResponsePageResponseStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores',
            query: {
                'keyword': keyword,
                'categories': categories,
                'moods': moods,
                'universityId': universityId,
                ...pageable,
            },
        });
    }
    /**
     * [점주] 상점 등록
     * 새로운 상점을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 상점 등록 성공
     * @throws ApiError
     */
    public static createStore(
        requestBody?: {
            /**
             * 상품 이미지 목록
             */
            images: Array<Blob>;
            request: CreateStoreRequest;
        },
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
                409: `이미 존재하는 상점 이름`,
            },
        });
    }
    /**
     * [학생] 상점 신고
     * 특정 상점을 신고합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVoid 상점 신고 성공
     * @throws ApiError
     */
    public static reportStore(
        storeId: number,
        requestBody: StoreReportRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/reports',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `상점 없음`,
                409: `이미 신고한 상점`,
            },
        });
    }
    /**
     * [공통] 상점 단건 조회
     * 상점 ID로 상점의 상세 정보를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseStoreResponse 상점 조회 성공
     * @throws ApiError
     */
    public static getStore(
        storeId: number,
    ): CancelablePromise<CommonResponseStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
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
    public static deleteStore(
        storeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/stores/{storeId}',
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
    public static updateStore(
        storeId: number,
        requestBody?: {
            request: UpdateStoreRequest;
            images: Array<Blob>;
        },
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
                409: `이미 존재하는 상점 이름`,
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
    public static getStoreRegistrationStatus(
        storeId: number,
    ): CancelablePromise<CommonResponseStoreRegistrationStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/registration-status',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [공통] 주위 상점 조회
     * 위도, 경도, 반경(km)을 기준으로 주위 상점을 조회합니다.
     * @param latitude 위도
     * @param longitude 경도
     * @param radius 반경(km)
     * @returns CommonResponseListStoreResponse 상점 목록 조회 성공
     * @throws ApiError
     */
    public static getNearbyStores(
        latitude: number,
        longitude: number,
        radius: number,
    ): CancelablePromise<CommonResponseListStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/nearby',
            query: {
                'latitude': latitude,
                'longitude': longitude,
                'radius': radius,
            },
        });
    }
    /**
     * [점주] 자신의 상점 조회
     * 자신이 등록한 모든 상점을 조회합니다.
     * @returns CommonResponseListStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getMyStores(): CancelablePromise<CommonResponseListStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/my-stores',
        });
    }
    /**
     * [점주] 상점 이미지 개별 삭제
     * 상점의 특정 이미지를 삭제합니다.
     * @param storeId
     * @param imageId
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static deleteStoreImage(
        storeId: number,
        imageId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/stores/{storeId}/images/{imageId}',
            path: {
                'storeId': storeId,
                'imageId': imageId,
            },
        });
    }
}
