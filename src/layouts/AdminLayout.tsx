import React, { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    ListItemButton,
    Theme,
    CSSObject
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    MedicalServices as MedicalServicesIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Assessment as AssessmentIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Home as HomeIcon,
    PersonAdd as PersonAddIcon,
    Article as ArticleIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const miniDrawerWidth = 64;

// Define mixins for drawer open/close states
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: miniDrawerWidth,
});

const AdminLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Backdrop when sidebar is open */}
            {open && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: theme.zIndex.drawer + 1,
                        display: { xs: 'block', sm: 'none' }, // Only show on mobile
                    }}
                    onClick={handleDrawerToggle}
                />
            )}

            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 3, // Above drawer and backdrop
                    width: '100%',
                    ml: 0,
                    bgcolor: '#7E57C2'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Quản trị hệ thống HIV Healthcare
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleGoHome}
                        sx={{ mr: 1 }}
                        title="Quay về trang chủ"
                    >
                        <HomeIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: miniDrawerWidth, // Always mini width to not affect layout
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        whiteSpace: 'nowrap',
                        ...(open ? openedMixin(theme) : closedMixin(theme)),
                        borderRight: '1px solid #e0e0e0',
                        boxShadow: open ? '0 8px 30px rgba(0,0,0,0.12)' : 'none', // Shadow when expanded
                        position: 'fixed',
                        height: '100vh',
                        zIndex: open ? theme.zIndex.drawer + 2 : theme.zIndex.drawer, // Higher z-index when open
                    },
                }}
                open={open}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'flex-end' : 'center',
                        px: [1],
                        minHeight: '64px !important',
                    }}
                >
                    {open && (
                        <IconButton onClick={handleDrawerToggle}>
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                    {!open && (
                        <IconButton onClick={handleDrawerToggle}>
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </Toolbar>
                <Divider />
                {open && (
                    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            Bảng điều khiển
                        </Typography>
                    </Box>
                )}
                <List sx={{ py: 0 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin/dashboard"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Dashboard"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin/users"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý người dùng"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin/doctors"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <PersonAddIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý bác sĩ"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>


                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin/services"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <MedicalServicesIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý dịch vụ"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>


                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin/settings"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Cài đặt hệ thống"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                                '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#7E57C2'
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Đăng xuất"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f5f5f5',
                    p: 0,
                    width: '100%',
                    ml: `${miniDrawerWidth}px`, // Always use mini drawer width
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout; 