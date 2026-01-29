export interface EventResponse {
    id: number;
    title: string;
    description: string;
    eventTypes: EventType[];
    latitude: number;
    longitude: number;
    startDateTime: string;
    endDateTime: string;
    imageUrls: string[];
}

export interface CreateEventRequest {
    title: string;
    description: string;
    eventTypes: EventType[];
    latitude: number;
    longitude: number;
    startDateTime: string;
    endDateTime: string;
}

export type EventType =
    | 'FOOD_EVENT'
    | 'POPUP_STORE'
    | 'SCHOOL_EVENT'
    | 'FLEA_MARKET'
    | 'PERFORMANCE'
    | 'COMMUNITY';

export interface UpdateEventRequest extends CreateEventRequest { }
