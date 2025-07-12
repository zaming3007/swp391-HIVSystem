import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Tooltip
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Schedule as RescheduleIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';

interface Appointment {
    id: string;
    patientName: string;
    patientEmail: string;
    doctorName: string;
    service: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
    createdAt: string;
}

// Mock data
const mockAppointments: Appointment[] = [
    {
        id: '1',
        patientName: 'Nguyễn Văn A',
        patientEmail: 'nguyenvana@email.com',
        doctorName: 'BS. Trần Thị B',
        service: 'Tư vấn HIV',
        date: '2024-01-15',
        time: '09:00',
        status: 'pending',
        notes: 'Bệnh nhân cần tư vấn về phòng ngừa HIV',
        createdAt: '2024-01-10'
    },
    {
        id: '2',
        patientName: 'Lê Thị C',
        patientEmail: 'lethic@email.com',
        doctorName: 'BS. Phạm Văn D',
        service: 'Xét nghiệm',
        date: '2024-01-15',
        time: '10:30',
        status: 'confirmed',
        notes: 'Xét nghiệm định kỳ',
        createdAt: '2024-01-12'
    },
    {
        id: '3',
        patientName: 'Hoàng Minh E',
        patientEmail: 'hoangminhe@email.com',
        doctorName: 'BS. Nguyễn Thị F',
        service: 'Tái khám',
        date: '2024-01-16',
        time: '14:00',
        status: 'confirmed',
        notes: 'Tái khám sau 3 tháng điều trị',
        createdAt: '2024-01-13'
    },
    {
        id: '4',
        patientName: 'Trần Văn G',
        patientEmail: 'tranvang@email.com',
        doctorName: 'BS. Lê Thị H',
        service: 'Tư vấn điều trị',
        date: '2024-01-17',
        time: '08:30',
        status: 'cancelled',
        notes: 'Bệnh nhân hủy lịch',
        createdAt: '2024-01-14'
    }
];

const StaffAppointmentManagement: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'reschedule' | 'view'>('view');

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [doctorFilter, setDoctorFilter] = useState<string>('all');

    useEffect(() => {
        filterAppointments();
    }, [statusFilter, dateFilter, doctorFilter, selectedTab]);

    const filterAppointments = () => {
        let filtered = appointments;

        // Filter by tab
        if (selectedTab === 1) {
            filtered = filtered.filter(apt => apt.status === 'pending');
        } else if (selectedTab === 2) {
            filtered = filtered.filter(apt => apt.status === 'confirmed');
        } else if (selectedTab === 3) {
            filtered = filtered.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => apt.status === statusFilter);
        }

        // Filter by date
        if (dateFilter) {
            filtered = filtered.filter(apt => apt.date === dateFilter);
        }

        // Filter by doctor
        if (doctorFilter !== 'all') {
            filtered = filtered.filter(apt => apt.doctorName === doctorFilter);
        }

        setFilteredAppointments(filtered);
    };

    const handleAction = (appointment: Appointment, action: 'approve' | 'reject' | 'reschedule' | 'view') => {
        setSelectedAppointment(appointment);
        setActionType(action);
        setOpenDialog(true);
    };

    const handleConfirmAction = () => {
        if (!selectedAppointment) return;

        const updatedAppointments = appointments.map(apt => {
            if (apt.id === selectedAppointment.id) {
                switch (actionType) {
                    case 'approve':
                        return { ...apt, status: 'confirmed' as const };
                    case 'reject':
                        return { ...apt, status: 'cancelled' as const };
                    default:
                        return apt;
                }
            }
            return apt;
        });

        setAppointments(updatedAppointments);
        setOpenDialog(false);
        setSelectedAppointment(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            case 'completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'pending':
                return 'Chờ xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            case 'completed':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    const getActionTitle = () => {
        switch (actionType) {
            case 'approve':
                return 'Xác nhận lịch hẹn';
            case 'reject':
                return 'Hủy lịch hẹn';
            case 'reschedule':
                return 'Đổi lịch hẹn';
            case 'view':
                return 'Chi tiết lịch hẹn';
            default:
                return '';
        }
    };

    // Get unique doctors for filter
    const uniqueDoctors = Array.from(new Set(appointments.map(apt => apt.doctorName)));

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý lịch hẹn
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Xem và quản lý tất cả lịch hẹn trong hệ thống
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Tổng lịch hẹn
                            </Typography>
                            <Typography variant="h5">
                                {appointments.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Chờ xác nhận
                            </Typography>
                            <Typography variant="h5" color="warning.main">
                                {appointments.filter(apt => apt.status === 'pending').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Đã xác nhận
                            </Typography>
                            <Typography variant="h5" color="success.main">
                                {appointments.filter(apt => apt.status === 'confirmed').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Hôm nay
                            </Typography>
                            <Typography variant="h5" color="info.main">
                                {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Tất cả" />
                    <Tab label="Chờ xác nhận" />
                    <Tab label="Đã xác nhận" />
                    <Tab label="Hôm nay" />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                                <MenuItem value="cancelled">Đã hủy</MenuItem>
                                <MenuItem value="completed">Hoàn thành</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Ngày"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Bác sĩ</InputLabel>
                            <Select
                                value={doctorFilter}
                                onChange={(e) => setDoctorFilter(e.target.value)}
                                label="Bác sĩ"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {uniqueDoctors.map(doctor => (
                                    <MenuItem key={doctor} value={doctor}>{doctor}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={() => {
                                setStatusFilter('all');
                                setDateFilter('');
                                setDoctorFilter('all');
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Appointments Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bệnh nhân</TableCell>
                            <TableCell>Bác sĩ</TableCell>
                            <TableCell>Dịch vụ</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Giờ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {appointment.patientName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {appointment.patientEmail}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{appointment.doctorName}</TableCell>
                                <TableCell>{appointment.service}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(appointment.status)}
                                        color={getStatusColor(appointment.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleAction(appointment, 'view')}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {appointment.status === 'pending' && (
                                            <>
                                                <Tooltip title="Xác nhận">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleAction(appointment, 'approve')}
                                                    >
                                                        <ApproveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Hủy">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleAction(appointment, 'reject')}
                                                    >
                                                        <RejectIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {appointment.status === 'confirmed' && (
                                            <Tooltip title="Đổi lịch">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleAction(appointment, 'reschedule')}
                                                >
                                                    <RescheduleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{getActionTitle()}</DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Bệnh nhân:</strong> {selectedAppointment.patientName}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Bác sĩ:</strong> {selectedAppointment.doctorName}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Dịch vụ:</strong> {selectedAppointment.service}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Ngày giờ:</strong> {selectedAppointment.date} lúc {selectedAppointment.time}
                            </Typography>
                            {selectedAppointment.notes && (
                                <Typography variant="body1" gutterBottom>
                                    <strong>Ghi chú:</strong> {selectedAppointment.notes}
                                </Typography>
                            )}
                            
                            {actionType === 'approve' && (
                                <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                                    Bạn có chắc chắn muốn xác nhận lịch hẹn này?
                                </Typography>
                            )}
                            
                            {actionType === 'reject' && (
                                <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                                    Bạn có chắc chắn muốn hủy lịch hẹn này?
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {actionType === 'view' ? 'Đóng' : 'Hủy'}
                    </Button>
                    {actionType !== 'view' && (
                        <Button
                            onClick={handleConfirmAction}
                            color={actionType === 'reject' ? 'error' : 'primary'}
                            variant="contained"
                        >
                            {actionType === 'approve' ? 'Xác nhận' : actionType === 'reject' ? 'Hủy lịch' : 'Lưu'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaffAppointmentManagement;
