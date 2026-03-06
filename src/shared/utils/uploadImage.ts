import { UploadService } from '../api/services/UploadService';

/**
 * 이미지 파일을 S3에 업로드하고 최종 URL을 반환합니다.
 * 1. /api/presigned-url로 PUT URL 발급
 * 2. S3에 직접 PUT 업로드 (헤더 오염 방지를 위해 순수 fetch 사용)
 * 3. fileUrl 반환
 */
export async function uploadImage(file: File): Promise<string> {
    const contentType = file.type || 'application/octet-stream';

    // 1. Presigned URL 발급 요청
    const response = await UploadService.getPresignedUrl({
        fileName: file.name,
        contentType: contentType,
    });

    // API 응답 구조가 { isSuccess, data: { presignedUrl, fileUrl } } 임을 확인
    const { presignedUrl, fileUrl } = response.data;

    // 2. S3에 직접 업로드
    // axios 등의 라이브러리가 자동으로 추가하는 헤더(Authorization, Accept 등)를 완전히 배제하기 위해 순수 fetch 사용
    try {
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': contentType,
            },
            // 중요: S3 업로드 시 다른 헤더가 섞이지 않도록 함
            mode: 'cors',
            credentials: 'omit',
        });

        if (!uploadResponse.ok) {
            // S3의 에러 메시지(XML 형식)를 읽어서 더 자세한 정보 제공
            const errorText = await uploadResponse.text();
            console.error('S3 Upload Detail Error:', errorText);
            throw new Error(`S3 upload failed with status ${uploadResponse.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('S3 upload network/CORS error:', error);
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
