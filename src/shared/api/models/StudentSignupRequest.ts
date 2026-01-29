/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StudentSignupRequest = {
    username?: string;
    password?: string;
    nickname?: string;
    gender?: StudentSignupRequest.gender;
    birthDate?: string;
    universityId?: number;
    collegeId?: number;
    departmentId?: number;
};
export namespace StudentSignupRequest {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

