import { LoginCredentials, RegisterData, User } from '../types';
import authApi from './authApi';

// Mock users for testing different roles
const mockUsers: User[] = [
    {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        profileImage: '/admin-avatar.jpg'
    },
    {
        id: '2',
        firstName: 'Doctor',
        lastName: 'User',
        email: 'doctor@example.com',
        role: 'doctor',
        profileImage: '/doctor-avatar.jpg'
    },
    {
        id: '3',
        firstName: 'Staff',
        lastName: 'User',
        email: 'staff@example.com',
        role: 'staff',
        profileImage: '/staff-avatar.jpg'
    },
    {
        id: '4',
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        role: 'customer',
        profileImage: '/customer-avatar.jpg'
    }
];

// Flag to use mock data instead of real API calls (set to false to use real API)
const USE_MOCK_DATA = false;

export const authService = {
    // Login user
    login: async (credentials: LoginCredentials) => {
        console.log('Login attempt:', credentials.email);

        if (USE_MOCK_DATA) {
            // Mock login implementation
            console.log('Using mock login');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Find user by email
            const user = mockUsers.find(user => user.email === credentials.email);

            if (user && credentials.password === 'password') {
                // Generate a mock token
                const token = `mock-token-${user.role}-${Date.now()}`;

                // Save token, user, and role to localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role);

                return { token, user };
            }

            throw new Error('Email hoặc mật khẩu không đúng.');
        }

        try {
            console.log('Making API request to /Auth/login...', { url: authApi.defaults.baseURL });
            const response = await authApi.post<{ token: string; user: User }>('/Auth/login', credentials);
            console.log('Login API response:', response.data);

            // Save token, user, and role to localStorage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('userRole', response.data.user.role);
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            } else if (error.request) {
                // Request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
            } else {
                // Something happened in setting up the request
                console.error('Request setup error:', error.message);
            }
            throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    },

    // Register new user
    register: async (userData: RegisterData) => {
        console.log('Register attempt:', userData.email);

        if (USE_MOCK_DATA) {
            // Mock register implementation
            console.log('Using mock register');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check if user already exists
            if (mockUsers.some(user => user.email === userData.email)) {
                throw new Error('Email đã được sử dụng.');
            }

            // Create new user (always as customer for new registrations)
            const newUser: User = {
                id: `${mockUsers.length + 1}`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: 'customer',
            };

            // Generate a mock token
            const token = `mock-token-customer-${Date.now()}`;

            // Store in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('userRole', newUser.role);

            return { token, user: newUser };
        }

        try {
            console.log('Making API request to /Auth/register...');
            const response = await authApi.post<{ token: string; user: User }>('/Auth/register', userData);
            console.log('Register API response:', response.data);

            // Save token, user, and role to localStorage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('userRole', response.data.user.role);
            return response.data;
        } catch (error: any) {
            console.error('Register error:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        if (USE_MOCK_DATA) {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            try {
                const user = JSON.parse(userStr);
                return user;
            } catch (e) {
                throw new Error('Không thể phân tích thông tin người dùng');
            }
        }

        try {
            const response = await authApi.get<User>('/Auth/me');
            // Update role in localStorage
            localStorage.setItem('userRole', response.data.role);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể lấy thông tin người dùng');
        }
    },

    // Update user profile
    updateProfile: async (userId: string, profileData: Partial<User>) => {
        if (USE_MOCK_DATA) {
            // For mock, just update the stored user
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            try {
                const user = JSON.parse(userStr);
                const updatedUser = { ...user, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            } catch (e) {
                throw new Error('Không thể cập nhật thông tin người dùng');
            }
        }

        const response = await authApi.put<User>(`/users/${userId}`, profileData);
        // Update user data in localStorage
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userRole', updatedUser.role);
        return updatedUser;
    },

    // Change password
    changePassword: async (userId: string, data: { oldPassword: string; newPassword: string }) => {
        if (USE_MOCK_DATA) {
            // Mock implementation - just pretend it succeeded
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }

        const response = await authApi.put<{ success: boolean }>(`/Auth/change-password/${userId}`, data);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        // Could also call an API endpoint to invalidate the token server-side
        // await api.post('/auth/logout');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        return !!token;
    },

    // Get stored user
    getStoredUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    // Get stored user role
    getUserRole: (): string | null => {
        return localStorage.getItem('userRole');
    },

    // Check if user has specific role
    hasRole: (role: string): boolean => {
        const userRole = localStorage.getItem('userRole');
        return userRole === role;
    },

    // Send password reset email
    requestPasswordReset: async (email: string) => {
        if (USE_MOCK_DATA) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }

        const response = await authApi.post<{ success: boolean }>('/Auth/password-reset-request', { email });
        return response.data;
    },

    // Reset password with token
    resetPassword: async (token: string, newPassword: string) => {
        if (USE_MOCK_DATA) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }

        const response = await authApi.post<{ success: boolean }>('/Auth/reset-password', { token, newPassword });
        return response.data;
    },

    // Utility function to clear localStorage and reset the system
    clearAndReset: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        console.log('LocalStorage cleared. Please log in again.');
        window.location.href = '/auth/login';
    }
}; 