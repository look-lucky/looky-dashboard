/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableCouponBenefitType } from './JsonNullableCouponBenefitType';
import type { JsonNullableCouponStatus } from './JsonNullableCouponStatus';
import type { JsonNullableInteger } from './JsonNullableInteger';
import type { JsonNullableLocalDateTime } from './JsonNullableLocalDateTime';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 쿠폰 수정 요청
 */
export type UpdateCouponRequest = {
    title?: JsonNullableString;
    issueStartsAt?: JsonNullableLocalDateTime;
    issueEndsAt?: JsonNullableLocalDateTime;
    validDays?: JsonNullableInteger;
    totalQuantity?: JsonNullableInteger;
    limitPerUser?: JsonNullableInteger;
    benefitType?: JsonNullableCouponBenefitType;
    benefitValue?: JsonNullableString;
    minOrderAmount?: JsonNullableInteger;
    status?: JsonNullableCouponStatus;
};

