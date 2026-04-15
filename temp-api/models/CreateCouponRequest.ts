/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCouponRequest = {
    title: string;
    issueStartsAt?: string;
    issueEndsAt?: string;
    validDays: number;
    totalQuantity?: number;
    limitPerUser: number;
    benefitType: CreateCouponRequest.benefitType;
    benefitValue?: string;
    minOrderAmount?: number;
    status?: CreateCouponRequest.status;
};
export namespace CreateCouponRequest {
    export enum benefitType {
        FIXED_DISCOUNT = 'FIXED_DISCOUNT',
        PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
        SERVICE_GIFT = 'SERVICE_GIFT',
    }
    export enum status {
        ACTIVE = 'ACTIVE',
        SOLD_OUT = 'SOLD_OUT',
        EXPIRED = 'EXPIRED',
        WITHDRAWN_BY_OWNER = 'WITHDRAWN_BY_OWNER',
    }
}

