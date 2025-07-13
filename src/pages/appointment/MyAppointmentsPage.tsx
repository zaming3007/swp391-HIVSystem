import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';
import { format, parseISO } from 'date-fns';
import { RootState } from '../../store';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`appointment-tabpanel-${index}`}
            aria-labelledby={`appointment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

// Định nghĩa kiểu cho status để xử lý cả chuỗi và số
type StatusType = AppointmentStatus | string | number;

const MyAppointmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check authentication
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login?redirect=/appointment/my-appointments', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                // Kiểm tra localStorage trước khi gọi API
                console.log("Checking localStorage for appointments...");
                const savedAppointments = localStorage.getItem('mockAppointments');
                if (savedAppointments) {
                    console.log("Found appointments in localStorage:", savedAppointments);
                }

                const data = await getMyAppointments();
                console.log("Fetched appointments:", data);

                // Log thêm thông tin về mỗi lịch hẹn
                if (data && data.length > 0) {
                    data.forEach(app => {
                        console.log(`Appointment detail - id: ${app.id}, status: ${app.status}, type: ${typeof app.status}, service: ${app.serviceName}, date: ${app.date}`);
                    });
                } else {
                    console.log("No appointments found or empty data array returned");
                }

                setAppointments(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch appointments', error);
                setError('Không thể tải danh sách lịch hẹn.');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchAppointments();
        }
    }, [isAuthenticated]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
            try {
                const success = await cancelAppointment(appointmentId);

                if (success) {
                    // Update local state - sử dụng "Cancelled" thay vì số 2
                    setAppointments(prevAppointments =>
                        prevAppointments.map(app =>
                            app.id === appointmentId
                                ? { ...app, status: "Cancelled" as any }
                                : app
                        )
                    );
                } else {
                    alert('Không thể hủy lịch hẹn. Vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Error cancelling appointment', error);
                alert('Đã xảy ra lỗi khi hủy lịch hẹn.');
            }
        }
    };

    // Hàm kiểm tra trạng thái cho các trường hợp khác nhau
    const isStatusEqual = (status: StatusType, value: StatusType): boolean => {
        if (status === value) return true;
        if (typeof status === 'number' && typeof value === 'string' && status.toString() === value) return true;
        if (typeof status === 'string' && typeof value === 'number' && status === value.toString()) return true;

        // Xử lý trường hợp đặc biệt cho các giá trị enum và chuỗi
        if ((status === 0 || status === "0") && value === "Pending") return true;
        if ((status === 1 || status === "1") && value === "Confirmed") return true;
        if ((status === 2 || status === "2") && value === "Cancelled") return true;
        if ((status === 3 || status === "3") && value === "Completed") return true;

        return false;
    };

    // Filter appointments by status - Đơn giản hóa logic lọc
    const upcomingAppointments = appointments.filter(app => {
        // Log để debug giá trị status
        console.log(`Filtering upcoming appointment ${app.id}, status: ${app.status}, type: ${typeof app.status}`);

        // Kiểm tra cả hai loại status - số và chuỗi
        const status = app.status as StatusType;
        return isStatusEqual(status, 0) ||
            isStatusEqual(status, 1) ||
            isStatusEqual(status, "Pending") ||
            isStatusEqual(status, "Confirmed");
    });

    const completedAppointments = appointments.filter(app => {
        const status = app.status as StatusType;
        return isStatusEqual(status, 3) ||
            isStatusEqual(status, "Completed") ||
            isStatusEqual(status, "3");
    });

    const cancelledAppointments = appointments.filter(app => {
        const status = app.status as StatusType;
        return isStatusEqual(status, 2) ||
            isStatusEqual(status, "Cancelled") ||
            isStatusEqual(status, "2");
    });

    // Get status label - Đơn giản hóa logic hiển thị trạng thái
    const getStatusLabel = (status: StatusType): string => {
        if (isStatusEqual(status, 0) || isStatusEqual(status, "Pending") || isStatusEqual(status, "0")) return "Đang chờ";
        if (isStatusEqual(status, 1) || isStatusEqual(status, "Confirmed") || isStatusEqual(status, "1")) return "Đã xác nhận";
        if (isStatusEqual(status, 2) || isStatusEqual(status, "Cancelled") || isStatusEqual(status, "2")) return "Đã hủy";
        if (isStatusEqual(status, 3) || isStatusEqual(status, "Completed") || isStatusEqual(status, "3")) return "Đã hoàn thành";
        return "Không xác định";
    };

    // Get status color - Đơn giản hóa logic lấy màu
    const getStatusColor = (status: StatusType): "warning" | "primary" | "error" | "success" | "default" => {
        if (isStatusEqual(status, 0) || isStatusEqual(status, "Pending") || isStatusEqual(status, "0")) return "warning";
        if (isStatusEqual(status, 1) || isStatusEqual(status, "Confirmed") || isStatusEqual(status, "1")) return "primary";
        if (isStatusEqual(status, 2) || isStatusEqual(status, "Cancelled") || isStatusEqual(status, "2")) return "error";
        if (isStatusEqual(status, 3) || isStatusEqual(status, "Completed") || isStatusEqual(status, "3")) return "success";
        return "default";
    };

    // Appointment Card component
    const AppointmentCard = ({ appointment, onCancel }: { appointment: Appointment, onCancel: (id: string) => void }) => {
        // Format ngày giờ
        const formattedDate = format(parseISO(appointment.date), 'dd/MM/yyyy');

        // Xử lý status theo dữ liệu API
        let status = appointment.status as StatusType;
        console.log("Card rendering appointment:", appointment.id, "with status:", status, "and type:", typeof status);

        // Debug appointment để xem toàn bộ dữ liệu
        console.log("Full appointment data:", appointment);

        // Hiển thị giá trị appointmentType
        let isOnline = false;

        // Kiểm tra xem appointmentType có phải là online không bằng nhiều cách
        const appointmentType = appointment.appointmentType as string | number;
        if (appointmentType === 'online' ||
            appointmentType === 'Online' ||
            appointmentType === 1 ||
            appointmentType === '1') {
            isOnline = true;
        }

        console.log("Is online appointment:", isOnline);

        // Mã hóa URL để sử dụng cho cuộc họp online
        const meetingUrl = appointment.meetingLink ||
            `https://meet.jit.si/${appointment.id.replace(/[^a-zA-Z0-9]/g, '')}`;

        return (
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            {appointment.serviceName}
                        </Typography>
                        <Chip
                            label={getStatusLabel(status)}
                            color={getStatusColor(status) as any}
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                <EventIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                <strong>Ngày:</strong> {formattedDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                <strong>Thời gian:</strong> {appointment.startTime} - {appointment.endTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                <MedicalServicesIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                <strong>Dịch vụ:</strong> {appointment.serviceName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                <strong>Bác sĩ:</strong> {appointment.doctorName}
                            </Typography>
                        </Grid>

                        {/* Hiển thị loại cuộc hẹn và link nếu là online */}
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                {isOnline
                                    ? <VideocamIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    : <LocalHospitalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                }
                                <strong>Loại cuộc hẹn:</strong> {isOnline ? 'Tư vấn trực tuyến' : 'Tại phòng khám'}
                            </Typography>
                        </Grid>

                        {isOnline && (
                            <Grid item xs={12}>
                                <Box sx={{ mt: 1, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                        <strong>Link cuộc họp:</strong>
                                        <Button
                                            href={meetingUrl}
                                            target="_blank"
                                            variant="contained"
                                            size="small"
                                            sx={{ ml: 2 }}
                                        >
                                            Tham gia cuộc họp
                                        </Button>
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 1 }}>
                                        Link này sẽ hoạt động trong ngày hẹn. Vui lòng kiểm tra email để nhận thông báo.
                                    </Typography>
                                </Box>
                            </Grid>
                        )}

                        {appointment.notes && (
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <NoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    <strong>Ghi chú:</strong> {appointment.notes}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>

                    {(isStatusEqual(status, 0) || isStatusEqual(status, 1) || isStatusEqual(status, "Pending") || isStatusEqual(status, "Confirmed")) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onCancel(appointment.id)}
                                >
                                    Hủy lịch hẹn
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };



    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Lịch Hẹn Của Tôi
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/appointment')}
                    >
                        Đặt Lịch Hẹn Mới
                    </Button>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointment tabs">
                        <Tab label={`Sắp tới (${upcomingAppointments.length})`} id="tab-0" />
                        <Tab label={`Đã hoàn thành (${completedAppointments.length})`} id="tab-1" />
                        <Tab label={`Đã hủy (${cancelledAppointments.length})`} id="tab-2" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {isLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography>Đang tải...</Typography>
                        </Box>
                    ) : error ? (
                        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                            <Typography>{error}</Typography>
                        </Paper>
                    ) : upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancelAppointment} />
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Bạn không có lịch hẹn sắp tới
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/appointment')}
                                sx={{ mt: 2 }}
                            >
                                Đặt Lịch Hẹn
                            </Button>
                        </Paper>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {isLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography>Đang tải...</Typography>
                        </Box>
                    ) : error ? (
                        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                            <Typography>{error}</Typography>
                        </Paper>
                    ) : completedAppointments.length > 0 ? (
                        completedAppointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancelAppointment} />
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Bạn chưa có lịch hẹn nào đã hoàn thành
                            </Typography>
                        </Paper>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {isLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography>Đang tải...</Typography>
                        </Box>
                    ) : error ? (
                        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                            <Typography>{error}</Typography>
                        </Paper>
                    ) : cancelledAppointments.length > 0 ? (
                        cancelledAppointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancelAppointment} />
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Bạn chưa có lịch hẹn nào đã hủy
                            </Typography>
                        </Paper>
                    )}
                </TabPanel>
            </Box>
        </Container>
    );
};

export default MyAppointmentsPage; 