import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Link,
    Stepper,
    Step,
    StepLabel,
    LinearProgress
} from '@mui/material';
import {
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    CheckCircle as CheckCircleIcon,
    ArrowBack as ArrowBackIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { authService } from '../../services/authService';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token || '';
    const email = location.state?.email || '';

    useEffect(() => {
        if (!token || !email) {
            navigate('/auth/forgot-password');
        }
    }, [token, email, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setLoading(true);
            await authService.resetPasswordWithToken(token, newPassword, confirmPassword);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/auth/login', {
                    state: {
                        message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.'
                    }
                });
            }, 3000);
        } catch (error: any) {
            setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return 0;
        if (password.length < 6) return 25;
        if (password.length < 8) return 50;
        if (password.length < 12) return 75;
        return 100;
    };

    const getStrengthColor = (strength: number) => {
        if (strength < 40) return 'error';
        if (strength < 80) return 'warning';
        return 'success';
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 25) return 'Quá ngắn';
        if (strength <= 50) return 'Đủ dùng';
        if (strength <= 75) return 'Tốt';
        return 'Rất tốt';
    };

    const passwordStrength = getPasswordStrength(newPassword);

    if (success) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                <CheckCircleIcon
                    sx={{
                        fontSize: 80,
                        color: 'success.main',
                        mb: 3
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'success.main',
                        mb: 2
                    }}
                >
                    Thành công!
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Mật khẩu của bạn đã được đặt lại thành công.
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Đang chuyển hướng đến trang đăng nhập...
                </Typography>
                <LinearProgress sx={{ width: '100%', mt: 2 }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {/* Back to Home Button */}
            <Box sx={{ alignSelf: 'flex-start', mb: 2 }}>
                <Button
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon />}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Về trang chủ
                </Button>
            </Box>

            {/* Progress Stepper */}
            <Box sx={{ width: '100%', mb: 4 }}>
                <Stepper activeStep={2} alternativeLabel>
                    <Step completed>
                        <StepLabel>Nhập Email</StepLabel>
                    </Step>
                    <Step completed>
                        <StepLabel>Xác minh mã</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Đặt mật khẩu mới</StepLabel>
                    </Step>
                </Stepper>
            </Box>

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    Đặt mật khẩu mới
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1rem' }}
                >
                    Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn.
                </Typography>
            </Box>

            {/* Error Message */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        width: '100%',
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* New Password */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="Mật khẩu mới"
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                    size="small"
                                >
                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                {/* Password Strength Indicator */}
                {newPassword && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Độ mạnh mật khẩu
                            </Typography>
                            <Typography
                                variant="body2"
                                color={`${getStrengthColor(passwordStrength)}.main`}
                                sx={{ fontWeight: 500 }}
                            >
                                {getStrengthText(passwordStrength)}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={passwordStrength}
                            color={getStrengthColor(passwordStrength)}
                            sx={{ borderRadius: 1, height: 6 }}
                        />
                    </Box>
                )}

                {/* Confirm Password */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    error={confirmPassword !== '' && newPassword !== confirmPassword}
                    helperText={
                        confirmPassword !== '' && newPassword !== confirmPassword
                            ? 'Mật khẩu xác nhận không khớp'
                            : ''
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    size="small"
                                >
                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !isValidPassword(newPassword) || newPassword !== confirmPassword}
                    sx={{
                        mt: 3,
                        mb: 2,
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
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Đặt lại mật khẩu'
                    )}
                </Button>

                {/* Back to Login */}
                <Box sx={{ textAlign: 'center' }}>
                    <Link
                        component={RouterLink}
                        to="/auth/login"
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'primary.main',
                            fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
                        Quay lại đăng nhập
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default ResetPasswordPage;
