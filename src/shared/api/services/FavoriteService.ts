/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseFavoriteStoreResponse } from '../models/CommonResponsePageResponseFavoriteStoreResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FavoriteService {
    /**
     * [학생] 상점 즐겨찾기 추가
     * 특정 상점을 단골 상점으로 등록합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseVoid 즐겨찾기 추가 성공
     * @throws ApiError
     */
    public static addFavorite(
        storeId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/favorites',
            path: {
                'storeId': storeId,
            },
            errors: {
                400: `본인 상점`,
                404: `상점 없음`,
                409: `이미 추가된 상점`,
            },
        });
    }
    /**
     * [학생] 상점 즐겨찾기 취소
     * 단골 상점 등록을 취소합니다.
     * @param storeId 상점 ID
     * @returns void
     * @throws ApiError
     */
    public static removeFavorite(
        storeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/stores/{storeId}/favorites',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [공통] 상점 즐겨찾기 수 조회
     * 특정 상점의 총 단골 수를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseLong 조회 성공
     * @throws ApiError
     */
    public static countFavorites(
        storeId: number,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/favorites/count',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [학생] 내 단골 상점 목록 조회
     * 내가 등록한 단골 상점 목록을 페이징하여 조회합니다.<br>정렬 기능: 찜한최신순(sort=createdAt,desc), 별점높은순(sort=store.averageRating,desc)
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseFavoriteStoreResponse 조회 성공
     * @throws ApiError
     */
    public static getMyFavorites(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseFavoriteStoreResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/favorites',
            query: {
                'pageable': pageable,
            },
        });
    }
}
