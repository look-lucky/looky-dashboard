/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 가게 정보 생성 요청
 */
export type StoreCreateRequest = {
    /**
     * 상호명
     */
    name: string;
    /**
     * 지점명
     */
    branch?: string;
    /**
     * 사업자등록번호
     */
    bizRegNo?: string;
    /**
     * 도로명 주소
     */
    roadAddress: string;
    /**
     * 지번 주소
     */
    jibunAddress?: string;
    /**
     * 위도
     */
    latitude?: number;
    /**
     * 경도
     */
    longitude?: number;
    /**
     * 가게 전화번호
     */
    storePhone?: string;
    /**
     * 대표자명
     */
    representativeName?: string;
    /**
     * 가게 소개
     */
    introduction?: string;
    /**
     * 영업 시간 (JSON 형식 권장)
     */
    operatingHours?: string;
    /**
     * 가게 카테고리 목록
     */
    storeCategories?: Array<'BAR' | 'CAFE' | 'RESTAURANT' | 'ENTERTAINMENT' | 'BEAUTY_HEALTH' | 'ETC'>;
    /**
     * 가게 분위기 목록
     */
    storeMoods?: Array<'SOLO_DINING' | 'GROUP_GATHERING' | 'LATE_NIGHT' | 'ROMANTIC'>;
    /**
     * 연결할 대학 ID 목록
     */
    universityIds?: Array<number>;
    /**
     * 프로필 이미지 URL
     */
    profileImageUrl?: string;
    /**
     * 갤러리 이미지 URL 목록 (최대 3장)
     */
    imageUrls?: Array<string>;
    /**
     * 메뉴판 이미지 URL 목록 (최대 10장)
     */
    menuBoardImageUrls?: Array<string>;
};

