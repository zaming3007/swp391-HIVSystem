import { createApiClient } from './shared/apiClientFactory';

// Create API client for AppointmentApi
const appointmentApi = createApiClient({
    baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || 'http://localhost:5002/api',
    serviceName: 'AppointmentApi'
});

export default appointmentApi;