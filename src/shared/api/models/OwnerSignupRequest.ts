/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OwnerSignupRequest = {
    username?: string;
    password?: string;
    email?: string;
    gender?: OwnerSignupRequest.gender;
    birthDate?: string;
    name?: string;
};
export namespace OwnerSignupRequest {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

