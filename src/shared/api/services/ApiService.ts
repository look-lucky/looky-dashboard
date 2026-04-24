/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseInquiryResponse } from '../models/CommonResponseInquiryResponse';
import type { CommonResponseLong } from '../models/CommonResponseLong';
import type { CommonResponsePageInquiryResponse } from '../models/CommonResponsePageInquiryResponse';
import type { CreateInquiryRequest } from '../models/CreateInquiryRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * 내 문의 목록 조회
     * 내가 작성한 문의 목록을 조회합니다.
     * @param pageable 페이징 정보
     * @returns CommonResponsePageInquiryResponse OK
     * @throws ApiError
     */
    public static getInquiries(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageInquiryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/inquiries',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * 문의하기
     * 고객센터에 문의를 등록합니다.
     * @param requestBody
     * @returns CommonResponseLong 성공
     * @throws ApiError
     */
    public static createInquiry(
        requestBody: CreateInquiryRequest,
    ): CancelablePromise<CommonResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/inquiries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `입력값 검증 실패 (제목 길이, 이미지 개수 초과 등)`,
            },
        });
    }
    /**
     * 문의 상세 조회
     * 문의 상세 내용을 조회합니다.
     * @param inquiryId
     * @returns CommonResponseInquiryResponse 성공
     * @throws ApiError
     */
    public static getInquiry(
        inquiryId: number,
    ): CancelablePromise<CommonResponseInquiryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/inquiries/{inquiryId}',
            path: {
                'inquiryId': inquiryId,
            },
            errors: {
                403: `본인 문의 아님`,
                404: `문의 없음`,
            },
        });
    }
}
