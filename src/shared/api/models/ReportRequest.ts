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
        SPAM = 'SPAM',
        INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
        IRRELEVANT = 'IRRELEVANT',
        OTHER = 'OTHER',
    }
}

