/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLoginResponse } from '../models/CommonResponseLoginResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CompleteSocialSignupRequest } from '../models/CompleteSocialSignupRequest';
import type { CouncilSignupRequest } from '../models/CouncilSignupRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { OwnerSignupRequest } from '../models/OwnerSignupRequest';
import type { StudentSignupRequest } from '../models/StudentSignupRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * [학생] 학생 회원가입
     * 학생 회원을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static signupStudent(
        requestBody: StudentSignupRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup/student',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [점주] 점주 회원가입
     * 점주 회원을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static signupOwner(
        requestBody: OwnerSignupRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup/owner',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [학생회] 학생회 회원가입
     * 학생회 회원을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static signupcouncil(
        requestBody: CouncilSignupRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup/council',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 토큰 갱신
     * RefreshToken으로 AccessToken을 갱신합니다.
     * @param refreshToken
     * @returns CommonResponseLoginResponse 토큰 갱신 성공
     * @throws ApiError
     */
    public static refresh(
        refreshToken?: string,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            cookies: {
                'refreshToken': refreshToken,
            },
            errors: {
                401: `유효하지 않은 RefreshToken`,
                404: `사용자 없음`,
            },
        });
    }
    /**
     * [공통] 로그아웃
     * 사용자를 로그아웃 처리합니다.
     * @param refreshToken
     * @returns CommonResponseVoid 로그아웃 성공
     * @throws ApiError
     */
    public static logout(
        refreshToken?: string,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
            cookies: {
                'refreshToken': refreshToken,
            },
        });
    }
    /**
     * [공통] 로그인
     * 아이디와 비밀번호로 로그인합니다.
     * @param requestBody
     * @returns CommonResponseLoginResponse 로그인 성공
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `로그인 실패 (아이디/비밀번호 불일치)`,
                401: `인증 실패`,
            },
        });
    }
    /**
     * [공통] 소셜 회원가입 완료
     * 소셜 로그인 후 추가 정보를 입력하여 회원가입을 완료합니다.
     * @param userId
     * @param request
     * @returns CommonResponseLoginResponse 회원가입 완료 성공
     * @throws ApiError
     */
    public static completeSocialSignup(
        userId: number,
        request: CompleteSocialSignupRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/complete-social-signup',
            query: {
                'userId': userId,
                'request': request,
            },
            errors: {
                400: `잘못된 요청`,
                404: `사용자 없음`,
                409: `이미 존재하는 소셜 정보`,
            },
        });
    }
}
