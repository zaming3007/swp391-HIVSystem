import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Divider,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon,
} from '@mui/icons-material';
import mapImage from '../../images/map/mapttyte.png';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [formStatus, setFormStatus] = useState<{
        submitted: boolean;
        submitting: boolean;
        success: boolean;
        error: string | null;
    }>({
        submitted: false,
        submitting: false,
        success: false,
        error: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubjectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, subject: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus({ ...formStatus, submitting: true });

        // Giả lập gửi form
        setTimeout(() => {
            setFormStatus({
                submitted: true,
                submitting: false,
                success: true,
                error: null,
            });

            // Reset form sau khi gửi thành công
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        }, 1500);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Liên Hệ Với Chúng Tôi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </Typography>
                <Divider sx={{ my: 4 }} />
            </Box>

            <Grid container spacing={4}>
                {/* Thông tin liên hệ */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Thông Tin Liên Hệ
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <LocationIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Địa Chỉ
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Điện Thoại
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    (028) 3812 3456 | Hotline: 0987 654 321
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <EmailIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Email
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    info@genderhealthcare.vn | support@genderhealthcare.vn
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TimeIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Giờ Làm Việc
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Thứ Hai - Thứ Sáu: 8:00 - 17:00
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Thứ Bảy: 8:00 - 12:00 | Chủ Nhật: Đóng cửa
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
                            Mạng Xã Hội
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Kết nối với chúng tôi trên các nền tảng mạng xã hội để cập nhật thông tin mới nhất.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Placeholder for social media icons */}
                            <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%' }}></Box>
                            <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%' }}></Box>
                            <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%' }}></Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Form liên hệ */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Gửi Tin Nhắn Cho Chúng Tôi
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {formStatus.submitted && formStatus.success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                            </Alert>
                        )}

                        {formStatus.error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {formStatus.error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Họ và tên"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={formStatus.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={formStatus.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={formStatus.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="subject-label">Chủ đề</InputLabel>
                                        <Select
                                            labelId="subject-label"
                                            name="subject"
                                            value={formData.subject}
                                            label="Chủ đề"
                                            onChange={handleSubjectChange}
                                            disabled={formStatus.submitting}
                                        >
                                            <MenuItem value=""><em>Chọn chủ đề</em></MenuItem>
                                            <MenuItem value="appointment">Đặt lịch hẹn</MenuItem>
                                            <MenuItem value="info">Thông tin dịch vụ</MenuItem>
                                            <MenuItem value="feedback">Phản hồi và góp ý</MenuItem>
                                            <MenuItem value="other">Khác</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Nội dung tin nhắn"
                                        name="message"
                                        multiline
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={formStatus.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        disabled={formStatus.submitting}
                                        startIcon={formStatus.submitting ? <CircularProgress size={20} /> : null}
                                    >
                                        {formStatus.submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bản đồ */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Bản Đồ Đường Đi
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box
                        component="img"
                        src={mapImage}
                        alt="Bản đồ đường đi đến trung tâm y tế"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                        }}
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default ContactPage; 