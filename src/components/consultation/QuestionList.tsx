import {
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Box,
    Divider,
    Badge,
    Avatar,
    CircularProgress
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Consultation } from '../../types';

interface QuestionListProps {
    questions: Consultation[];
    selectedQuestionId: string | null;
    onQuestionSelect: (id: string) => void;
    loading?: boolean;
}

const QuestionList = ({ questions, selectedQuestionId, onQuestionSelect, loading = false }: QuestionListProps) => {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
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
            <Paper sx={{ borderRadius: 2, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" color="primary">
                    Câu hỏi của bạn
                </Typography>
            </Box>

            <List sx={{ p: 0, maxHeight: 500, overflow: 'auto' }}>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <Box key={question.id}>
                            <ListItem
                                button
                                selected={selectedQuestionId === question.id}
                                onClick={() => onQuestionSelect(question.id)}
                                sx={{
                                    p: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                        },
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="subtitle1" component="span" noWrap sx={{ maxWidth: '70%' }}>
                                                {question.title}
                                            </Typography>
                                            <Chip
                                                size="small"
                                                label={getStatusLabel(question.status)}
                                                color={getStatusColor(question.status)}
                                                sx={{ ml: 'auto' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    mb: 1
                                                }}
                                            >
                                                {question.question}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Chip
                                                    size="small"
                                                    label={question.topic || question.category}
                                                    variant="outlined"
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTimeAgo(question.createdAt)}
                                                </Typography>
                                            </Box>

                                            {question.status === 'answered' && question.responderName && (
                                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            bgcolor: 'primary.main',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {question.responderName.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="caption">
                                                        Trả lời bởi {question.responderName}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < questions.length - 1 && <Divider />}
                        </Box>
                    ))
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Bạn chưa có câu hỏi nào.
                        </Typography>
                    </Box>
                )}
            </List>
        </Paper>
    );
};

export default QuestionList; 