/**
 * Centralized token management service
 * Handles storage, retrieval, and cleanup of authentication tokens
 */
export class TokenManager {
    private readonly TOKEN_KEY = 'authToken';
    private readonly USER_KEY = 'user';
    private readonly USER_ROLE_KEY = 'userRole';

    /**
     * Get the current authentication token
     */
    getToken(): string | null {
        try {
            return localStorage.getItem(this.TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token from localStorage:', error);
            return null;
        }
    }

    /**
     * Set the authentication token
     */
    setToken(token: string): void {
        try {
            localStorage.setItem(this.TOKEN_KEY, token);
        } catch (error) {
            console.error('Error setting token in localStorage:', error);
        }
    }

    /**
     * Get the current user data
     */
    getUser(): any | null {
        try {
            const userStr = localStorage.getItem(this.USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting user from localStorage:', error);
            return null;
        }
    }

    /**
     * Set the user data
     */
    setUser(user: any): void {
        try {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error setting user in localStorage:', error);
        }
    }

    /**
     * Get the current user role
     */
    getUserRole(): string | null {
        try {
            return localStorage.getItem(this.USER_ROLE_KEY);
        } catch (error) {
            console.error('Error getting user role from localStorage:', error);
            return null;
        }
    }

    /**
     * Set the user role
     */
    setUserRole(role: string): void {
        try {
            localStorage.setItem(this.USER_ROLE_KEY, role);
        } catch (error) {
            console.error('Error setting user role in localStorage:', error);
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Clear all authentication data
     */
    clearAuth(): void {
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            localStorage.removeItem(this.USER_ROLE_KEY);
        } catch (error) {
            console.error('Error clearing auth data from localStorage:', error);
        }
    }

    /**
     * Set complete authentication data
     */
    setAuthData(token: string, user: any, role?: string): void {
        this.setToken(token);
        this.setUser(user);
        if (role) {
            this.setUserRole(role);
        }
    }
}

// Export singleton instance
export const tokenManager = new TokenManager();
