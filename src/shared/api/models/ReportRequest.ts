/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportRequest = {
    reason: ReportRequest.reason;
    detail?: string;
};
export namespace ReportRequest {
    export enum reason {
        MALICIOUS_SLANDER = 'MALICIOUS_SLANDER',
        INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
        RIGHTS_VIOLATION = 'RIGHTS_VIOLATION',
        PRIVACY_INFRINGEMENT = 'PRIVACY_INFRINGEMENT',
        COMMERCIAL_PROMOTION = 'COMMERCIAL_PROMOTION',
        FRAUDULENT_REVIEW = 'FRAUDULENT_REVIEW',
        IRRELEVANT = 'IRRELEVANT',
        OTHER = 'OTHER',
    }
}

