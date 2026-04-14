/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseActivateCouponResponse } from '../models/CommonResponseActivateCouponResponse';
import type { CommonResponseDownloadCouponResponse } from '../models/CommonResponseDownloadCouponResponse';
import type { CommonResponseListDownloadCouponResponse } from '../models/CommonResponseListDownloadCouponResponse';
import type { CommonResponseListStudentCouponResponse } from '../models/CommonResponseListStudentCouponResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentCouponService {
    /**
     * [학생] 쿠폰 코드 발급
     * 매장에서 사용하기 위해 쿠폰을 활성화하고 4자리 코드를 발급받습니다.
     * @param studentCouponId 사용할 쿠폰 ID (download ID)
     * @returns CommonResponseActivateCouponResponse 쿠폰 활성화 성공 (코드 반환)
     * @throws ApiError
     */
    public static activateCoupon(
        studentCouponId: number,
    ): CancelablePromise<CommonResponseActivateCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/my-coupons/{studentCouponId}/activate',
            path: {
                'studentCouponId': studentCouponId,
            },
            errors: {
                404: `발급한 쿠폰 없음`,
                409: `이미 사용한 쿠폰`,
                422: `유효기간 만료`,
            },
        });
    }
    /**
     * [학생] 쿠폰 다운로드
     * 학생이 쿠폰을 다운로드받습니다.
     * @param couponId 쿠폰 ID
     * @returns CommonResponseDownloadCouponResponse 쿠폰 다운로드 성공
     * @throws ApiError
     */
    public static downloadCoupon(
        couponId: number,
    ): CancelablePromise<CommonResponseDownloadCouponResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student/coupons/{couponId}/download',
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
     * [학생] 상점별 쿠폰 목록 조회
     * 특정 상점의 학생용 쿠폰 목록을 조회합니다.
     * @param storeId 상점 ID
     * @returns CommonResponseListStudentCouponResponse 성공
     * @throws ApiError
     */
    public static getCouponsByStore2(
        storeId: number,
    ): CancelablePromise<CommonResponseListStudentCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/stores/{storeId}/coupons',
            path: {
                'storeId': storeId,
            },
            errors: {
                403: `학생 권한 필요`,
                404: `상점 없음`,
            },
        });
    }
    /**
     * [학생] 내 쿠폰 조회
     * 학생이 발급받은 쿠폰 목록을 조회합니다.
     * @returns CommonResponseListDownloadCouponResponse 성공
     * @throws ApiError
     */
    public static getMyCoupons(): CancelablePromise<CommonResponseListDownloadCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/my-coupons',
            errors: {
                403: `학생 권한 필요`,
            },
        });
    }
    /**
     * [학생] 오늘의 신규 쿠폰 조회
     * 학생의 소속 대학과 제휴된 매장에서 24시간 내에 발급된 쿠폰 목록을 조회합니다.
     * @returns CommonResponseListStudentCouponResponse 성공
     * @throws ApiError
     */
    public static getTodayCoupons(): CancelablePromise<CommonResponseListStudentCouponResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student/coupons/today',
            errors: {
                403: `학생 권한 필요`,
                404: `학생 프로필 없음`,
            },
        });
    }
}
