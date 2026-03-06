export interface UpdateItemRequest {
    name?: string;
    price?: number;
    description?: string;
    isSoldOut?: boolean;
    itemOrder?: number;
    isRepresentative?: boolean;
    isHidden?: boolean;
    badge?: 'BEST' | 'NEW' | 'HOT' | 'VEGAN';
    itemCategoryId?: number;
    imageUrl?: string;
}
