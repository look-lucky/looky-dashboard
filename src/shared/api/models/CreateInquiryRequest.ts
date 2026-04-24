/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInquiryRequest = {
    type: CreateInquiryRequest.type;
    title: string;
    content: string;
    imageUrls?: Array<string>;
};
export namespace CreateInquiryRequest {
    export enum type {
        COUPON_BENEFIT = 'COUPON_BENEFIT',
        MAP_LOCATION = 'MAP_LOCATION',
        STORE_INFO_ERROR = 'STORE_INFO_ERROR',
        EVENT_PARTICIPATION = 'EVENT_PARTICIPATION',
        ALERT_ACCOUNT = 'ALERT_ACCOUNT',
        PROPOSAL_OTHER = 'PROPOSAL_OTHER',
    }
}

