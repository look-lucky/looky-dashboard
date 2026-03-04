/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateItemRequest = {
    name?: string;
    price?: number;
    description?: string;
    isSoldOut?: boolean;
    itemOrder?: number;
    isRepresentative?: boolean;
    isHidden?: boolean;
    badge?: UpdateItemRequest.badge;
    itemCategoryId?: number;
    removeItemCategory?: boolean;
};
export namespace UpdateItemRequest {
    export enum badge {
        BEST = 'BEST',
        NEW = 'NEW',
        HOT = 'HOT',
        VEGAN = 'VEGAN',
    }
}

