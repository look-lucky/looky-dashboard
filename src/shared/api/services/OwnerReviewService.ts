/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageResponseOwnerReviewResponse } from '../models/CommonResponsePageResponseOwnerReviewResponse';
import type { CommonResponseReviewStatsResponse } from '../models/CommonResponseReviewStatsResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateReviewRequest } from '../models/CreateReviewRequest';
import type { Pageable } from '../models/Pageable';
import type { ReportRequest } from '../models/ReportRequest';
import type { UpdateReviewRequest } from '../models/UpdateReviewRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OwnerReviewService {
    /**
     * [점주] 리뷰 답글 작성
     * 본인 상점의 리뷰에 답글을 작성합니다.
     * @param storeId 상점 ID
     * @param parentReviewId 원본 리뷰 ID
     * @param requestBody
     * @returns CommonResponseLong 답글 작성 성공
     * @throws ApiError
     */
    public static createReply1(
        storeId: number,
        parentReviewId: number,
        requestBody: CreateReviewRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/stores/{storeId}/reviews/{parentReviewId}/replies',
            path: {
                'storeId': storeId,
                'parentReviewId': parentReviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 또는 원본 리뷰 없음`,
            },
        });
    }
    /**
     * [점주] 리뷰 신고
     * 특정 리뷰를 신고합니다.
     * @param reviewId 리뷰 ID
     * @param requestBody
     * @returns CommonResponseVoid 리뷰 신고 성공
     * @throws ApiError
     */
    public static reportReview2(
        reviewId: number,
        requestBody: ReportRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/reviews/{reviewId}/reports',
            path: {
                'reviewId': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `리뷰 없음`,
            },
        });
    }
    /**
     * [점주] 리뷰 좋아요
     * 리뷰에 좋아요를 누릅니다.
     * @param reviewId 리뷰 ID
     * @returns CommonResponseVoid 좋아요 성공
     * @throws ApiError
     */
    public static addLike2(
        reviewId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/reviews/{reviewId}/likes',
            path: {
                'reviewId': reviewId,
            },
            errors: {
                400: `자신의 리뷰에 좋아요 시도`,
                404: `리뷰 없음`,
                409: `이미 좋아요 누름`,
            },
        });
    }
    /**
     * [점주] 리뷰 좋아요 취소
     * 리뷰 좋아요를 취소합니다.
     * @param reviewId 리뷰 ID
     * @returns CommonResponseVoid 좋아요 취소 성공
     * @throws ApiError
     */
    public static removeLike2(
        reviewId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/owner/reviews/{reviewId}/likes',
            path: {
                'reviewId': reviewId,
            },
            errors: {
                404: `좋아요를 누르지 않은 리뷰`,
            },
        });
    }
    /**
     * [점주] 답글 삭제
     * 작성한 답글을 삭제합니다. (본인만 가능)
     * @param reviewId 리뷰 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteReview2(
        reviewId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/owner/reviews/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
            errors: {
                403: `권한 없음 (본인 답글 아님)`,
                404: `답글 없음`,
            },
        });
    }
    /**
     * [점주] 답글 수정
     * 작성한 답글을 수정합니다. (본인만 가능)
     * @param reviewId 리뷰 ID
     * @param requestBody
     * @returns CommonResponseVoid 답글 수정 성공
     * @throws ApiError
     */
    public static updateReview2(
        reviewId: number,
        requestBody: UpdateReviewRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/owner/reviews/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 (본인 답글 아님)`,
                404: `답글 없음`,
            },
        });
    }
    /**
     * [점주] 상점 리뷰 목록 조회
     * 특정 상점의 리뷰 목록을 페이징하여 조회합니다.
     * @param storeId 상점 ID
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseOwnerReviewResponse 성공
     * @throws ApiError
     */
    public static getReviews2(
        storeId: number,
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseOwnerReviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores/{storeId}/reviews',
            path: {
                'storeId': storeId,
            },
            query: {
                'pageable': pageable,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 상점 리뷰 통계 조회
     * 상점의 평점 평균, 총 리뷰 수, 별점별 개수 분포를 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseReviewStatsResponse 성공
     * @throws ApiError
     */
    public static getReviewStats2(
        storeId: number,
    ): CancelablePromise<CommonResponseReviewStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores/{storeId}/reviews/stats',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 내 답글 목록 조회
     * 점주가 작성한 답글 목록을 조회합니다.
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseOwnerReviewResponse 성공
     * @throws ApiError
     */
    public static getMyReviews2(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseOwnerReviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/reviews/my',
            query: {
                'pageable': pageable,
            },
        });
    }
}
