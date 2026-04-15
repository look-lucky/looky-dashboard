/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableAdvertisementStatus } from './JsonNullableAdvertisementStatus';
import type { JsonNullableGender } from './JsonNullableGender';
import type { JsonNullableInteger } from './JsonNullableInteger';
import type { JsonNullableListLong } from './JsonNullableListLong';
import type { JsonNullableLocalDateTime } from './JsonNullableLocalDateTime';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 광고 수정 요청
 */
export type UpdateAdvertisementRequest = {
    title?: JsonNullableString;
    imageUrl?: JsonNullableString;
    landingUrl?: JsonNullableString;
    displayOrder?: JsonNullableInteger;
    startAt?: JsonNullableLocalDateTime;
    endAt?: JsonNullableLocalDateTime;
    status?: JsonNullableAdvertisementStatus;
    targetUniversityIds?: JsonNullableListLong;
    targetOrganizationIds?: JsonNullableListLong;
    targetGender?: JsonNullableGender;
};

