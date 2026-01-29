/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCouponRequest = {
    title?: string;
    description?: string;
    issueStartsAt?: string;
    issueEndsAt?: string;
    totalQuantity?: number;
    limitPerUser?: number;
    status?: UpdateCouponRequest.status;
};
export namespace UpdateCouponRequest {
    export enum status {
        DRAFT = 'DRAFT',
        SCHEDULED = 'SCHEDULED',
        ACTIVE = 'ACTIVE',
        STOPPED = 'STOPPED',
        EXPIRED = 'EXPIRED',
    }
}

