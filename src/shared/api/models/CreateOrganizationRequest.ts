/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateOrganizationRequest = {
    category: CreateOrganizationRequest.category;
    name: string;
    parentId?: number;
    expiresAt?: string;
};
export namespace CreateOrganizationRequest {
    export enum category {
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        STUDENT_COUNCIL = 'STUDENT_COUNCIL',
    }
}

