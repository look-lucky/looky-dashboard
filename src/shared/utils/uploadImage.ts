import { UploadService } from '../api/services/UploadService';

/**
 * 이미지 파일을 S3에 업로드하고 최종 URL을 반환합니다.
 * 1. /api/presigned-url로 PUT URL 발급
 * 2. S3에 직접 PUT 업로드 (Content-Type 헤더 필수)
 * 3. fileUrl 반환
 */
export async function uploadImage(file: File): Promise<string> {
    const response = await UploadService.getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
    });

    const { presignedUrl, fileUrl } = response.data;

    await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    return fileUrl;
}

/**
 * 여러 이미지 파일을 병렬로 업로드하고 URL 배열을 반환합니다.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(uploadImage));
}
