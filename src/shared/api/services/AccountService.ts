/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { ChangeUsernameRequest } from '../models/ChangeUsernameRequest';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { WithdrawRequest } from '../models/WithdrawRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * [공통] 아이디 변경
     * 사용자의 아이디를 변경합니다.
     * @param requestBody
     * @returns CommonResponseVoid 아이디 변경 성공
     * @throws ApiError
     */
    public static changeUsername1(
        requestBody: ChangeUsernameRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/account/change-username',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                409: `이미 존재하는 아이디`,
            },
        });
    }
    /**
     * [공통] 비밀번호 변경
     * 사용자의 비밀번호를 변경합니다.
     * @param requestBody
     * @returns CommonResponseVoid 비밀번호 변경 성공
     * @throws ApiError
     */
    public static changePassword1(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/account/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `현재 비밀번호 불일치`,
            },
        });
    }
    /**
     * [공통] 회원 탈퇴
     * 회원을 탈퇴 처리합니다. (Soft Delete)
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static withdraw(
        requestBody: WithdrawRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/account/withdraw',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 (기타 사유 미입력 등)`,
                401: `인증 실패`,
            },
        });
    }
}
