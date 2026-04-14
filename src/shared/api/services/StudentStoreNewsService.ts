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
export class StudentStoreNewsService {
    /**
     * [학생] 소식 좋아요 토글
     * 소식에 좋아요를 누르거나 취소합니다.
     * @param newsId 소식 ID
     * @returns CommonResponseVoid 성공
     * @throws ApiError
     */
    public static toggleLike(
        newsId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/store-news/{newsId}/likes',
            path: {
                'newsId': newsId,
            },
            errors: {
                404: `소식 찾을 수 없음`,
            },
        });
    }
    /**
     * [학생] 댓글 목록 조회
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
            url: '/api/student/store-news/{newsId}/comments',
            path: {
                'newsId': newsId,
            },
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * [학생] 댓글 작성
     * 소식에 댓글을 작성합니다.
     * @param newsId 소식 ID
     * @param requestBody
     * @returns CommonResponseLong 댓글 작성 성공
     * @throws ApiError
     */
    public static createComment(
        newsId: number,
        requestBody: CreateStoreNewsCommentRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/store-news/{newsId}/comments',
            path: {
                'newsId': newsId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `소식 찾을 수 없음`,
            },
        });
    }
    /**
     * [학생] 소식 목록 조회
     * 가게의 소식 목록을 조회합니다.
     * @param storeId 가게 ID
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseStoreNewsResponse OK
     * @throws ApiError
     */
    public static getStoreNewsList2(
        storeId: number,
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseStoreNewsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/{storeId}/news',
            path: {
                'storeId': storeId,
            },
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * [학생] 소식 상세 조회
     * 소식 상세 정보를 조회합니다.
     * @param newsId 소식 ID
     * @returns CommonResponseStoreNewsResponse OK
     * @throws ApiError
     */
    public static getStoreNews2(
        newsId: number,
    ): CancelablePromise<CommonResponseStoreNewsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/store-news/{newsId}',
            path: {
                'newsId': newsId,
            },
        });
    }
    /**
     * [학생] 댓글 삭제
     * 자신의 댓글을 삭제합니다.
     * @param newsId 소식 ID
     * @param commentId 댓글 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteComment(
        newsId: number,
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/student/store-news/{newsId}/comments/{commentId}',
            path: {
                'newsId': newsId,
                'commentId': commentId,
            },
            errors: {
                403: `권한 없음 (본인 댓글 아님)`,
                404: `댓글 찾을 수 없음`,
            },
        });
    }
}
