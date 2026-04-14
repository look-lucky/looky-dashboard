/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminStoreClaimResponse } from './AdminStoreClaimResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageAdminStoreClaimResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    pageable?: PageableObject;
    size?: number;
    content?: Array<AdminStoreClaimResponse>;
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    last?: boolean;
    empty?: boolean;
};

