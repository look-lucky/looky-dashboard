/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreCreateRequest } from './StoreCreateRequest';
export type OwnerSignupRequest = {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: OwnerSignupRequest.gender;
    birthDate?: string;
    storeList?: Array<StoreCreateRequest>;
};
export namespace OwnerSignupRequest {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

