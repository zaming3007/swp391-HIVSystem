import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appointmentApi from '../../services/appointmentApi';
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
    Button,
    Divider,
    LinearProgress,
    Avatar,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    EventNote as EventNoteIcon,
    QuestionAnswer as QuestionAnswerIcon,
    People as PatientsIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    AccessTime as TimeIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    LocalPharmacy as PharmacyIcon,
    Assignment as AssignmentIcon,
    Notifications as NotificationIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import arvService, { Patient } from '../../services/arvService';
import doctorService, { DoctorStats, TodayAppointment, DoctorPatient, ConsultationForDoctor } from '../../services/doctorService';

// Remove mock data - now using real API calls

// Remove mock data - using real API data now

// Remove mock consultations - using real API data now

const DoctorDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doctorStats, setDoctorStats] = useState<DoctorStats>({
        todayAppointments: 0,
        pendingConsultations: 0,
        totalPatients: 0,
        completedAppointments: 0,
        averageRating: 0,
        responseTime: 'N/A'
    });
    const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
    const [consultations, setConsultations] = useState<ConsultationForDoctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctorPatients, setDoctorPatients] = useState<DoctorPatient[]>([]);
    const [arvStats, setArvStats] = useState({
        totalPatients: 0,
        activeRegimens: 0,
        needingReview: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            // Load doctor statistics
            const stats = await doctorService.getDoctorStats();
            setDoctorStats(stats);

            // Load today's appointments
            const todayApts = await doctorService.getTodayAppointments();
            setTodayAppointments(todayApts);

            // Load consultations
            const consultationsData = await doctorService.getConsultationsForDoctor();
            setConsultations(consultationsData);

            // Load doctor's patients
            const patientsData = await doctorService.getDoctorPatients();
            setDoctorPatients(patientsData);

            // Load ARV patients data
            await loadARVData();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadARVData = async () => {
        try {
            const patientsData = await arvService.getDoctorPatients();
            setPatients(patientsData);

            // Calculate ARV statistics
            const totalPatients = patientsData.length;
            const activeRegimens = patientsData.filter(p => p.currentRegimen).length;
            const needingReview = patientsData.filter(p => !p.currentRegimen).length;

            setArvStats({
                totalPatients,
                activeRegimens,
                needingReview
            });
        } catch (error) {
            console.error('Error loading ARV data:', error);
        }
    };

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircleIcon />;
            case 'pending':
                return <PendingIcon />;
            default:
                return <ScheduleIcon />;
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
                    Dashboard Bác sĩ
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Chào mừng trở lại, {user?.name}! Đây là tổng quan công việc của bạn hôm nay.
                </Typography>
            </Box>

            {/* Welcome Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1">
                    Bạn có <strong>{doctorStats.todayAppointments}</strong> lịch hẹn và <strong>{doctorStats.pendingConsultations}</strong> tư vấn chờ trả lời hôm nay.
                </Typography>
            </Alert>

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
                                        {doctorStats.todayAppointments}
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
                                        Tư vấn chờ trả lời
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctorStats.pendingConsultations}
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
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <PeopleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng số bệnh nhân
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctorStats.totalPatients}
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
                                    <CheckCircleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Lịch hẹn hoàn thành
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctorStats.completedAppointments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ARV Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <PatientsIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Bệnh nhân ARV
                                    </Typography>
                                    <Typography variant="h5">
                                        {arvStats.totalPatients}
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
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <StarIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đang điều trị ARV
                                    </Typography>
                                    <Typography variant="h5">
                                        {arvStats.activeRegimens}
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
                                    <NotificationIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Cần xem xét
                                    </Typography>
                                    <Typography variant="h5">
                                        {arvStats.needingReview}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Performance Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                                <Typography variant="h6">
                                    Hiệu suất
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Lịch hẹn hoàn thành
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {doctorStats.completedAppointments}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TimeIcon sx={{ color: 'info.main', mr: 1 }} />
                                <Typography variant="h6">
                                    Thời gian phản hồi
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Trung bình
                            </Typography>
                            <Typography variant="h4" color="info.main">
                                {doctorStats.responseTime}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography variant="h6">
                                    Lịch làm việc
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Hôm nay
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                                8:00 - 17:00
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/doctor/appointments')}
                                    sx={{ py: 1.5 }}
                                >
                                    Xem lịch hẹn
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<QuestionAnswerIcon />}
                                    onClick={() => navigate('/doctor/consultations')}
                                    sx={{ py: 1.5 }}
                                >
                                    Trả lời tư vấn
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PatientsIcon />}
                                    onClick={() => navigate('/doctor/patients')}
                                    sx={{ py: 1.5 }}
                                >
                                    Quản lý bệnh nhân
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PharmacyIcon />}
                                    onClick={() => navigate('/doctor/arv-management')}
                                    sx={{ py: 1.5 }}
                                >
                                    Quản lý phác đồ ARV
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Today's Appointments */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Lịch hẹn hôm nay
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/doctor/appointments')}
                                variant="outlined"
                            >
                                Xem tất cả
                            </Button>
                        </Box>
                        <List>
                            {todayAppointments.length > 0 ? todayAppointments.map((appointment, index) => (
                                <React.Fragment key={appointment.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {getStatusIcon(appointment.status)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {appointment.time} - {appointment.patientName}
                                                    </Typography>
                                                    <Chip
                                                        label={appointment.service}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={appointment.notes}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                                color={getStatusColor(appointment.status)}
                                                size="small"
                                            />
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate('/doctor/appointments')}
                                                >
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </ListItem>
                                    {index < todayAppointments.length - 1 && <Divider />}
                                </React.Fragment>
                            )) : (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Không có lịch hẹn nào hôm nay
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* ARV Patients Needing Review */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Bệnh nhân ARV cần theo dõi
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/doctor/regimens')}
                                variant="outlined"
                            >
                                Xem tất cả
                            </Button>
                        </Box>
                        <List>
                            {patients.filter(p => !p.currentRegimen).slice(0, 3).map((patient, index) => (
                                <React.Fragment key={patient.patientId}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PatientsIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {patient.patientName}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                    <Chip
                                                        label="Chưa có phác đồ"
                                                        color="warning"
                                                        size="small"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Lần khám cuối: {new Date(patient.lastAppointment).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate('/doctor/regimens')}
                                        >
                                            Kê đơn
                                        </Button>
                                    </ListItem>
                                    {index < patients.filter(p => !p.currentRegimen).slice(0, 3).length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                            {patients.filter(p => !p.currentRegimen).length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Tất cả bệnh nhân đều đã có phác đồ điều trị
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Pending Consultations */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Tư vấn chờ trả lời
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/doctor/consultations')}
                                variant="outlined"
                            >
                                Xem tất cả
                            </Button>
                        </Box>
                        <List>
                            {consultations.filter(c => c.status === 'pending').length > 0 ? consultations.filter(c => c.status === 'pending').map((consultation, index) => (
                                <React.Fragment key={consultation.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <QuestionAnswerIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" noWrap>
                                                    {consultation.question}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                    <Chip
                                                        label={consultation.category}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={consultation.priority === 'high' ? 'Cao' : 'Trung bình'}
                                                        color={getPriorityColor(consultation.priority)}
                                                        size="small"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(consultation.createdAt).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < consultations.filter(c => c.status === 'pending').length - 1 && <Divider />}
                                </React.Fragment>
                            )) : (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Không có tư vấn nào chờ trả lời
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDashboard;
