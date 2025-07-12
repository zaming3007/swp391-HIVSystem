import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
    IconButton,
    Divider,
    useTheme,
    Theme,
    CSSObject,
    ListItemButton
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    EventNote as EventNoteIcon,
    MedicalServices as MedicalServicesIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Logout as LogoutIcon,
    Home as HomeIcon,
    SettingsBackupRestore as CheckInIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Article as ArticleIcon,
    Assessment as ReportsIcon
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

const StaffLayout: React.FC = () => {
    const theme = useTheme();
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
                        Giao diện Nhân viên hỗ trợ
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
                        position: 'fixed',
                        height: '100vh',
                        zIndex: open ? theme.zIndex.drawer + 2 : theme.zIndex.drawer, // Higher z-index when open
                        boxShadow: open ? '0 8px 30px rgba(0,0,0,0.12)' : 'none', // Shadow when expanded
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
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="/staff"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
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
                            component="a"
                            href="/staff/appointments"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <EventNoteIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý lịch hẹn"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="/staff/consultations"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <QuestionAnswerIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý tư vấn"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="/staff/blog"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ArticleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quản lý Blog"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="/staff/reports"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ReportsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Báo cáo & Thống kê"
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
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
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
                    p: 3,
                    width: '100%',
                    ml: `${miniDrawerWidth}px`, // Always use mini drawer width
                    mt: 8,
                    minHeight: '100vh',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default StaffLayout; 