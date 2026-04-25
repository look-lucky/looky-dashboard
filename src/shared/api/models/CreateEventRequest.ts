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
     * 대상 대학 ID 목록 (null이면 모든 대학 대상)
     */
    targetUniversityIds?: Array<number | null> | null;
    /**
     * 대상 조직 ID 목록 (COLLEGE / DEPARTMENT, 하위 조직은 상위 조직과 함께 지정해야 함)
     */
    targetOrganizationIds?: Array<number | null> | null;
    /**
     * 배너 이미지 URL
     */
    bannerImageUrl?: string;
    /**
     * 일반 이미지 URL 목록
     */
    imageUrls?: Array<string>;
};

