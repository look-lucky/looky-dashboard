/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 광고 등록 요청
 */
export type CreateAdvertisementRequest = {
    /**
     * 광고 제목
     */
    title: string;
    /**
     * 광고 타입 (POPUP / BANNER / FLOATING)
     */
    advertisementType: CreateAdvertisementRequest.advertisementType;
    /**
     * 광고 이미지 URL
     */
    imageUrl: string;
    /**
     * 랜딩 URL (없으면 클릭 불가)
     */
    landingUrl?: string | null;
    /**
     * 노출 순서 (낮을수록 우선 노출, ACTIVE 시작 시만 적용 / 미입력 시 마지막 순서)
     */
    displayOrder?: number | null;
    /**
     * 노출 시작일시
     */
    startAt: string;
    /**
     * 노출 종료일시
     */
    endAt: string;
    /**
     * 타겟 대학 ID 목록 (없으면 전체 대학 대상)
     */
    targetUniversityIds?: Array<number | null> | null;
    /**
     * 타겟 단과대 ID 목록 (없으면 전체 단과대 대상, 반드시 대학 ID도 함께 지정해야 함)
     */
    targetOrganizationIds?: Array<number | null> | null;
    /**
     * 타겟 성별 (없으면 전체 성별 대상, MALE / FEMALE / UNKNOWN)
     */
    targetGender?: CreateAdvertisementRequest.targetGender | null;
};
export namespace CreateAdvertisementRequest {
    /**
     * 광고 타입 (POPUP / BANNER / FLOATING)
     */
    export enum advertisementType {
        POPUP = 'POPUP',
        BANNER = 'BANNER',
        FLOATING = 'FLOATING',
    }
    /**
     * 타겟 성별 (없으면 전체 성별 대상, MALE / FEMALE / UNKNOWN)
     */
    export enum targetGender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

