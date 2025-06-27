import {
    Paper,
    Typography,
    Box,
    Chip,
    IconButton,
    Divider,
    Avatar
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Answer {
    id: string;
    content: string;
    createdAt: string;
    counselor: string;
}

interface Question {
    id: string;
    title: string;
    content: string;
    status: 'pending' | 'answered';
    createdAt: string;
    category: string;
    answers?: Answer[];
}

interface QuestionDetailProps {
    question: Question;
    onClose: () => void;
}

const QuestionDetail = ({ question, onClose }: QuestionDetailProps) => {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    const getStatusColor = (status: string) => {
        return status === 'answered' ? 'success' : 'warning';
    };

    const getStatusLabel = (status: string) => {
        return status === 'answered' ? 'Đã trả lời' : 'Đang chờ';
    };

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
            <Box sx={{ p: 2, flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
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
                            label={question.category}
                            variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(question.createdAt)}
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {question.content}
                    </Typography>
                </Box>

                {/* Answers Section */}
                {question.answers && question.answers.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" color="primary" gutterBottom>
                            Phản hồi
                        </Typography>

                        {question.answers.map((answer) => (
                            <Box key={answer.id} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                        {answer.counselor.split(' ').pop()?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {answer.counselor}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(answer.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        ml: 5,
                                        pl: 2,
                                        borderLeft: '2px solid',
                                        borderColor: 'primary.light',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {answer.content}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {question.status === 'pending' && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.contrastText">
                            Câu hỏi của bạn đang được xử lý. Tư vấn viên sẽ trả lời trong thời gian sớm nhất.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default QuestionDetail; 