export interface CreateStoreRequest {
    name: string;
    bizRegNo?: string;
    roadAddress: string;
    jibunAddress?: string;
    latitude?: number;
    longitude?: number;
    storePhone?: string;
    representativeName?: string;
    introduction?: string;
    operatingHours?: string;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    universityIds?: number[];
    profileImageUrl?: string;
    imageUrls?: string[];
}
