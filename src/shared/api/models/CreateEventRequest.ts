export interface CreateEventRequest {
    title: string;
    content: string;
    startsAt: string;
    endsAt: string;
    eventUrl?: string;
    isPopup?: boolean;
    isBanner?: boolean;
    universityIds?: number[];
}
