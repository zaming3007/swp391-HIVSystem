import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';
import {
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    Forum as ForumIcon,
    TrendingUp as TrendingUpIcon,
    PersonAdd as PersonAddIcon,
    EventAvailable as EventAvailableIcon,
    Message as MessageIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Appointment, Consultation } from '../../types';

// Mock data for dashboard stats
const stats = {
    totalUsers: 120,
    totalAppointments: 450,
    totalConsultations: 68,
    pendingConsultations: 12,
    completedAppointments: 410,
    newUsersThisMonth: 15,
};

// Sample appointments data
const recentAppointments: Appointment[] = [
    {
        id: 'apt12345',
        patientId: '1',
        doctorId: '1',
        serviceId: '1',
        date: '2023-06-15',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        status: 'confirmed',
        patientName: 'Alex Johnson',
        doctorName: 'Sarah Johnson',
        serviceName: 'Hormone Therapy Consultation',
    },
    {
        id: 'apt12346',
        patientId: '2',
        doctorId: '2',
        serviceId: '2',
        date: '2023-06-16',
        startTime: '02:30 PM',
        endTime: '03:20 PM',
        status: 'pending',
        patientName: 'Taylor Smith',
        doctorName: 'Michael Chen',
        serviceName: 'Gender Therapy Session',
    },
    {
        id: 'apt12347',
        patientId: '3',
        doctorId: '3',
        serviceId: '3',
        date: '2023-06-16',
        startTime: '09:30 AM',
        endTime: '10:15 AM',
        status: 'confirmed',
        patientName: 'Jamie Williams',
        doctorName: 'Aisha Khan',
        serviceName: 'Voice and Communication Therapy',
    },
    {
        id: 'apt12348',
        patientId: '4',
        doctorId: '1',
        serviceId: '1',
        date: '2023-06-17',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        status: 'pending',
        patientName: 'Morgan Lee',
        doctorName: 'Sarah Johnson',
        serviceName: 'Hormone Therapy Consultation',
    },
];

// Sample consultations data
const pendingConsultations: Consultation[] = [
    {
        id: 'c123457',
        patientId: '1',
        topic: 'Mental Health Support During Transition',
        question: 'I\'ve been experiencing anxiety as I begin my transition journey. What mental health resources do you offer specifically for transgender patients? Are there support groups or counseling services available?',
        status: 'pending',
        createdAt: '2023-05-18T16:45:00Z',
        patientName: 'Alex Johnson',
    },
    {
        id: 'c123459',
        patientId: '2',
        topic: 'Insurance Coverage Questions',
        question: 'Does your clinic work with insurance providers for gender-affirming care? I\'m specifically interested in knowing if hormone therapy is covered under my plan.',
        status: 'pending',
        createdAt: '2023-05-19T10:15:00Z',
        patientName: 'Taylor Smith',
    },
];

const AdminDashboardPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user || user.role !== 'admin') {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        Access Denied
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        You do not have permission to access the admin dashboard.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={() => navigate('/')}
                    >
                        Return to Home
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Welcome back, {user.firstName}. Here's what's happening with your clinic today.
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<PeopleIcon />}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Appointments"
                        value={stats.totalAppointments}
                        icon={<CalendarIcon />}
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Consultations"
                        value={stats.totalConsultations}
                        icon={<ForumIcon />}
                        color={theme.palette.info.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="New Users This Month"
                        value={stats.newUsersThisMonth}
                        icon={<TrendingUpIcon />}
                        color={theme.palette.success.main}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Recent Appointments */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Recent Appointments
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                endIcon={<EventAvailableIcon />}
                                onClick={() => navigate('/admin/appointments')}
                            >
                                View All
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Service</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentAppointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.patientName}</TableCell>
                                            <TableCell>{appointment.serviceName}</TableCell>
                                            <TableCell>{appointment.date}</TableCell>
                                            <TableCell>{appointment.startTime}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={appointment.status}
                                                    size="small"
                                                    color={
                                                        appointment.status === 'confirmed' ? 'success' :
                                                            appointment.status === 'pending' ? 'warning' :
                                                                appointment.status === 'cancelled' ? 'error' : 'default'
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Pending Consultations */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Pending Consultations
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                endIcon={<MessageIcon />}
                                onClick={() => navigate('/admin/consultations')}
                            >
                                View All
                            </Button>
                        </Box>
                        <List>
                            {pendingConsultations.map((consultation) => (
                                <React.Fragment key={consultation.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                {consultation.patientName?.charAt(0) || 'U'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={consultation.topic}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {consultation.patientName}
                                                    </Typography>
                                                    {` — ${consultation.question.substring(0, 60)}...`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                            {pendingConsultations.length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary="No pending consultations"
                                        secondary="All consultations have been answered."
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => navigate('/admin/users/new')}
                                    sx={{ py: 1.5 }}
                                >
                                    Add New User
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<EventAvailableIcon />}
                                    onClick={() => navigate('/admin/appointments/new')}
                                    sx={{ py: 1.5 }}
                                >
                                    Schedule Appointment
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<MessageIcon />}
                                    onClick={() => navigate('/admin/consultations')}
                                    sx={{ py: 1.5 }}
                                >
                                    Respond to Consultations
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AssignmentIcon />}
                                    onClick={() => navigate('/admin/reports')}
                                    sx={{ py: 1.5 }}
                                >
                                    Generate Reports
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4">
                            {value}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 56,
                            height: 56,
                            boxShadow: 2,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AdminDashboardPage; 