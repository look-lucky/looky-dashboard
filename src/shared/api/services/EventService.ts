import { default as axios } from 'axios';
import type { EventResponse, CreateEventRequest } from '../models/Event';
import type { CommonResponse, CommonResponsePageResponse, CommonResponseLong, CommonResponseVoid } from '../models/CommonResponse';

// Define specific response types based on Swagger if not in CommonResponse
// Re-using CommonResponse models created

// Reuse existing API_URL logic or import if available. 
// Assuming a standard setup similar to other services.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class EventService {
    static async getEvents(page: number = 0, size: number = 10, sort: string[] = ['id,desc'], keyword?: string, eventTypes?: string[]) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        sort.forEach(s => params.append('sort', s));

        if (keyword) params.append('keyword', keyword);
        if (eventTypes && eventTypes.length > 0) {
            eventTypes.forEach(type => params.append('eventTypes', type));
        }

        return axios.get<CommonResponsePageResponse<EventResponse>>(`${API_URL}/api/events`, { params });
    }

    static async getEvent(eventId: number) {
        return axios.get<CommonResponse<EventResponse>>(`${API_URL}/api/events/${eventId}`);
    }

    static async createEvent(data: CreateEventRequest, images: File[]) {
        const formData = new FormData();

        // Append JSON data as a Blob with application/json
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('request', jsonBlob);

        // Append images
        images.forEach((file) => {
            formData.append('images', file);
        });

        return axios.post<CommonResponseLong>(`${API_URL}/api/admin/events`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Since Update isn't explicitly detailed in the initial grep, I'm inferring from standard patterns or will leave it if not in swagger yet. 
    // Checking Swagger... 
    // Swagger snippet showed: /api/admin/events (POST). 
    // Let's check for PUT/PATCH /api/admin/events/{eventId} or similar.
    // The grep showed /api/admin/events/{eventId} but we didn't see the method.
    // I will assume standard update pattern but verify if needed. 
    // For now, I'll implement delete as I saw it in the list.

    static async deleteEvent(eventId: number) {
        return axios.delete<CommonResponseVoid>(`${API_URL}/api/admin/events/${eventId}`);
    }
}
