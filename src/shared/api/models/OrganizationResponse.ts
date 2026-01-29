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
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        STUDENT_COUNCIL = 'STUDENT_COUNCIL',
    }
}

