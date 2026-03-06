/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 카카오 소셜 로그인 요청 (앱 네이티브)
 */
export type KakaoLoginRequest = {
    /**
     * Kakao SDK를 통해 발급받은 Access Token
     */
    accessToken: string;
    /**
     * Kakao SDK를 통해 발급받은 ID Token (선택)
     */
    idToken?: string;
};

