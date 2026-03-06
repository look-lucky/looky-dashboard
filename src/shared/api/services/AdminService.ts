/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponseCoordinate } from '../models/CommonResponseCoordinate';
import type { CommonResponsePageResponseUserResponse } from '../models/CommonResponsePageResponseUserResponse';
import type { CommonResponseString } from '../models/CommonResponseString';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { UserRoleUpdateRequest } from '../models/UserRoleUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * [관리자] 상점 데이터 엑셀 업로드
     * 상권 데이터를 엑셀로 업로드하여 DB에 저장 및 보정합니다.
     * @param formData
     * @returns CommonResponseString 업로드 성공 (작업 시작됨)
     * @throws ApiError
     */
    public static uploadStoreData(
        formData?: {
            /**
             * 엑셀 파일 (.xlsx)
             */
            file: Blob;
        },
    ): CancelablePromise<CommonResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/stores/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `잘못된 파일`,
                500: `서버 에러`,
            },
        });
    }
    /**
     * [관리자] 사용자 권한 수정
     * 사용자의 권한을 수정합니다.
     * @param userId
     * @param requestBody
     * @returns CommonResponseVoid 수정 성공
     * @throws ApiError
     */
    public static updateUserRole(
        userId: number,
        requestBody: UserRoleUpdateRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/users/{userId}/role',
            path: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `권한 없음`,
                404: `사용자 없음`,
            },
        });
    }
    /**
     * [관리자] 전체 사용자 목록 조회
     * 가입된 모든 사용자를 페이징하여 조회합니다.
     * @param pageable 페이징 정보
     * @returns CommonResponsePageResponseUserResponse 조회 성공
     * @throws ApiError
     */
    public static getAllUsers(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
            query: {
                'pageable': pageable,
            },
            errors: {
                403: `권한 없음`,
            },
        });
    }
    /**
     * [관리자] 주소로 위경도 변환
     * 주소를 입력받아 위도, 경도 좌표를 반환합니다.
     * @param address 도로명 주소 (예: 전라북도 전주시 덕진구 명륜3길 22)
     * @returns CommonResponseCoordinate 변환 성공
     * @throws ApiError
     */
    public static getGeocode(
        address: string,
    ): CancelablePromise<CommonResponseCoordinate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/stores/geocode',
            query: {
                'address': address,
            },
            errors: {
                400: `잘못된 주소/API 호출 에러`,
                500: `서버 에러`,
            },
        });
    }
}
