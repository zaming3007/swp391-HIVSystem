import {
    Paper,
    Typography,
    Box,
    Chip,
    IconButton,
    Divider,
    Avatar,
    Button,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon, QuestionAnswer as QuestionIcon, MedicalServices as DoctorIcon } from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Consultation } from '../../types';

interface QuestionDetailProps {
    question: Consultation;
    onClose: () => void;
    loading?: boolean;
}

const QuestionDetail = ({ question, onClose, loading = false }: QuestionDetailProps) => {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    const formatTimeAgo = (dateString: string) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    };

    const getStatusColor = (status: string) => {
        return status === 'answered' ? 'success' : 'warning';
    };

    const getStatusLabel = (status: string) => {
        return status === 'answered' ? 'Đã trả lời' : 'Đang chờ';
    };

    if (loading) {
        return (
            <Paper sx={{ borderRadius: 2, p: 4, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
                    Chi tiết câu hỏi
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Question Content */}
            <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">
                            {question.title}
                        </Typography>
                        <Chip
                            size="small"
                            label={getStatusLabel(question.status)}
                            color={getStatusColor(question.status)}
                            sx={{ ml: 'auto' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip
                            size="small"
                            label={question.topic || question.category}
                            variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(question.createdAt)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <QuestionIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                                {question.patientName || 'Bạn'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                {formatDate(question.createdAt)}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                {question.question}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Answer Section */}
                {question.status === 'answered' && question.response && (
                    <Box sx={{ mt: 3 }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                <DoctorIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="medium" color="success.main">
                                    {question.responderName || 'Chuyên gia y tế'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    {question.answeredAt ? formatDate(question.answeredAt) : ''}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                    {question.response}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {question.status === 'pending' && (
                    <Box sx={{ mt: 3, p: 3, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body1" color="info.contrastText" gutterBottom>
                            Câu hỏi của bạn đang được xử lý
                        </Typography>
                        <Typography variant="body2" color="info.contrastText">
                            Tư vấn viên sẽ trả lời trong thời gian sớm nhất (thường trong vòng 24-48 giờ).
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default QuestionDetail; 