import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Pagination,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon
} from '@mui/icons-material';
import appointmentApi from '../../services/appointmentApi';

interface AppointmentDto {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    serviceId: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    notes: string;
    createdAt: string;
    updatedAt?: string;
}

interface AppointmentStatistics {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    todayAppointments: number;
    thisWeekAppointments: number;
    thisMonthAppointments: number;
}

const StaffAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
    const [statistics, setStatistics] = useState<AppointmentStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateNotes, setUpdateNotes] = useState('');

    const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
        'Pending': 'warning',
        'Confirmed': 'primary',
        'Completed': 'success',
        'Cancelled': 'error'
    };

    const statusOptions = [
        { value: 'Pending', label: 'Chờ xác nhận' },
        { value: 'Confirmed', label: 'Đã xác nhận' },
        { value: 'Completed', label: 'Hoàn thành' },
        { value: 'Cancelled', label: 'Đã hủy' }
    ];

    useEffect(() => {
        loadAppointments();
        loadStatistics();
    }, [page, statusFilter]);

    // 📋 DEMO: Load tất cả lịch hẹn để staff quản lý (có thể lọc theo status)
    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '10'
            });

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await appointmentApi.get(`/StaffAppointment/all?${params}`);

            if (response.data.success) {
                setAppointments(response.data.data);
                if (response.data.meta) {
                    setTotalPages(Math.ceil(response.data.meta.totalPages));
                }
            } else {
                setError(response.data.message || 'Không thể tải danh sách lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error loading appointments:', error);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await appointmentApi.get('/StaffAppointment/statistics');
            if (response.data.success) {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedAppointment || !newStatus) return;

        try {
            setLoading(true);
            const response = await appointmentApi.put(`/StaffAppointment/${selectedAppointment.id}/status`, {
                status: newStatus,
                notes: updateNotes
            });

            if (response.data.success) {
                setUpdateDialogOpen(false);
                setSelectedAppointment(null);
                setNewStatus('');
                setUpdateNotes('');
                loadAppointments();
                loadStatistics();
            } else {
                setError(response.data.message || 'Không thể cập nhật trạng thái');
            }
        } catch (error: any) {
            console.error('Error updating appointment:', error);
            setError('Lỗi khi cập nhật trạng thái lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const openUpdateDialog = (appointment: AppointmentDto) => {
        setSelectedAppointment(appointment);
        setNewStatus(appointment.status);
        setUpdateNotes(appointment.notes || '');
        setUpdateDialogOpen(true);
    };

    // ✅ DEMO: Phê duyệt nhanh lịch hẹn → status "Confirmed" + gửi notification
    const quickApprove = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await appointmentApi.put(`/StaffAppointment/${appointmentId}/status`, {
                status: 'Confirmed',
                notes: 'Được phê duyệt bởi staff'
            });

            if (response.data.success) {
                loadAppointments();
                loadStatistics();
            } else {
                setError(response.data.message || 'Không thể phê duyệt lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error approving appointment:', error);
            setError('Lỗi khi phê duyệt lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    // ❌ DEMO: Từ chối nhanh lịch hẹn → status "Cancelled" + gửi notification
    const quickReject = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await appointmentApi.put(`/StaffAppointment/${appointmentId}/status`, {
                status: 'Cancelled',
                notes: 'Bị từ chối bởi staff'
            });

            if (response.data.success) {
                loadAppointments();
                loadStatistics();
            } else {
                setError(response.data.message || 'Không thể từ chối lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error rejecting appointment:', error);
            setError('Lỗi khi từ chối lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quản lý lịch hẹn - Staff
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            {statistics && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Tổng lịch hẹn
                                </Typography>
                                <Typography variant="h4">
                                    {statistics.totalAppointments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Chờ xác nhận
                                </Typography>
                                <Typography variant="h4" color="warning.main">
                                    {statistics.pendingAppointments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Đã xác nhận
                                </Typography>
                                <Typography variant="h4" color="primary.main">
                                    {statistics.confirmedAppointments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Hôm nay
                                </Typography>
                                <Typography variant="h4" color="info.main">
                                    {statistics.todayAppointments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Lọc theo trạng thái</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Lọc theo trạng thái"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={loadAppointments}>
                    Làm mới
                </Button>
            </Box>

            {/* Appointments Table */}
            <Card>
                <CardContent>
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
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{appointment.patientName}</TableCell>
                                        <TableCell>{appointment.doctorName}</TableCell>
                                        <TableCell>{appointment.serviceName}</TableCell>
                                        <TableCell>
                                            {new Date(appointment.date).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            {appointment.startTime} - {appointment.endTime}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={appointment.status}
                                                color={statusColors[appointment.status] || 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Xem chi tiết">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => openUpdateDialog(appointment)}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {appointment.status === 'Pending' && (
                                                    <>
                                                        <Tooltip title="Phê duyệt">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => quickApprove(appointment.id)}
                                                            >
                                                                <ApproveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Từ chối">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => quickReject(appointment.id)}
                                                            >
                                                                <RejectIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, newPage) => setPage(newPage)}
                            color="primary"
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Update Status Dialog */}
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Cập nhật lịch hẹn</DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Bệnh nhân:</strong> {selectedAppointment.patientName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Bác sĩ:</strong> {selectedAppointment.doctorName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Dịch vụ:</strong> {selectedAppointment.serviceName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Ngày:</strong> {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Giờ:</strong> {selectedAppointment.startTime} - {selectedAppointment.endTime}
                            </Typography>

                            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={newStatus}
                                    label="Trạng thái"
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Ghi chú"
                                multiline
                                rows={3}
                                value={updateNotes}
                                onChange={(e) => setUpdateNotes(e.target.value)}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleUpdateStatus} variant="contained" disabled={loading}>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaffAppointments;
