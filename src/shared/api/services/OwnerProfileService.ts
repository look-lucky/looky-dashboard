/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseOwnerInfoResponse } from '../models/CommonResponseOwnerInfoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OwnerProfileService {
    /**
     * [점주] 내 정보 조회
     * 점주의 이름, 이메일, 아이디, 성별, 생년월일을 조회합니다.
     * @returns CommonResponseOwnerInfoResponse 조회 성공
     * @throws ApiError
     */
    public static getOwnerInfo(): CancelablePromise<CommonResponseOwnerInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/profile',
            errors: {
                403: `점주 회원이 아님`,
                404: `점주 프로필 없음`,
            },
        });
    }
}
