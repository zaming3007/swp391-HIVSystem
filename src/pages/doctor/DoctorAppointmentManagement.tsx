import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appointmentApi from '../../services/appointmentApi';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Avatar,
    Tooltip,
    Alert,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    CheckCircle as ConfirmIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    EventNote as EventIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    AccessTime as TimeIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { RootState } from '../../store';

// Mock data for appointments
const mockAppointments = [
    {
        id: '1',
        patientId: '4',
        patientName: 'Nguyễn Văn A',
        patientPhone: '0123456789',
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00',
        service: 'Tư vấn HIV',
        status: 'confirmed',
        notes: 'Bệnh nhân mới, cần tư vấn cơ bản về HIV',
        createdAt: '2024-01-10T08:00:00',
        reason: 'Tư vấn về phòng ngừa HIV'
    },
    {
        id: '2',
        patientId: '5',
        patientName: 'Trần Thị B',
        patientPhone: '0987654321',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:30',
        service: 'Tái khám',
        status: 'pending',
        notes: 'Tái khám sau 3 tháng điều trị ARV',
        createdAt: '2024-01-12T14:30:00',
        reason: 'Kiểm tra hiệu quả điều trị'
    },
    {
        id: '3',
        patientId: '6',
        patientName: 'Lê Văn C',
        patientPhone: '0369852147',
        appointmentDate: '2024-01-15',
        appointmentTime: '14:00',
        service: 'Xét nghiệm',
        status: 'pending',
        notes: 'Xét nghiệm định kỳ viral load',
        createdAt: '2024-01-13T09:15:00',
        reason: 'Theo dõi viral load'
    },
    {
        id: '4',
        patientId: '4',
        patientName: 'Nguyễn Văn A',
        patientPhone: '0123456789',
        appointmentDate: '2024-01-16',
        appointmentTime: '15:30',
        service: 'Tư vấn điều trị',
        status: 'confirmed',
        notes: 'Tư vấn về phác đồ điều trị mới',
        createdAt: '2024-01-14T11:20:00',
        reason: 'Bắt đầu điều trị ARV'
    },
    {
        id: '5',
        patientId: '7',
        patientName: 'Phạm Thị D',
        patientPhone: '0456789123',
        appointmentDate: '2024-01-12',
        appointmentTime: '11:00',
        service: 'Tư vấn',
        status: 'completed',
        notes: 'Đã hoàn thành buổi tư vấn',
        createdAt: '2024-01-08T16:45:00',
        reason: 'Tư vấn tâm lý'
    }
];

const DoctorAppointmentManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState<'view' | 'confirm' | 'cancel' | 'edit'>('view');

    useEffect(() => {
        loadAppointments();
    }, [user]);

    useEffect(() => {
        filterAppointments();
    }, [selectedTab, searchTerm, statusFilter, dateFilter, appointments]);

    const loadAppointments = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const response = await appointmentApi.get('/appointments/doctor');
            if (response.data.success) {
                setAppointments(response.data.data || []);
            } else {
                console.error('Failed to load appointments:', response.data.message);
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = appointments;

        // Filter by tab
        const today = new Date().toISOString().split('T')[0];
        if (selectedTab === 1) {
            filtered = filtered.filter(apt => apt.appointmentDate === today);
        } else if (selectedTab === 2) {
            filtered = filtered.filter(apt => apt.status === 'pending');
        } else if (selectedTab === 3) {
            filtered = filtered.filter(apt => apt.status === 'confirmed');
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(apt =>
                apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => apt.status === statusFilter);
        }

        // Filter by date
        if (dateFilter !== 'all') {
            const today = new Date();
            const filterDate = new Date(today);

            switch (dateFilter) {
                case 'today':
                    filterDate.setDate(today.getDate());
                    break;
                case 'tomorrow':
                    filterDate.setDate(today.getDate() + 1);
                    break;
                case 'week':
                    filterDate.setDate(today.getDate() + 7);
                    break;
            }

            if (dateFilter !== 'week') {
                filtered = filtered.filter(apt => apt.appointmentDate === filterDate.toISOString().split('T')[0]);
            } else {
                filtered = filtered.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate >= today && aptDate <= filterDate;
                });
            }
        }

        setFilteredAppointments(filtered);
    };

    const handleAction = (appointment: any, action: 'view' | 'confirm' | 'cancel' | 'edit') => {
        setSelectedAppointment(appointment);
        setActionType(action);
        setOpenDialog(true);
    };

    const handleConfirmAction = () => {
        if (!selectedAppointment) return;

        const updatedAppointments = appointments.map(apt => {
            if (apt.id === selectedAppointment.id) {
                switch (actionType) {
                    case 'confirm':
                        return { ...apt, status: 'confirmed' };
                    case 'cancel':
                        return { ...apt, status: 'cancelled' };
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
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getActionTitle = () => {
        switch (actionType) {
            case 'confirm':
                return 'Xác nhận lịch hẹn';
            case 'cancel':
                return 'Hủy lịch hẹn';
            case 'edit':
                return 'Chỉnh sửa lịch hẹn';
            case 'view':
                return 'Chi tiết lịch hẹn';
            default:
                return '';
        }
    };

    // Calculate stats
    const todayAppointments = appointments.filter(apt => apt.appointmentDate === new Date().toISOString().split('T')[0]);
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography variant="h6">Đang tải lịch hẹn...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý lịch hẹn
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Xem và quản lý lịch hẹn của bệnh nhân với bác sĩ {user?.name}
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <CalendarIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng lịch hẹn
                                    </Typography>
                                    <Typography variant="h5">
                                        {appointments.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <TimeIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Hôm nay
                                    </Typography>
                                    <Typography variant="h5">
                                        {todayAppointments.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <ScheduleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chờ xác nhận
                                    </Typography>
                                    <Typography variant="h5">
                                        {pendingAppointments.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <EventIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đã xác nhận
                                    </Typography>
                                    <Typography variant="h5">
                                        {confirmedAppointments.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Tất cả" />
                    <Tab label="Hôm nay" />
                    <Tab label="Chờ xác nhận" />
                    <Tab label="Đã xác nhận" />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm bệnh nhân, dịch vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
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
                                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                                <MenuItem value="cancelled">Đã hủy</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                label="Thời gian"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="today">Hôm nay</MenuItem>
                                <MenuItem value="tomorrow">Ngày mai</MenuItem>
                                <MenuItem value="week">Tuần này</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setDateFilter('all');
                            }}
                            fullWidth
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
                            <TableCell>Ngày & Giờ</TableCell>
                            <TableCell>Dịch vụ</TableCell>
                            <TableCell>Lý do khám</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {appointment.patientName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {appointment.patientPhone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(appointment.appointmentDate)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {appointment.appointmentTime}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {appointment.service}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                                        {appointment.reason}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(appointment.status)}
                                        color={getStatusColor(appointment.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 150 }} noWrap>
                                        {appointment.notes}
                                    </Typography>
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
                                                        onClick={() => handleAction(appointment, 'confirm')}
                                                    >
                                                        <ConfirmIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Hủy">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleAction(appointment, 'cancel')}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleAction(appointment, 'edit')}
                                                >
                                                    <EditIcon />
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
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{getActionTitle()}</DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin bệnh nhân
                                    </Typography>
                                    <Typography><strong>Họ tên:</strong> {selectedAppointment.patientName}</Typography>
                                    <Typography><strong>Điện thoại:</strong> {selectedAppointment.patientPhone}</Typography>
                                    <Typography><strong>ID:</strong> {selectedAppointment.patientId}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin lịch hẹn
                                    </Typography>
                                    <Typography><strong>Ngày:</strong> {formatDate(selectedAppointment.appointmentDate)}</Typography>
                                    <Typography><strong>Giờ:</strong> {selectedAppointment.appointmentTime}</Typography>
                                    <Typography><strong>Dịch vụ:</strong> {selectedAppointment.service}</Typography>
                                    <Typography><strong>Trạng thái:</strong> {getStatusText(selectedAppointment.status)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Chi tiết
                                    </Typography>
                                    <Typography><strong>Lý do khám:</strong> {selectedAppointment.reason}</Typography>
                                    <Typography><strong>Ghi chú:</strong> {selectedAppointment.notes}</Typography>
                                    <Typography><strong>Đặt lịch lúc:</strong> {formatDateTime(selectedAppointment.createdAt)}</Typography>
                                </Grid>
                            </Grid>

                            {(actionType === 'confirm' || actionType === 'cancel') && (
                                <Alert severity={actionType === 'confirm' ? 'success' : 'warning'} sx={{ mt: 2 }}>
                                    {actionType === 'confirm'
                                        ? 'Bạn có chắc chắn muốn xác nhận lịch hẹn này?'
                                        : 'Bạn có chắc chắn muốn hủy lịch hẹn này?'
                                    }
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {actionType === 'view' ? 'Đóng' : 'Hủy'}
                    </Button>
                    {actionType !== 'view' && actionType !== 'edit' && (
                        <Button
                            onClick={handleConfirmAction}
                            color={actionType === 'confirm' ? 'success' : 'error'}
                            variant="contained"
                        >
                            {actionType === 'confirm' ? 'Xác nhận' : 'Hủy lịch hẹn'}
                        </Button>
                    )}
                    {actionType === 'edit' && (
                        <Button
                            onClick={() => alert('Tính năng chỉnh sửa lịch hẹn sẽ được phát triển trong phiên bản tiếp theo')}
                            color="primary"
                            variant="contained"
                        >
                            Lưu thay đổi
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorAppointmentManagement;
