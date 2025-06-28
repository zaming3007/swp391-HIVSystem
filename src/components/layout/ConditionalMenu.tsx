import React from 'react';
import { Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { authService } from '../../services/authService';

interface MenuItemProps {
    to: string;
    label: string;
    isActive: boolean;
    requiredRoles?: string[];
}

const MenuItem: React.FC<MenuItemProps> = ({ to, label, isActive, requiredRoles = [] }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    // If no roles are required, or user has one of the required roles, show the menu item
    const shouldShow = requiredRoles.length === 0 ||
        (user && user.role && requiredRoles.includes(user.role));

    if (!shouldShow) {
        return null;
    }

    return (
        <Button
            component={RouterLink}
            to={to}
            sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                fontWeight: isActive ? 'bold' : 'normal',
                borderBottom: isActive ? '2px solid' : 'none',
                borderRadius: 0,
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                },
                fontSize: '0.85rem',
                px: 1
            }}
        >
            {label}
        </Button>
    );
};

interface ConditionalMenuProps {
    isActive: (path: string) => boolean;
}

const ConditionalMenu: React.FC<ConditionalMenuProps> = ({ isActive }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    return (
        <>
            {/* Public Menu Items - Shown to everyone */}
            <MenuItem to="/" label="Trang chủ" isActive={isActive('/')} />
            <MenuItem to="/services" label="Dịch vụ" isActive={isActive('/services')} />
            <MenuItem to="/about" label="Về chúng tôi" isActive={isActive('/about')} />
            <MenuItem to="/contact" label="Liên hệ" isActive={isActive('/contact')} />

            {/* Authenticated Only Menu Items */}
            {isAuthenticated && (
                <>
                    {/* Patient Menu Items */}
                    <MenuItem
                        to="/app/appointments"
                        label="Đặt lịch hẹn"
                        isActive={isActive('/app/appointments')}
                        requiredRoles={['customer']}
                    />
                    <MenuItem
                        to="/app/profile"
                        label="Hồ sơ cá nhân"
                        isActive={isActive('/app/profile')}
                        requiredRoles={['customer']}
                    />
                    <MenuItem
                        to="/app/reminder"
                        label="Nhắc nhở thuốc"
                        isActive={isActive('/app/reminder')}
                        requiredRoles={['customer']}
                    />
                    <MenuItem
                        to="/app/consultations"
                        label="Tư vấn"
                        isActive={isActive('/app/consultations')}
                        requiredRoles={['customer']}
                    />

                    {/* Doctor Menu Items */}
                    <MenuItem
                        to="/doctor"
                        label="Dashboard"
                        isActive={isActive('/doctor')}
                        requiredRoles={['doctor']}
                    />
                    <MenuItem
                        to="/doctor/appointments"
                        label="Lịch hẹn khám"
                        isActive={isActive('/doctor/appointments')}
                        requiredRoles={['doctor']}
                    />
                    <MenuItem
                        to="/doctor/patients"
                        label="Bệnh nhân"
                        isActive={isActive('/doctor/patients')}
                        requiredRoles={['doctor']}
                    />

                    {/* Staff Menu Items */}
                    <MenuItem
                        to="/staff"
                        label="Dashboard"
                        isActive={isActive('/staff')}
                        requiredRoles={['staff']}
                    />
                    <MenuItem
                        to="/staff/patients"
                        label="Danh sách bệnh nhân"
                        isActive={isActive('/staff/patients')}
                        requiredRoles={['staff']}
                    />
                    <MenuItem
                        to="/staff/check-in"
                        label="Check-in"
                        isActive={isActive('/staff/check-in')}
                        requiredRoles={['staff']}
                    />

                    {/* Admin Menu Items */}
                    <MenuItem
                        to="/admin"
                        label="Dashboard"
                        isActive={isActive('/admin')}
                        requiredRoles={['admin']}
                    />
                    <MenuItem
                        to="/admin/users"
                        label="Quản lý người dùng"
                        isActive={isActive('/admin/users')}
                        requiredRoles={['admin']}
                    />
                </>
            )}
        </>
    );
};

export default ConditionalMenu; 