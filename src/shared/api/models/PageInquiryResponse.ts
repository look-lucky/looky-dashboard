/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InquiryResponse } from './InquiryResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageInquiryResponse = {
    totalElements?: number;
    totalPages?: number;
    pageable?: PageableObject;
    first?: boolean;
    size?: number;
    content?: Array<InquiryResponse>;
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    last?: boolean;
    empty?: boolean;
};

