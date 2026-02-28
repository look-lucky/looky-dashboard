/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizationResponse = {
    id?: number;
    userId?: number;
    universityId?: number;
    universityName?: string;
    category?: OrganizationResponse.category;
    name?: string;
    expiresAt?: string;
};
export namespace OrganizationResponse {
    export enum category {
        UNIVERSITY_COUNCIL = 'UNIVERSITY_COUNCIL',
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        CLUB_ASSOCIATION = 'CLUB_ASSOCIATION',
    }
}

