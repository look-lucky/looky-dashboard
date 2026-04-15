/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseActivateCouponResponse } from '../models/CommonResponseActivateCouponResponse';
import type { CommonResponseDownloadCouponResponse } from '../models/CommonResponseDownloadCouponResponse';
import type { CommonResponseListCouponResponse } from '../models/CommonResponseListCouponResponse';
import type { CommonResponseListDownloadCouponResponse } from '../models/CommonResponseListDownloadCouponResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponseVerifyCouponResponse } from '../models/CommonResponseVerifyCouponResponse';
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
     * [점주] 쿠폰 사용 확정
     * 조회된 쿠폰을 실제로 사용 처리합니다.
     * @param storeId 상점 ID
     * @param studentCouponId 학생 쿠폰 ID
     * @returns CommonResponseVoid 쿠폰 사용 완료
     * @throws ApiError
     */
    public static useCoupon(
        storeId: number,
        studentCouponId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/coupons/{studentCouponId}/use',
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
     * 손님이 제시한 4자리 코드를 입력하여 혜택 및 사용자 정보를 확인합니다. (상태 변경 없음)
     * @param storeId 상점 ID
     * @param requestBody
     * @returns CommonResponseVerifyCouponResponse 쿠폰 조회 성공
     * @throws ApiError
     */
    public static verifyCoupon(
        storeId: number,
        requestBody: VerifyCouponRequest,
    ): CancelablePromise<CommonResponseVerifyCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stores/{storeId}/coupons/verify ',
            path: {
                'storeId': storeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `유효하지 않은 코드 또는 활성화되지 않은 쿠폰`,
                422: `만료된 쿠폰`,
            },
        });
    }
    /**
     * [학생] 쿠폰 코드 발급
     * 매장에서 사용하기 위해 쿠폰을 활성화하고 4자리 코드를 발급받습니다.
     * @param studentCouponId 사용자 쿠폰 ID (download ID)
     * @returns CommonResponseActivateCouponResponse 쿠폰 활성화 성공 (코드 반환)
     * @throws ApiError
     */
    public static activateCoupon(
        studentCouponId: number,
    ): CancelablePromise<CommonResponseActivateCouponResponse> {
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
     * [점주] 쿠폰 수동 만료
     * 점주가 자신의 쿠폰을 수동으로 만료시킵니다.
     * @param couponId 쿠폰 ID
     * @returns CommonResponseVoid 쿠폰 만료 성공
     * @throws ApiError
     */
    public static expireCoupon(
        couponId: number,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/coupons/{couponId}/expire',
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
     * [학생] 쿠폰 다운로드
     * 사용자가 쿠폰을 다운로드받습니다.
     * @param couponId 쿠폰 ID
     * @returns CommonResponseDownloadCouponResponse 쿠폰 다운로드 성공
     * @throws ApiError
     */
    public static downloadCoupon(
        couponId: number,
    ): CancelablePromise<CommonResponseDownloadCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/coupons/{couponId}/download',
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
     * @returns CommonResponseListDownloadCouponResponse 성공
     * @throws ApiError
     */
    public static getMyCoupons(): CancelablePromise<CommonResponseListDownloadCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/my-coupons',
        });
    }
    /**
     * [학생] 오늘의 신규 쿠폰 조회
     * 학생의 학교와 제휴된 매장에서 24시간 이내에 발급된 쿠폰 목록을 조회합니다.
     * @returns CommonResponseListCouponResponse 성공
     * @throws ApiError
     */
    public static getTodayCoupons(): CancelablePromise<CommonResponseListCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/coupons/today',
            errors: {
                403: `학생 권한 필요`,
            },
        });
    }
}
