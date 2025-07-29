import { createApiClient } from './shared/apiClientFactory';

// Create API client for AuthApi
const api = createApiClient({
    baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api',
    serviceName: 'AuthApi'
});

export default api;