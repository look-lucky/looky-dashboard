export interface CreateItemRequest {
    name: string;
    price?: number;
    description?: string;
    itemOrder?: number;
    badge?: 'BEST' | 'NEW' | 'HOT' | 'VEGAN';
    itemCategoryId?: number;
    imageUrl?: string;
    hidden?: boolean;
    soldOut?: boolean;
    representative?: boolean;
}
