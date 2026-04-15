/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StudentSignupRequest = {
    username?: string;
    password?: string;
    email?: string;
    nickname?: string;
    gender?: StudentSignupRequest.gender;
    birthDate?: string;
    universityId?: number;
    collegeId?: number;
    departmentId?: number;
    isClubMember?: boolean;
};
export namespace StudentSignupRequest {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

