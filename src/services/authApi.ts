import axios from 'axios';

// Auth API configuration
const baseURL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            console.log('Auth API - Adding token to request:', token.substring(0, 15) + '...');
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Full Authorization header:', `Bearer ${token.substring(0, 10)}...`);
        } else {
            console.log('Auth API - No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Auth API request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response) {
            // Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                console.error('Auth API - 401 Unauthorized error:', error.response.data);

                // Không tự động đăng xuất khi gặp lỗi 401 từ việc cập nhật profile
                // Chỉ đăng xuất khi endpoint không phải /Auth/profile
                const isProfileUpdate = error.config && error.config.url && error.config.url.includes('/profile');

                if (!isProfileUpdate) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userRole');
                    // In a real app, you might want to redirect to login page
                    window.location.href = '/auth/login';
                } else {
                    console.log('Profile update failed with 401, but not logging out user');
                }
            }

            // Server error
            if (error.response.status >= 500) {
                console.error('Auth API - Server error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default authApi; 