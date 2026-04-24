/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponsePageResponseInquiryResponse } from '../models/CommonResponsePageResponseInquiryResponse';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminInquiryService {
    /**
     * [관리자] 문의 전체 목록 조회
     * 모든 사용자의 문의 내역을 조회합니다.
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseInquiryResponse 성공
     * @throws ApiError
     */
    public static getAllInquiries(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseInquiryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/inquiries',
            query: {
                'pageable': pageable,
            },
            errors: {
                403: `권한 없음 (관리자 아님)`,
            },
        });
    }
}
