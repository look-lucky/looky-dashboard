/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponsePresignedUrlResponse } from '../models/CommonResponsePresignedUrlResponse';
import type { PresignedUrlRequest } from '../models/PresignedUrlRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * Presigned URL 발급
     * S3에 직접 업로드하기 위한 Presigned PUT URL을 발급합니다. 발급된 presignedUrl로 PUT 요청을 보내 파일을 업로드하고, 업로드 완료 후 fileUrl을 각 API에 전달하세요. 유효 시간은 10분입니다. S3 PUT 요청 시 Content-Type 헤더를 요청한 contentType과 동일하게 설정해야 합니다.
     * @param requestBody
     * @returns CommonResponsePresignedUrlResponse OK
     * @throws ApiError
     */
    public static getPresignedUrl(
        requestBody: PresignedUrlRequest,
    ): CancelablePromise<CommonResponsePresignedUrlResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/presigned-url',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
