"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHandler = void 0;
class ApiResponseHandler {
    /**
     * Success response
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            status: statusCode,
            message,
            data,
        });
    }
    /**
     * Error response
     */
    static error(res, message, statusCode = 400, error) {
        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            message,
            error: error || message,
        });
    }
    /**
     * Created response (201)
     */
    static created(res, data, message = 'Created successfully') {
        return res.status(201).json({
            success: true,
            status: 201,
            message,
            data,
        });
    }
    /**
     * Not found response (404)
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            status: 404,
            message,
            error: message,
        });
    }
    /**
     * Unauthorized response (401)
     */
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            status: 401,
            message,
            error: message,
        });
    }
    /**
     * Forbidden response (403)
     */
    static forbidden(res, message = 'Forbidden') {
        return res.status(403).json({
            success: false,
            status: 403,
            message,
            error: message,
        });
    }
}
exports.ApiResponseHandler = ApiResponseHandler;
//# sourceMappingURL=apiResponse.js.map