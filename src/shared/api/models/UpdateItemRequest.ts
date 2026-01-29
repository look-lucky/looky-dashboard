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
};
export namespace UpdateItemRequest {
    export enum badge {
        BEST = 'BEST',
        NEW = 'NEW',
        HOT = 'HOT',
    }
}

