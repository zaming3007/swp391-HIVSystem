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
    LocalHospital as HospitalIcon,
    Lock as LockIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
} from '@mui/icons-material';
import mapImage from '../../images/map/mapttyte.png';
// Bạn cần có file zalo.svg hoặc zalo.png trong src/assets hoặc src/images
import ZaloIcon from "../../images/icons/zalo.jpg";

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
                    Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn về các vấn đề liên quan đến HIV/AIDS
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
                                    (028) 3812 3456 | Đường dây nóng HIV: 1800 1919
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
                                    info@hivcare.vn | support@hivcare.vn
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

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <HospitalIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Dịch Vụ Khẩn Cấp
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Dịch vụ PEP sau phơi nhiễm: Hotline 24/7: 0909 123 456
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <LockIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Cam Kết Bảo Mật
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Chúng tôi đảm bảo bảo mật tuyệt đối thông tin cá nhân và tình trạng sức khỏe của bạn
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
                            Mạng Xã Hội
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Kết nối với chúng tôi trên các nền tảng mạng xã hội để cập nhật thông tin mới nhất về HIV/AIDS.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FacebookIcon sx={{ fontSize: 40, color: '#4267B2', bgcolor: 'white', borderRadius: '50%', p: 1 }} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <TwitterIcon sx={{ fontSize: 40, color: '#1DA1F2', bgcolor: 'white', borderRadius: '50%', p: 1 }} />
                            </a>
                            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                                <Box
                                    component="img"
                                    src={ZaloIcon}
                                    alt="Zalo"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: 'white',
                                        borderRadius: '50%',
                                        p: 1,
                                        boxShadow: 2,
                                        objectFit: 'cover',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: 4,
                                        },
                                        display: 'block',
                                    }}
                                />
                            </a>
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
                                            <MenuItem value="appointment">Đặt lịch hẹn khám và tư vấn</MenuItem>
                                            <MenuItem value="testing">Xét nghiệm HIV</MenuItem>
                                            <MenuItem value="treatment">Thông tin về điều trị ARV</MenuItem>
                                            <MenuItem value="support">Hỗ trợ tâm lý</MenuItem>
                                            <MenuItem value="prep">Thông tin về PrEP/PEP</MenuItem>
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
                        alt="Bản đồ đường đi đến trung tâm điều trị HIV/AIDS"
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