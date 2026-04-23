/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
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
    status?: EventResponse.status;
    bannerImageUrl?: string;
    imageUrls?: Array<string>;
    createdAt?: string;
};
export namespace EventResponse {
    export enum status {
        UPCOMING = 'UPCOMING',
        LIVE = 'LIVE',
        ENDED = 'ENDED',
    }
}

