/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 가게 소식 생성 요청
 */
export type CreateStoreNewsRequest = {
    /**
     * 소식 제목
     */
    title: string;
    /**
     * 소식 내용
     */
    content: string;
    /**
     * 이미지 URL 목록 (최대 5장)
     */
    imageUrls?: Array<string>;
};

