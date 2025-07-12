import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    IconButton,
    Button,
    Divider,
    LinearProgress,
    Avatar
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    EventNote as EventNoteIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Article as ArticleIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

// Mock data - sẽ được thay thế bằng API calls
const mockStats = {
    todayAppointments: 12,
    pendingConsultations: 8,
    totalBlogPosts: 25,
    activeUsers: 156,
    appointmentGrowth: 15.2,
    consultationGrowth: 8.7
};

const mockRecentAppointments = [
    {
        id: '1',
        patientName: 'Nguyễn Văn A',
        doctorName: 'BS. Trần Thị B',
        time: '09:00',
        status: 'confirmed',
        service: 'Tư vấn HIV'
    },
    {
        id: '2',
        patientName: 'Lê Thị C',
        doctorName: 'BS. Phạm Văn D',
        time: '10:30',
        status: 'pending',
        service: 'Xét nghiệm'
    },
    {
        id: '3',
        patientName: 'Hoàng Minh E',
        doctorName: 'BS. Nguyễn Thị F',
        time: '14:00',
        status: 'confirmed',
        service: 'Tái khám'
    }
];

const mockPendingConsultations = [
    {
        id: '1',
        question: 'Tôi có thể làm xét nghiệm HIV ở đâu?',
        submittedAt: '2 giờ trước',
        priority: 'high'
    },
    {
        id: '2',
        question: 'Thuốc ARV có tác dụng phụ gì không?',
        submittedAt: '4 giờ trước',
        priority: 'medium'
    },
    {
        id: '3',
        question: 'Làm thế nào để phòng ngừa HIV?',
        submittedAt: '6 giờ trước',
        priority: 'low'
    }
];

const StaffDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircleIcon />;
            case 'pending':
                return <PendingIcon />;
            case 'cancelled':
                return <CancelIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Đang tải dữ liệu...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard Nhân viên
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Tổng quan hoạt động hệ thống HIV Healthcare
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <EventNoteIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Lịch hẹn hôm nay
                                    </Typography>
                                    <Typography variant="h5">
                                        {mockStats.todayAppointments}
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
                                    <QuestionAnswerIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tư vấn chờ xử lý
                                    </Typography>
                                    <Typography variant="h5">
                                        {mockStats.pendingConsultations}
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
                                    <ArticleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Bài viết Blog
                                    </Typography>
                                    <Typography variant="h5">
                                        {mockStats.totalBlogPosts}
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
                                    <PeopleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Người dùng hoạt động
                                    </Typography>
                                    <Typography variant="h5">
                                        {mockStats.activeUsers}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Recent Appointments */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Lịch hẹn gần đây
                            </Typography>
                            <Button size="small" href="/staff/appointments">
                                Xem tất cả
                            </Button>
                        </Box>
                        <List>
                            {mockRecentAppointments.map((appointment, index) => (
                                <React.Fragment key={appointment.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {getStatusIcon(appointment.status)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${appointment.patientName} - ${appointment.doctorName}`}
                                            secondary={`${appointment.time} - ${appointment.service}`}
                                        />
                                        <Chip
                                            label={appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                            color={getStatusColor(appointment.status)}
                                            size="small"
                                        />
                                    </ListItem>
                                    {index < mockRecentAppointments.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Pending Consultations */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Tư vấn chờ xử lý
                            </Typography>
                            <Button size="small" href="/staff/consultations">
                                Xem tất cả
                            </Button>
                        </Box>
                        <List>
                            {mockPendingConsultations.map((consultation, index) => (
                                <React.Fragment key={consultation.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <NotificationsIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={consultation.question}
                                            secondary={consultation.submittedAt}
                                        />
                                        <Chip
                                            label={consultation.priority === 'high' ? 'Cao' : consultation.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                            color={getPriorityColor(consultation.priority)}
                                            size="small"
                                        />
                                    </ListItem>
                                    {index < mockPendingConsultations.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StaffDashboard;
