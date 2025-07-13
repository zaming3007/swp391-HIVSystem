import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Alert,
    Snackbar,
    Tab,
    Tabs,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import {
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    Storage as StorageIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';

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
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

interface SystemSettings {
    // General Settings
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;

    // Appointment Settings
    maxAppointmentsPerDay: number;
    appointmentDuration: number;
    advanceBookingDays: number;
    allowCancellation: boolean;
    cancellationDeadlineHours: number;

    // Notification Settings
    emailNotifications: boolean;
    smsNotifications: boolean;
    appointmentReminders: boolean;
    reminderHoursBefore: number;

    // Security Settings
    sessionTimeout: number;
    passwordMinLength: number;
    requirePasswordChange: boolean;
    passwordChangeDays: number;

    // System Settings
    maintenanceMode: boolean;
    debugMode: boolean;
    logLevel: string;
    backupFrequency: string;
}

const SystemSettingsPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [settings, setSettings] = useState<SystemSettings>({
        // General Settings
        siteName: 'HIV Healthcare System',
        siteDescription: 'Hệ thống chăm sóc sức khỏe HIV/AIDS chuyên nghiệp',
        contactEmail: 'contact@hivhealthcare.vn',
        contactPhone: '1900-1234',
        address: 'Số 123, Đường ABC, Quận 1, TP.HCM',

        // Appointment Settings
        maxAppointmentsPerDay: 50,
        appointmentDuration: 30,
        advanceBookingDays: 30,
        allowCancellation: true,
        cancellationDeadlineHours: 24,

        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        reminderHoursBefore: 24,

        // Security Settings
        sessionTimeout: 60,
        passwordMinLength: 8,
        requirePasswordChange: false,
        passwordChangeDays: 90,

        // System Settings
        maintenanceMode: false,
        debugMode: false,
        logLevel: 'INFO',
        backupFrequency: 'daily'
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [loading, setLoading] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSettingChange = (key: keyof SystemSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save to localStorage for demo
            localStorage.setItem('systemSettings', JSON.stringify(settings));

            setSnackbar({
                open: true,
                message: 'Cài đặt đã được lưu thành công!',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi khi lưu cài đặt!',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        // Load from localStorage or use defaults
        const savedSettings = localStorage.getItem('systemSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        setSnackbar({
            open: true,
            message: 'Đã khôi phục cài đặt!',
            severity: 'success'
        });
    };

    useEffect(() => {
        // Load settings on component mount
        const savedSettings = localStorage.getItem('systemSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Cài Đặt Hệ Thống
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleReset}
                    >
                        Khôi phục
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Lưu cài đặt
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ width: '100%' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Thông tin chung" />
                    <Tab label="Lịch hẹn" />
                    <Tab label="Thông báo" />
                    <Tab label="Bảo mật" />
                    <Tab label="Hệ thống" />
                </Tabs>

                {/* General Settings Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Tên hệ thống"
                                value={settings.siteName}
                                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email liên hệ"
                                value={settings.contactEmail}
                                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả hệ thống"
                                value={settings.siteDescription}
                                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={settings.contactPhone}
                                onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Địa chỉ"
                                value={settings.address}
                                onChange={(e) => handleSettingChange('address', e.target.value)}
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Appointment Settings Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Số lịch hẹn tối đa mỗi ngày"
                                type="number"
                                value={settings.maxAppointmentsPerDay}
                                onChange={(e) => handleSettingChange('maxAppointmentsPerDay', parseInt(e.target.value))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Thời gian mỗi lịch hẹn (phút)"
                                type="number"
                                value={settings.appointmentDuration}
                                onChange={(e) => handleSettingChange('appointmentDuration', parseInt(e.target.value))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Số ngày đặt trước tối đa"
                                type="number"
                                value={settings.advanceBookingDays}
                                onChange={(e) => handleSettingChange('advanceBookingDays', parseInt(e.target.value))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Thời hạn hủy lịch (giờ)"
                                type="number"
                                value={settings.cancellationDeadlineHours}
                                onChange={(e) => handleSettingChange('cancellationDeadlineHours', parseInt(e.target.value))}
                                variant="outlined"
                                disabled={!settings.allowCancellation}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.allowCancellation}
                                        onChange={(e) => handleSettingChange('allowCancellation', e.target.checked)}
                                    />
                                }
                                label="Cho phép hủy lịch hẹn"
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Notification Settings Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Cài đặt thông báo
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo qua Email"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.smsNotifications}
                                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo qua SMS"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.appointmentReminders}
                                        onChange={(e) => handleSettingChange('appointmentReminders', e.target.checked)}
                                    />
                                }
                                label="Nhắc nhở lịch hẹn"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nhắc nhở trước (giờ)"
                                type="number"
                                value={settings.reminderHoursBefore}
                                onChange={(e) => handleSettingChange('reminderHoursBefore', parseInt(e.target.value))}
                                variant="outlined"
                                disabled={!settings.appointmentReminders}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Security Settings Tab */}
                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Cài đặt bảo mật
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Thời gian hết phiên (phút)"
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Độ dài mật khẩu tối thiểu"
                                type="number"
                                value={settings.passwordMinLength}
                                onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.requirePasswordChange}
                                        onChange={(e) => handleSettingChange('requirePasswordChange', e.target.checked)}
                                    />
                                }
                                label="Yêu cầu đổi mật khẩu định kỳ"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Chu kỳ đổi mật khẩu (ngày)"
                                type="number"
                                value={settings.passwordChangeDays}
                                onChange={(e) => handleSettingChange('passwordChangeDays', parseInt(e.target.value))}
                                variant="outlined"
                                disabled={!settings.requirePasswordChange}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* System Settings Tab */}
                <TabPanel value={tabValue} index={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Cài đặt hệ thống
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                                    />
                                }
                                label="Chế độ bảo trì"
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Khi bật, chỉ admin có thể truy cập hệ thống
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.debugMode}
                                        onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                                    />
                                }
                                label="Chế độ debug"
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Hiển thị thông tin debug chi tiết
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Mức độ log</InputLabel>
                                <Select
                                    value={settings.logLevel}
                                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                                    label="Mức độ log"
                                >
                                    <MenuItem value="ERROR">ERROR</MenuItem>
                                    <MenuItem value="WARN">WARN</MenuItem>
                                    <MenuItem value="INFO">INFO</MenuItem>
                                    <MenuItem value="DEBUG">DEBUG</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Tần suất backup</InputLabel>
                                <Select
                                    value={settings.backupFrequency}
                                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                                    label="Tần suất backup"
                                >
                                    <MenuItem value="hourly">Mỗi giờ</MenuItem>
                                    <MenuItem value="daily">Hàng ngày</MenuItem>
                                    <MenuItem value="weekly">Hàng tuần</MenuItem>
                                    <MenuItem value="monthly">Hàng tháng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Thao tác hệ thống
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="warning"
                                startIcon={<StorageIcon />}
                                sx={{ py: 1.5 }}
                            >
                                Backup dữ liệu
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="info"
                                startIcon={<RefreshIcon />}
                                sx={{ py: 1.5 }}
                            >
                                Xóa cache
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                startIcon={<RefreshIcon />}
                                sx={{ py: 1.5 }}
                            >
                                Khởi động lại
                            </Button>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SystemSettingsPage;
