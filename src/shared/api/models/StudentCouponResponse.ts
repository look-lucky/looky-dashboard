/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StudentCouponResponse = {
    id?: number;
    storeId?: number;
    storeName?: string;
    title?: string;
    issueStartsAt?: string;
    issueEndsAt?: string;
    validDays?: number;
    totalQuantity?: number;
    limitPerUser?: number;
    status?: StudentCouponResponse.status;
    benefitType?: StudentCouponResponse.benefitType;
    benefitValue?: string;
    minOrderAmount?: number;
    downloadCount?: number;
    isDownloaded?: boolean;
};
export namespace StudentCouponResponse {
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

