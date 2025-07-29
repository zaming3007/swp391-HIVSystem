import { createApiClient } from './shared/apiClientFactory';
import { AxiosError } from 'axios';

// Create API client for AuthApi with custom error handling for profile updates
const authApi = createApiClient({
    baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api',
    serviceName: 'AuthApi'
});

// Add custom response interceptor for profile update handling
authApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Special handling for profile update 401 errors
        if (error.response?.status === 401) {
            const isProfileUpdate = error.config?.url?.includes('/profile');

            if (isProfileUpdate) {
                console.log('Profile update failed with 401, but not logging out user');
                // Don't trigger automatic logout for profile updates
                return Promise.reject(error);
            }
        }

        // For all other errors, let the default error handler manage them
        return Promise.reject(error);
    }
);

export default authApi;