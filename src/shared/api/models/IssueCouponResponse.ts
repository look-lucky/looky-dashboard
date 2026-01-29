/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IssueCouponResponse = {
    studentCouponId?: number;
    couponCode?: string;
    status?: IssueCouponResponse.status;
    issuedAt?: string;
    expiresAt?: string;
};
export namespace IssueCouponResponse {
    export enum status {
        UNUSED = 'UNUSED',
        ACTIVATED = 'ACTIVATED',
        USED = 'USED',
        EXPIRED = 'EXPIRED',
    }
}

