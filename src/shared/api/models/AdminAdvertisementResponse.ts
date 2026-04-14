/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TargetOrganizationInfo } from './TargetOrganizationInfo';
import type { TargetUniversityInfo } from './TargetUniversityInfo';
export type AdminAdvertisementResponse = {
    id?: number;
    title?: string;
    advertisementType?: AdminAdvertisementResponse.advertisementType;
    imageUrl?: string;
    landingUrl?: string;
    status?: AdminAdvertisementResponse.status;
    displayOrder?: number;
    startAt?: string;
    endAt?: string;
    createdAt?: string;
    targetUniversities?: Array<TargetUniversityInfo>;
    targetOrganizations?: Array<TargetOrganizationInfo>;
    targetGender?: AdminAdvertisementResponse.targetGender;
};
export namespace AdminAdvertisementResponse {
    export enum advertisementType {
        POPUP = 'POPUP',
        BANNER = 'BANNER',
        FLOATING = 'FLOATING',
    }
    export enum status {
        SCHEDULED = 'SCHEDULED',
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
        ENDED = 'ENDED',
    }
    export enum targetGender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        UNKNOWN = 'UNKNOWN',
    }
}

