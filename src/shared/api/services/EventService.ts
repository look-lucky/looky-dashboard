/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseEventResponse } from '../models/CommonResponseEventResponse';
import type { CommonResponsePageResponseEventResponse } from '../models/CommonResponsePageResponseEventResponse';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventService {
    /**
     * [공통] 이벤트 목록 조회
     * 이벤트 목록을 페이징하여 조회합니다. 이벤트 타입 복수선택 가능.
     * @param pageable 페이징 정보
     * @param keyword 검색 키워드 (제목)
     * @param eventTypes 이벤트 타입 필터 (복수 선택 가능)
     * @param status 상태 필터
     * @returns CommonResponsePageResponseEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvents(
        pageable: Pageable,
        keyword?: string,
        eventTypes?: Array<'FOOD_EVENT' | 'POPUP_STORE' | 'SCHOOL_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'COMMUNITY'>,
        status?: 'UPCOMING' | 'LIVE' | 'ENDED',
    ): CancelablePromise<CommonResponsePageResponseEventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events',
            query: {
                'keyword': keyword,
                'eventTypes': eventTypes,
                'status': status,
                'pageable': pageable,
            },
        });
    }
    /**
     * [공통] 이벤트 단건 조회
     * 이벤트 ID로 상세 정보를 조회합니다.
     * @param eventId 이벤트 ID
     * @returns CommonResponseEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvent(
        eventId: number,
    ): CancelablePromise<CommonResponseEventResponse> {
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
}
