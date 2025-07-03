import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    FormGroup
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
    EventNote as EventNoteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { vi } from 'date-fns/locale';
import { format, parse } from 'date-fns';
import { reminderService, MedicationReminder, AppointmentReminder, ARVRegimen } from '../../services/reminderService';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { RecurrenceOption } from '../../types';

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

const RECURRENCE_OPTIONS: RecurrenceOption[] = [
    { value: 'none', label: 'Không lặp lại' },
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'weekly', label: 'Hàng tuần' },
    { value: 'monthly', label: 'Hàng tháng' }
];

const WEEKDAYS = [
    { value: 0, label: 'CN' },
    { value: 1, label: 'T2' },
    { value: 2, label: 'T3' },
    { value: 3, label: 'T4' },
    { value: 4, label: 'T5' },
    { value: 5, label: 'T6' },
    { value: 6, label: 'T7' }
];

const ReminderPage: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>([]);
    const [appointments, setAppointments] = useState<AppointmentReminder[]>([]);
    const [arvRegimens, setArvRegimens] = useState<ARVRegimen[]>([]);

    const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [currentReminder, setCurrentReminder] = useState<Partial<MedicationReminder> | null>(null);
    const [currentAppointment, setCurrentAppointment] = useState<Partial<AppointmentReminder> | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser?.id;

    useEffect(() => {
        const loadData = async () => {
            if (!userId) {
                setError('Vui lòng đăng nhập để sử dụng tính năng này');
                return;
            }

            setLoading(true);
            try {
                // Load ARV regimens
                const regimens = await reminderService.getARVRegimens();
                setArvRegimens(regimens);

                // Load medication reminders
                const medications = await reminderService.getMedicationReminders(userId);
                setMedicationReminders(medications);

                // Load appointment reminders
                const appts = await reminderService.getAppointmentReminders(userId);
                setAppointments(appts);
            } catch (err) {
                console.error('Error loading reminder data:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Xử lý mở dialog nhắc nhở thuốc
    const handleOpenMedicationDialog = (reminder: MedicationReminder | null = null) => {
        if (reminder) {
            setCurrentReminder({ ...reminder });
        } else {
            setCurrentReminder({
                userId,
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
    const handleOpenAppointmentDialog = (appointment: AppointmentReminder | null = null) => {
        if (appointment) {
            setCurrentAppointment({ ...appointment });
            setSelectedDate(new Date(appointment.date));
            setSelectedTime(parse(appointment.time, 'HH:mm', new Date()));
        } else {
            setCurrentAppointment({
                userId,
                title: '',
                date: format(new Date(), 'yyyy-MM-dd'),
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
    const handleSaveMedicationReminder = async () => {
        if (!currentReminder) return;
        if (!currentReminder.medicineName || !currentReminder.time) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            if (currentReminder.id) {
                // Update existing reminder
                const updated = await reminderService.updateMedicationReminder(
                    currentReminder.id,
                    currentReminder
                );

                // Update state
                setMedicationReminders(medicationReminders.map(item =>
                    item.id === updated.id ? updated : item
                ));
            } else {
                // Create new reminder
                const newReminder = await reminderService.createMedicationReminder(
                    currentReminder as Omit<MedicationReminder, 'id'>
                );

                // Update state
                setMedicationReminders([...medicationReminders, newReminder]);
            }

            handleCloseMedicationDialog();
        } catch (err) {
            console.error('Error saving medication reminder:', err);
            setError('Không thể lưu nhắc nhở. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý lưu lịch hẹn
    const handleSaveAppointmentReminder = async () => {
        if (!currentAppointment || !selectedDate) return;
        if (!currentAppointment.title || !currentAppointment.doctor || !currentAppointment.location) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const updatedAppointment = {
                ...currentAppointment,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime ? format(selectedTime, 'HH:mm') : '00:00'
            };

            if (currentAppointment.id) {
                // Update existing appointment
                const updated = await reminderService.updateAppointmentReminder(
                    currentAppointment.id,
                    updatedAppointment
                );

                // Update state
                setAppointments(appointments.map(item =>
                    item.id === updated.id ? updated : item
                ));
            } else {
                // Create new appointment
                const newAppointment = await reminderService.createAppointmentReminder(
                    updatedAppointment as Omit<AppointmentReminder, 'id'>
                );

                // Update state
                setAppointments([...appointments, newAppointment]);
            }

            handleCloseAppointmentDialog();
        } catch (err) {
            console.error('Error saving appointment reminder:', err);
            setError('Không thể lưu lịch hẹn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xóa nhắc nhở thuốc
    const handleDeleteMedicationReminder = async (id: string) => {
        setLoading(true);
        try {
            await reminderService.deleteMedicationReminder(id);
            setMedicationReminders(medicationReminders.filter(reminder => reminder.id !== id));
        } catch (err) {
            console.error('Error deleting medication reminder:', err);
            setError('Không thể xóa nhắc nhở. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xóa lịch hẹn
    const handleDeleteAppointmentReminder = async (id: string) => {
        setLoading(true);
        try {
            await reminderService.deleteAppointmentReminder(id);
            setAppointments(appointments.filter(apt => apt.id !== id));
        } catch (err) {
            console.error('Error deleting appointment reminder:', err);
            setError('Không thể xóa lịch hẹn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi trạng thái kích hoạt của nhắc nhở
    const handleToggleReminder = async (id: string, enabled: boolean) => {
        setLoading(true);
        try {
            await reminderService.toggleMedicationReminder(id, !enabled);
            setMedicationReminders(medicationReminders.map(reminder =>
                reminder.id === id ? { ...reminder, enabled: !enabled } : reminder
            ));
        } catch (err) {
            console.error('Error toggling medication reminder:', err);
            setError('Không thể thay đổi trạng thái. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
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
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Quản Lý Nhắc Nhở
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {loading && !tabValue ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="reminder tabs"
                        >
                            <Tab label="Nhắc Nhở Uống Thuốc" {...a11yProps(0)} />
                            <Tab label="Lịch Tái Khám" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenMedicationDialog()}
                            >
                                Thêm Nhắc Nhở Mới
                            </Button>
                        </Box>

                        {medicationReminders.length > 0 ? (
                            <Grid container spacing={3}>
                                {medicationReminders.map((reminder) => (
                                    <Grid item xs={12} md={6} key={reminder.id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom>
                                                            {reminder.medicineName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {reminder.schedule} - {reminder.time}
                                                        </Typography>
                                                    </Box>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={reminder.enabled}
                                                                onChange={() => handleToggleReminder(reminder.id, reminder.enabled)}
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                </Box>

                                                {reminder.notes && (
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        Ghi chú: {reminder.notes}
                                                    </Typography>
                                                )}

                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => handleOpenMedicationDialog(reminder)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleDeleteMedicationReminder(reminder.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <AlarmOnIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Chưa có nhắc nhở uống thuốc nào
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Thêm nhắc nhở để giúp bạn uống thuốc đúng giờ, không bỏ lỡ liều thuốc quan trọng
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenMedicationDialog()}
                                >
                                    Thêm Nhắc Nhở
                                </Button>
                            </Paper>
                        )}
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenAppointmentDialog()}
                            >
                                Thêm Lịch Tái Khám Mới
                            </Button>
                        </Box>

                        {appointments.length > 0 ? (
                            <Grid container spacing={3}>
                                {appointments.map((appointment) => (
                                    <Grid item xs={12} md={6} key={appointment.id}>
                                        <Card>
                                            <CardContent>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {appointment.title}
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        <Typography variant="body2">
                                                            <strong>Ngày: </strong>
                                                            {new Date(appointment.date).toLocaleDateString('vi-VN')}
                                                            <strong> - Giờ: </strong>
                                                            {appointment.time}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Bác sĩ: </strong>
                                                            {appointment.doctor}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Địa điểm: </strong>
                                                            {appointment.location}
                                                        </Typography>
                                                        {appointment.notes && (
                                                            <Typography variant="body2">
                                                                <strong>Ghi chú: </strong>
                                                                {appointment.notes}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => handleOpenAppointmentDialog(appointment)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleDeleteAppointmentReminder(appointment.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <EventNoteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Chưa có lịch tái khám nào
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Thêm lịch tái khám để không bỏ lỡ các buổi khám quan trọng
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenAppointmentDialog()}
                                >
                                    Thêm Lịch Tái Khám
                                </Button>
                            </Paper>
                        )}
                    </TabPanel>
                </>
            )}

            {/* Dialog thêm/sửa nhắc nhở thuốc */}
            <Dialog
                open={openMedicationDialog}
                onClose={handleCloseMedicationDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {currentReminder?.id ? 'Chỉnh Sửa Nhắc Nhở' : 'Thêm Nhắc Nhở Mới'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseMedicationDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel id="med-name-label">Tên Thuốc</InputLabel>
                        <Select
                            labelId="med-name-label"
                            value={currentReminder?.medicineName || ''}
                            label="Tên Thuốc"
                            onChange={(e) => handleMedicationChange('medicineName', e.target.value)}
                        >
                            {arvRegimens.map((regimen) => (
                                <MenuItem key={regimen.id} value={regimen.name}>
                                    {regimen.name} - {regimen.description}
                                </MenuItem>
                            ))}
                            <MenuItem value="Cotrimoxazole">Cotrimoxazole - Thuốc dự phòng nhiễm trùng</MenuItem>
                            <MenuItem value="other">Thuốc khác...</MenuItem>
                        </Select>
                    </FormControl>

                    {currentReminder?.medicineName === 'other' && (
                        <TextField
                            label="Tên Thuốc"
                            fullWidth
                            margin="normal"
                            value={currentReminder?.customMedicineName || ''}
                            onChange={(e) => handleMedicationChange('customMedicineName', e.target.value)}
                        />
                    )}

                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel id="schedule-label">Lịch Uống</InputLabel>
                        <Select
                            labelId="schedule-label"
                            value={currentReminder?.schedule || 'Hàng ngày'}
                            label="Lịch Uống"
                            onChange={(e) => handleMedicationChange('schedule', e.target.value)}
                        >
                            <MenuItem value="Hàng ngày">Hàng ngày</MenuItem>
                            <MenuItem value="Thứ 2, 4, 6">Thứ 2, 4, 6</MenuItem>
                            <MenuItem value="Thứ 3, 5, 7">Thứ 3, 5, 7</MenuItem>
                            <MenuItem value="Chủ Nhật">Chủ Nhật</MenuItem>
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <TimePicker
                            label="Giờ Uống"
                            value={currentReminder?.time ? parse(currentReminder.time, 'HH:mm', new Date()) : null}
                            onChange={(newTime) => {
                                if (newTime) {
                                    handleMedicationChange('time', format(newTime, 'HH:mm'));
                                }
                            }}
                            sx={{ width: '100%', mt: 2, mb: 2 }}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Ghi Chú"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={currentReminder?.notes || ''}
                        onChange={(e) => handleMedicationChange('notes', e.target.value)}
                    />

                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseMedicationDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveMedicationReminder}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog thêm/sửa lịch tái khám */}
            <Dialog
                open={openAppointmentDialog}
                onClose={handleCloseAppointmentDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {currentAppointment?.id ? 'Chỉnh Sửa Lịch Tái Khám' : 'Thêm Lịch Tái Khám Mới'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAppointmentDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tiêu Đề"
                        fullWidth
                        margin="normal"
                        value={currentAppointment?.title || ''}
                        onChange={(e) => handleAppointmentChange('title', e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                            label="Ngày Hẹn"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            sx={{ width: '100%', mt: 2, mb: 2 }}
                        />

                        <TimePicker
                            label="Giờ Hẹn"
                            value={selectedTime}
                            onChange={(newTime) => setSelectedTime(newTime)}
                            sx={{ width: '100%', mt: 2, mb: 2 }}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Bác Sĩ"
                        fullWidth
                        margin="normal"
                        value={currentAppointment?.doctor || ''}
                        onChange={(e) => handleAppointmentChange('doctor', e.target.value)}
                    />

                    <TextField
                        label="Địa Điểm"
                        fullWidth
                        margin="normal"
                        value={currentAppointment?.location || ''}
                        onChange={(e) => handleAppointmentChange('location', e.target.value)}
                    />

                    <TextField
                        label="Ghi Chú"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={currentAppointment?.notes || ''}
                        onChange={(e) => handleAppointmentChange('notes', e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseAppointmentDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveAppointmentReminder}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ReminderPage;
