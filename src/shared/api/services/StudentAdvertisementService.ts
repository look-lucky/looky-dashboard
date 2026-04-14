/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListAdvertisementResponse } from '../models/CommonResponseListAdvertisementResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentAdvertisementService {
    /**
     * [학생] 팝업 광고 목록 조회
     * 학생 타겟 기준으로 현재 노출 중인 팝업 광고 목록을 조회합니다.
     * @returns CommonResponseListAdvertisementResponse 조회 성공
     * @throws ApiError
     */
    public static getPopupAdvertisements(): CancelablePromise<CommonResponseListAdvertisementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/advertisements/popup',
        });
    }
    /**
     * [학생] 플로팅 광고 목록 조회
     * 학생 타겟 기준으로 현재 노출 중인 플로팅 광고 목록을 조회합니다.
     * @returns CommonResponseListAdvertisementResponse 조회 성공
     * @throws ApiError
     */
    public static getFloatingAdvertisements(): CancelablePromise<CommonResponseListAdvertisementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/advertisements/floating',
        });
    }
    /**
     * [학생] 배너 광고 목록 조회
     * 학생 타겟 기준으로 현재 노출 중인 배너 광고 목록을 조회합니다.
     * @returns CommonResponseListAdvertisementResponse 조회 성공
     * @throws ApiError
     */
    public static getBannerAdvertisements(): CancelablePromise<CommonResponseListAdvertisementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/advertisements/banner',
        });
    }
}
