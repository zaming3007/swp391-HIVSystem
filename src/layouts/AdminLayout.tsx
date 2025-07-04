import React from 'react';
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
    useMediaQuery
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    EventNote as EventNoteIcon,
    MedicalServices as MedicalServicesIcon,
    Message as MessageIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: '100%',
                    bgcolor: '#7E57C2'
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Quản trị hệ thống HIV Healthcare
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={!isMobile}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid #e0e0e0',
                        boxShadow: 'none'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        Bảng điều khiển
                    </Typography>
                </Box>
                <List sx={{ py: 0 }}>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/dashboard"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard & Báo cáo" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/users"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý người dùng" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/appointments"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý lịch hẹn" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/services"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <MedicalServicesIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý dịch vụ" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/consultations"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <MessageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý tư vấn" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/reports"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <AssessmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Báo cáo thống kê" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/admin/settings"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cài đặt hệ thống" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/auth/login"
                        sx={{
                            py: 1.5,
                            '&:hover': { bgcolor: 'rgba(126, 87, 194, 0.08)' },
                            '&.Mui-selected': { bgcolor: 'rgba(126, 87, 194, 0.16)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#7E57C2' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Đăng xuất" />
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f5f5f5',
                    p: 0,
                    width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh'
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