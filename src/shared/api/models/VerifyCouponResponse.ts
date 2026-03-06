/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VerifyCouponResponse = {
    studentCouponId?: number;
    studentNickname?: string;
    couponTitle?: string;
    benefitType?: VerifyCouponResponse.benefitType;
    benefitValue?: string;
    downloadedAt?: string;
    expiresAt?: string;
    isExpired?: boolean;
};
export namespace VerifyCouponResponse {
    export enum benefitType {
        FIXED_DISCOUNT = 'FIXED_DISCOUNT',
        PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
        SERVICE_GIFT = 'SERVICE_GIFT',
    }
}

