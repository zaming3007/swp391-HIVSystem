import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Link,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Timer as TimerIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { authService } from '../../services/authService';

const VerifyCodePage: React.FC = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/auth/forgot-password');
            return;
        }

        // Start countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, navigate]);

    useEffect(() => {
        // Auto submit when all 6 digits are entered
        if (code.every(digit => digit !== '')) {
            handleVerify();
        }
    }, [code]);

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedCode = value.slice(0, 6).split('');
            const newCode = [...code];
            pastedCode.forEach((digit, i) => {
                if (index + i < 6 && /^\d$/.test(digit)) {
                    newCode[index + i] = digit;
                }
            });
            setCode(newCode);

            // Focus last filled input
            const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
            inputRefs.current[lastFilledIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
        if (event.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 số');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await authService.verifyResetCode(email, verificationCode);

            // Navigate to reset password page with token
            navigate('/auth/reset-password', {
                state: {
                    token: response.token,
                    email: email
                }
            });
        } catch (error: any) {
            setError(error.message || 'Mã xác minh không đúng');
            // Clear code on error
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        try {
            setLoading(true);
            setError(null);

            await authService.sendResetCode(email);

            // Reset timer and start cooldown
            setTimeLeft(300);
            setResendCooldown(60);

            const cooldownTimer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(cooldownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error: any) {
            setError(error.message || 'Không thể gửi lại mã. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isExpired = timeLeft <= 0;

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
                <Stepper activeStep={1} alternativeLabel>
                    <Step completed>
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
                    Nhập mã xác minh
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1rem', mb: 2 }}
                >
                    Chúng tôi đã gửi mã 6 số đến
                </Typography>
                <Typography
                    variant="body1"
                    color="primary.main"
                    sx={{ fontWeight: 600 }}
                >
                    {email}
                </Typography>
            </Box>

            {/* Timer */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                p: 2,
                bgcolor: isExpired ? 'error.light' : 'primary.light',
                borderRadius: 2,
                color: isExpired ? 'error.dark' : 'primary.dark'
            }}>
                <TimerIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {isExpired ? 'Mã đã hết hạn' : `Mã hết hạn sau ${formatTime(timeLeft)}`}
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

            {/* Code Input */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2}>
                    {code.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading || isExpired}
                            inputProps={{
                                maxLength: 6,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    padding: '16px 8px'
                                }
                            }}
                            sx={{
                                width: 56,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderWidth: 2,
                                    }
                                },
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Verify Button */}
            <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleVerify}
                disabled={loading || isExpired || code.some(digit => digit === '')}
                sx={{
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
                    'Xác minh mã'
                )}
            </Button>

            {/* Resend Button */}
            <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                }}
            >
                {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại mã'}
            </Button>

            {/* Back to Email */}
            <Box sx={{ textAlign: 'center' }}>
                <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
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
                    Thay đổi email
                </Link>
            </Box>
        </Box>
    );
};

export default VerifyCodePage;
