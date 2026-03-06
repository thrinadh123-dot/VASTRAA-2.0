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

export class ApiResponseHandler {
    /**
     * Success response
     */
    static success<T>(res: any, data: T, message: string = 'Success', statusCode: number = 200): any {
        return res.status(statusCode).json({
            success: true,
            status: statusCode,
            message,
            data,
        } as ApiResponse<T>);
    }

    /**
     * Error response
     */
    static error(res: any, message: string, statusCode: number = 400, error?: string): any {
        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            message,
            error: error || message,
        } as ApiResponse);
    }

    /**
     * Created response (201)
     */
    static created<T>(res: any, data: T, message: string = 'Created successfully'): any {
        return res.status(201).json({
            success: true,
            status: 201,
            message,
            data,
        } as ApiResponse<T>);
    }

    /**
     * Not found response (404)
     */
    static notFound(res: any, message: string = 'Resource not found'): any {
        return res.status(404).json({
            success: false,
            status: 404,
            message,
            error: message,
        } as ApiResponse);
    }

    /**
     * Unauthorized response (401)
     */
    static unauthorized(res: any, message: string = 'Unauthorized'): any {
        return res.status(401).json({
            success: false,
            status: 401,
            message,
            error: message,
        } as ApiResponse);
    }

    /**
     * Forbidden response (403)
     */
    static forbidden(res: any, message: string = 'Forbidden'): any {
        return res.status(403).json({
            success: false,
            status: 403,
            message,
            error: message,
        } as ApiResponse);
    }
}
