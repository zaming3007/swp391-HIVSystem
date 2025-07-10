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
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    LockOutlined as LockOutlinedIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate form
        if (!email || !password) {
            dispatch(loginFailure('Vui lòng điền đầy đủ thông tin'));
            return;
        }

        try {
            dispatch(loginStart());

            // Call API through our service
            const response = await authService.login({ email, password });

            // On success, update Redux state
            dispatch(loginSuccess({
                user: response.user,
                token: response.token
            }));

            // Redirect based on user role
            const userRole = response.user.role;
            switch (userRole) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'doctor':
                    navigate('/doctor');
                    break;
                case 'staff':
                    navigate('/staff');
                    break;
                case 'customer':
                    navigate('/app/appointments');
                    break;
                default:
                    // Fallback to profile page
                    navigate('/app/profile');
            }
        } catch (error: any) {
            dispatch(loginFailure(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'));
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', mb: 2 }}
                startIcon={<ArrowBackIcon />}
            >
                quay lại
            </Button>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Đăng Nhập
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Địa chỉ Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            value="remember"
                            color="primary"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                        />
                    }
                    label="Ghi nhớ đăng nhập"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Đăng Nhập'}
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link component={RouterLink} to="/auth/reset-password" variant="body2">
                        Quên mật khẩu?
                    </Link>
                    <Link component={RouterLink} to="/auth/register" variant="body2">
                        {"Chưa có tài khoản? Đăng ký ngay"}
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage; 