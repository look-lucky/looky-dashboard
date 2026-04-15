/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseAdminEventResponse } from '../models/CommonResponseAdminEventResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseAdminEventResponse } from '../models/CommonResponsePageResponseAdminEventResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateEventRequest } from '../models/CreateEventRequest';
import type { Pageable } from '../models/Pageable';
import type { UpdateEventRequest } from '../models/UpdateEventRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminEventService {
    /**
     * [관리자] 이벤트 목록 조회
     * 이벤트 목록을 페이징 조회합니다. 대학 ID 미입력 시 전체 조회합니다.
     * @param pageable 페이지 정보
     * @param keyword 검색 키워드(제목)
     * @param eventTypes 이벤트 타입 필터 (복수 선택 가능)
     * @param status 상태 필터
     * @param universityId 대학 ID (미입력 시 전체 조회)
     * @returns CommonResponsePageResponseAdminEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvents(
        pageable: Pageable,
        keyword?: string,
        eventTypes?: Array<'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP'>,
        status?: 'UPCOMING' | 'LIVE' | 'ENDED',
        universityId?: number,
    ): CancelablePromise<CommonResponsePageResponseAdminEventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events',
            query: {
                'keyword': keyword,
                'eventTypes': eventTypes,
                'status': status,
                'universityId': universityId,
                'pageable': pageable,
            },
            errors: {
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 이벤트 등록
     * 새로운 이벤트를 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 이벤트 등록 성공
     * @throws ApiError
     */
    public static createEvent(
        requestBody: CreateEventRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/events',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 이벤트 단건 조회
     * 이벤트 ID로 상세 정보를 조회합니다.
     * @param eventId 이벤트 ID
     * @returns CommonResponseAdminEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvent(
        eventId: number,
    ): CancelablePromise<CommonResponseAdminEventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events/{eventId}',
            path: {
                'eventId': eventId,
            },
            errors: {
                404: `이벤트 없음`,
            },
        });
    }
    /**
     * [관리자] 이벤트 삭제
     * 이벤트를 삭제합니다.
     * @param eventId 이벤트 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteEvent(
        eventId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/events/{eventId}',
            path: {
                'eventId': eventId,
            },
            errors: {
                403: `권한 없음`,
                404: `이벤트 없음`,
            },
        });
    }
    /**
     * [관리자] 이벤트 수정
     * 이벤트 정보를 수정합니다.
     * @param eventId 이벤트 ID
     * @param requestBody
     * @returns CommonResponseVoid 이벤트 수정 성공
     * @throws ApiError
     */
    public static updateEvent(
        eventId: number,
        requestBody: UpdateEventRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/events/{eventId}',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음`,
                404: `이벤트 없음`,
            },
        });
    }
}
