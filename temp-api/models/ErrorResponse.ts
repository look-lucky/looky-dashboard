/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorDetail } from './ErrorDetail';
export type ErrorResponse = {
    timestamp?: string;
    path?: string;
    code?: string;
    message?: string;
    details?: Array<ErrorDetail>;
};

