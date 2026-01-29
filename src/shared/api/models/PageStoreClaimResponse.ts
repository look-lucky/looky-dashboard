/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
import type { StoreClaimResponse } from './StoreClaimResponse';
export type PageStoreClaimResponse = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<StoreClaimResponse>;
    number?: number;
    sort?: SortObject;
    first?: boolean;
    last?: boolean;
    pageable?: PageableObject;
    numberOfElements?: number;
    empty?: boolean;
};

