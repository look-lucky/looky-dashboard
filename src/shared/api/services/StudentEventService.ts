/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponsePageResponseStudentEventResponse } from '../models/CommonResponsePageResponseStudentEventResponse';
import type { CommonResponseStudentEventResponse } from '../models/CommonResponseStudentEventResponse';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentEventService {
    /**
     * [학생] 이벤트 목록 조회
     * 학생의 대학/단과대/학과 타겟 기준으로 이벤트 목록을 페이징 조회합니다.
     * @param pageable 페이지 정보
     * @param keyword 검색 키워드(제목)
     * @param eventTypes 이벤트 타입 필터 (복수 선택 가능)
     * @param status 상태 필터
     * @returns CommonResponsePageResponseStudentEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvents1(
        pageable: Pageable,
        keyword?: string,
        eventTypes?: Array<'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP'>,
        status?: 'UPCOMING' | 'LIVE' | 'ENDED',
    ): CancelablePromise<CommonResponsePageResponseStudentEventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/events',
            query: {
                'keyword': keyword,
                'eventTypes': eventTypes,
                'status': status,
                'pageable': pageable,
            },
        });
    }
    /**
     * [학생] 이벤트 단건 조회
     * 이벤트 ID로 상세 정보를 조회합니다.
     * @param eventId 이벤트 ID
     * @returns CommonResponseStudentEventResponse 조회 성공
     * @throws ApiError
     */
    public static getEvent1(
        eventId: number,
    ): CancelablePromise<CommonResponseStudentEventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/events/{eventId}',
            path: {
                'eventId': eventId,
            },
            errors: {
                404: `이벤트 없음`,
            },
        });
    }
}
