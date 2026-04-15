/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 애플 소셜 로그인 요청 (앱 네이티브)
 */
export type AppleLoginRequest = {
    /**
     * Apple 인증 후 발급받은 JWT 형식의 id_token
     */
    idToken: string;
    /**
     * 유저의 이름 (Apple 로그인 최초 1회에만 제공됨. 없을 경우 null)
     */
    name?: string;
};

