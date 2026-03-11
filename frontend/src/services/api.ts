import axios from 'axios';
import { toastService } from '@/services/toastService';

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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Refresh lock to prevent concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

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

        console.log('API Error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            message: error.message
        });

        // Handle network errors
        if (!error.response) {
            console.error('Network error - Response missing:', error.message);
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
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token using the httpOnly refreshToken cookie
                await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                processQueue(); // Replay all queued requests
                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError); // Reject all queued requests
                console.error('Token refresh failed:', refreshError);
                // If refresh fails, user is truly unauthenticated
                localStorage.removeItem('userInfo');

                // ONLY redirect if we aren't already on the login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
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

/* ── Step 6: Saved Delivery Address System ─────────────────────────── */

/** Fetch Addresses */
export const fetchAddresses = () => api.get("/users/addresses");

/** Add Address */
export const addAddress = (data: any) => api.post("/users/addresses", data);

/** Delete Address */
export const deleteAddress = (id: string) => api.delete(`/users/addresses/${id}`);

