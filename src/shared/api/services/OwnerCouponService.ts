/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseListOwnerCouponResponse } from '../models/CommonResponseListOwnerCouponResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVerifyCouponResponse } from '../models/CommonResponseVerifyCouponResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CreateCouponRequest } from '../models/CreateCouponRequest';
import type { UpdateCouponRequest } from '../models/UpdateCouponRequest';
import type { VerifyCouponRequest } from '../models/VerifyCouponRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OwnerCouponService {
    /**
     * [점주] 상점별 쿠폰 목록 조회
     * 본인 상점의 모든 쿠폰을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListOwnerCouponResponse 성공
     * @throws ApiError
     */
    public static getCouponsByStore1(
        storeId: number,
    ): CancelablePromise<CommonResponseListOwnerCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/owner/stores/{storeId}/coupons',
            path: {
                'storeId': storeId,
            },
            errors: {
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 쿠폰 생성
     * 상점에 새로운 쿠폰을 생성합니다.
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseLong 쿠폰 생성 성공
     * @throws ApiError
     */
    public static createCoupon1(
        storeId: number,
        requestBody: CreateCouponRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/stores/{storeId}/coupons',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                403: `권한 없음 (본인 소유 상점 아님)`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [점주] 쿠폰 사용 확정
     * 조회된 쿠폰을 실제로 사용 처리합니다.
     * @param storeId 상점 ID
     * @param studentCouponId 학생 쿠폰 ID
     * @returns CommonResponseVoid 쿠폰 사용 완료
     * @throws ApiError
     */
    public static useCoupon1(
        storeId: number,
        studentCouponId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/stores/{storeId}/coupons/{studentCouponId}/use',
            path: {
                'storeId': storeId,
                'studentCouponId': studentCouponId,
            },
            errors: {
                403: `권한 없음`,
                404: `쿠폰 없음`,
                422: `활성화되지 않은 쿠폰`,
            },
        });
    }
    /**
     * [점주] 쿠폰 코드 조회 (검증)
     * 손님이 제시한 4자리 코드를 입력하여 쿠폰 및 사용자 정보를 확인합니다. (상태 변경 없음)
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVerifyCouponResponse 쿠폰 조회 성공
     * @throws ApiError
     */
    public static verifyCoupon1(
        storeId: number,
        requestBody: VerifyCouponRequest,
    ): CancelablePromise<CommonResponseVerifyCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/stores/{storeId}/coupons/verify',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `유효하지 않은 코드이거나 활성화되지 않은 쿠폰`,
                422: `만료된 쿠폰`,
            },
        });
    }
    /**
     * [점주] 쿠폰 수동 만료
     * 점주가 자신의 쿠폰을 수동으로 만료 처리합니다.
     * @param couponId 쿠폰 ID
     * @returns CommonResponseVoid 쿠폰 만료 성공
     * @throws ApiError
     */
    public static expireCoupon(
        couponId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/owner/coupons/{couponId}/expire',
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
            url: '/api/owner/coupons/{couponId}',
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
            url: '/api/owner/coupons/{couponId}',
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
}
