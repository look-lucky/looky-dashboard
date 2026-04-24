/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PartnershipResponse = {
    id?: number;
    organizationId?: number;
    organizationName?: string;
    universityName?: string;
    category?: PartnershipResponse.category;
    benefit?: string;
    startsAt?: string;
    endsAt?: string;
    storeId?: number;
    storeName?: string;
};
export namespace PartnershipResponse {
    export enum category {
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        UNIVERSITY_COUNCIL = 'UNIVERSITY_COUNCIL',
        CLUB_ASSOCIATION = 'CLUB_ASSOCIATION',
    }
}

