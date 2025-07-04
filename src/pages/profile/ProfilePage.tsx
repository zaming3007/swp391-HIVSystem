import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Button,
    TextField,
    Tab,
    Tabs,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    SelectChangeEvent
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Lock as LockIcon,
    MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

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
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`,
    };
}

interface MedicalRecordsProps {
    // userId parameter removed as it's not being used
}

const MedicalRecords: React.FC<MedicalRecordsProps> = () => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Hồ sơ y tế
            </Typography>
            <Paper sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Quản lý kết quả xét nghiệm và lịch sử khám bệnh của bạn.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MedicalServicesIcon />}
                        href="/app/test-results"
                    >
                        Xem kết quả xét nghiệm
                    </Button>
                </Box>
                <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Các kết quả xét nghiệm mới nhất:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2">
                            CD4: Xem trong mục kết quả xét nghiệm
                        </Typography>
                        <Typography component="li" variant="body2">
                            Tải lượng virus: Xem trong mục kết quả xét nghiệm
                        </Typography>
                        <Typography component="li" variant="body2">
                            Phác đồ ARV hiện tại: Xem trong mục kết quả xét nghiệm
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

const ProfilePage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dateOfBirth: user?.dateOfBirth || '',
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Reset form data if cancelling edit
            setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                gender: user?.gender || '',
                dateOfBirth: user?.dateOfBirth || '',
            });
        }
        setEditMode(!editMode);
        setSuccess('');
        setError('');
    };

    const handleSaveProfile = async () => {
        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setSaving(true);
        setSuccess('');
        setError('');

        try {
            // Chuẩn bị dữ liệu theo đúng format UpdateProfileRequest của API
            // Loại bỏ email vì backend không mong đợi trường này trong cập nhật profile
            // Đảm bảo các trường bắt buộc không bao giờ là null/undefined
            const profileUpdateData = {
                firstName: formData.firstName || '', // Đảm bảo không bao giờ null/undefined
                lastName: formData.lastName || '',   // Đảm bảo không bao giờ null/undefined
                phone: formData.phone || '',
                gender: formData.gender || '',
                dateOfBirth: formData.dateOfBirth || ''
            };

            console.log('Profile update data being sent:', JSON.stringify(profileUpdateData, null, 2));

            // Call the API to update the profile
            const updatedUser = await authService.updateProfile(user?.id || '', profileUpdateData);

            // Update Redux store
            dispatch(updateUser(updatedUser));

            setSuccess('Thông tin cá nhân đã được cập nhật thành công');
            setEditMode(false);

            // Refresh form data với dữ liệu mới
            setFormData({
                firstName: updatedUser.firstName || '',
                lastName: updatedUser.lastName || '',
                email: updatedUser.email || '',
                phone: updatedUser.phone || '',
                gender: updatedUser.gender || '',
                dateOfBirth: updatedUser.dateOfBirth || '',
            });

        } catch (err: any) {
            console.error('Profile update error:', err);

            // Lấy user hiện tại từ localStorage để đảm bảo UI cập nhật
            const storedUserStr = localStorage.getItem('user');
            if (storedUserStr) {
                try {
                    const storedUser = JSON.parse(storedUserStr);

                    // Cập nhật form data từ localStorage
                    setFormData({
                        firstName: storedUser.firstName || '',
                        lastName: storedUser.lastName || '',
                        email: storedUser.email || '',
                        phone: storedUser.phone || '',
                        gender: storedUser.gender || '',
                        dateOfBirth: storedUser.dateOfBirth || '',
                    });

                    // Cập nhật redux store
                    dispatch(updateUser(storedUser));

                    // Hiển thị thông báo lỗi kèm thông báo đã lưu cục bộ
                    setError('Không thể cập nhật thông tin lên server nhưng đã lưu cục bộ');
                    setEditMode(false);
                    return;
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            }

            // Nếu không thể cập nhật từ localStorage, hiển thị lỗi thông thường
            setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handleOpenPasswordDialog = () => {
        setOpenPasswordDialog(true);
        setPasswordError('');
        setPasswordSuccess('');
        setPassword({
            current: '',
            new: '',
            confirm: '',
        });
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };

    const handleChangePassword = async () => {
        // Validate passwords
        if (!password.current || !password.new || !password.confirm) {
            setPasswordError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password.new !== password.confirm) {
            setPasswordError('Mật khẩu mới không khớp');
            return;
        }

        if (password.new.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setPasswordError('');
        setPasswordSuccess('');

        try {
            // Gọi API để thay đổi mật khẩu
            const userId = user?.id;
            if (!userId) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            const response = await authService.changePassword(userId, {
                currentPassword: password.current,
                newPassword: password.new,
                confirmPassword: password.confirm
            });

            // Hiển thị thông báo thành công
            setPasswordSuccess(response.message || 'Mật khẩu đã được thay đổi thành công');

            // Đóng dialog sau 1.5 giây
            setTimeout(() => {
                handleClosePasswordDialog();
                // Reset password state
                setPassword({
                    current: '',
                    new: '',
                    confirm: '',
                });
            }, 1500);
        } catch (err: any) {
            // Hiển thị thông báo lỗi
            setPasswordError(err.message || 'Có lỗi xảy ra khi thay đổi mật khẩu');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hồ sơ cá nhân
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý thông tin cá nhân và hồ sơ y tế của bạn
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Sidebar with user info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                mx: 'auto',
                                mb: 2,
                                fontSize: '3rem',
                                bgcolor: 'primary.main'
                            }}
                        >
                            {user?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="h5">{user?.firstName} {user?.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user?.email}
                        </Typography>

                        <Box mt={3}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<LockIcon />}
                                onClick={handleOpenPasswordDialog}
                                sx={{ mb: 2 }}
                            >
                                Đổi mật khẩu
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                                onClick={handleEditToggle}
                                disabled={saving}
                                color={editMode ? 'success' : 'primary'}
                            >
                                {editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Main content */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 0 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="profile tabs"
                                variant="fullWidth"
                            >
                                <Tab
                                    icon={<PersonIcon />}
                                    label="Thông tin cá nhân"
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    icon={<MedicalServicesIcon />}
                                    label="Hồ sơ y tế"
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>

                        {/* Personal Information */}
                        <TabPanel value={tabValue} index={0}>
                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    {success}
                                </Alert>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box px={3} pb={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Họ"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            disabled={!editMode || saving}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Tên"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            disabled={!editMode || saving}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={!editMode || saving}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Số điện thoại"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!editMode || saving}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth disabled={!editMode || saving}>
                                            <InputLabel id="gender-label">Giới tính</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                name="gender"
                                                value={formData.gender}
                                                label="Giới tính"
                                                onChange={handleSelectChange}
                                            >
                                                <MenuItem value="male">Nam</MenuItem>
                                                <MenuItem value="female">Nữ</MenuItem>
                                                <MenuItem value="other">Khác</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Ngày sinh"
                                            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                            onChange={(newValue) => {
                                                setFormData({
                                                    ...formData,
                                                    dateOfBirth: newValue ? newValue.toISOString() : '',
                                                });
                                            }}
                                            disabled={!editMode || saving}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {editMode && (
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                            >
                                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </TabPanel>

                        {/* Medical Records */}
                        <TabPanel value={tabValue} index={1}>
                            <Box px={3} pb={3}>
                                <MedicalRecords />
                            </Box>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={2}>
                        Để đổi mật khẩu, vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.
                    </DialogContentText>
                    {passwordError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {passwordError}
                        </Alert>
                    )}
                    {passwordSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {passwordSuccess}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="current"
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password.current}
                        onChange={handlePasswordChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="new"
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password.new}
                        onChange={handlePasswordChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="confirm"
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordDialog} color="inherit">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleChangePassword} color="primary" variant="contained">
                        Đổi mật khẩu
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilePage; 