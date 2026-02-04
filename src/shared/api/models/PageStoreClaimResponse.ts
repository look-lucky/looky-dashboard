/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
import type { StoreClaimResponse } from './StoreClaimResponse';
export type PageStoreClaimResponse = {
    totalElements?: number;
    totalPages?: number;
    pageable?: PageableObject;
    first?: boolean;
    size?: number;
    content?: Array<StoreClaimResponse>;
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    last?: boolean;
    empty?: boolean;
};

