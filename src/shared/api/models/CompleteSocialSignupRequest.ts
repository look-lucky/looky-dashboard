/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CompleteSocialSignupRequest = {
    role?: CompleteSocialSignupRequest.role;
    gender?: CompleteSocialSignupRequest.gender;
    birthDate?: string;
    nickname?: string;
    universityId?: number;
    collegeId?: number;
    departmentId?: number;
    name?: string;
    email?: string;
    phone?: string;
};
export namespace CompleteSocialSignupRequest {
    export enum role {
        ROLE_GUEST = 'ROLE_GUEST',
        ROLE_COUNCIL = 'ROLE_COUNCIL',
        ROLE_STUDENT = 'ROLE_STUDENT',
        ROLE_OWNER = 'ROLE_OWNER',
        ROLE_ADMIN = 'ROLE_ADMIN',
    }
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

