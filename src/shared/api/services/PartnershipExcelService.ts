/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartnershipExcelService {
    /**
     * [학생회/관리자] 제휴 엑셀 업로드
     * 엑셀 파일을 업로드하여 제휴 정보를 일괄 등록/수정합니다.
     * @param organizationId 대상 조직 ID (관리자용)
     * @param formData
     * @returns CommonResponseVoid 업로드 성공
     * @throws ApiError
     */
    public static uploadPartnershipData(
        organizationId?: number,
        formData?: {
            /**
             * 엑셀 파일
             */
            file: Blob;
        },
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/partnerships/upload',
            query: {
                'organizationId': organizationId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `데이터 검증 실패 (에러 메시지 포함)`,
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 제휴 등록 템플릿 다운로드
     * 특정 대학의 상점 리스트가 포함된 엑셀 템플릿을 다운로드합니다.
     * @param universityId 대상 대학 ID
     * @returns string 다운로드 성공
     * @throws ApiError
     */
    public static exportPartnershipTemplate(
        universityId: number,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/partnerships/template',
            query: {
                'universityId': universityId,
            },
            errors: {
                403: `권한 없음`,
            },
        });
    }
}
