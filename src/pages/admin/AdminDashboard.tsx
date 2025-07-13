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
    TrendingUp as TrendingUpIcon,
    Assessment as AnalyticsIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    MedicalServices as MedicalServicesIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface SystemOverview {
    totalUsers: number;
    totalCustomers: number;
    totalDoctors: number;
    totalStaff: number;
    activeDoctors: number;
    newUsersThisMonth: number;
    userGrowthData: MonthlyUserGrowth[];
    systemHealth: SystemHealth;
}

interface MonthlyUserGrowth {
    month: string;
    monthName: string;
    newUsers: number;
    newCustomers: number;
    newDoctors: number;
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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    🏥 Dashboard Quản trị
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Quản lý toàn diện hệ thống HIV Treatment & Medical Services
                </Typography>
            </Box>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            ⚡ Thao tác nhanh
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<PeopleIcon />}
                                    onClick={() => navigate('/admin/users')}
                                    sx={{
                                        py: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    Quản lý người dùng
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => navigate('/admin/doctors')}
                                    sx={{
                                        py: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    Quản lý bác sĩ
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<MedicalServicesIcon />}
                                    onClick={() => navigate('/admin/services')}
                                    sx={{
                                        py: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    Quản lý dịch vụ
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<SettingsIcon />}
                                    onClick={() => navigate('/admin/settings')}
                                    sx={{
                                        py: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    Cài đặt hệ thống
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Main Statistics */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                📊 Thống kê tổng quan
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, backdropFilter: 'blur(10px)' }}>
                                    <PeopleIcon sx={{ color: 'white' }} />
                                </Avatar>
                                <Box>
                                    <Typography color="rgba(255,255,255,0.8)" gutterBottom>
                                        Tổng người dùng
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {overview.totalUsers}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#90EE90' }}>
                                        +{overview.newUsersThisMonth} tháng này
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, backdropFilter: 'blur(10px)' }}>
                                    <DoctorIcon sx={{ color: 'white' }} />
                                </Avatar>
                                <Box>
                                    <Typography color="rgba(255,255,255,0.8)" gutterBottom>
                                        Bác sĩ hoạt động
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {overview.activeDoctors}/{overview.totalDoctors}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#90EE90' }}>
                                        {Math.round((overview.activeDoctors / overview.totalDoctors) * 100)}% hoạt động
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, backdropFilter: 'blur(10px)' }}>
                                    <PeopleIcon sx={{ color: 'white' }} />
                                </Avatar>
                                <Box>
                                    <Typography color="rgba(255,255,255,0.8)" gutterBottom>
                                        Khách hàng
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {overview.totalCustomers}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#90EE90' }}>
                                        Đang sử dụng dịch vụ
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, backdropFilter: 'blur(10px)' }}>
                                    <PeopleIcon sx={{ color: 'white' }} />
                                </Avatar>
                                <Box>
                                    <Typography color="rgba(255,255,255,0.8)" gutterBottom>
                                        Nhân viên
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {overview.totalStaff}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#90EE90' }}>
                                        Đang làm việc
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Detailed Information */}
            <Grid container spacing={3}>
                {/* Doctor Management */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quản lý bác sĩ
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Tổng số bác sĩ: {overview.totalDoctors}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Bác sĩ đang hoạt động: {overview.activeDoctors}
                            </Typography>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/admin/doctors')}
                            >
                                Quản lý bác sĩ
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
                                        <CheckCircleIcon color="info" />
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
