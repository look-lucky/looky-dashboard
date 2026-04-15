/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableBoolean } from './JsonNullableBoolean';
import type { JsonNullableDouble } from './JsonNullableDouble';
import type { JsonNullableListLocalDate } from './JsonNullableListLocalDate';
import type { JsonNullableListStoreCategory } from './JsonNullableListStoreCategory';
import type { JsonNullableListStoreMood } from './JsonNullableListStoreMood';
import type { JsonNullableListString } from './JsonNullableListString';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 가게 정보 수정 요청
 */
export type StoreUpdateRequest = {
    name?: JsonNullableString;
    branch?: JsonNullableString;
    roadAddress?: JsonNullableString;
    jibunAddress?: JsonNullableString;
    latitude?: JsonNullableDouble;
    longitude?: JsonNullableDouble;
    phone?: JsonNullableString;
    representativeName?: JsonNullableString;
    introduction?: JsonNullableString;
    operatingHours?: JsonNullableString;
    storeCategories?: JsonNullableListStoreCategory;
    storeMoods?: JsonNullableListStoreMood;
    holidayDates?: JsonNullableListLocalDate;
    isSuspended?: JsonNullableBoolean;
    profileImageUrl?: JsonNullableString;
    imageUrls?: JsonNullableListString;
    menuBoardImageUrls?: JsonNullableListString;
};

