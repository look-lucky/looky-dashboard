/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppleLoginRequest } from '../models/AppleLoginRequest';
import type { CommonResponseBoolean } from '../models/CommonResponseBoolean';
import type { CommonResponseLoginResponse } from '../models/CommonResponseLoginResponse';
import type { CommonResponseString } from '../models/CommonResponseString';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CompleteSocialSignupRequest } from '../models/CompleteSocialSignupRequest';
import type { CouncilSignupRequest } from '../models/CouncilSignupRequest';
import type { FindPasswordSendCodeRequest } from '../models/FindPasswordSendCodeRequest';
import type { GoogleLoginRequest } from '../models/GoogleLoginRequest';
import type { KakaoLoginRequest } from '../models/KakaoLoginRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { OwnerSignupRequest } from '../models/OwnerSignupRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { SendEmailCodeRequest } from '../models/SendEmailCodeRequest';
import type { StudentSignupRequest } from '../models/StudentSignupRequest';
import type { VerifyEmailCodeRequest } from '../models/VerifyEmailCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * [학생] 학생 회원가입
     * 학생 회원을 등록합니다.
     * @param requestBody
     * @returns CommonResponseLoginResponse OK
     * @throws ApiError
     */
    public static signupStudent(
        requestBody: StudentSignupRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
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
     * @returns CommonResponseLoginResponse OK
     * @throws ApiError
     */
    public static signupOwner(
        requestBody: OwnerSignupRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
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
     * @returns CommonResponseLoginResponse OK
     * @throws ApiError
     */
    public static signupcouncil(
        requestBody: CouncilSignupRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
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
     * [공통] 카카오 로그인 (네이티브)
     * 카카오 인증 후 발급받은 access_token을 통해 로그인/회원가입을 진행합니다.
     * @param requestBody
     * @returns CommonResponseLoginResponse 로그인 성공
     * @throws ApiError
     */
    public static kakaoLogin(
        requestBody: KakaoLoginRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/kakao/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 토큰 또는 파라미터`,
                401: `카카오 인증 실패`,
            },
        });
    }
    /**
     * [공통] 구글 로그인 (네이티브)
     * 구글 인증 후 발급받은 id_token을 통해 로그인/회원가입을 진행합니다.
     * @param requestBody
     * @returns CommonResponseLoginResponse 로그인 성공
     * @throws ApiError
     */
    public static googleLogin(
        requestBody: GoogleLoginRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/google/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 토큰 또는 파라미터`,
                401: `구글 인증 실패`,
            },
        });
    }
    /**
     * [공통] 비밀번호 재설정 - 인증 확인 및 임시 토큰 반환
     * 인증번호 검증 후 비밀번호 재설정을 위한 임시 토큰을 반환합니다.
     * @param requestBody
     * @returns CommonResponseString OK
     * @throws ApiError
     */
    public static verifyCodeForFindPassword(
        requestBody: VerifyEmailCodeRequest,
    ): CancelablePromise<CommonResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/find-password/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 비밀번호 찾기 - 인증번호 발송
     * 아이디와 이메일이 일치하는지 확인 후 인증번호를 발송합니다.
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static sendCodeForFindPassword(
        requestBody: FindPasswordSendCodeRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/find-password/send-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 비밀번호 재설정
     * 비밀번호 재설정 토큰을 사용하여 새 비밀번호로 변경합니다.
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPasswordRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/find-password/reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 아이디 찾기 - 인증 확인 및 아이디 반환
     * 인증번호 검증 후 가입된 아이디를 반환합니다.
     * @param requestBody
     * @returns CommonResponseString OK
     * @throws ApiError
     */
    public static verifyCodeForFindId(
        requestBody: VerifyEmailCodeRequest,
    ): CancelablePromise<CommonResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/find-id/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 아이디 찾기 - 인증번호 발송
     * 가입된 이메일로 인증번호를 발송합니다.
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static sendCodeForFindId(
        requestBody: SendEmailCodeRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/find-id/send-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 회원 가입용 이메일 인증 확인
     * 회원 가입용 이메일 인증 코드를 검증합니다. (true: 검증 (일치) 완료, false: 검증 실패 (코드 불일치 및 이미 등록된 이메일)
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static verify(
        requestBody: VerifyEmailCodeRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/email/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 회원 가입용 이메일 인증 발송
     * 회원 가입용 이메일 인증 코드를 전송합니다. (universityId 존재 시 도메인 검사 진행)
     * @param requestBody
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static send(
        requestBody: SendEmailCodeRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/email/send-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 소셜 회원가입 완료
     * 소셜 로그인 후 추가 정보를 입력하여 회원가입을 완료합니다.
     * @param userId
     * @param requestBody
     * @returns CommonResponseLoginResponse 회원가입 완료 성공
     * @throws ApiError
     */
    public static completeSocialSignup(
        userId: number,
        requestBody: CompleteSocialSignupRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/complete-social-signup',
            query: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청`,
                404: `사용자 없음`,
                409: `이미 존재하는 소셜 정보`,
            },
        });
    }
    /**
     * [공통] 애플 로그인 (네이티브)
     * 애플 인증 후 발급받은 id_token을 통해 로그인/회원가입을 진행합니다.
     * @param requestBody
     * @returns CommonResponseLoginResponse 로그인 성공
     * @throws ApiError
     */
    public static appleLogin(
        requestBody: AppleLoginRequest,
    ): CancelablePromise<CommonResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/apple/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 토큰 또는 파라미터`,
                401: `인증/디코딩 실패`,
            },
        });
    }
    /**
     * [공통] 아이디 중복 확인
     * 아이디 사용 가능 여부를 확인합니다. (true: 사용 가능, false: 중복)
     * @param username
     * @returns CommonResponseBoolean OK
     * @throws ApiError
     */
    public static checkUsernameAvailability(
        username: string,
    ): CancelablePromise<CommonResponseBoolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/check-username',
            query: {
                'username': username,
            },
        });
    }
}
