import { AxiosError } from 'axios';
import { tokenManager } from './tokenManager';
import { logger } from './logger';

export interface ApiErrorResponse {
    message: string;
    status?: number;
    code?: string;
    details?: any;
}

/**
 * Centralized error handling service for API responses
 */
export class ErrorHandler {
    /**
     * Handle API errors with consistent logic across all services
     */
    handleApiError(error: AxiosError, serviceName: string, enableLogging: boolean = true): Promise<never> {
        if (enableLogging) {
            logger.error(`${serviceName} - API Error`, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                method: error.config?.method
            });
        }

        // Handle different error scenarios
        if (error.response) {
            const status = error.response.status;
            
            // Unauthorized - token expired or invalid
            if (status === 401) {
                this.handleUnauthorizedError(serviceName, enableLogging);
            }
            
            // Forbidden
            else if (status === 403) {
                this.handleForbiddenError(serviceName, enableLogging);
            }
            
            // Server errors
            else if (status >= 500) {
                this.handleServerError(error, serviceName, enableLogging);
            }
            
            // Client errors
            else if (status >= 400) {
                this.handleClientError(error, serviceName, enableLogging);
            }
        } 
        // Network errors
        else if (error.request) {
            this.handleNetworkError(error, serviceName, enableLogging);
        }
        // Other errors
        else {
            this.handleGenericError(error, serviceName, enableLogging);
        }

        // Enhance error with additional context
        const enhancedError = this.enhanceError(error, serviceName);
        return Promise.reject(enhancedError);
    }

    /**
     * Handle 401 Unauthorized errors
     */
    private handleUnauthorizedError(serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.warn(`${serviceName} - 401 Unauthorized: Clearing auth data and redirecting to login`);
        }
        
        // Clear authentication data
        tokenManager.clearAuth();
        
        // Redirect to login page
        window.location.href = '/auth/login';
    }

    /**
     * Handle 403 Forbidden errors
     */
    private handleForbiddenError(serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.warn(`${serviceName} - 403 Forbidden: Access denied`);
        }
    }

    /**
     * Handle server errors (5xx)
     */
    private handleServerError(error: AxiosError, serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.error(`${serviceName} - Server Error (${error.response?.status})`, {
                data: error.response?.data,
                url: error.config?.url
            });
        }
    }

    /**
     * Handle client errors (4xx)
     */
    private handleClientError(error: AxiosError, serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.warn(`${serviceName} - Client Error (${error.response?.status})`, {
                data: error.response?.data,
                url: error.config?.url
            });
        }
    }

    /**
     * Handle network errors
     */
    private handleNetworkError(error: AxiosError, serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.error(`${serviceName} - Network Error`, {
                message: error.message,
                code: error.code
            });
        }
    }

    /**
     * Handle generic errors
     */
    private handleGenericError(error: AxiosError, serviceName: string, enableLogging: boolean): void {
        if (enableLogging) {
            logger.error(`${serviceName} - Generic Error`, {
                message: error.message
            });
        }
    }

    /**
     * Enhance error with additional context and user-friendly messages
     */
    private enhanceError(error: AxiosError, serviceName: string): AxiosError {
        // Extract user-friendly error message
        let userMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        
        if (error.response?.data) {
            const data = error.response.data as any;
            
            if (typeof data === 'string') {
                userMessage = data;
            } else if (data.message) {
                userMessage = data.message;
            } else if (data.error) {
                userMessage = data.error;
            } else if (data.title) {
                userMessage = data.title;
            }
        }

        // Add enhanced message to error
        error.message = userMessage;
        
        return error;
    }

    /**
     * Extract error message from various error response formats
     */
    extractErrorMessage(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        if (error?.response?.data) {
            const data = error.response.data;
            
            if (typeof data === 'string') {
                return data;
            }
            
            if (data.message) return data.message;
            if (data.error) return data.error;
            if (data.title) return data.title;
            if (data.detail) return data.detail;
        }

        if (error?.message) {
            return error.message;
        }

        return 'Đã xảy ra lỗi không xác định';
    }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
