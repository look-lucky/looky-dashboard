/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
    id?: number;
    title?: string;
    description?: string;
    eventTypes?: Array<'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP'>;
    latitude?: number;
    longitude?: number;
    place?: string;
    subtitle?: string;
    universityId?: number | null;
    startDateTime?: string;
    endDateTime?: string;
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

