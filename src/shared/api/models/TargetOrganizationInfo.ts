/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TargetOrganizationInfo = {
    id?: number;
    name?: string;
    category?: TargetOrganizationInfo.category;
};
export namespace TargetOrganizationInfo {
    export enum category {
        COLLEGE = 'COLLEGE',
        DEPARTMENT = 'DEPARTMENT',
        UNIVERSITY_COUNCIL = 'UNIVERSITY_COUNCIL',
        CLUB_ASSOCIATION = 'CLUB_ASSOCIATION',
    }
}

