/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ItemResponse = {
    id?: number;
    storeId?: number;
    name?: string;
    price?: number;
    description?: string;
    imageUrl?: string;
    itemOrder?: number;
    badge?: ItemResponse.badge;
    hidden?: boolean;
    soldOut?: boolean;
    representative?: boolean;
};
export namespace ItemResponse {
    export enum badge {
        BEST = 'BEST',
        NEW = 'NEW',
        HOT = 'HOT',
        VEGAN = 'VEGAN',
    }
}

