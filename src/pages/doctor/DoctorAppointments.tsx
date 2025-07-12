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
    Tooltip,
    Tabs,
    Tab
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Schedule as TodayIcon,
    CheckCircle
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

const DoctorAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
    const [todayAppointments, setTodayAppointments] = useState<AppointmentDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateNotes, setUpdateNotes] = useState('');
    const [tabValue, setTabValue] = useState(0);

    const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
        'Pending': 'warning',
        'Confirmed': 'primary',
        'Completed': 'success',
        'Cancelled': 'error'
    };

    const statusOptions = [
        { value: 'Confirmed', label: 'Xác nhận' },
        { value: 'Completed', label: 'Hoàn thành' },
        { value: 'Cancelled', label: 'Hủy bỏ' }
    ];

    useEffect(() => {
        if (tabValue === 0) {
            loadMyAppointments();
        } else {
            loadTodayAppointments();
        }
    }, [page, statusFilter, tabValue]);

    const loadMyAppointments = async () => {
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

            const response = await appointmentApi.get(`/DoctorAppointment/my-appointments?${params}`);

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

    const loadTodayAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await appointmentApi.get('/DoctorAppointment/today');

            if (response.data.success) {
                setTodayAppointments(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải lịch hẹn hôm nay');
            }
        } catch (error: any) {
            console.error('Error loading today appointments:', error);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedAppointment || !newStatus) return;

        try {
            setLoading(true);
            const response = await appointmentApi.put(`/DoctorAppointment/${selectedAppointment.id}/status`, {
                status: newStatus,
                notes: updateNotes
            });

            if (response.data.success) {
                setUpdateDialogOpen(false);
                setSelectedAppointment(null);
                setNewStatus('');
                setUpdateNotes('');
                if (tabValue === 0) {
                    loadMyAppointments();
                } else {
                    loadTodayAppointments();
                }
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

    const quickConfirm = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await appointmentApi.put(`/DoctorAppointment/${appointmentId}/status`, {
                status: 'Confirmed',
                notes: 'Được xác nhận bởi bác sĩ'
            });

            if (response.data.success) {
                if (tabValue === 0) {
                    loadMyAppointments();
                } else {
                    loadTodayAppointments();
                }
            } else {
                setError(response.data.message || 'Không thể xác nhận lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error confirming appointment:', error);
            setError('Lỗi khi xác nhận lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const quickComplete = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await appointmentApi.put(`/DoctorAppointment/${appointmentId}/status`, {
                status: 'Completed',
                notes: 'Hoàn thành khám bệnh'
            });

            if (response.data.success) {
                if (tabValue === 0) {
                    loadMyAppointments();
                } else {
                    loadTodayAppointments();
                }
            } else {
                setError(response.data.message || 'Không thể hoàn thành lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error completing appointment:', error);
            setError('Lỗi khi hoàn thành lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const renderAppointmentTable = (appointmentList: AppointmentDto[]) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Bệnh nhân</TableCell>
                        <TableCell>Dịch vụ</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Giờ</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointmentList.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.patientName}</TableCell>
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
                                        <Tooltip title="Xác nhận">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => quickConfirm(appointment.id)}
                                            >
                                                <ApproveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {appointment.status === 'Confirmed' && (
                                        <Tooltip title="Hoàn thành">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => quickComplete(appointment.id)}
                                            >
                                                <CheckCircle />
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
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lịch hẹn của tôi - Bác sĩ
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Tất cả lịch hẹn" />
                    <Tab label="Lịch hẹn hôm nay" />
                </Tabs>
            </Box>

            {/* Filters for All Appointments tab */}
            {tabValue === 0 && (
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Lọc theo trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Lọc theo trạng thái"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Pending">Chờ xác nhận</MenuItem>
                            <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
                            <MenuItem value="Completed">Hoàn thành</MenuItem>
                            <MenuItem value="Cancelled">Đã hủy</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={loadMyAppointments}>
                        Làm mới
                    </Button>
                </Box>
            )}

            {/* Appointments Table */}
            <Card>
                <CardContent>
                    {tabValue === 0 ? renderAppointmentTable(appointments) : renderAppointmentTable(todayAppointments)}

                    {/* Pagination for All Appointments */}
                    {tabValue === 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, newPage) => setPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
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

export default DoctorAppointments;
