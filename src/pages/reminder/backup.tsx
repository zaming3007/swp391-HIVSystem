import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Stack,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
    Notifications as NotificationsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    AlarmOn as AlarmOnIcon,
    EventNote as EventNoteIcon
} from '@mui/icons-material';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';

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
            id={`reminder-tabpanel-${index}`}
            aria-labelledby={`reminder-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `reminder-tab-${index}`,
        'aria-controls': `reminder-tabpanel-${index}`,
    };
}

// Mock Data - Phác đồ ARV 
const arvRegimens = [
    { id: 1, name: 'TDF + 3TC + DTG', description: 'Phác đồ bậc 1 - Người trưởng thành' },
    { id: 2, name: 'TDF + 3TC + EFV', description: 'Phác đồ bậc 1 - Phụ nữ có thai' },
    { id: 3, name: 'ABC + 3TC + DTG', description: 'Phác đồ thay thế - Người có bệnh thận' },
    { id: 4, name: 'AZT + 3TC + NVP', description: 'Phác đồ bậc 1 - Trẻ em' },
    { id: 5, name: 'TDF + FTC + DTG', description: 'Phác đồ bậc 1 - Thay thế' }
];

// Mock Data - Nhắc nhở uống thuốc
const initialMedicationReminders = [
    {
        id: 1,
        medicineName: 'ARV - TDF + 3TC + DTG',
        schedule: 'Hàng ngày',
        time: '08:00',
        enabled: true,
        notes: 'Uống sau bữa sáng'
    },
    {
        id: 2,
        medicineName: 'Cotrimoxazole',
        schedule: 'Hàng ngày',
        time: '20:00',
        enabled: true,
        notes: 'Uống sau bữa tối'
    }
];

// Mock Data - Lịch tái khám
const initialAppointments = [
    {
        id: 1,
        title: 'Tái khám và lấy thuốc ARV',
        date: new Date('2023-12-15'),
        time: '09:30',
        doctor: 'BS. Nguyễn Văn A',
        location: 'Phòng khám HIV ngoại trú',
        notes: 'Mang theo sổ điều trị và kết quả xét nghiệm'
    },
    {
        id: 2,
        title: 'Xét nghiệm CD4 và tải lượng virus',
        date: new Date('2023-12-28'),
        time: '10:00',
        doctor: 'BS. Trần Thị B',
        location: 'Phòng xét nghiệm - Tầng 2',
        notes: 'Nhịn ăn 8 tiếng trước khi xét nghiệm'
    }
];

const ReminderPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [medicationReminders, setMedicationReminders] = useState(initialMedicationReminders);
    const [appointments, setAppointments] = useState(initialAppointments);

    const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [currentReminder, setCurrentReminder] = useState<any>(null);
    const [currentAppointment, setCurrentAppointment] = useState<any>(null);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Xử lý mở dialog nhắc nhở thuốc
    const handleOpenMedicationDialog = (reminder: any = null) => {
        if (reminder) {
            setCurrentReminder(reminder);
        } else {
            setCurrentReminder({
                id: Math.max(0, ...medicationReminders.map(r => r.id)) + 1,
                medicineName: '',
                schedule: 'Hàng ngày',
                time: '',
                enabled: true,
                notes: ''
            });
        }
        setOpenMedicationDialog(true);
    };

    // Đóng dialog nhắc nhở thuốc
    const handleCloseMedicationDialog = () => {
        setOpenMedicationDialog(false);
        setCurrentReminder(null);
    };

    // Xử lý mở dialog lịch hẹn
    const handleOpenAppointmentDialog = (appointment: any = null) => {
        if (appointment) {
            setCurrentAppointment(appointment);
            setSelectedDate(appointment.date);
            setSelectedTime(new Date(`2000-01-01T${appointment.time}`));
        } else {
            setCurrentAppointment({
                id: Math.max(0, ...appointments.map(a => a.id)) + 1,
                title: '',
                date: new Date(),
                time: '',
                doctor: '',
                location: '',
                notes: ''
            });
            setSelectedDate(new Date());
            setSelectedTime(null);
        }
        setOpenAppointmentDialog(true);
    };

    // Đóng dialog lịch hẹn
    const handleCloseAppointmentDialog = () => {
        setOpenAppointmentDialog(false);
        setCurrentAppointment(null);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    // Xử lý lưu nhắc nhở thuốc
    const handleSaveMedicationReminder = () => {
        if (currentReminder) {
            const isExisting = medicationReminders.some(reminder => reminder.id === currentReminder.id);
            if (isExisting) {
                setMedicationReminders(medicationReminders.map(reminder =>
                    reminder.id === currentReminder.id ? currentReminder : reminder
                ));
            } else {
                setMedicationReminders([...medicationReminders, currentReminder]);
            }
            handleCloseMedicationDialog();
        }
    };

    // Xử lý lưu lịch hẹn
    const handleSaveAppointment = () => {
        if (currentAppointment && selectedDate) {
            const updatedAppointment = {
                ...currentAppointment,
                date: selectedDate,
                time: selectedTime ? format(selectedTime, 'HH:mm') : '00:00'
            };

            const isExisting = appointments.some(apt => apt.id === updatedAppointment.id);
            if (isExisting) {
                setAppointments(appointments.map(apt =>
                    apt.id === updatedAppointment.id ? updatedAppointment : apt
                ));
            } else {
                setAppointments([...appointments, updatedAppointment]);
            }
            handleCloseAppointmentDialog();
        }
    };

    // Xử lý xóa nhắc nhở thuốc
    const handleDeleteMedicationReminder = (id: number) => {
        setMedicationReminders(medicationReminders.filter(reminder => reminder.id !== id));
    };

    // Xử lý xóa lịch hẹn
    const handleDeleteAppointment = (id: number) => {
        setAppointments(appointments.filter(apt => apt.id !== id));
    };

    // Xử lý thay đổi trạng thái kích hoạt của nhắc nhở
    const handleToggleReminder = (id: number) => {
        setMedicationReminders(medicationReminders.map(reminder =>
            reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
        ));
    };

    // Form handleChange cho nhắc nhở thuốc
    const handleMedicationChange = (field: string, value: any) => {
        if (currentReminder) {
            setCurrentReminder({
                ...currentReminder,
                [field]: value
            });
        }
    };

    // Form handleChange cho lịch hẹn
    const handleAppointmentChange = (field: string, value: any) => {
        if (currentAppointment) {
            setCurrentAppointment({
                ...currentAppointment,
                [field]: value
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý nhắc nhở
            </Typography>

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mt: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="reminder tabs"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Nhắc nhở uống thuốc" {...a11yProps(0)} />
                    <Tab label="Lịch tái khám" {...a11yProps(1)} />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6">
                            Lịch uống thuốc của bạn
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenMedicationDialog()}
                        >
                            Thêm nhắc nhở
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {medicationReminders.map((reminder) => (
                            <Grid item xs={12} md={6} key={reminder.id}>
                                <Card sx={{
                                    borderLeft: 6,
                                    borderColor: reminder.enabled ? 'primary.main' : 'grey.400',
                                    opacity: reminder.enabled ? 1 : 0.7
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" component="div">
                                                {reminder.medicineName}
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={reminder.enabled}
                                                        onChange={() => handleToggleReminder(reminder.id)}
                                                        color="primary"
                                                    />
                                                }
                                                label={reminder.enabled ? "Bật" : "Tắt"}
                                                labelPlacement="start"
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <AlarmOnIcon color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                {reminder.time} - {reminder.schedule}
                                            </Typography>
                                        </Box>

                                        {reminder.notes && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {reminder.notes}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenMedicationDialog(reminder)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteMedicationReminder(reminder.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        {medicationReminders.length === 0 && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <NotificationsIcon color="disabled" sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        Chưa có nhắc nhở nào
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        Thiết lập nhắc nhở uống thuốc để đảm bảo bạn không bỏ lỡ liều nào
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenMedicationDialog()}
                                    >
                                        Thêm nhắc nhở mới
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6">
                            Lịch tái khám của bạn
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenAppointmentDialog()}
                        >
                            Thêm lịch hẹn
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {appointments.map((appointment) => (
                            <Grid item xs={12} md={6} key={appointment.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {appointment.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <EventNoteIcon color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                {format(appointment.date, 'dd/MM/yyyy')} - {appointment.time}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Typography variant="body2" color="text.secondary">
                                            Bác sĩ: {appointment.doctor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Địa điểm: {appointment.location}
                                        </Typography>

                                        {appointment.notes && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Ghi chú: {appointment.notes}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenAppointmentDialog(appointment)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteAppointment(appointment.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        {appointments.length === 0 && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <EventNoteIcon color="disabled" sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        Chưa có lịch hẹn nào
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        Thiết lập lịch tái khám để đảm bảo bạn được theo dõi thường xuyên
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenAppointmentDialog()}
                                    >
                                        Thêm lịch hẹn mới
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
            </Box>

            {/* Dialog thêm/sửa nhắc nhở uống thuốc */}
            <Dialog open={openMedicationDialog} onClose={handleCloseMedicationDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {currentReminder && currentReminder.id && medicationReminders.some(r => r.id === currentReminder.id)
                        ? "Chỉnh sửa nhắc nhở"
                        : "Thêm nhắc nhở mới"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Thuốc</InputLabel>
                                    <Select
                                        value={currentReminder?.medicineName || ''}
                                        label="Thuốc"
                                        onChange={(e) => handleMedicationChange('medicineName', e.target.value)}
                                    >
                                        {arvRegimens.map((regimen) => (
                                            <MenuItem key={regimen.id} value={`ARV - ${regimen.name}`}>
                                                ARV - {regimen.name} ({regimen.description})
                                            </MenuItem>
                                        ))}
                                        <MenuItem value="Cotrimoxazole">Cotrimoxazole (Dự phòng nhiễm trùng)</MenuItem>
                                        <MenuItem value="Isoniazid">Isoniazid (Dự phòng Lao)</MenuItem>
                                        <MenuItem value="Fluconazole">Fluconazole (Điều trị nấm)</MenuItem>
                                        <MenuItem value="Khác">Thuốc khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {currentReminder?.medicineName === 'Khác' && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tên thuốc"
                                        value={currentReminder?.customMedicineName || ''}
                                        onChange={(e) => handleMedicationChange('customMedicineName', e.target.value)}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Lịch uống</InputLabel>
                                    <Select
                                        value={currentReminder?.schedule || 'Hàng ngày'}
                                        label="Lịch uống"
                                        onChange={(e) => handleMedicationChange('schedule', e.target.value)}
                                    >
                                        <MenuItem value="Hàng ngày">Hàng ngày</MenuItem>
                                        <MenuItem value="Cách ngày">Cách ngày</MenuItem>
                                        <MenuItem value="Hàng tuần">Hàng tuần</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Thời gian"
                                    type="time"
                                    value={currentReminder?.time || ''}
                                    onChange={(e) => handleMedicationChange('time', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Ghi chú"
                                    value={currentReminder?.notes || ''}
                                    onChange={(e) => handleMedicationChange('notes', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMedicationDialog}>Hủy</Button>
                    <Button
                        onClick={handleSaveMedicationReminder}
                        variant="contained"
                        disabled={!currentReminder?.medicineName || !currentReminder?.time}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog thêm/sửa lịch tái khám */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <Dialog open={openAppointmentDialog} onClose={handleCloseAppointmentDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {currentAppointment && currentAppointment.id && appointments.some(a => a.id === currentAppointment.id)
                            ? "Chỉnh sửa lịch hẹn"
                            : "Thêm lịch hẹn mới"}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tiêu đề"
                                        value={currentAppointment?.title || ''}
                                        onChange={(e) => handleAppointmentChange('title', e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <DatePicker
                                        label="Ngày hẹn"
                                        value={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TimePicker
                                        label="Giờ hẹn"
                                        value={selectedTime}
                                        onChange={(time) => setSelectedTime(time)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Bác sĩ"
                                        value={currentAppointment?.doctor || ''}
                                        onChange={(e) => handleAppointmentChange('doctor', e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Địa điểm"
                                        value={currentAppointment?.location || ''}
                                        onChange={(e) => handleAppointmentChange('location', e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Ghi chú"
                                        value={currentAppointment?.notes || ''}
                                        onChange={(e) => handleAppointmentChange('notes', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAppointmentDialog}>Hủy</Button>
                        <Button
                            onClick={handleSaveAppointment}
                            variant="contained"
                            disabled={!currentAppointment?.title || !selectedDate}
                        >
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </Container>
    );
};

export default ReminderPage;
