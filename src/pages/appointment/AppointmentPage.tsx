import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Divider,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Alert,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
    MedicalServices as MedicalServicesIcon,
    AccessTime as TimeIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Videocam as VideocamIcon,
    PersonPin as PersonPinIcon,
} from '@mui/icons-material';
import { Appointment, Doctor, Service } from '../../types';

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
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `appointment-tab-${index}`,
        'aria-controls': `appointment-tabpanel-${index}`,
    };
}

const AppointmentPage: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [openBooking, setOpenBooking] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [appointmentType, setAppointmentType] = useState('truc-tiep');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenBooking = () => {
        setOpenBooking(true);
        resetForm();
    };

    const handleCloseBooking = () => {
        setOpenBooking(false);
        if (bookingSuccess) {
            setBookingSuccess(false);
        }
    };

    const resetForm = () => {
        setSelectedService('');
        setSelectedDoctor('');
        setSelectedDate(new Date());
        setSelectedTime('');
        setNotes('');
        setAppointmentType('truc-tiep');
        setBookingError('');
    };

    const handleBookAppointment = () => {
        // Validate form
        if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
            setBookingError('Vui lòng điền đầy đủ tất cả các trường bắt buộc');
            return;
        }

        // Simulate appointment booking
        setTimeout(() => {
            // In a real app, this would be an API call and you would add the appointment to state
            // For demo purposes, we're just showing success message
            setBookingSuccess(true);
            setBookingError('');
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return theme.palette.success.main;
            case 'pending':
                return theme.palette.warning.main;
            case 'cancelled':
                return theme.palette.error.main;
            case 'completed':
                return theme.palette.info.main;
            default:
                return theme.palette.grey[500];
        }
    };

    const getStatusLabel = (status: string) => {
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

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Lịch Hẹn
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenBooking}
                >
                    Đặt Lịch Hẹn Mới
                </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="appointment tabs"
                >
                    <Tab label="Sắp Tới" {...a11yProps(0)} />
                    <Tab label="Đã Qua" {...a11yProps(1)} />
                    <Tab label="Đã Hủy" {...a11yProps(2)} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            statusColor={getStatusColor(appointment.status)}
                            statusLabel={getStatusLabel(appointment.status)}
                        />
                    ))
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Không có lịch hẹn sắp tới
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenBooking}
                            sx={{ mt: 2 }}
                        >
                            Đặt Lịch Hẹn
                        </Button>
                    </Paper>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {pastAppointments.length > 0 ? (
                    pastAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            statusColor={getStatusColor(appointment.status)}
                            statusLabel={getStatusLabel(appointment.status)}
                        />
                    ))
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            Không có lịch hẹn đã qua
                        </Typography>
                    </Paper>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                {cancelledAppointments.length > 0 ? (
                    cancelledAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            statusColor={getStatusColor(appointment.status)}
                            statusLabel={getStatusLabel(appointment.status)}
                        />
                    ))
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            Không có lịch hẹn đã hủy
                        </Typography>
                    </Paper>
                )}
            </TabPanel>

            {/* Book Appointment Dialog */}
            <Dialog open={openBooking} onClose={handleCloseBooking} maxWidth="md" fullWidth>
                <DialogTitle>
                    {bookingSuccess ? 'Đặt Lịch Hẹn Thành Công' : 'Đặt Lịch Hẹn'}
                </DialogTitle>
                <DialogContent>
                    {bookingSuccess ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Lịch hẹn của bạn đã được đặt thành công!
                            </Alert>
                            <DialogContentText>
                                Bạn sẽ nhận được email xác nhận với chi tiết lịch hẹn của mình.
                                Bạn có thể xem và quản lý lịch hẹn trên trang này.
                            </DialogContentText>
                        </Box>
                    ) : (
                        <>
                            {bookingError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {bookingError}
                                </Alert>
                            )}
                            <DialogContentText sx={{ mb: 3 }}>
                                Vui lòng điền thông tin chi tiết dưới đây để đặt lịch hẹn.
                            </DialogContentText>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Hình thức khám</FormLabel>
                                        <RadioGroup
                                            row
                                            name="appointment-type"
                                            value={appointmentType}
                                            onChange={(e) => setAppointmentType(e.target.value)}
                                        >
                                            <FormControlLabel
                                                value="truc-tiep"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PersonPinIcon sx={{ mr: 1 }} />
                                                        <span>Trực tiếp tại cơ sở</span>
                                                    </Box>
                                                }
                                            />
                                            <FormControlLabel
                                                value="online"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <VideocamIcon sx={{ mr: 1 }} />
                                                        <span>Tư vấn online</span>
                                                    </Box>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                <Box>
                                    <FormControl fullWidth required>
                                        <InputLabel id="service-select-label">Dịch Vụ</InputLabel>
                                        <Select
                                            labelId="service-select-label"
                                            id="service-select"
                                            value={selectedService}
                                            label="Dịch Vụ"
                                            onChange={(e) => setSelectedService(e.target.value)}
                                        >
                                            {services.map((service) => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.name} ({service.price}.000 VNĐ, {service.duration} phút)
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl fullWidth required>
                                        <InputLabel id="doctor-select-label">Bác Sĩ</InputLabel>
                                        <Select
                                            labelId="doctor-select-label"
                                            id="doctor-select"
                                            value={selectedDoctor}
                                            label="Bác Sĩ"
                                            onChange={(e) => setSelectedDoctor(e.target.value)}
                                        >
                                            {doctors.map((doctor) => (
                                                <MenuItem key={doctor.id} value={doctor.id}>
                                                    BS. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Ngày"
                                                value={selectedDate}
                                                onChange={setSelectedDate}
                                                minDate={new Date()}
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="time-select-label">Giờ</InputLabel>
                                            <Select
                                                labelId="time-select-label"
                                                id="time-select"
                                                value={selectedTime}
                                                label="Giờ"
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                            >
                                                {timeSlots.map((slot) => (
                                                    <MenuItem key={slot} value={slot}>
                                                        {slot}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>

                                {appointmentType === 'truc-tiep' && (
                                    <Box>
                                        <FormControl fullWidth>
                                            <InputLabel id="location-select-label">Địa điểm khám</InputLabel>
                                            <Select
                                                labelId="location-select-label"
                                                id="location-select"
                                                defaultValue="cs-1"
                                                label="Địa điểm khám"
                                            >
                                                <MenuItem value="cs-1">Cơ sở 1: 123 Đường Nguyễn Văn A, Quận 1, TP. HCM</MenuItem>
                                                <MenuItem value="cs-2">Cơ sở 2: 456 Đường Lê Lợi, Quận 3, TP. HCM</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}

                                {appointmentType === 'online' && (
                                    <Alert severity="info" sx={{ mt: 1 }}>
                                        Lịch hẹn online sẽ được thực hiện qua Zoom. Thông tin phòng họp sẽ được gửi qua email sau khi đặt lịch thành công.
                                    </Alert>
                                )}

                                <Box>
                                    <TextField
                                        fullWidth
                                        id="notes"
                                        label="Ghi Chú (Không bắt buộc)"
                                        multiline
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={appointmentType === 'online' ? "Nhập các triệu chứng, mối quan tâm hoặc thông tin bổ sung cho bác sĩ..." : "Nhập các triệu chứng, mối quan tâm hoặc thông tin bổ sung..."}
                                    />
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBooking}>
                        {bookingSuccess ? 'Đóng' : 'Hủy'}
                    </Button>
                    {!bookingSuccess && (
                        <Button onClick={handleBookAppointment} variant="contained" color="primary">
                            Đặt Lịch Hẹn
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

interface AppointmentCardProps {
    appointment: Appointment;
    statusColor: string;
    statusLabel: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, statusColor, statusLabel }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" component="div">
                            {appointment.serviceName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                BS. {appointment.doctorName}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={statusLabel}
                        sx={{
                            backgroundColor: statusColor,
                            color: '#fff',
                            textTransform: 'capitalize'
                        }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 8px)' }, display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                            {appointment.date}
                        </Typography>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 8px)' }, display: 'flex', alignItems: 'center' }}>
                        <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                            {appointment.startTime}
                        </Typography>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 8px)' }, display: 'flex', alignItems: 'center' }}>
                        <MedicalServicesIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                            Mã lịch hẹn: {appointment.id.substring(0, 8)}
                        </Typography>
                    </Box>
                </Box>

                {appointment.status === 'confirmed' && (
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CloseIcon />}
                        >
                            Hủy Lịch Hẹn
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Sample data
const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
];

const services: Service[] = [
    {
        id: '1',
        name: 'Tư Vấn Liệu Pháp Hormone',
        description: 'Tư vấn ban đầu hoặc theo dõi cho liệu pháp thay thế hormone.',
        category: 'Gender-Affirming',
        price: 150,
        duration: 60,
    },
    {
        id: '2',
        name: 'Buổi Trị Liệu Giới Tính',
        description: 'Buổi trị liệu một-một tập trung vào bản dạng giới và quá trình chuyển đổi.',
        category: 'Mental Health',
        price: 120,
        duration: 50,
    },
    {
        id: '3',
        name: 'Trị Liệu Giọng Nói và Giao Tiếp',
        description: 'Trị liệu làm nữ hóa hoặc nam hóa giọng nói với chuyên gia ngôn ngữ trị liệu.',
        category: 'Gender-Affirming',
        price: 100,
        duration: 45,
    },
];

const doctors: Doctor[] = [
    {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        specialization: 'Nội tiết học',
        experience: 8,
        gender: 'female',
        bio: 'Chuyên về liệu pháp hormone cho chuyển đổi giới tính.',
        available: true,
    },
    {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        specialization: 'Tâm thần học',
        experience: 12,
        gender: 'male',
        bio: 'Chuyên môn về bản dạng giới và hỗ trợ sức khỏe tâm thần trong quá trình chuyển đổi.',
        available: true,
    },
    {
        id: '3',
        firstName: 'Aisha',
        lastName: 'Khan',
        specialization: 'Trị liệu ngôn ngữ',
        experience: 6,
        gender: 'female',
        bio: 'Chuyên gia về làm nữ hóa và nam hóa giọng nói.',
        available: true,
    },
];

const upcomingAppointments: Appointment[] = [
    {
        id: 'apt12345',
        patientId: '1',
        doctorId: '1',
        serviceId: '1',
        date: '15/06/2023',
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
        patientName: 'Người dùng Demo',
        doctorName: 'Sarah Johnson',
        serviceName: 'Tư Vấn Liệu Pháp Hormone',
    },
    {
        id: 'apt12346',
        patientId: '1',
        doctorId: '2',
        serviceId: '2',
        date: '22/06/2023',
        startTime: '14:30',
        endTime: '15:20',
        status: 'pending',
        patientName: 'Người dùng Demo',
        doctorName: 'Michael Chen',
        serviceName: 'Buổi Trị Liệu Giới Tính',
    },
];

const pastAppointments: Appointment[] = [
    {
        id: 'apt12340',
        patientId: '1',
        doctorId: '1',
        serviceId: '1',
        date: '05/05/2023',
        startTime: '09:30',
        endTime: '10:30',
        status: 'completed',
        patientName: 'Người dùng Demo',
        doctorName: 'Sarah Johnson',
        serviceName: 'Tư Vấn Liệu Pháp Hormone',
    },
];

const cancelledAppointments: Appointment[] = [
    {
        id: 'apt12339',
        patientId: '1',
        doctorId: '3',
        serviceId: '3',
        date: '20/05/2023',
        startTime: '13:00',
        endTime: '13:45',
        status: 'cancelled',
        patientName: 'Người dùng Demo',
        doctorName: 'Aisha Khan',
        serviceName: 'Trị Liệu Giọng Nói và Giao Tiếp',
    },
];

export default AppointmentPage; 