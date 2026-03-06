/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseStoreNewsCommentResponse } from '../models/CommonResponsePageResponseStoreNewsCommentResponse';
import type { CommonResponsePageResponseStoreNewsResponse } from '../models/CommonResponsePageResponseStoreNewsResponse';
import type { CommonResponseStoreNewsResponse } from '../models/CommonResponseStoreNewsResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateStoreNewsCommentRequest } from '../models/CreateStoreNewsCommentRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreNewsService {
    /**
     * [공통] 소식 목록 조회
     * 가게의 소식 목록을 조회합니다.
     * @param storeId 가게 ID
     * @param pageable 페이징 정보 (page, size, sort)
     * @returns CommonResponsePageResponseStoreNewsResponse OK
     * @throws ApiError
     */
    public static getStoreNewsList(
        storeId: number,
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseStoreNewsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/news',
            path: {
                'storeId': storeId,
            },
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * [점주] 소식 등록
     * 가게에 새로운 소식을 등록합니다.
     * @param storeId 가게 ID
     * @param formData
     * @returns CommonResponseLong 소식 등록 성공
     * @throws ApiError
     */
    public static createStoreNews(
        storeId: number,
        formData?: {
            /**
             * 소식 이미지 목록
             */
            images?: Array<Blob>;
            request: string;
        },
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/news',
            path: {
                'storeId': storeId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `권한 없음 (본인 가게 아님)`,
                404: `가게 찾을 수 없음`,
            },
        });
    }
    /**
     * [공통] 소식 좋아요 토글
     * 소식에 좋아요를 누르거나 취소합니다.
     * @param newsId 소식 ID
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static toggleLike(
        newsId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/store-news/{newsId}/likes',
            path: {
                'newsId': newsId,
            },
        });
    }
    /**
     * [공통] 댓글 목록 조회
     * 소식의 댓글 목록을 조회합니다.
     * @param newsId 소식 ID
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseStoreNewsCommentResponse OK
     * @throws ApiError
     */
    public static getComments(
        newsId: number,
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseStoreNewsCommentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/store-news/{newsId}/comments',
            path: {
                'newsId': newsId,
            },
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * [공통] 댓글 작성
     * 소식에 댓글을 작성합니다.
     * @param newsId 소식 ID
     * @param requestBody
     * @returns CommonResponseLong OK
     * @throws ApiError
     */
    public static createComment(
        newsId: number,
        requestBody: CreateStoreNewsCommentRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/store-news/{newsId}/comments',
            path: {
                'newsId': newsId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * [공통] 소식 상세 조회
     * 소식 상세 정보를 조회합니다.
     * @param newsId 소식 ID
     * @returns CommonResponseStoreNewsResponse OK
     * @throws ApiError
     */
    public static getStoreNews(
        newsId: number,
    ): CancelablePromise<CommonResponseStoreNewsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/store-news/{newsId}',
            path: {
                'newsId': newsId,
            },
        });
    }
    /**
     * [점주] 소식 삭제
     * 소식을 삭제합니다.
     * @param newsId 소식 ID
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static deleteStoreNews(
        newsId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/store-news/{newsId}',
            path: {
                'newsId': newsId,
            },
        });
    }
    /**
     * [점주] 소식 수정
     * 소식을 수정합니다.
     * @param newsId 소식 ID
     * @param formData
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static updateStoreNews(
        newsId: number,
        formData?: {
            /**
             * 변경할 소식 이미지 목록
             */
            images?: Array<Blob>;
            request: string;
        },
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/store-news/{newsId}',
            path: {
                'newsId': newsId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * [공통] 댓글 삭제
     * 자신의 댓글을 삭제합니다.
     * @param newsId 소식 ID
     * @param commentId 댓글 ID
     * @returns CommonResponseVoid OK
     * @throws ApiError
     */
    public static deleteComment(
        newsId: number,
        commentId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/store-news/{newsId}/comments/{commentId}',
            path: {
                'newsId': newsId,
                'commentId': commentId,
            },
        });
    }
}
