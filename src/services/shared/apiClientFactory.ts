import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { tokenManager } from './tokenManager';
import { errorHandler } from './errorHandler';
import { logger } from './logger';

export interface ApiClientConfig {
    baseURL: string;
    serviceName: string;
    timeout?: number;
    enableLogging?: boolean;
}

/**
 * Creates a configured axios instance with standardized interceptors
 * @param config Configuration for the API client
 * @returns Configured axios instance
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
    const {
        baseURL,
        serviceName,
        timeout = 10000,
        enableLogging = true
    } = config;

    // Create axios instance with base configuration
    const client = axios.create({
        baseURL,
        timeout,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor to add auth token and logging
    client.interceptors.request.use(
        (requestConfig) => {
            // Add authentication token
            const token = tokenManager.getToken();
            if (token) {
                requestConfig.headers.Authorization = `Bearer ${token}`;
                
                if (enableLogging) {
                    logger.debug(`${serviceName} - Adding token to request`, {
                        url: requestConfig.url,
                        method: requestConfig.method,
                        tokenPreview: token.substring(0, 15) + '...'
                    });
                }
            } else if (enableLogging) {
                logger.debug(`${serviceName} - No token found for request`, {
                    url: requestConfig.url,
                    method: requestConfig.method
                });
            }

            return requestConfig;
        },
        (error) => {
            if (enableLogging) {
                logger.error(`${serviceName} - Request error`, error);
            }
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    client.interceptors.response.use(
        (response) => {
            if (enableLogging) {
                logger.debug(`${serviceName} - Response received`, {
                    status: response.status,
                    url: response.config.url,
                    method: response.config.method
                });
            }
            return response;
        },
        (error: AxiosError) => {
            // Use centralized error handler
            return errorHandler.handleApiError(error, serviceName, enableLogging);
        }
    );

    return client;
}

/**
 * Pre-configured API clients for different services
 */
export const apiClients = {
    auth: () => createApiClient({
        baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api',
        serviceName: 'AuthApi'
    }),
    
    appointment: () => createApiClient({
        baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || 'http://localhost:5002/api',
        serviceName: 'AppointmentApi'
    }),
    
    arv: () => createApiClient({
        baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || 'http://localhost:5002/api',
        serviceName: 'ARVApi'
    })
};
