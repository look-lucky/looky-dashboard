/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateItemRequest = {
    name: string;
    price?: number;
    description?: string;
    itemOrder?: number;
    badge?: CreateItemRequest.badge;
    itemCategoryId?: number;
    imageUrl?: string;
    hidden?: boolean;
    soldOut?: boolean;
    representative?: boolean;
};
export namespace CreateItemRequest {
    export enum badge {
        BEST = 'BEST',
        NEW = 'NEW',
        HOT = 'HOT',
        VEGAN = 'VEGAN',
    }
}

