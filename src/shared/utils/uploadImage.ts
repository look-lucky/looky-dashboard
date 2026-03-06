import axios from 'axios';
import { UploadService } from '../api/services/UploadService';

/**
 * 이미지 파일을 S3에 업로드하고 최종 URL을 반환합니다.
 * 1. /api/presigned-url로 PUT URL 발급
 * 2. S3에 직접 PUT 업로드 (인터셉터 없는 깨끗한 axios 사용)
 * 3. fileUrl 반환
 */
export async function uploadImage(file: File): Promise<string> {
    const contentType = file.type || 'application/octet-stream';

    // 1. Presigned URL 발급 요청
    const response = await UploadService.getPresignedUrl({
        fileName: file.name,
        contentType: contentType,
    });

    const { presignedUrl, fileUrl } = response.data;

    // 2. S3에 직접 업로드
    // 전역 axios 인터셉터(Authorization 헤더 추가 등)의 영향을 받지 않기 위해 새 인스턴스 생성
    const uploadAxios = axios.create();

    try {
        await uploadAxios.put(presignedUrl, file, {
            headers: {
                'Content-Type': contentType,
            },
        });
    } catch (error) {
        console.error('S3 upload failed:', error);
        throw error;
    }

    return fileUrl;
}

/**
 * 여러 이미지 파일을 병렬로 업로드하고 URL 배열을 반환합니다.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(uploadImage));
}
