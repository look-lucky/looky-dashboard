/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateOrganizationRequest = {
    category: UpdateOrganizationRequest.category;
    name: string;
    parentId?: number;
    expiresAt?: string;
};
export namespace UpdateOrganizationRequest {
    export enum category {
        UNIVERSITY_COUNCIL = 'UNIVERSITY_COUNCIL',
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        CLUB_ASSOCIATION = 'CLUB_ASSOCIATION',
    }
}

