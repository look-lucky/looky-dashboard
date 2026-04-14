/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableDouble } from './JsonNullableDouble';
import type { JsonNullableEventStatus } from './JsonNullableEventStatus';
import type { JsonNullableListEventType } from './JsonNullableListEventType';
import type { JsonNullableListLong } from './JsonNullableListLong';
import type { JsonNullableListString } from './JsonNullableListString';
import type { JsonNullableLocalDateTime } from './JsonNullableLocalDateTime';
import type { JsonNullableLong } from './JsonNullableLong';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 이벤트 수정 요청
 */
export type UpdateEventRequest = {
    title?: JsonNullableString;
    description?: JsonNullableString;
    subtitle?: JsonNullableString;
    eventTypes?: JsonNullableListEventType;
    place?: JsonNullableString;
    latitude?: JsonNullableDouble;
    longitude?: JsonNullableDouble;
    startDateTime?: JsonNullableLocalDateTime;
    endDateTime?: JsonNullableLocalDateTime;
    status?: JsonNullableEventStatus;
    universityId?: JsonNullableLong;
    targetOrganizationIds?: JsonNullableListLong;
    bannerImageUrl?: JsonNullableString;
    imageUrls?: JsonNullableListString;
};

