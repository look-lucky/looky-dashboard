import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface PresignedUrlRequest {
    fileName: string;
    contentType: string;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    fileUrl: string;
}

export class UploadService {
    /**
     * Presigned URL 발급
     * S3에 직접 업로드하기 위한 Presigned PUT URL을 발급합니다.
     */
    public static getPresignedUrl(
        requestBody: PresignedUrlRequest,
    ): CancelablePromise<{ isSuccess: boolean; data: PresignedUrlResponse }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/presigned-url',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
