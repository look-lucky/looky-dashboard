/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonResponsePageResponseAdminUserResponse } from '../models/CommonResponsePageResponseAdminUserResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { UserRoleUpdateRequest } from '../models/UserRoleUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUserService {
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
     * @returns CommonResponsePageResponseAdminUserResponse 조회 성공
     * @throws ApiError
     */
    public static getAllUsers(
        pageable: Pageable,
    ): CancelablePromise<CommonResponsePageResponseAdminUserResponse> {
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
}
