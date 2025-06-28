import { LoginCredentials, RegisterData, User } from '../types';

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
        firstName: 'Patient',
        lastName: 'User',
        email: 'patient@example.com',
        role: 'customer',
        profileImage: '/patient-avatar.jpg'
    }
];

export const mockAuthService = {
    // Login user with mock data
    login: async (credentials: LoginCredentials) => {
        console.log('Mock login attempt:', credentials.email);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Find user by email
        const user = mockUsers.find(user => user.email === credentials.email);

        if (user && credentials.password === 'password') {
            // Generate a mock token
            const token = `mock-token-${user.role}-${Date.now()}`;

            // Store in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userRole', user.role);

            return { token, user };
        }

        throw new Error('Email hoặc mật khẩu không đúng.');
    },

    // Register with mock data
    register: async (userData: RegisterData) => {
        console.log('Mock register attempt:', userData.email);

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
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
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
    }
};

export default mockAuthService; 