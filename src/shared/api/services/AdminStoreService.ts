/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseAdminStoreResponse } from '../models/CommonResponseAdminStoreResponse';
import type { CommonResponseCoordinate } from '../models/CommonResponseCoordinate';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseAdminStoreResponse } from '../models/CommonResponsePageResponseAdminStoreResponse';
import type { CommonResponseString } from '../models/CommonResponseString';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { StoreCreateRequest } from '../models/StoreCreateRequest';
import type { StoreUpdateRequest } from '../models/StoreUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminStoreService {
    /**
     * [관리자] 상점 목록 페이징 조회
     * 조건에 따라 상점 목록을 조회합니다.
     * @param keyword 검색어 (상점명)
     * @param categories 가게 유형
     * @param universityId 대학 ID
     * @param storeStatus 상점 상태
     * @param hasPartnership 제휴 여부
     * @param page Zero-based page index (0..N)
     * @param size The size of the page to be returned
     * @param sort Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     * @returns CommonResponsePageResponseAdminStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getStores1(
        keyword?: string,
        categories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>,
        universityId?: number,
        storeStatus?: 'UNCLAIMED' | 'ACTIVE' | 'BANNED',
        hasPartnership?: boolean,
        page?: number,
        size: number = 10,
        sort?: Array<string>,
    ): CancelablePromise<CommonResponsePageResponseAdminStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/stores',
            query: {
                'keyword': keyword,
                'categories': categories,
                'universityId': universityId,
                'storeStatus': storeStatus,
                'hasPartnership': hasPartnership,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * [관리자] 상점 등록
     * 관리자가 새로운 상점을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 상점 등록 성공
     * @throws ApiError
     */
    public static createStore2(
        requestBody: StoreCreateRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/stores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
                409: `이미 존재하는 상점 (상점명 + 지점명 기준)`,
            },
        });
    }
    /**
     * [관리자] 상점 데이터 엑셀 업로드
     * 상권 데이터를 엑셀로 업로드하여 DB에 저장 및 보정합니다.
     * @param formData
     * @returns CommonResponseString 업로드 성공 (작업 시작됨)
     * @throws ApiError
     */
    public static uploadStoreData(
        formData?: {
            /**
             * 엑셀 파일 (.xlsx)
             */
            file: Blob;
        },
    ): CancelablePromise<CommonResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/stores/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `잘못된 파일`,
                500: `서버 에러`,
            },
        });
    }
    /**
     * [관리자] 상점 단건 조회
     * 상점의 상세 정보를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseAdminStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getStore1(
        storeId: number,
    ): CancelablePromise<CommonResponseAdminStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [관리자] 상점 삭제
     * UNCLAIMED 상태의 상점을 삭제합니다.
     * @param storeId 상점 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteStore2(
        storeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            errors: {
                403: `권한 없음 또는 UNCLAIMED 상태 아님`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [관리자] 상점 정보 수정
     * UNCLAIMED 상태의 상점 정보를 수정합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVoid 상점 수정 성공
     * @throws ApiError
     */
    public static updateStore2(
        storeId: number,
        requestBody: StoreUpdateRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 또는 UNCLAIMED 상태 아님`,
                404: `상점 없음`,
                409: `이미 존재하는 상점 (상점명 + 지점명 기준)`,
            },
        });
    }
    /**
     * [관리자] 주소로 위경도 변환
     * 주소를 입력받아 위도, 경도 좌표를 반환합니다.
     * @param address 도로명 주소 (예: 전라북도 전주시 덕진구 명륜3길 22)
     * @returns CommonResponseCoordinate 변환 성공
     * @throws ApiError
     */
    public static getGeocode(
        address: string,
    ): CancelablePromise<CommonResponseCoordinate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/stores/geocode',
            query: {
                'address': address,
            },
            errors: {
                400: `잘못된 주소/API 호출 에러`,
                500: `서버 에러`,
            },
        });
    }
}
