/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 점주 정보 응답
 */
export type OwnerInfoResponse = {
    /**
     * 이름
     */
    name?: string;
    /**
     * 이메일
     */
    email?: string;
    /**
     * 아이디
     */
    username?: string;
    /**
     * 성별
     */
    gender?: OwnerInfoResponse.gender;
    /**
     * 생년월일
     */
    birthDate?: string;
};
export namespace OwnerInfoResponse {
    /**
     * 성별
     */
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

