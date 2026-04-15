/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CouponResponse = {
    id?: number;
    storeId?: number;
    storeName?: string;
    title?: string;
    issueStartsAt?: string;
    issueEndsAt?: string;
    validDays?: number;
    totalQuantity?: number;
    limitPerUser?: number;
    status?: CouponResponse.status;
    benefitType?: CouponResponse.benefitType;
    benefitValue?: string;
    minOrderAmount?: number;
    downloadCount?: number;
    usedCount?: number;
    isDownloaded?: boolean;
};
export namespace CouponResponse {
    export enum status {
        ACTIVE = 'ACTIVE',
        SOLD_OUT = 'SOLD_OUT',
        EXPIRED = 'EXPIRED',
        WITHDRAWN_BY_OWNER = 'WITHDRAWN_BY_OWNER',
    }
    export enum benefitType {
        FIXED_DISCOUNT = 'FIXED_DISCOUNT',
        PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
        SERVICE_GIFT = 'SERVICE_GIFT',
    }
}

