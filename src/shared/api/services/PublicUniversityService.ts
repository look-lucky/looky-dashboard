/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListUniversityResponse } from '../models/CommonResponseListUniversityResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicUniversityService {
    /**
     * [공통] 대학 목록 조회
     * 전체 대학 목록을 조회합니다.
     * @returns CommonResponseListUniversityResponse 조회 성공
     * @throws ApiError
     */
    public static getUniversities(): CancelablePromise<CommonResponseListUniversityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/universities',
        });
    }
}
