/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 이벤트 수정 요청
 */
export type UpdateEventRequest = {
    /**
     * 이벤트 제목
     */
    title?: string;
    /**
     * 이벤트 설명
     */
    description?: string;
    /**
     * 이벤트 타입 목록
     */
    eventTypes?: Array<'FOOD_EVENT' | 'POPUP_STORE' | 'SCHOOL_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'COMMUNITY'>;
    /**
     * 위도
     */
    latitude?: number;
    /**
     * 경도
     */
    longitude?: number;
    /**
     * 이벤트 시작일시
     */
    startDateTime?: string;
    /**
     * 이벤트 종료일시
     */
    endDateTime?: string;
    /**
     * 이벤트 상태
     */
    status?: UpdateEventRequest.status;
};
export namespace UpdateEventRequest {
    /**
     * 이벤트 상태
     */
    export enum status {
        UPCOMING = 'UPCOMING',
        LIVE = 'LIVE',
        ENDED = 'ENDED',
    }
}

