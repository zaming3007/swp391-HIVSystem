import axios from 'axios';

// Appointment API configuration
const baseURL = import.meta.env.VITE_APPOINTMENT_API_URL || 'http://localhost:5002/api';

const appointmentApi = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
appointmentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            console.log('Appointment API - Adding token to request:', token.substring(0, 15) + '...');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('Appointment API - No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Appointment API request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
appointmentApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response) {
            // Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                console.error('Appointment API - 401 Unauthorized error:', error.response.data);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
                // In a real app, you might want to redirect to login page
                window.location.href = '/auth/login';
            }

            // Server error
            if (error.response.status >= 500) {
                console.error('Appointment API - Server error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default appointmentApi; 