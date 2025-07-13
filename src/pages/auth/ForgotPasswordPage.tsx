import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    Link,
    Paper,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    Email as EmailIcon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { authService } from '../../services/authService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!email) {
            setError('Vui lòng nhập địa chỉ email');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        try {
            setLoading(true);
            await authService.sendResetCode(email);
            setSuccess(true);
            startCountdown();

            // Navigate to verify code page after 2 seconds
            setTimeout(() => {
                navigate('/auth/verify-code', { state: { email } });
            }, 2000);
        } catch (error: any) {
            setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        try {
            setLoading(true);
            setError(null);
            await authService.sendResetCode(email);
            setSuccess(true);
            startCountdown();
        } catch (error: any) {
            setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
                <Stepper activeStep={0} alternativeLabel>
                    <Step>
                        <StepLabel>Nhập Email</StepLabel>
                    </Step>
                    <Step>
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
                    Quên mật khẩu?
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1rem' }}
                >
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác minh để đặt lại mật khẩu.
                </Typography>
            </Box>

            {/* Success Message */}
            {success && (
                <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    sx={{
                        width: '100%',
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2">
                        Mã xác minh đã được gửi đến email <strong>{email}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                    </Typography>
                </Alert>
            )}

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
                    disabled={loading || success}
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

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || success}
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
                    ) : success ? (
                        'Đã gửi mã xác minh'
                    ) : (
                        'Gửi mã xác minh'
                    )}
                </Button>

                {/* Resend Button */}
                {success && (
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleResend}
                        disabled={countdown > 0 || loading}
                        sx={{
                            mb: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                    </Button>
                )}

                {/* Back to Login */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
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

export default ForgotPasswordPage;
