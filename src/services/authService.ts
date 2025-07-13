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
        profileImage: '/admin-avatar.jpg',
        phone: '0123456789',
        gender: 'Male',
        dateOfBirth: '1990-01-01'
    },
    {
        id: '2',
        firstName: 'Doctor',
        lastName: 'User',
        email: 'doctor@example.com',
        role: 'doctor',
        profileImage: '/doctor-avatar.jpg',
        phone: '0987654321',
        gender: 'Female',
        dateOfBirth: '1985-05-15'
    },
    {
        id: '3',
        firstName: 'Staff',
        lastName: 'User',
        email: 'staff@example.com',
        role: 'staff',
        profileImage: '/staff-avatar.jpg',
        phone: '0123498765',
        gender: 'Male',
        dateOfBirth: '1992-10-20'
    },
    {
        id: '4',
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        role: 'customer',
        profileImage: '/customer-avatar.jpg',
        phone: '0987612345',
        gender: 'Female',
        dateOfBirth: '1995-03-25'
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

            // Ensure profileImage is never null
            const user = {
                ...response.data.user,
                profileImage: response.data.user.profileImage || ''
            };

            // Save token, user, and role to localStorage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userRole', user.role);
            return { token: response.data.token, user };
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
                phone: '',
                gender: '',
                dateOfBirth: ''
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

        try {
            console.log('Making API request to update profile:', userId, profileData);

            // Kiểm tra các trường bắt buộc trước khi gửi
            if (!profileData.firstName || !profileData.lastName) {
                throw new Error('Họ và tên là thông tin bắt buộc');
            }

            // Kiểm tra token trước khi gửi
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Bạn cần đăng nhập lại để thực hiện hành động này');
            }

            // Format lại dateOfBirth để đảm bảo đúng định dạng "YYYY-MM-DD" theo schema Users trong database
            let formattedDateOfBirth = profileData.dateOfBirth || '';
            if (formattedDateOfBirth && formattedDateOfBirth.includes('T')) {
                // Chuyển từ ISO format sang YYYY-MM-DD
                formattedDateOfBirth = formattedDateOfBirth.split('T')[0];
            }

            // Chuyển đổi dữ liệu theo đúng format mà API yêu cầu (UpdateProfileRequest)
            // và đảm bảo đúng với cấu trúc bảng Users trong database
            const updateData = {
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                gender: profileData.gender || '',
                dateOfBirth: formattedDateOfBirth,
                profileImage: profileData.profileImage || ''
            };

            console.log('Formatted update data DETAIL:', JSON.stringify(updateData, null, 2));

            try {
                // Gửi userId rõ ràng trong request body để khắc phục vấn đề xác thực
                const apiResponse = await authApi.put<User>(
                    `/Auth/profile`,
                    {
                        ...updateData,
                        userId: userId // Thêm userId vào request body
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Log để debug
                console.log('Update profile API response:', apiResponse.data);

                // Update user data in localStorage
                localStorage.setItem('user', JSON.stringify(apiResponse.data));
                localStorage.setItem('userRole', apiResponse.data.role);

                return apiResponse.data;

            } catch (apiError: any) {
                console.error('API error:', apiError);

                // Kiểm tra nếu lỗi là 401 Unauthorized
                if (apiError.response && apiError.response.status === 401) {
                    console.log('Unauthorized error detected, attempting to refresh session');

                    // Lưu thông tin người dùng hiện tại vào localStorage để tránh mất dữ liệu
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            const localUpdatedUser = {
                                ...user,
                                ...updateData
                            };
                            localStorage.setItem('user', JSON.stringify(localUpdatedUser));

                            // Thông báo người dùng phiên đăng nhập đã hết hạn
                            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để cập nhật thông tin.');
                        } catch (e) {
                            throw new Error('Lỗi xác thực: Vui lòng đăng nhập lại để tiếp tục.');
                        }
                    }
                }

                // Nếu không phải lỗi 401, rethrow lỗi gốc
                throw apiError;
            }
        } catch (error: any) {
            console.error('Update profile error:', error);

            // Xử lý và hiển thị các lỗi từ API
            if (error.response) {
                console.error('Error response FULL:', JSON.stringify(error.response.data, null, 2));
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);

                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                } else if (error.response.data && error.response.data.errors) {
                    // Xử lý validation errors từ ASP.NET Core
                    const validationErrors = Object.values(error.response.data.errors).flat();
                    throw new Error(validationErrors.join(', '));
                }
            }

            throw error; // Trả về lỗi gốc thay vì tạo lỗi mới
        }
    },

    // Change password
    changePassword: async (userId: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        if (USE_MOCK_DATA) {
            // Mock implementation - just pretend it succeeded
            console.log('Mock password change for user:', userId);
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: "Mật khẩu đã được thay đổi thành công" };
        }

        try {
            console.log('Making API request to change password for user:', userId);

            // Kiểm tra token trước khi gửi
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Bạn cần đăng nhập lại để thực hiện hành động này');
            }

            // Sửa đổi endpoint URL để phù hợp với API thực tế
            // Endpoint đúng sẽ là /Auth/change-password hoặc tương tự
            const response = await authApi.post<{ success: boolean; message: string }>(
                `/Auth/change-password`,
                {
                    userId,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Change password API response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Change password error:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                } else if (error.response.data && error.response.data.errors) {
                    // Xử lý validation errors từ ASP.NET Core
                    const validationErrors = Object.values(error.response.data.errors).flat();
                    throw new Error(validationErrors.join(', '));
                }
            }

            throw new Error('Không thể thay đổi mật khẩu. Vui lòng thử lại.');
        }
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

    // Send reset code to email
    sendResetCode: async (email: string) => {
        if (USE_MOCK_DATA) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                success: true,
                message: "Nếu email tồn tại trong hệ thống, mã xác minh đã được gửi",
                expiresIn: 300
            };
        }

        const response = await authApi.post<{
            success: boolean;
            message: string;
            expiresIn: number;
        }>('/Auth/send-reset-code', { email });
        return response.data;
    },

    // Verify reset code
    verifyResetCode: async (email: string, code: string) => {
        if (USE_MOCK_DATA) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500));
            if (code === '123456') {
                return {
                    success: true,
                    token: 'mock-temp-token',
                    message: "Mã xác minh đúng"
                };
            } else {
                throw new Error('Mã xác minh không đúng');
            }
        }

        const response = await authApi.post<{
            success: boolean;
            token: string;
            message: string;
        }>('/Auth/verify-reset-code', { email, code });
        return response.data;
    },

    // Reset password with token
    resetPasswordWithToken: async (token: string, newPassword: string, confirmPassword: string) => {
        if (USE_MOCK_DATA) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500));
            if (newPassword !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return {
                success: true,
                message: "Mật khẩu đã được cập nhật thành công"
            };
        }

        const response = await authApi.post<{
            success: boolean;
            message: string;
        }>('/Auth/reset-password-with-token', {
            token,
            newPassword,
            confirmPassword
        });
        return response.data;
    },

    // Legacy reset password method (keep for backward compatibility)
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