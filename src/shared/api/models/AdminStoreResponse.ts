/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminStoreResponse = {
    id?: number;
    userId?: number;
    name?: string;
    branch?: string;
    roadAddress?: string;
    jibunAddress?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    representativeName?: string;
    introduction?: string;
    operatingHours?: string;
    needToCheck?: boolean;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    imageUrls?: Array<string>;
    menuBoardImageUrls?: Array<string>;
    averageRating?: number;
    reviewCount?: number;
    holidayDates?: Array<string>;
    isSuspended?: boolean;
    storeStatus?: AdminStoreResponse.storeStatus;
    cloverGrade?: AdminStoreResponse.cloverGrade;
    profileImageUrl?: string;
};
export namespace AdminStoreResponse {
    export enum storeStatus {
        UNCLAIMED = 'UNCLAIMED',
        ACTIVE = 'ACTIVE',
        BANNED = 'BANNED',
    }
    export enum cloverGrade {
        SEED = 'SEED',
        SPROUT = 'SPROUT',
        THREE_LEAF = 'THREE_LEAF',
    }
}

