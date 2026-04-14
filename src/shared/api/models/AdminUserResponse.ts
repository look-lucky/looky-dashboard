/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminUserResponse = {
    id?: number;
    username?: string;
    role?: AdminUserResponse.role;
    socialType?: AdminUserResponse.socialType;
};
export namespace AdminUserResponse {
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
        KAKAO = 'KAKAO',
        APPLE = 'APPLE',
    }
}

