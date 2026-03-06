/**
 * Standardized API Response Utility
 * Ensures all endpoints return a consistent response format
 */
export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    message: string;
    data?: T;
    error?: string;
}
export declare class ApiResponseHandler {
    /**
     * Success response
     */
    static success<T>(res: any, data: T, message?: string, statusCode?: number): any;
    /**
     * Error response
     */
    static error(res: any, message: string, statusCode?: number, error?: string): any;
    /**
     * Created response (201)
     */
    static created<T>(res: any, data: T, message?: string): any;
    /**
     * Not found response (404)
     */
    static notFound(res: any, message?: string): any;
    /**
     * Unauthorized response (401)
     */
    static unauthorized(res: any, message?: string): any;
    /**
     * Forbidden response (403)
     */
    static forbidden(res: any, message?: string): any;
}
//# sourceMappingURL=apiResponse.d.ts.map