import {
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Box,
    Divider
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Question {
    id: string;
    title: string;
    content: string;
    status: 'pending' | 'answered';
    createdAt: string;
    category: string;
    answers?: Array<{
        id: string;
        content: string;
        createdAt: string;
        counselor: string;
    }>;
}

interface QuestionListProps {
    questions: Question[];
    selectedQuestionId: string | null;
    onQuestionSelect: (id: string) => void;
}

const QuestionList = ({ questions, selectedQuestionId, onQuestionSelect }: QuestionListProps) => {
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
        <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" color="primary">
                    Danh sách câu hỏi
                </Typography>
            </Box>

            <List sx={{ p: 0 }}>
                {questions.map((question, index) => (
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
                                        <Typography variant="subtitle1" component="span">
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
                                            {question.content}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip
                                                size="small"
                                                label={question.category}
                                                variant="outlined"
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(question.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < questions.length - 1 && <Divider />}
                    </Box>
                ))}
                {questions.length === 0 && (
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