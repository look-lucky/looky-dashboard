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
    storeId?: number;
    storeName?: string;
};
export namespace PartnershipResponse {
    export enum category {
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        STUDENT_COUNCIL = 'STUDENT_COUNCIL',
    }
}

