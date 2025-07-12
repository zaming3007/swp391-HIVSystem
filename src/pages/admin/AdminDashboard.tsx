import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Avatar,
    Button,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert
} from '@mui/material';
import {
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    LocalHospital as DoctorIcon,
    EventNote as AppointmentIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AnalyticsIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface SystemOverview {
    totalUsers: number;
    totalCustomers: number;
    totalDoctors: number;
    totalStaff: number;
    activeDoctors: number;
    newUsersThisMonth: number;
    totalAppointments: number;
    todayAppointments: number;
    thisWeekAppointments: number;
    pendingAppointments: number;
    userGrowthData: MonthlyUserGrowth[];
    appointmentsByDoctor: DoctorAppointmentCount[];
    systemHealth: SystemHealth;
}

interface MonthlyUserGrowth {
    month: string;
    monthName: string;
    newUsers: number;
    newCustomers: number;
    newDoctors: number;
}

interface DoctorAppointmentCount {
    doctorId: string;
    doctorName: string;
    appointmentCount: number;
    pendingCount: number;
    confirmedCount: number;
    completedCount: number;
}

interface SystemHealth {
    databaseStatus: string;
    lastBackup: string;
    systemUptime: string;
    activeSessions: number;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [overview, setOverview] = useState<SystemOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSystemOverview();
    }, []);

    const loadSystemOverview = async () => {
        try {
            setLoading(true);
            setError(null);

            // Debug: Check authentication
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('user');
            console.log('Debug - Token exists:', !!token);
            console.log('Debug - User:', user ? JSON.parse(user) : null);

            if (!token) {
                setError('Bạn cần đăng nhập để truy cập trang này');
                return;
            }

            const response = await api.get('/AdminAnalytics/overview');
            if (response.data.success) {
                setOverview(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải dữ liệu tổng quan');
            }
        } catch (error: any) {
            console.error('Error loading system overview:', error);
            console.error('Error details:', error.response?.data);
            console.error('Error status:', error.response?.status);

            if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản Admin.');
            } else if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                setError('Lỗi kết nối server');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getHealthColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'healthy':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'info';
        }
    };

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Đang tải dashboard...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={loadSystemOverview}>
                        Thử lại
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/admin/login')}>
                        Đăng nhập Admin
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!overview) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Alert severity="warning">
                    Không có dữ liệu để hiển thị
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard Quản trị
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Tổng quan hệ thống HIV Treatment Management
                </Typography>
            </Box>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Thao tác nhanh
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => navigate('/admin/doctors')}
                                    sx={{ py: 1.5 }}
                                >
                                    Quản lý bác sĩ
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AppointmentIcon />}
                                    onClick={() => navigate('/admin/appointments')}
                                    sx={{ py: 1.5 }}
                                >
                                    Quản lý lịch hẹn
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PeopleIcon />}
                                    onClick={() => navigate('/admin/users')}
                                    sx={{ py: 1.5 }}
                                >
                                    Quản lý người dùng
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AnalyticsIcon />}
                                    onClick={() => navigate('/admin/analytics')}
                                    sx={{ py: 1.5 }}
                                >
                                    Báo cáo chi tiết
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Main Statistics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PeopleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng người dùng
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.totalUsers}
                                    </Typography>
                                    <Typography variant="caption" color="success.main">
                                        +{overview.newUsersThisMonth} tháng này
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <DoctorIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Bác sĩ hoạt động
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.activeDoctors}/{overview.totalDoctors}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {Math.round((overview.activeDoctors / overview.totalDoctors) * 100)}% hoạt động
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <AppointmentIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Lịch hẹn hôm nay
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.todayAppointments}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {overview.thisWeekAppointments} tuần này
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <PendingIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chờ xác nhận
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.pendingAppointments}
                                    </Typography>
                                    <Typography variant="caption" color="warning.main">
                                        Cần xử lý
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detailed Information */}
            <Grid container spacing={3}>
                {/* Doctor Performance */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Hiệu suất bác sĩ
                            </Typography>
                            <List>
                                {overview.appointmentsByDoctor.slice(0, 5).map((doctor, index) => (
                                    <React.Fragment key={doctor.doctorId}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                    {index + 1}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={doctor.doctorName}
                                                secondary={
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                        <Chip
                                                            label={`${doctor.appointmentCount} lịch hẹn`}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                        <Chip
                                                            label={`${doctor.pendingCount} chờ`}
                                                            size="small"
                                                            color="warning"
                                                        />
                                                        <Chip
                                                            label={`${doctor.completedCount} hoàn thành`}
                                                            size="small"
                                                            color="success"
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < Math.min(overview.appointmentsByDoctor.length, 5) - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/admin/doctors')}
                            >
                                Xem tất cả bác sĩ
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* System Health */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tình trạng hệ thống
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Cơ sở dữ liệu"
                                        secondary={
                                            <Chip
                                                label={overview.systemHealth.databaseStatus}
                                                color={getHealthColor(overview.systemHealth.databaseStatus)}
                                                size="small"
                                            />
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <ScheduleIcon color="info" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Sao lưu gần nhất"
                                        secondary={formatDate(overview.systemHealth.lastBackup)}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <TrendingUpIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Phiên hoạt động"
                                        secondary={`${overview.systemHealth.activeSessions} người dùng online`}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* User Growth Trend */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Xu hướng tăng trưởng người dùng (12 tháng gần đây)
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={1}>
                                    {overview.userGrowthData.slice(-6).map((month) => (
                                        <Grid item xs={2} key={month.month}>
                                            <Paper sx={{ p: 1, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {month.monthName}
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    {month.newUsers}
                                                </Typography>
                                                <Typography variant="caption">
                                                    {month.newCustomers}C / {month.newDoctors}D
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/admin/analytics')}
                            >
                                Xem báo cáo chi tiết
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
