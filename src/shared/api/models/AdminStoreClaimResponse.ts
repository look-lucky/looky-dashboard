/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminStoreClaimResponse = {
    id?: number;
    storeId?: number;
    userId?: number;
    name?: string;
    storeName?: string;
    bizRegNo?: string;
    representativeName?: string;
    storePhone?: string;
    licenseImageUrl?: string;
    status?: AdminStoreClaimResponse.status;
    createdAt?: string;
    adminMemo?: string;
};
export namespace AdminStoreClaimResponse {
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
        CANCELED = 'CANCELED',
    }
}

