import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    SelectChangeEvent,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        acceptTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when field is edited
        if (formErrors[name as string]) {
            setFormErrors({ ...formErrors, [name as string]: '' });
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        // First name validation
        if (!formData.firstName.trim()) {
            errors.firstName = 'Họ là bắt buộc';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            errors.lastName = 'Tên là bắt buộc';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'Email là bắt buộc';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Vui lòng nhập một địa chỉ email hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 8) {
            errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu của bạn';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp';
        }

        // Terms acceptance validation
        if (!formData.acceptTerms) {
            errors.acceptTerms = 'Bạn phải đồng ý với điều khoản và điều kiện';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            dispatch(registerStart());

            // Simulating API call - in a real app, you would make an actual API call here
            // const response = await registerApi(formData);

            // For demo purposes, simulating a successful registration
            setTimeout(() => {
                const fakeUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    phone: formData.phone,
                    role: 'patient' as const,
                };

                dispatch(registerSuccess({
                    user: fakeUser,
                    token: 'fake-jwt-token'
                }));

                navigate('/app/profile');
            }, 1500);
        } catch (error) {
            dispatch(registerFailure('Đăng ký thất bại. Vui lòng thử lại.'));
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                pb: 3,
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Tạo Tài Khoản
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="Họ"
                            autoFocus
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Tên"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Địa Chỉ Email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Mật Khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Xác Nhận Mật Khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="gender-select-label">Giới Tính</InputLabel>
                            <Select
                                labelId="gender-select-label"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                label="Giới Tính"
                                onChange={handleSelectChange}
                                disabled={isLoading}
                            >
                                <MenuItem value=""><em>Không muốn nói</em></MenuItem>
                                <MenuItem value="male">Nam</MenuItem>
                                <MenuItem value="female">Nữ</MenuItem>
                                <MenuItem value="non-binary">Phi nhị nguyên</MenuItem>
                                <MenuItem value="transgender">Chuyển giới</MenuItem>
                                <MenuItem value="other">Khác</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="dateOfBirth"
                            label="Ngày Sinh"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="phone"
                            label="Số Điện Thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="acceptTerms"
                                    color="primary"
                                    checked={formData.acceptTerms}
                                    onChange={handleCheckboxChange}
                                    disabled={isLoading}
                                />
                            }
                            label="Tôi đồng ý với các điều khoản và điều kiện"
                        />
                        {formErrors.acceptTerms && (
                            <FormHelperText error>{formErrors.acceptTerms}</FormHelperText>
                        )}
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Đăng Ký'}
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link component={RouterLink} to="/auth/login" variant="body2">
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RegisterPage; 