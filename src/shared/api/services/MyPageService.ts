/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { ChangeUsernameRequest } from '../models/ChangeUsernameRequest';
import type { CommonResponseOwnerInfoResponse } from '../models/CommonResponseOwnerInfoResponse';
import type { CommonResponseStudentInfoResponse } from '../models/CommonResponseStudentInfoResponse';
import type { CommonResponseVoid } from '../models/CommonResponseVoid';
import type { UpdateStudentProfileRequest } from '../models/UpdateStudentProfileRequest';
import type { UpdateUniversityRequest } from '../models/UpdateUniversityRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MyPageService {
    /**
     * [학생] 내 정보 조회
     * 학생의 대학, 단과대, 학과, 동아리 활동 여부를 조회합니다.
     * @returns CommonResponseStudentInfoResponse 조회 성공
     * @throws ApiError
     */
    public static getStudentInfo(): CancelablePromise<CommonResponseStudentInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mypage/student/profile',
            errors: {
                403: `학생 회원이 아님`,
                404: `학생 프로필 없음`,
            },
        });
    }
    /**
     * [학생] 프로필 수정
     * 학생의 프로필(닉네임, 단과대, 학과, 동아리 가입여부)을 수정합니다. 대학 변경은 별도 API 사용.
     * @param requestBody
     * @returns CommonResponseVoid 프로필 수정 성공
     * @throws ApiError
     */
    public static updateStudentProfile(
        requestBody: UpdateStudentProfileRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/mypage/student/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 조직 카테고리 요청`,
                403: `학생 회원이 아님`,
            },
        });
    }
    /**
     * [학생] 대학 변경
     * 학생의 소속 대학을 변경합니다. (기존 단과대/학과는 초기화됨)
     * @param requestBody
     * @returns CommonResponseVoid 대학 변경 성공
     * @throws ApiError
     */
    public static updateUniversity(
        requestBody: UpdateUniversityRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mypage/student/university',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `학생 회원이 아님`,
                404: `대학 정보 없음`,
            },
        });
    }
    /**
     * [공통] 아이디 변경
     * 사용자의 아이디를 변경합니다.
     * @param requestBody
     * @returns CommonResponseVoid 아이디 변경 성공
     * @throws ApiError
     */
    public static changeUsername(
        requestBody: ChangeUsernameRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mypage/change-username',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `잘못된 요청 데이터`,
                409: `이미 존재하는 아이디`,
            },
        });
    }
    /**
     * [공통] 비밀번호 변경
     * 사용자의 비밀번호를 변경합니다.
     * @param requestBody
     * @returns CommonResponseVoid 비밀번호 변경 성공
     * @throws ApiError
     */
    public static changePassword(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<CommonResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mypage/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `현재 비밀번호 불일치`,
            },
        });
    }
    /**
     * [점주] 내 정보 조회
     * 점주의 이름, 이메일, 아이디, 성별, 생년월일을 조회합니다.
     * @returns CommonResponseOwnerInfoResponse 조회 성공
     * @throws ApiError
     */
    public static getOwnerInfo(): CancelablePromise<CommonResponseOwnerInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mypage/owner/profile',
            errors: {
                403: `점주 회원이 아님`,
                404: `점주 프로필 없음`,
            },
        });
    }
}
