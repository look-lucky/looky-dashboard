/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartnershipInfo } from './PartnershipInfo';
export type StoreMapResponse = {
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    operatingHours?: string;
    myPartnerships?: Array<PartnershipInfo>;
    hasCoupon?: boolean;
    favoriteCount?: number;
};

