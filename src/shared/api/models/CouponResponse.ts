/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CouponResponse = {
    id?: number;
    storeId?: number;
    title?: string;
    description?: string;
    targetOrganizationId?: number;
    issueStartsAt?: string;
    issueEndsAt?: string;
    totalQuantity?: number;
    limitPerUser?: number;
    status?: CouponResponse.status;
};
export namespace CouponResponse {
    export enum status {
        DRAFT = 'DRAFT',
        SCHEDULED = 'SCHEDULED',
        ACTIVE = 'ACTIVE',
        STOPPED = 'STOPPED',
        EXPIRED = 'EXPIRED',
    }
}

