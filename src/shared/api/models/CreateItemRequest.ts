export interface CreateItemRequest {
    name: string;
    price?: number;
    description?: string;
    badge?: 'BEST' | 'NEW' | 'HOT' | 'VEGAN' | string;
    itemOrder?: number;
}
