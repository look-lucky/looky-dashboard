/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreImage } from './StoreImage';
import type { StoreUniversity } from './StoreUniversity';
import type { User } from './User';
export type Store = {
    createdAt?: string;
    modifiedAt?: string;
    createdBy?: string;
    lastModifiedBy?: string;
    id?: number;
    name?: string;
    branch?: string;
    bizRegNo?: string;
    roadAddress?: string;
    jibunAddress?: string;
    latitude?: number;
    longitude?: number;
    storePhone?: string;
    needToCheck?: boolean;
    checkReason?: string;
    introduction?: string;
    operatingHours?: string;
    storeStatus?: Store.storeStatus;
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    user?: User;
    images?: Array<StoreImage>;
    universities?: Array<StoreUniversity>;
};
export namespace Store {
    export enum storeStatus {
        UNCLAIMED = 'UNCLAIMED',
        ACTIVE = 'ACTIVE',
        BANNED = 'BANNED',
    }
}

