/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseIssueCouponResponse } from '../models/CommonResponseIssueCouponResponse';
import type { CommonResponseListCouponResponse } from '../models/CommonResponseListCouponResponse';
import type { CommonResponseListIssueCouponResponse } from '../models/CommonResponseListIssueCouponResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseString } from '../models/CommonResponseString';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateCouponRequest } from '../models/CreateCouponRequest';
import type { UpdateCouponRequest } from '../models/UpdateCouponRequest';
import type { VerifyCouponRequest } from '../models/VerifyCouponRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CouponService {
    /**
     * [공통] 상점별 쿠폰 목록 조회
     * 특정 상점의 모든 쿠폰을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListCouponResponse 성공
     * @throws ApiError
     */
    public static getCouponsByStore(
        storeId: number,
    ): CancelablePromise<CommonResponseListCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stores/{storeId}/coupons',
            path: {
                'storeId': storeId,
            },
            errors: {
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 쿠폰 생성
     * 상점의 새로운 쿠폰을 생성합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseLong 쿠폰 생성 성공
     * @throws ApiError
     */
    public static createCoupon(
        storeId: number,
        requestBody: CreateCouponRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/coupons',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터 (타 상점 물품 등)`,
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 쿠폰 사용 확인 (코드 검증)
     * 손님이 제시한 4자리 코드를 입력하여 사용 처리합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVoid 쿠폰 사용 완료
     * @throws ApiError
     */
    public static verifyCoupon(
        storeId: number,
        requestBody: VerifyCouponRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/coupons/verify',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `유효하지 않은 코드 또는 활성화되지 않은 쿠폰`,
            },
        });
    }
    /**
     * [학생] 쿠폰 코드 발급
     * 매장에서 사용하기 위해 쿠폰을 활성화하고 4자리 코드를 발급받습니다.
     * @param studentCouponId 사용자 쿠폰 ID (issue ID)
     * @returns CommonResponseString 쿠폰 활성화 성공 (코드 반환)
     * @throws ApiError
     */
    public static activateCoupon(
        studentCouponId: number,
    ): CancelablePromise<CommonResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/my-coupons/{studentCouponId}/activate',
            path: {
                'studentCouponId': studentCouponId,
            },
            errors: {
                404: `발급된 쿠폰 없음`,
                409: `이미 사용된 쿠폰`,
                422: `유효기간 만료`,
            },
        });
    }
    /**
     * [학생] 쿠폰 발급
     * 사용자가 쿠폰을 발급받습니다.
     * @param couponId 쿠폰 ID
     * @returns CommonResponseIssueCouponResponse 쿠폰 발급 성공
     * @throws ApiError
     */
    public static issueCoupon(
        couponId: number,
    ): CancelablePromise<CommonResponseIssueCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/coupons/{couponId}/issue',
            path: {
                'couponId': couponId,
            },
            errors: {
                404: `쿠폰 없음`,
                422: `재고 소진 / 발급 기간 아님 / 한도 초과`,
            },
        });
    }
    /**
     * [점주] 쿠폰 삭제
     * 쿠폰을 삭제합니다. (본인 상점만 가능)
     * @param couponId 쿠폰 ID
     * @returns void
     * @throws ApiError
     */
    public static deleteCoupon(
        couponId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/coupons/{couponId}',
            path: {
                'couponId': couponId,
            },
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `쿠폰 없음`,
            },
        });
    }
    /**
     * [점주] 쿠폰 수정
     * 쿠폰 정보를 수정합니다. (본인 상점만 가능)
     * @param couponId 쿠폰 ID
     * @param requestBody
     * @returns CommonResponseVoid 쿠폰 수정 성공
     * @throws ApiError
     */
    public static updateCoupon(
        couponId: number,
        requestBody: UpdateCouponRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/coupons/{couponId}',
            path: {
                'couponId': couponId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `쿠폰 없음`,
            },
        });
    }
    /**
     * [학생] 내 쿠폰 조회
     * 사용자가 발급받은 쿠폰 목록을 조회합니다.
     * @returns CommonResponseListIssueCouponResponse 성공
     * @throws ApiError
     */
    public static getMyCoupons(): CancelablePromise<CommonResponseListIssueCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/my-coupons',
        });
    }
    /**
     * [공통] 상품별 적용 가능 쿠폰 조회
     * 특정 상품에 적용 가능한 쿠폰 목록을 조회합니다.
     * @param itemId 상품 ID
     * @returns CommonResponseListCouponResponse 성공
     * @throws ApiError
     */
    public static getCouponsByItem(
        itemId: number,
    ): CancelablePromise<CommonResponseListCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/items/{itemId}/coupons',
            path: {
                'itemId': itemId,
            },
            errors: {
                404: `상품 없음`,
            },
        });
    }
}
