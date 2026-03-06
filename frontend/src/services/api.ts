import axios from 'axios';
import { toastService } from './toastService';

// Base API configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
    (response) => {
        // Unwrap ApiResponseHandler's { success, data, message } envelope
        // so thunks can access response.data.items / response.data.products directly
        if (response.data && response.data.success === true && response.data.data !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            toastService.error('Network error - please check your connection');
            return Promise.reject({
                message: 'Network Error',
                status: 0,
                isNetworkError: true,
            });
        }

        // If error is 401 (Unauthorized) and we haven't already retried
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh' &&
            originalRequest.url !== '/auth/login'
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the httpOnly refreshToken cookie
                await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, user is truly unauthenticated
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other error responses
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Something went wrong';

        return Promise.reject({
            response: error.response,
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default api;
