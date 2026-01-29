/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StoreResponse = {
    id?: number;
    userId?: number;
    name?: string;
    roadAddress?: string;
    jibunAddress?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    introduction?: string;
    operatingHours?: string;
    needToCheck?: boolean;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    imageUrls?: Array<string>;
};

