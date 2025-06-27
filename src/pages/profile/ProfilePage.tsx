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
    History as HistoryIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/authSlice';

interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    patientName: string;
    doctorName: string;
    serviceName: string;
}

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

interface AppointmentHistoryProps {
    // userId parameter removed as it's not being used
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = () => {
    // In a real app, we would fetch this data from an API based on userId
    const appointments: Appointment[] = [
        {
            id: 'apt12340',
            patientId: '1',
            doctorId: '1',
            serviceId: '1',
            date: '2023-05-05',
            startTime: '09:30 AM',
            endTime: '10:30 AM',
            status: 'completed',
            patientName: 'Demo User',
            doctorName: 'Sarah Johnson',
            serviceName: 'Hormone Therapy Consultation',
        },
        {
            id: 'apt12339',
            patientId: '1',
            doctorId: '3',
            serviceId: '3',
            date: '2023-05-20',
            startTime: '01:00 PM',
            endTime: '01:45 PM',
            status: 'cancelled',
            patientName: 'Demo User',
            doctorName: 'Aisha Khan',
            serviceName: 'Voice and Communication Therapy',
        },
    ];

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Your Appointment History
            </Typography>
            {appointments.map((appointment) => (
                <Paper key={appointment.id} sx={{ p: 3, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {appointment.serviceName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dr. {appointment.doctorName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                            <Typography variant="body1">
                                {appointment.date} at {appointment.startTime}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    textTransform: 'capitalize',
                                    color:
                                        appointment.status === 'completed' ? 'success.main' :
                                            appointment.status === 'cancelled' ? 'error.main' :
                                                'info.main'
                                }}
                            >
                                {appointment.status}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
            {appointments.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center">
                    No appointment history found
                </Typography>
            )}
        </Box>
    );
};

interface MedicalRecordsProps {
    // userId parameter removed as it's not being used
}

const MedicalRecords: React.FC<MedicalRecordsProps> = () => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Your Medical Records
            </Typography>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No medical records found. Medical records will be available after your appointments.
                </Typography>
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

    const handleSaveProfile = () => {
        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Please fill all required fields');
            return;
        }

        setSaving(true);
        setSuccess('');
        setError('');

        // Simulate API call
        setTimeout(() => {
            try {
                if (user) {
                    const updatedUser = {
                        ...user,
                        ...formData,
                    };
                    dispatch(updateUser(updatedUser));
                    setSaving(false);
                    setEditMode(false);
                    setSuccess('Profile updated successfully');
                }
            } catch (_error) {
                setError('Failed to update profile');
                setSaving(false);
            }
        }, 1500);
    };

    const handleOpenPasswordDialog = () => {
        setOpenPasswordDialog(true);
        setPassword({
            current: '',
            new: '',
            confirm: '',
        });
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };

    const handleChangePassword = () => {
        // Validate passwords
        if (!password.current || !password.new || !password.confirm) {
            setPasswordError('Please fill all password fields');
            return;
        }

        if (password.new !== password.confirm) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (password.new.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            // This is just a demo, in a real app we would call an API
            setPasswordSuccess('Password changed successfully');
            setPasswordError('');

            // Close the dialog after a delay
            setTimeout(() => {
                handleClosePasswordDialog();
            }, 2000);
        }, 1500);
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                        Please login to view your profile
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                margin: '0 auto',
                                bgcolor: 'primary.main',
                                fontSize: 64,
                            }}
                            src={user.profileImage}
                        >
                            {!user.profileImage && <PersonIcon style={{ fontSize: 80 }} />}
                        </Avatar>
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            {`${user.firstName} ${user.lastName}`}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user.role === 'patient' ? 'Patient' : user.role === 'doctor' ? 'Doctor' : 'Administrator'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                                variant={editMode ? 'outlined' : 'contained'}
                                color={editMode ? 'error' : 'primary'}
                                startIcon={editMode ? <PersonIcon /> : <EditIcon />}
                                onClick={handleEditToggle}
                                sx={{ mr: 1 }}
                                disabled={saving}
                            >
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </Button>
                            {editMode && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            )}
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!editMode || saving}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!editMode || saving}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!editMode || saving}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!editMode || saving}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth disabled={!editMode || saving}>
                                    <InputLabel id="gender-select-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        label="Gender"
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value=""><em>Prefer not to say</em></MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="non-binary">Non-binary</MenuItem>
                                        <MenuItem value="transgender">Transgender</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date ? date.toISOString().split('T')[0] : '' })}
                                    disabled={!editMode || saving}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<LockIcon />}
                                onClick={handleOpenPasswordDialog}
                                disabled={saving}
                                sx={{ mt: 2 }}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="profile tabs"
                        centered
                    >
                        <Tab
                            icon={<HistoryIcon />}
                            label="Appointment History"
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={<AssignmentIcon />}
                            label="Medical Records"
                            {...a11yProps(1)}
                        />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <AppointmentHistory />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <MedicalRecords />
                </TabPanel>
            </Box>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    {passwordSuccess ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {passwordSuccess}
                        </Alert>
                    ) : (
                        <>
                            <DialogContentText>
                                Please enter your current password and a new password.
                            </DialogContentText>
                            {passwordError && (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    {passwordError}
                                </Alert>
                            )}
                            <TextField
                                autoFocus
                                margin="dense"
                                name="current"
                                label="Current Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={password.current}
                                onChange={handlePasswordChange}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="new"
                                label="New Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={password.new}
                                onChange={handlePasswordChange}
                            />
                            <TextField
                                margin="dense"
                                name="confirm"
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={password.confirm}
                                onChange={handlePasswordChange}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                    {!passwordSuccess && (
                        <Button onClick={handleChangePassword} variant="contained" color="primary">
                            Change Password
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilePage; 