export type EventType = 'SCHOOL_EVENT' | 'STUDENT_EVENT' | 'FOOD_EVENT' | 'FLEA_MARKET' | 'PERFORMANCE' | 'BRAND_POPUP';

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    subtitle?: string;
    eventTypes?: EventType[];
    place?: string;
    latitude?: number;
    longitude?: number;
    startDateTime?: string;
    endDateTime?: string;
    universityId?: number | null;
    bannerImageUrl?: string;
    imageUrls?: string[];
}
