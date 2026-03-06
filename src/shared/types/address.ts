import type { Address } from 'react-daum-postcode/lib/loadPostcode';

export type AddressSearchBaseData = Address;

export interface AddressSearchResultData extends Address {
    fullAddress: string;
}

export interface GeocodeResult {
    latitude?: number;
    longitude?: number;
    jibunAddress?: string;
}