import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    Divider,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardContent,
    CardActions,
    Grid,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    QuestionAnswer as QuestionIcon,
    Person as PersonIcon,
    AccessTime as TimeIcon,
    Check as CheckIcon,
    Send as SendIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { RootState } from '../../store';
import { consultationService } from '../../services/consultationService';
import { Consultation } from '../../types';

const ConsultationsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
    const [answeredConsultations, setAnsweredConsultations] = useState<Consultation[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Tải danh sách câu hỏi
    const loadConsultations = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const pendingData = await consultationService.getPendingConsultations();
            setPendingConsultations(pendingData);

            // Lấy danh sách câu hỏi đã trả lời từ API
            const answeredData = await consultationService.getAnsweredConsultations();
            setAnsweredConsultations(answeredData);
        } catch (err) {
            console.error('Error loading consultations:', err);
            setError('Không thể tải dữ liệu tư vấn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConsultations();
    }, [user]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAnswerDialog = (consultation: Consultation) => {
        setSelectedConsultation(consultation);
        setAnswerText('');
        setAnswerDialogOpen(true);
    };

    const handleCloseAnswerDialog = () => {
        setAnswerDialogOpen(false);
    };

    const handleSubmitAnswer = async () => {
        if (!selectedConsultation || !user || !answerText.trim()) return;

        try {
            setSubmitting(true);
            const updatedConsultation = await consultationService.answerConsultation(
                selectedConsultation.id,
                answerText,
                user.id
            );

            if (updatedConsultation) {
                // Cập nhật danh sách câu hỏi
                setPendingConsultations(prev => prev.filter(c => c.id !== selectedConsultation.id));
                setAnsweredConsultations(prev => [updatedConsultation, ...prev]);
                setSuccessMessage('Câu trả lời đã được gửi thành công!');

                // Đóng dialog sau 2 giây
                setTimeout(() => {
                    setAnswerDialogOpen(false);
                    setSuccessMessage(null);
                }, 2000);
            }
        } catch (err) {
            console.error('Error submitting answer:', err);
            setError('Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (e) {
            return dateString;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
        } catch (e) {
            return '';
        }
    };

    // Lọc câu hỏi theo từ khóa tìm kiếm
    const filteredPendingConsultations = pendingConsultations.filter(
        c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.patientName && c.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredAnsweredConsultations = answeredConsultations.filter(
        c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.patientName && c.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý tư vấn trực tuyến
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý và trả lời các câu hỏi tư vấn từ người dùng
                </Typography>
            </Box>

            <Paper sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            placeholder="Tìm kiếm câu hỏi..."
                            size="small"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                            sx={{ width: 300, mr: 2 }}
                        />
                        <Tooltip title="Làm mới">
                            <IconButton onClick={loadConsultations} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                        <Tab label={`Đang chờ (${pendingConsultations.length})`} />
                        <Tab label={`Đã trả lời (${answeredConsultations.length})`} />
                    </Tabs>
                </Box>
                <Divider />

                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : tabValue === 0 ? (
                        // Hiển thị câu hỏi đang chờ
                        filteredPendingConsultations.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Không có câu hỏi nào đang chờ trả lời
                            </Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredPendingConsultations.map((consultation) => (
                                    <Grid item xs={12} key={consultation.id}>
                                        <Card sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {consultation.patientName || 'Bệnh nhân'}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatTimeAgo(consultation.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="Đang chờ"
                                                        color="warning"
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="h6" gutterBottom>
                                                    {consultation.title}
                                                </Typography>

                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Chip
                                                        label={consultation.category || consultation.topic}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(consultation.createdAt)}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body1" sx={{ mt: 2 }}>
                                                    {consultation.question}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<QuestionIcon />}
                                                    onClick={() => handleOpenAnswerDialog(consultation)}
                                                >
                                                    Trả lời
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    ) : (
                        // Hiển thị câu hỏi đã trả lời
                        filteredAnsweredConsultations.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Không có câu hỏi nào đã được trả lời
                            </Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredAnsweredConsultations.map((consultation) => (
                                    <Grid item xs={12} key={consultation.id}>
                                        <Card sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {consultation.patientName || 'Bệnh nhân'}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatTimeAgo(consultation.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="Đã trả lời"
                                                        color="success"
                                                        size="small"
                                                        icon={<CheckIcon />}
                                                    />
                                                </Box>

                                                <Typography variant="h6" gutterBottom>
                                                    {consultation.title}
                                                </Typography>

                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Chip
                                                        label={consultation.category || consultation.topic}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(consultation.createdAt)}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body1" sx={{ mt: 2 }}>
                                                    {consultation.question}
                                                </Typography>

                                                <Divider sx={{ my: 2 }} />

                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                                        <QuestionIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="medium" color="success.main">
                                                            {consultation.responderName || 'Chuyên gia y tế'}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {consultation.answeredAt ? formatTimeAgo(consultation.answeredAt) : ''}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                                            {consultation.response}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}
                </Box>
            </Paper>

            {/* Dialog trả lời câu hỏi */}
            <Dialog
                open={answerDialogOpen}
                onClose={handleCloseAnswerDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {successMessage ? "Trả lời thành công" : "Trả lời câu hỏi"}
                </DialogTitle>
                <DialogContent>
                    {successMessage ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {successMessage}
                        </Alert>
                    ) : (
                        <>
                            {selectedConsultation && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedConsultation.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Chip
                                            label={selectedConsultation.category || selectedConsultation.topic}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(selectedConsultation.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" paragraph>
                                        {selectedConsultation.question}
                                    </Typography>
                                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Người hỏi: {selectedConsultation.patientName || 'Bệnh nhân'}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            <TextField
                                label="Câu trả lời của bạn"
                                multiline
                                rows={6}
                                fullWidth
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Nhập câu trả lời chi tiết và hữu ích..."
                                sx={{ mt: 2 }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    {!successMessage && (
                        <>
                            <Button onClick={handleCloseAnswerDialog}>Hủy</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitAnswer}
                                disabled={!answerText.trim() || submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi câu trả lời'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ConsultationsPage; 