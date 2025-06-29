import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Box, Button, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, Step, StepLabel, Stepper, TextField, Typography, SelectChangeEvent, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import format from 'date-fns/format';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Service, Doctor, AppointmentCreateDto, AppointmentType } from '../../types';
import { getServices, getDoctorsByServiceId, getAvailableSlots, createAppointment } from '../../services/appointmentService';
import { toast } from 'react-toastify';

const steps = ['Chọn dịch vụ', 'Chọn bác sĩ & lịch', 'Xác nhận lịch hẹn'];

const AppointmentPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [activeStep, setActiveStep] = useState(0);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [appointmentType, setAppointmentType] = useState<AppointmentType>('offline');

    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login?redirect=/appointment', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Lấy danh sách dịch vụ
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

    // Khi chọn dịch vụ, lấy danh sách bác sĩ cho dịch vụ đó
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

    // Khi chọn bác sĩ và ngày, lấy các khung giờ có sẵn
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

    const handleServiceChange = (event: SelectChangeEvent<string>) => {
        const serviceId = event.target.value;
        const service = services.find(s => s.id === serviceId) || null;
        setSelectedService(service);
        setErrors({ ...errors, service: '' });
    };

    const handleDoctorChange = (event: SelectChangeEvent<string>) => {
        setSelectedDoctor(event.target.value);
        setErrors({ ...errors, doctor: '' });
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setErrors({ ...errors, date: '' });
    };

    const handleTimeChange = (event: SelectChangeEvent<string>) => {
        setSelectedTime(event.target.value);
        setErrors({ ...errors, time: '' });
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleAppointmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentType(event.target.value as AppointmentType);
    };

    const validateStep = (step: number) => {
        let newErrors: { [key: string]: string } = {};
        let isValid = true;

        if (step === 0) {
            if (!selectedService) {
                newErrors.service = 'Vui lòng chọn một dịch vụ';
                isValid = false;
            }
        } else if (step === 1) {
            if (!selectedDoctor) {
                newErrors.doctor = 'Vui lòng chọn bác sĩ';
                isValid = false;
            }
            if (!selectedDate) {
                newErrors.date = 'Vui lòng chọn ngày';
                isValid = false;
            }
            if (!selectedTime) {
                newErrors.time = 'Vui lòng chọn giờ';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        try {
            if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime || !user) {
                setSubmitError('Vui lòng nhập đầy đủ thông tin');
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }

            const appointmentData: AppointmentCreateDto = {
                patientId: user.id,
                doctorId: selectedDoctor,
                serviceId: selectedService.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedTime,
                appointmentType: appointmentType,
                notes: notes
            };

            console.log("Creating appointment with data:", appointmentData);

            // Lưu thông tin người dùng vào localStorage nếu chưa có
            if (!localStorage.getItem('userId')) {
                localStorage.setItem('userId', user.id);
                console.log("Saved userId to localStorage:", user.id);
            }

            if (!localStorage.getItem('userName') && user.firstName) {
                const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
                localStorage.setItem('userName', fullName);
                console.log("Saved userName to localStorage:", fullName);
            }

            const result = await createAppointment(appointmentData);
            console.log("Appointment creation result:", result);

            if (result) {
                setSubmitSuccess(true);
                toast.success('Đặt lịch thành công! Đang chuyển hướng...');

                // Lưu thông tin lịch hẹn vừa tạo vào localStorage để đảm bảo hiển thị
                try {
                    const existingAppointmentsJson = localStorage.getItem('mockAppointments');
                    let appointments = [];

                    if (existingAppointmentsJson) {
                        try {
                            appointments = JSON.parse(existingAppointmentsJson);
                            if (!Array.isArray(appointments)) {
                                console.warn("mockAppointments is not an array, resetting to empty array");
                                appointments = [];
                            }
                        } catch (parseError) {
                            console.error("Error parsing mockAppointments:", parseError);
                            appointments = [];
                        }
                    }

                    // Thêm lịch hẹn mới vào danh sách nếu chưa có
                    if (!appointments.some(app => app.id === result.id)) {
                        appointments.push(result);
                        localStorage.setItem('mockAppointments', JSON.stringify(appointments));
                        console.log("Added new appointment to localStorage. Total appointments:", appointments.length);
                    }
                } catch (error) {
                    console.error("Failed to update localStorage with new appointment:", error);
                }

                // Chuyển hướng đến trang xem lịch hẹn sau 2 giây
                setTimeout(() => {
                    navigate('/appointment/my-appointments');
                }, 2000);
            } else {
                setSubmitError('Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.');
                toast.error('Đã xảy ra lỗi khi đặt lịch');
            }
        } catch (error) {
            console.error('Error submitting appointment', error);
            setSubmitError('Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.');
            toast.error('Đã xảy ra lỗi khi đặt lịch');
        }
    };

    // Thêm hàm debug để kiểm tra dữ liệu localStorage
    const handleDebug = () => {
        console.log("=== DEBUG INFO ===");
        console.log("User:", user);
        console.log("Selected service:", selectedService);
        console.log("Selected doctor:", selectedDoctor);
        console.log("Selected date:", selectedDate);
        console.log("Selected time:", selectedTime);

        console.log("=== LOCAL STORAGE ===");
        console.log("userId:", localStorage.getItem('userId'));
        console.log("userName:", localStorage.getItem('userName'));

        const appointments = localStorage.getItem('mockAppointments');
        if (appointments) {
            try {
                const parsed = JSON.parse(appointments);
                console.log("mockAppointments:", parsed);
            } catch (error) {
                console.error("Error parsing mockAppointments:", error);
            }
        } else {
            console.log("mockAppointments: Not found");
        }

        // Mở trang debug.html trong tab mới
        window.open('/debug.html', '_blank');
    };

    // Hiển thị thông tin dịch vụ đã chọn
    const getSelectedServiceInfo = () => {
        if (!selectedService) return null;

        return (
            <Box mt={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">{selectedService.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">{selectedService.description}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Thời gian:</strong> {selectedService.duration} phút
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Giá:</strong> {selectedService.price.toLocaleString('vi-VN')} VNĐ
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    };

    // Hiển thị thông tin bác sĩ đã chọn
    const getSelectedDoctorInfo = () => {
        if (!selectedDoctor) return null;

        const doctor = doctors.find(d => d.id === selectedDoctor);
        if (!doctor) return null;

        return (
            <Box mt={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    borderRadius: '5px',
                                    objectFit: 'cover',
                                    height: '150px'
                                }}
                                alt={`${doctor.firstName} ${doctor.lastName}`}
                                src={doctor.imageUrl || 'https://via.placeholder.com/150'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Typography variant="h6">{doctor.firstName} {doctor.lastName}</Typography>
                            <Typography variant="body2">
                                <strong>Chuyên khoa:</strong> {doctor.specialization}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Kinh nghiệm:</strong> {doctor.experience}
                            </Typography>
                            {doctor.biography && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {doctor.biography}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    };

    // Hiển thị bước 1: Chọn dịch vụ
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Chọn dịch vụ bạn cần
                        </Typography>

                        <FormControl fullWidth error={!!errors.service} sx={{ mt: 2 }}>
                            <InputLabel id="service-label">Dịch vụ</InputLabel>
                            <Select
                                labelId="service-label"
                                value={selectedService?.id || ''}
                                label="Dịch vụ"
                                onChange={handleServiceChange}
                                startAdornment={<MedicalServicesIcon sx={{ mr: 1 }} />}
                            >
                                {services.map((service) => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
                        </FormControl>

                        {getSelectedServiceInfo()}
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        {/* Chọn bác sĩ */}
                        <FormControl fullWidth margin="normal" error={!!errors.doctor}>
                            <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                            <Select
                                labelId="doctor-label"
                                id="doctor-select"
                                value={selectedDoctor}
                                label="Bác sĩ"
                                onChange={handleDoctorChange}
                                startAdornment={<PersonIcon sx={{ mr: 1 }} />}
                            >
                                {doctors.map((doctor) => (
                                    <MenuItem key={doctor.id} value={doctor.id}>
                                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.doctor && <FormHelperText>{errors.doctor}</FormHelperText>}
                        </FormControl>

                        {/* Thông tin bác sĩ */}
                        {getSelectedDoctorInfo()}

                        {/* Chọn ngày */}
                        <FormControl fullWidth margin="normal" error={!!errors.date}>
                            <DatePicker
                                label="Ngày khám"
                                value={selectedDate}
                                onChange={handleDateChange}
                                format="dd/MM/yyyy"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: "normal",
                                        error: !!errors.date,
                                        helperText: errors.date,
                                        InputProps: {
                                            startAdornment: <EventIcon sx={{ mr: 1 }} />
                                        }
                                    }
                                }}
                                disablePast
                            />
                        </FormControl>

                        {/* Chọn thời gian */}
                        <FormControl fullWidth margin="normal" error={!!errors.time}>
                            <InputLabel id="time-label">Thời gian</InputLabel>
                            <Select
                                labelId="time-label"
                                id="time-select"
                                value={selectedTime}
                                label="Thời gian"
                                onChange={handleTimeChange}
                                startAdornment={<AccessTimeIcon sx={{ mr: 1 }} />}
                                disabled={availableSlots.length === 0}
                            >
                                {availableSlots.map((slot) => (
                                    <MenuItem key={slot} value={slot}>
                                        {slot}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.time && <FormHelperText>{errors.time}</FormHelperText>}
                            {availableSlots.length === 0 && (
                                <FormHelperText>
                                    Không có khung giờ nào khả dụng cho ngày này. Vui lòng chọn ngày khác.
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Chọn loại hẹn: online hoặc offline */}
                        <FormControl component="fieldset" margin="normal">
                            <FormLabel component="legend">Loại cuộc hẹn</FormLabel>
                            <RadioGroup
                                row
                                name="appointmentType"
                                value={appointmentType}
                                onChange={handleAppointmentTypeChange}
                            >
                                <FormControlLabel
                                    value="offline"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <LocalHospitalIcon sx={{ mr: 1 }} />
                                            <span>Tại phòng khám</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="online"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <VideocamIcon sx={{ mr: 1 }} />
                                            <span>Tư vấn trực tuyến</span>
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
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Xác nhận thông tin lịch hẹn
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <MedicalServicesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        <strong>Dịch vụ:</strong> {selectedService?.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        <strong>Bác sĩ:</strong> {
                                            doctors.find(d => d.id === selectedDoctor) ?
                                                `${doctors.find(d => d.id === selectedDoctor)?.firstName} ${doctors.find(d => d.id === selectedDoctor)?.lastName}` :
                                                ''
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        <strong>Ngày khám:</strong> {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        <strong>Thời gian:</strong> {selectedTime}
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
                            </Grid>
                        </Paper>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="notes"
                                label="Ghi chú"
                                multiline
                                rows={4}
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="Nhập ghi chú hoặc triệu chứng của bạn"
                                InputProps={{
                                    startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1 }} />
                                }}
                            />
                        </FormControl>

                        {submitError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {submitError}
                            </Alert>
                        )}

                        {submitSuccess && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Đặt lịch thành công! Bạn sẽ được chuyển đến trang lịch hẹn của mình.
                            </Alert>
                        )}
                    </Box>
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