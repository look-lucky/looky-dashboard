export interface UpdateEventRequest {
    title?: string;
    content?: string;
    startsAt?: string;
    endsAt?: string;
    eventUrl?: string;
    isPopup?: boolean;
    isBanner?: boolean;
    universityIds?: number[];
    preserveImageIds?: string[];
}
