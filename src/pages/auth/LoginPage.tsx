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
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

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

            // Simulating API call - in a real app, you would make an actual API call here
            // const response = await loginApi({ email, password });

            // For demo purposes, using fake credentials
            setTimeout(() => {
                if (email === 'demo@example.com' && password === 'password') {
                    const fakeUser = {
                        id: '1',
                        firstName: 'Demo',
                        lastName: 'User',
                        email: 'demo@example.com',
                        role: 'patient' as const,
                    };

                    dispatch(loginSuccess({
                        user: fakeUser,
                        token: 'fake-jwt-token'
                    }));

                    navigate('/app/profile');
                } else {
                    dispatch(loginFailure('Email hoặc mật khẩu không chính xác'));
                }
            }, 1000);
        } catch (error) {
            dispatch(loginFailure('Đã xảy ra lỗi. Vui lòng thử lại.'));
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

            <Box sx={{ mt: 4, width: '100%' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Tài khoản demo: demo@example.com / password
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage; 