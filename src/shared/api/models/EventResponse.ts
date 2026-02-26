/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
    id?: number;
    title?: string;
    description?: string;
    eventTypes?: Array<'FOOD_EVENT' | 'POPUP_STORE' | 'SCHOOL_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'COMMUNITY'>;
    latitude?: number;
    longitude?: number;
    place?: string;
    subtitle?: string;
    universityId?: number;
    startDateTime?: string;
    endDateTime?: string;
    status?: EventResponse.status;
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

