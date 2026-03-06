export interface UpdateStoreRequest {
    name?: string;
    branch?: string;
    bizRegNo?: string;
    roadAddress?: string;
    jibunAddress?: string;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    storePhone?: string;
    introduction?: string;
    latitude?: number;
    longitude?: number;
    operatingHours?: string;
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    universityIds?: number[];
    preserveImageIds?: string[];
}
