/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DownloadCouponResponse = {
    studentCouponId?: number;
    couponCode?: string;
    status?: DownloadCouponResponse.status;
    downloadedAt?: string;
    expiresAt?: string;
    title?: string;
    benefitType?: DownloadCouponResponse.benefitType;
    benefitValue?: string;
    minOrderAmount?: number;
    storeName?: string;
    activationExpiresAt?: string;
};
export namespace DownloadCouponResponse {
    export enum status {
        UNUSED = 'UNUSED',
        ACTIVATED = 'ACTIVATED',
        USED = 'USED',
        EXPIRED = 'EXPIRED',
    }
    export enum benefitType {
        FIXED_DISCOUNT = 'FIXED_DISCOUNT',
        PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
        SERVICE_GIFT = 'SERVICE_GIFT',
    }
}

