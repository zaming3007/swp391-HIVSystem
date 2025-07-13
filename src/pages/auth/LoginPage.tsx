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
    Divider,
    Stack,
} from '@mui/material';
import {
    LockOutlined as LockOutlinedIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Email as EmailIcon,
    Google as GoogleIcon,
    Facebook as FacebookIcon,
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
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    sx={{
                        m: '0 auto 16px auto',
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    Đăng Nhập
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1rem' }}
                >
                    Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                        width: '100%',
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                            fontSize: '0.95rem'
                        }
                    }}
                >
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
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
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
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
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
                {/* Remember Me & Forgot Password */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="remember"
                                color="primary"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                                size="small"
                            />
                        }
                        label={
                            <Typography variant="body2" color="text.secondary">
                                Ghi nhớ đăng nhập
                            </Typography>
                        }
                    />
                    <Link
                        component={RouterLink}
                        to="/auth/reset-password"
                        variant="body2"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 500,
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Quên mật khẩu?
                    </Link>
                </Box>

                {/* Login Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                        mt: 2,
                        mb: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': {
                            boxShadow: 'none'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Đăng Nhập'
                    )}
                </Button>

                {/* Divider */}
                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        hoặc
                    </Typography>
                </Divider>

                {/* Social Login Buttons */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<GoogleIcon />}
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            borderColor: '#dadce0',
                            color: '#3c4043',
                            '&:hover': {
                                borderColor: '#dadce0',
                                backgroundColor: '#f8f9fa'
                            }
                        }}
                    >
                        Đăng nhập với Google
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<FacebookIcon />}
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            borderColor: '#1877f2',
                            color: '#1877f2',
                            '&:hover': {
                                borderColor: '#1877f2',
                                backgroundColor: '#f0f2f5'
                            }
                        }}
                    >
                        Đăng nhập với Facebook
                    </Button>
                </Stack>

                {/* Register Link */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Chưa có tài khoản?{' '}
                        <Link
                            component={RouterLink}
                            to="/auth/register"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Đăng ký ngay
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage; 