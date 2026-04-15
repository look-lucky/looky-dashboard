/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MyStoreClaimResponse = {
    id?: number;
    storeId?: number;
    storeName?: string;
    representativeName?: string;
    status?: MyStoreClaimResponse.status;
    rejectReason?: string;
    createdAt?: string;
};
export namespace MyStoreClaimResponse {
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
        CANCELED = 'CANCELED',
    }
}

