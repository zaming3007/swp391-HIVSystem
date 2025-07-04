import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Box,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    ListItemIcon,
    Divider,
    IconButton
} from '@mui/material';
import {
    Person as PersonIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    AccountCircle as AccountCircleIcon,
    CalendarToday as CalendarIcon,
    MedicalServices as MedicalServicesIcon,
    Notifications as NotificationsIcon,
    Bloodtype as BloodtypeIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const AuthStatus: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        navigate('/auth/login');
    };

    const handleRegister = () => {
        navigate('/auth/register');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        handleClose();
    };

    const handleProfile = () => {
        navigate('/app/profile');
        handleClose();
    };

    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleLogin}
                >
                    Đăng nhập
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleRegister}
                >
                    Đăng ký
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
            </IconButton>
            <Typography
                variant="body2"
                sx={{
                    ml: 1,
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500
                }}
            >
                {user ? `${user.firstName} ${user.lastName}` : 'Người dùng'}
            </Typography>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        mt: 1.5,
                        width: 220,
                        overflow: 'visible',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                        {user ? `${user.firstName} ${user.lastName}` : 'Người dùng'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Hồ sơ cá nhân
                </MenuItem>
                <MenuItem onClick={() => { navigate('/appointment/my-appointments'); handleClose(); }}>
                    <ListItemIcon>
                        <CalendarIcon fontSize="small" />
                    </ListItemIcon>
                    Lịch hẹn đã đặt
                </MenuItem>
                <MenuItem onClick={() => { navigate('/app/medical-history'); handleClose(); }}>
                    <ListItemIcon>
                        <MedicalServicesIcon fontSize="small" />
                    </ListItemIcon>
                    Hồ sơ y tế
                </MenuItem>
                <MenuItem onClick={() => { navigate('/app/test-results'); handleClose(); }}>
                    <ListItemIcon>
                        <BloodtypeIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Kết quả xét nghiệm
                </MenuItem>
                <MenuItem onClick={() => { navigate('/app/reminder'); handleClose(); }}>
                    <ListItemIcon>
                        <NotificationsIcon fontSize="small" />
                    </ListItemIcon>
                    Nhắc nhở thuốc
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AuthStatus; 