import axios from 'axios';

// Base API configuration
// Sử dụng local AuthApi server
const baseURL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response) {
            // Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
                // In a real app, you might want to redirect to login page
                window.location.href = '/auth/login';
            }

            // Server error
            if (error.response.status >= 500) {
                console.error('Server error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 