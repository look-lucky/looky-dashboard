/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 이벤트 생성 요청
 */
export type CreateEventRequest = {
    /**
     * 이벤트 제목
     */
    title: string;
    /**
     * 이벤트 설명
     */
    description?: string;
    /**
     * 이벤트 부제목
     */
    subtitle?: string;
    /**
     * 이벤트 타입 목록
     */
    eventTypes: Array<'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP'>;
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
    startDateTime: string;
    /**
     * 이벤트 종료일시
     */
    endDateTime?: string;
    /**
     * 장소
     */
    place: string;
    /**
     * 대학교 ID (null이면 모든 학교 대상)
     */
    universityId?: number | null;
    /**
     * 배너 이미지 URL
     */
    bannerImageUrl?: string;
    /**
     * 일반 이미지 URL 목록
     */
    imageUrls?: Array<string>;
};

