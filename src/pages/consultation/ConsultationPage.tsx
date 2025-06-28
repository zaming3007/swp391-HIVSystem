import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    SelectChangeEvent,
    IconButton
} from '@mui/material';
import {
    Send as SendIcon,
    ForumOutlined as ForumIcon,
    AccessTime as TimeIcon,
    Add as AddIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Consultation } from '../../types';
import { consultationService } from '../../services';

const ConsultationPage: React.FC = () => {
    const theme = useTheme();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [openNewConsultation, setOpenNewConsultation] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        question: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser?.id;
    const isAuthenticated = !!userId;

    // Load user's consultations
    useEffect(() => {
        const loadConsultations = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const data = await consultationService.getConsultations(userId);
                setConsultations(data);
            } catch (err) {
                console.error('Error loading consultations:', err);
                setError('Không thể tải dữ liệu tư vấn. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        loadConsultations();
    }, [userId]);

    const filteredConsultations = selectedTopic === 'all'
        ? consultations
        : consultations.filter(consultation => consultation.topic.toLowerCase().includes(selectedTopic.toLowerCase()));

    const handleOpenNewConsultation = () => {
        setOpenNewConsultation(true);
        setFormData({ topic: '', question: '' });
        setFormError('');
        setSubmitSuccess(false);
    };

    const handleCloseNewConsultation = () => {
        setOpenNewConsultation(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTopicFilter = (event: SelectChangeEvent) => {
        setSelectedTopic(event.target.value);
    };

    const handleSubmitConsultation = async () => {
        // Validate form
        if (!formData.topic.trim() || !formData.question.trim()) {
            setFormError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.question.trim().length < 20) {
            setFormError('Câu hỏi của bạn nên có ít nhất 20 ký tự');
            return;
        }

        if (!userId) {
            setFormError('Vui lòng đăng nhập để gửi câu hỏi');
            return;
        }

        setFormError('');
        setSubmitting(true);

        try {
            const newConsultation = await consultationService.createConsultation({
                patientId: userId,
                topic: formData.topic,
                question: formData.question
            });

            setConsultations([newConsultation, ...consultations]);
            setSubmitSuccess(true);

            // Close dialog after showing success message
            setTimeout(() => {
                handleCloseNewConsultation();
                setSubmitSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error creating consultation:', err);
            setFormError('Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại sau.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'answered':
                return theme.palette.success.main;
            case 'pending':
                return theme.palette.warning.main;
            default:
                return theme.palette.grey[500];
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'answered':
                return 'Đã trả lời';
            case 'pending':
                return 'Đang chờ';
            default:
                return status;
        }
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                        Vui lòng đăng nhập để sử dụng dịch vụ tư vấn
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Tư Vấn Trực Tuyến
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenNewConsultation}
                >
                    Câu Hỏi Mới
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Thông Tin Dịch Vụ Tư Vấn
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sử dụng dịch vụ tư vấn của chúng tôi để đặt câu hỏi về chăm sóc sức khỏe HIV,
                        các vấn đề liên quan đến điều trị hoặc bất kỳ mối quan tâm sức khỏe nào khác.
                        Đội ngũ chuyên gia y tế của chúng tôi sẽ trả lời câu hỏi của bạn, thường trong vòng 24-48 giờ.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lưu ý: Tư vấn trực tuyến không thay thế cho chăm sóc y tế khẩn cấp hoặc các cuộc hẹn khám trực tiếp.
                    </Typography>
                </Paper>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                    Lọc theo chủ đề:
                </Typography>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={selectedTopic}
                        onChange={handleTopicFilter}
                    >
                        <MenuItem value="all">Tất Cả</MenuItem>
                        <MenuItem value="ARV">Thuốc ARV</MenuItem>
                        <MenuItem value="CD4">Xét Nghiệm CD4/Tải Lượng Virus</MenuItem>
                        <MenuItem value="tác dụng phụ">Tác Dụng Phụ</MenuItem>
                        <MenuItem value="dinh dưỡng">Dinh Dưỡng</MenuItem>
                        <MenuItem value="chung">Sức Khỏe Chung</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredConsultations.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Không tìm thấy câu hỏi tư vấn nào
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenNewConsultation}
                        sx={{ mt: 2 }}
                    >
                        Tạo Câu Hỏi Mới
                    </Button>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {filteredConsultations.map((consultation) => (
                        <Box key={consultation.id} sx={{ width: '100%' }}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                {consultation.topic}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={getStatusLabel(consultation.status)}
                                            sx={{
                                                backgroundColor: getStatusColor(consultation.status),
                                                color: '#fff',
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                            Câu hỏi:
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {consultation.question}
                                        </Typography>
                                    </Box>

                                    {consultation.response && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                    Trả lời từ {consultation.responderName || 'Chuyên gia y tế'}:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {consultation.response}
                                                </Typography>
                                                {consultation.respondedAt && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDistanceToNow(new Date(consultation.respondedAt), { addSuffix: true })}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}

            <Dialog open={openNewConsultation} onClose={handleCloseNewConsultation} maxWidth="md" fullWidth>
                <DialogTitle>
                    {submitSuccess ? "Câu Hỏi Đã Gửi Thành Công" : "Gửi Câu Hỏi Mới"}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseNewConsultation}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {submitSuccess ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Câu hỏi của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                        </Alert>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            {formError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {formError}
                                </Alert>
                            )}

                            <FormControl fullWidth margin="normal">
                                <Select
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    displayEmpty
                                    name="topic"
                                >
                                    <MenuItem value="" disabled>Chọn chủ đề câu hỏi</MenuItem>
                                    <MenuItem value="Thuốc ARV">Thuốc ARV</MenuItem>
                                    <MenuItem value="Xét nghiệm CD4/Tải lượng virus">Xét nghiệm CD4/Tải lượng virus</MenuItem>
                                    <MenuItem value="Tác dụng phụ của thuốc">Tác dụng phụ của thuốc</MenuItem>
                                    <MenuItem value="Dinh dưỡng cho người có HIV">Dinh dưỡng cho người có HIV</MenuItem>
                                    <MenuItem value="Sức khỏe tâm lý">Sức khỏe tâm lý</MenuItem>
                                    <MenuItem value="Câu hỏi chung">Câu hỏi chung</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Câu hỏi của bạn"
                                multiline
                                rows={6}
                                fullWidth
                                margin="normal"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề bạn đang gặp phải..."
                                helperText="Cung cấp càng nhiều chi tiết càng tốt để chúng tôi có thể giúp bạn hiệu quả nhất"
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Câu hỏi của bạn sẽ được trả lời bởi các chuyên gia y tế trong vòng 24-48 giờ.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    {!submitSuccess && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                            onClick={handleSubmitConsultation}
                            disabled={submitting}
                        >
                            {submitting ? 'Đang Gửi...' : 'Gửi Câu Hỏi'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ConsultationPage; 