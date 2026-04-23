/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StorePartnershipResponse = {
    organizationCategory?: StorePartnershipResponse.organizationCategory;
    organizationName?: string;
    benefit?: string;
    isMyBenefit?: boolean;
};
export namespace StorePartnershipResponse {
    export enum organizationCategory {
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        UNIVERSITY_COUNCIL = 'UNIVERSITY_COUNCIL',
        CLUB_ASSOCIATION = 'CLUB_ASSOCIATION',
    }
}

