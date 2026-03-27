/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type AdvertisementType = 'POPUP' | 'BANNER' | 'FLOATING';
export type AdvertisementStatus = 'SCHEDULED' | 'ACTIVE' | 'INACTIVE' | 'ENDED';
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface TargetUniversityInfo {
    id: number;
    name: string;
}

export interface TargetOrganizationInfo {
    id: number;
    name: string;
}

export interface AdminAdvertisementResponse {
    id: number;
    title: string;
    advertisementType: AdvertisementType;
    imageUrl: string;
    landingUrl: string | null;
    status: AdvertisementStatus;
    displayOrder: number;
    startAt: string;
    endAt: string;
    createdAt: string;
    targetUniversities: TargetUniversityInfo[];
    targetOrganizations: TargetOrganizationInfo[];
    targetGender: Gender | null;
}

export interface CreateAdvertisementRequest {
    title: string;
    advertisementType: AdvertisementType;
    imageUrl: string;
    landingUrl?: string | null;
    displayOrder: number;
    startAt: string;
    endAt: string;
    targetUniversityIds?: number[] | null;
    targetOrganizationIds?: number[] | null;
    targetGender?: Gender | null;
}

export interface UpdateAdvertisementRequest {
    title?: string | null;
    imageUrl?: string | null;
    landingUrl?: string | null;
    displayOrder?: number | null;
    startAt?: string | null;
    endAt?: string | null;
    status?: AdvertisementStatus | null;
    targetUniversityIds?: number[] | null;
    targetOrganizationIds?: number[] | null;
    targetGender?: Gender | null;
}

export interface PageResponseAdminAdvertisementResponse {
    content: AdminAdvertisementResponse[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    sort: string;
    last: boolean;
}

export class AdminAdvertisementService {
    /**
     * [관리자] 광고 목록 조회
     * 광고 목록을 조회합니다. 타입 및 상태 필터를 지원합니다.
     * @param page
     * @param size
     * @param type 광고 타입 필터 (POPUP / BANNER / FLOATING)
     * @param status 광고 상태 필터 (SCHEDULED / ACTIVE / INACTIVE / ENDED)
     * @returns 광고 목록 조회 성공
     * @throws ApiError
     */
    public static getAdvertisements(
        page: number = 0,
        size: number = 10,
        type?: AdvertisementType,
        status?: AdvertisementStatus,
    ): CancelablePromise<{ isSuccess: boolean; data: PageResponseAdminAdvertisementResponse }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/advertisements',
            query: {
                'type': type,
                'status': status,
                'pageable': { page, size },
            },
            errors: {
                403: `권한 없음`,
            },
        });
    }

    /**
     * [관리자] 광고 등록
     * 새로운 광고를 등록합니다.
     * @param requestBody
     * @returns 광고 등록 성공
     * @throws ApiError
     */
    public static createAdvertisement(
        requestBody: CreateAdvertisementRequest,
    ): CancelablePromise<{ isSuccess: boolean; data: number }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/advertisements',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
            },
        });
    }

    /**
     * [관리자] 광고 수정
     * 광고 정보 및 상태를 수정합니다. 상태는 활성화/비활성화만 가능합니다.
     * @param advertisementId 광고 ID
     * @param requestBody
     * @returns 광고 수정 성공
     * @throws ApiError
     */
    public static updateAdvertisement(
        advertisementId: number,
        requestBody: UpdateAdvertisementRequest,
    ): CancelablePromise<{ isSuccess: boolean }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/advertisements/{advertisementId}',
            path: {
                'advertisementId': advertisementId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음`,
                404: `광고 없음`,
            },
        });
    }

    /**
     * [관리자] 광고 삭제
     * 광고를 삭제합니다. S3 이미지도 함께 삭제됩니다.
     * @param advertisementId 광고 ID
     * @returns 광고 삭제 성공
     * @throws ApiError
     */
    public static deleteAdvertisement(
        advertisementId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/advertisements/{advertisementId}',
            path: {
                'advertisementId': advertisementId,
            },
            errors: {
                403: `권한 없음`,
                404: `광고 없음`,
            },
        });
    }
}
