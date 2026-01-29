/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCouponRequest = {
    title: string;
    description?: string;
    targetOrganizationId?: number;
    issueStartsAt?: string;
    issueEndsAt?: string;
    totalQuantity: number;
    limitPerUser: number;
    status?: CreateCouponRequest.status;
    targetItemIds?: Array<number>;
};
export namespace CreateCouponRequest {
    export enum status {
        DRAFT = 'DRAFT',
        SCHEDULED = 'SCHEDULED',
        ACTIVE = 'ACTIVE',
        STOPPED = 'STOPPED',
        EXPIRED = 'EXPIRED',
    }
}

