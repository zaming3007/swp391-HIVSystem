import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { authService } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';

const AuthGuard: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        // Nếu chưa authenticated nhưng có token trong localStorage
        if (!isAuthenticated && authService.isAuthenticated()) {
            const storedUser = authService.getStoredUser();
            const token = localStorage.getItem('authToken');

            if (storedUser && token) {
                // Khôi phục trạng thái đăng nhập từ localStorage
                console.log('Restoring authentication state from localStorage');
                dispatch(loginSuccess({
                    user: storedUser,
                    token
                }));
            }
        }
    }, [isAuthenticated, dispatch]);

    // Nếu người dùng đã xác thực hoặc vừa được khôi phục từ localStorage
    if (isAuthenticated && user) {
        // If user is trying to access the root protected path, redirect to appropriate dashboard
        if (location.pathname === '/app' || location.pathname === '/app/') {
            switch (user.role) {
                case 'admin':
                    return <Navigate to="/admin" replace />;
                case 'doctor':
                    return <Navigate to="/doctor" replace />;
                case 'staff':
                    return <Navigate to="/staff" replace />;
                case 'customer':
                    return <Navigate to="/app/appointments" replace />;
                default:
                    // If role is invalid, log out and redirect to login
                    authService.logout();
                    return <Navigate to="/auth/login" replace />;
            }
        }
        return <Outlet />;
    }

    // Nếu không có xác thực, chuyển hướng đến trang đăng nhập
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default AuthGuard; 