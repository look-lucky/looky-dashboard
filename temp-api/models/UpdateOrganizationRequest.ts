/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableLocalDateTime } from './JsonNullableLocalDateTime';
import type { JsonNullableLong } from './JsonNullableLong';
import type { JsonNullableOrganizationCategory } from './JsonNullableOrganizationCategory';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 조직(단과대/학과 등) 수정 요청
 */
export type UpdateOrganizationRequest = {
    category?: JsonNullableOrganizationCategory;
    name?: JsonNullableString;
    parentId?: JsonNullableLong;
    expiresAt?: JsonNullableLocalDateTime;
};

