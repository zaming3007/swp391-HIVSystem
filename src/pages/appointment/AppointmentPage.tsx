import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Alert, Box, Button, Container, FormControl, FormHelperText,
    Grid, InputLabel, MenuItem, Paper, Select, Step, StepLabel,
    Stepper, TextField, Typography, SelectChangeEvent, FormControlLabel,
    Radio, RadioGroup, FormLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { format, addDays } from 'date-fns';
import { RootState } from '../../store';
import {
    getServices,
    getDoctors,
    getDoctorsByServiceId,
    getAvailableSlots,
    createAppointment
} from '../../services/appointmentService';
import { Service, Doctor, AppointmentType, AppointmentCreateDto } from '../../types';
import { toast } from 'react-toastify';

const AppointmentPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !localStorage.getItem('guestMode')) {
            toast.info('Vui lòng đăng nhập để đặt lịch hẹn');
            navigate('/auth/login', { state: { from: '/appointment' } });
        }
    }, [isAuthenticated, navigate]);

    // Stepper state
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Chọn dịch vụ', 'Chọn bác sĩ và thời gian', 'Xác nhận thông tin'];

    // Form state
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(addDays(new Date(), 1));
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [appointmentType, setAppointmentType] = useState<string>('offline');

    // Handle service selection
    const handleServiceChange = (event: SelectChangeEvent) => {
        const serviceId = event.target.value;
        const service = services.find(s => s.id === serviceId);
        setSelectedService(service || null);
    };

    // Handle doctor selection
    const handleDoctorChange = (event: SelectChangeEvent) => {
        setSelectedDoctor(event.target.value);
    };

    // Handle date selection
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    // Handle time selection
    const handleTimeChange = (event: SelectChangeEvent) => {
        setSelectedTime(event.target.value);
    };

    // Handle notes input
    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    // Handle appointment type change
    const handleAppointmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentType(event.target.value);
    };

    // Fetch services on component mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesData = await getServices();
                console.log("Services data received:", servicesData);
                setServices(servicesData);
            } catch (error) {
                console.error('Failed to fetch services', error);
                toast.error('Không thể tải danh sách dịch vụ');
            }
        };

        fetchServices();
    }, []);

    // Fetch doctors when service is selected
    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedService) {
                try {
                    const doctorsData = await getDoctorsByServiceId(selectedService.id);
                    setDoctors(doctorsData);
                    if (doctorsData.length > 0) {
                        setSelectedDoctor(doctorsData[0].id);
                    }
                } catch (error) {
                    console.error('Failed to fetch doctors', error);
                    toast.error('Không thể tải danh sách bác sĩ');
                }
            }
        };

        fetchDoctors();
    }, [selectedService]);

    // Fetch available slots when doctor and date are selected
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (selectedDoctor && selectedDate && selectedService) {
                try {
                    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                    const slots = await getAvailableSlots(
                        selectedDoctor,
                        formattedDate,
                        selectedService.id
                    );
                    setAvailableSlots(slots);
                    setSelectedTime(''); // Reset selected time when slots change
                } catch (error) {
                    console.error('Failed to fetch available slots', error);
                    setAvailableSlots([]);
                }
            }
        };

        fetchAvailableSlots();
    }, [selectedDoctor, selectedDate, selectedService]);

    // Handle next step
    const handleNext = () => {
        if (activeStep === 0 && !selectedService) {
            toast.error('Vui lòng chọn dịch vụ');
            return;
        }

        if (activeStep === 1 && (!selectedDoctor || !selectedDate || !selectedTime)) {
            toast.error('Vui lòng chọn bác sĩ, ngày và giờ khám');
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Debug function
    const handleDebug = () => {
        console.log({
            selectedService,
            selectedDoctor,
            selectedDate,
            selectedTime,
            notes,
            appointmentType,
            user
        });
    };

    const handleSubmit = async () => {
        try {
            if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime) {
                setSubmitError('Vui lòng nhập đầy đủ thông tin');
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }

            // Debug: hiển thị thông tin người dùng hiện tại
            console.log("Current user from Redux state:", user);
            console.log("isAuthenticated:", isAuthenticated);

            // Lấy userId từ localStorage nếu không tìm thấy trong Redux state
            let userId = user?.id;
            if (!userId) {
                userId = localStorage.getItem('userId') || undefined;
                console.log("UserId not found in Redux state, using from localStorage:", userId);
            }

            // Nếu vẫn không tìm thấy userId, sử dụng ID cố định cho debug
            if (!userId) {
                userId = "126567f5-7cf3-441a-8524-69341cb9bac3"; // ID cố định cho debug
                console.log("Using hardcoded userId for debug:", userId);
                // Lưu vào localStorage để dùng cho lần sau
                localStorage.setItem('userId', userId);
            }

            const appointmentData: AppointmentCreateDto = {
                patientId: userId,
                doctorId: selectedDoctor,
                serviceId: selectedService.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedTime,
                appointmentType: appointmentType as AppointmentType,
                notes: notes
            };

            console.log("Creating appointment with data:", appointmentData);

            // Lấy tên người dùng từ Redux state (ưu tiên) hoặc từ localStorage
            if (user?.firstName && user?.lastName) {
                // Luôn ưu tiên sử dụng thông tin người dùng từ Redux
                const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
                localStorage.setItem('userName', fullName);
                console.log("Using current user name from Redux:", fullName);
            } else if (!localStorage.getItem('userName')) {
                // Chỉ sử dụng giá trị mặc định nếu không có thông tin người dùng từ Redux và localStorage
                localStorage.setItem('userName', "Bệnh nhân Test");
                console.log("No user name available, using default: Bệnh nhân Test");
            }

            const result = await createAppointment(appointmentData);
            console.log("Appointment creation result:", result);

            if (result) {
                setSubmitSuccess(true);
                toast.success('Đặt lịch thành công! Đang chuyển hướng...');

                // Chuyển hướng đến trang xem lịch hẹn sau 2 giây
                setTimeout(() => {
                    navigate('/appointment/my-appointments');
                }, 2000);
            } else {
                setSubmitError('Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.');
                toast.error('Đã xảy ra lỗi khi đặt lịch');
            }
        } catch (error: any) {
            console.error('Error submitting appointment', error);

            // Hiển thị thông báo lỗi chi tiết nếu có
            const errorMessage = error.message || 'Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.';
            setSubmitError(errorMessage);
            toast.error(errorMessage);

            // Nếu lỗi trùng lịch, tự động làm mới danh sách khung giờ
            if (errorMessage.includes('trùng lịch') || errorMessage.includes('không có lịch trống')) {
                // Làm mới danh sách khung giờ
                if (selectedDoctor && selectedDate && selectedService) {
                    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                    getAvailableSlots(selectedDoctor, formattedDate, selectedService.id)
                        .then(slots => {
                            setAvailableSlots(slots);
                            setSelectedTime(''); // Đặt lại thời gian đã chọn
                        })
                        .catch(err => console.error('Failed to refresh available slots', err));
                }
            }
        }
    };

    // Render step content based on active step
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="service-select-label">Chọn dịch vụ</InputLabel>
                                <Select
                                    labelId="service-select-label"
                                    id="service-select"
                                    value={selectedService?.id || ''}
                                    onChange={handleServiceChange}
                                    label="Chọn dịch vụ"
                                >
                                    {services.map((service) => (
                                        <MenuItem key={service.id} value={service.id}>
                                            {service.name} - {service.price.toLocaleString()}đ ({service.duration} phút)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {selectedService && (
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Thông tin dịch vụ:</strong>
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {selectedService.description}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Thời gian:</strong> {selectedService.duration} phút
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Giá:</strong> {selectedService.price.toLocaleString()}đ
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="doctor-select-label">Chọn bác sĩ</InputLabel>
                                <Select
                                    labelId="doctor-select-label"
                                    id="doctor-select"
                                    value={selectedDoctor}
                                    onChange={handleDoctorChange}
                                    label="Chọn bác sĩ"
                                >
                                    {doctors.map((doctor) => (
                                        <MenuItem key={doctor.id} value={doctor.id}>
                                            {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Chọn ngày khám"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    disablePast
                                    slotProps={{
                                        textField: { fullWidth: true }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth disabled={!selectedDoctor || !selectedDate}>
                                <Grid container spacing={2}>
                                    {availableSlots.length === 0 ? (
                                        <Grid item xs={12}>
                                            <Alert severity="info">
                                                Không có khung giờ khả dụng cho ngày này. Vui lòng chọn ngày khác.
                                            </Alert>
                                        </Grid>
                                    ) : (
                                        availableSlots.map((time) => (
                                            <Grid item xs={6} sm={4} md={3} key={time}>
                                                <Button
                                                    variant={selectedTime === time ? 'contained' : 'outlined'}
                                                    color={selectedTime === time ? 'primary' : 'inherit'}
                                                    fullWidth
                                                    onClick={() => handleTimeChange({ target: { value: time } } as SelectChangeEvent)}
                                                    sx={{ mb: 1 }}
                                                >
                                                    {time}
                                                </Button>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Hình thức khám</FormLabel>
                                <RadioGroup
                                    row
                                    value={appointmentType}
                                    onChange={handleAppointmentTypeChange}
                                >
                                    <FormControlLabel
                                        value="offline"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocalHospitalIcon sx={{ mr: 1 }} />
                                                Tại phòng khám
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        value="online"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <VideocamIcon sx={{ mr: 1 }} />
                                                Tư vấn trực tuyến
                                            </Box>
                                        }
                                    />
                                </RadioGroup>
                                <FormHelperText>
                                    {appointmentType === 'online'
                                        ? 'Bạn sẽ được cung cấp link cuộc họp sau khi đặt lịch thành công.'
                                        : 'Vui lòng đến phòng khám trước 15 phút so với giờ hẹn.'}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú (không bắt buộc)"
                                multiline
                                rows={4}
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="Vui lòng cung cấp thêm thông tin về tình trạng của bạn hoặc yêu cầu đặc biệt."
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        {selectedService && (
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin lịch hẹn
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Dịch vụ:</strong> {selectedService.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Giá:</strong> {selectedService.price.toLocaleString()}đ
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Thời gian:</strong> {selectedService.duration} phút
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Bác sĩ:</strong> {doctors.find(d => d.id === selectedDoctor)?.firstName} {doctors.find(d => d.id === selectedDoctor)?.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Ngày khám:</strong> {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Giờ khám:</strong> {selectedTime}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        {appointmentType === 'online'
                                            ? <VideocamIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            : <LocalHospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        }
                                        <strong>Loại cuộc hẹn:</strong> {appointmentType === 'online' ? 'Tư vấn trực tuyến' : 'Tại phòng khám'}
                                    </Typography>
                                </Grid>
                                {notes && (
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            <strong>Ghi chú:</strong> {notes}
                                        </Typography>
                                    </Grid>
                                )}
                                {submitError && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{submitError}</Alert>
                                    </Grid>
                                )}
                                {submitSuccess && (
                                    <Grid item xs={12}>
                                        <Alert severity="success">
                                            Đặt lịch thành công! Bạn sẽ được chuyển đến trang lịch hẹn của mình.
                                        </Alert>
                                    </Grid>
                                )}
                            </>
                        )}
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Đặt Lịch Hẹn
                    </Typography>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={handleDebug}
                        size="small"
                    >
                        Debug
                    </Button>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ width: '100%', mt: 4 }}>
                    <Box sx={{ mt: 4, p: 3, border: '1px solid #eaeaea', borderRadius: 2 }}>
                        {getStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                            >
                                Quay lại
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={submitSuccess}
                                >
                                    Xác nhận đặt lịch
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                >
                                    Tiếp theo
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default AppointmentPage; 