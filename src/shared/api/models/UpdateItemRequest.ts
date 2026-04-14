/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNullableBoolean } from './JsonNullableBoolean';
import type { JsonNullableInteger } from './JsonNullableInteger';
import type { JsonNullableItemBadge } from './JsonNullableItemBadge';
import type { JsonNullableLong } from './JsonNullableLong';
import type { JsonNullableString } from './JsonNullableString';
/**
 * 메뉴(상품) 수정 요청
 */
export type UpdateItemRequest = {
    name?: JsonNullableString;
    price?: JsonNullableInteger;
    description?: JsonNullableString;
    isSoldOut?: JsonNullableBoolean;
    itemOrder?: JsonNullableInteger;
    isRepresentative?: JsonNullableBoolean;
    isHidden?: JsonNullableBoolean;
    badge?: JsonNullableItemBadge;
    itemCategoryId?: JsonNullableLong;
    imageUrl?: JsonNullableString;
};

