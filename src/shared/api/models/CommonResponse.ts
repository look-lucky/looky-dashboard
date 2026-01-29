export interface CommonResponse<T> {
    isSuccess: boolean;
    data: T;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    sort?: any;
}

export interface CommonResponsePageResponse<T> {
    isSuccess: boolean;
    data: PageResponse<T>;
}

export interface CommonResponseLong {
    isSuccess: boolean;
    data: number;
}

export interface CommonResponseVoid {
    isSuccess: boolean;
}
