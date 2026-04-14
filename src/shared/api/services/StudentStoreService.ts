/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListHotStoreResponse } from '../models/CommonResponseListHotStoreResponse';
import type { CommonResponseListStudentStoreMapResponse } from '../models/CommonResponseListStudentStoreMapResponse';
import type { CommonResponseListStudentStoreResponse } from '../models/CommonResponseListStudentStoreResponse';
import type { CommonResponsePageResponseStudentStoreResponse } from '../models/CommonResponsePageResponseStudentStoreResponse';
import type { CommonResponseStudentStoreResponse } from '../models/CommonResponseStudentStoreResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { StoreReportRequest } from '../models/StoreReportRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentStoreService {
    /**
     * [학생] 상점 신고
     * 특정 상점을 신고합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVoid 신고 성공
     * @throws ApiError
     */
    public static reportStore(
        storeId: number,
        requestBody: StoreReportRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/stores/{storeId}/reports',
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
     * [학생] 상점 목록 조회
     * 전체 상점 목록을 페이징하여 조회합니다.
     * @param pageable 페이징 정보
     * @param keyword 검색 키워드 (상점 이름)
     * @param categories 카테고리 필터 (복수 선택 가능)
     * @param moods 분위기 필터 (복수 선택 가능)
     * @param universityId 대학(상권) ID 필터
     * @param hasPartnership 제휴 업체 보유 여부 필터
     * @param storeStatus 상점 상태 필터
     * @returns CommonResponsePageResponseStudentStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getStores2(
        pageable: Pageable,
        keyword?: string,
        categories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>,
        moods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>,
        universityId?: number,
        hasPartnership?: boolean,
        storeStatus?: 'UNCLAIMED' | 'ACTIVE' | 'BANNED',
    ): CancelablePromise<CommonResponsePageResponseStudentStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores',
            query: {
                'keyword': keyword,
                'categories': categories,
                'moods': moods,
                'universityId': universityId,
                'hasPartnership': hasPartnership,
                'storeStatus': storeStatus,
                'pageable': pageable,
            },
        });
    }
    /**
     * [학생] 상점 단건 조회
     * 상점 ID로 상세 정보와 나의 파트너십 혜택을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseStudentStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getStore2(
        storeId: number,
    ): CancelablePromise<CommonResponseStudentStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/{storeId}',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [학생] 주변 상점 조회
     * 위도, 경도, 반경(km)을 기준으로 주변 상점을 조회합니다.
     * @param latitude 위도
     * @param longitude 경도
     * @param radius 반경(km)
     * @returns CommonResponseListStudentStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getNearbyStores(
        latitude: number,
        longitude: number,
        radius: number,
    ): CancelablePromise<CommonResponseListStudentStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/nearby',
            query: {
                'latitude': latitude,
                'longitude': longitude,
                'radius': radius,
            },
        });
    }
    /**
     * [학생] 지도용 상점 전체 조회
     * 지도를 위한 상점 전체 목록을 조회합니다.
     * @param universityId 대학(상권) ID 필터
     * @returns CommonResponseListStudentStoreMapResponse 조회 성공
     * @throws ApiError
     */
    public static getStoreMap(
        universityId?: number,
    ): CancelablePromise<CommonResponseListStudentStoreMapResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/map',
            query: {
                'universityId': universityId,
            },
        });
    }
    /**
     * [학생] 특정 위치 상점 목록 조회
     * 위도, 경도가 일치하는 상점 목록을 조회합니다. (같은 건물/위치)
     * @param latitude 위도
     * @param longitude 경도
     * @returns CommonResponseListStudentStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getStoresByLocation(
        latitude: number,
        longitude: number,
    ): CancelablePromise<CommonResponseListStudentStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/location',
            query: {
                'latitude': latitude,
                'longitude': longitude,
            },
        });
    }
    /**
     * [학생] 이번 주 핫한 가게 조회
     * 소속 대학에서 이번 주 찜이 가장 많이 늘어난 상점 Top 10을 조회합니다.
     * @returns CommonResponseListHotStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getHotStores(): CancelablePromise<CommonResponseListHotStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/hot',
            errors: {
                403: `권한 없음 (대학 미소속)`,
            },
        });
    }
}
