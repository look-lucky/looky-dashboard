/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TargetOrganizationInfo } from './TargetOrganizationInfo';
import type { TargetUniversityInfo } from './TargetUniversityInfo';
export type AdminEventResponse = {
    id?: number;
    universityId?: number;
    title?: string;
    description?: string;
    subtitle?: string;
    eventTypes?: Array<'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP'>;
    latitude?: number;
    longitude?: number;
    startDateTime?: string;
    endDateTime?: string;
    place?: string;
    status?: AdminEventResponse.status;
    bannerImageUrl?: string;
    imageUrls?: Array<string>;
    createdAt?: string;
    targetUniversity?: TargetUniversityInfo;
    targetOrganizations?: Array<TargetOrganizationInfo>;
};
export namespace AdminEventResponse {
    export enum status {
        UPCOMING = 'UPCOMING',
        LIVE = 'LIVE',
        ENDED = 'ENDED',
    }
}

