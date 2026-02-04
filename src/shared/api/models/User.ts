/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    createdAt?: string;
    modifiedAt?: string;
    createdBy?: string;
    lastModifiedBy?: string;
    id?: number;
    username?: string;
    password?: string;
    gender?: User.gender;
    birthDate?: string;
    role?: User.role;
    socialType?: User.socialType;
    socialId?: string;
    deleted?: boolean;
    deletedAt?: string;
    userId?: number;
};
export namespace User {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
    export enum role {
        ROLE_GUEST = 'ROLE_GUEST',
        ROLE_COUNCIL = 'ROLE_COUNCIL',
        ROLE_STUDENT = 'ROLE_STUDENT',
        ROLE_OWNER = 'ROLE_OWNER',
        ROLE_ADMIN = 'ROLE_ADMIN',
    }
    export enum socialType {
        LOCAL = 'LOCAL',
        GOOGLE = 'GOOGLE',
        NAVER = 'NAVER',
        KAKAO = 'KAKAO',
        FIREBASE = 'FIREBASE',
    }
}

