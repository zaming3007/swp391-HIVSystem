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

// Import real data service
import staffDashboardService, {
    StaffStats,
    RecentAppointment,
    PendingConsultation,
    RecentBlogPost,
    SystemActivity
} from '../../services/staffDashboardService';


const StaffDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
    const [pendingConsultations, setPendingConsultations] = useState<PendingConsultation[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                // Load real data for appointments and consultations
                const [
                    appointmentsData,
                    consultationsData
                ] = await Promise.all([
                    staffDashboardService.getRecentAppointments(),
                    staffDashboardService.getPendingConsultations()
                ]);

                setRecentAppointments(appointmentsData);
                setPendingConsultations(consultationsData);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
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
                <Grid item xs={12} sm={6} md={4}>
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
                                        12
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                                        8
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                                        1
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
                            {recentAppointments.map((appointment, index) => (
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
                                    {index < recentAppointments.length - 1 && <Divider />}
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
                            {pendingConsultations.map((consultation, index) => (
                                <React.Fragment key={consultation.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <NotificationsIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={consultation.question}
                                            secondary={new Date(consultation.createdAt).toLocaleString('vi-VN')}
                                        />
                                        <Chip
                                            label={consultation.priority === 'high' ? 'Cao' : consultation.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                            color={getPriorityColor(consultation.priority)}
                                            size="small"
                                        />
                                    </ListItem>
                                    {index < pendingConsultations.length - 1 && <Divider />}
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
