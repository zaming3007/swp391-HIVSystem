import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Alert,
    Collapse,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { consultationService } from '../../services/consultationService';
import { RootState } from '../../store';

const AskQuestionForm: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        question: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topics, setTopics] = useState<string[]>([]);

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const topicsData = await consultationService.getConsultationTopics();
                setTopics(topicsData);
            } catch (err) {
                console.error('Error loading topics:', err);
            }
        };

        loadTopics();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTopicChange = (e: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            topic: e.target.value
        }));
    };

    // 💬 DEMO: Customer tạo câu hỏi tư vấn mới với topic và nội dung
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.topic || !formData.question.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.question.trim().length < 20) {
            setError('Câu hỏi của bạn nên có ít nhất 20 ký tự');
            return;
        }

        if (!user?.id) {
            setError('Vui lòng đăng nhập để gửi câu hỏi');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Gửi câu hỏi qua service
            await consultationService.createConsultation({
                patientId: user.id,
                patientName: `${user.firstName} ${user.lastName}`,
                topic: formData.topic,
                question: formData.question
            });

            // Reset form và hiển thị thông báo thành công
            setFormData({
                title: '',
                topic: '',
                question: ''
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (err) {
            console.error('Error submitting question:', err);
            setError('Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Đặt câu hỏi mới
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
                Đặt câu hỏi của bạn và nhận câu trả lời từ đội ngũ chuyên gia y tế của chúng tôi.
                Câu hỏi của bạn sẽ được trả lời trong vòng 24-48 giờ.
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Collapse in={showSuccess}>
                <Alert
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setShowSuccess(false)}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Câu hỏi của bạn đã được gửi thành công! Tư vấn viên sẽ trả lời trong thời gian sớm nhất.
                </Alert>
            </Collapse>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="topic-label">Chủ đề</InputLabel>
                    <Select
                        labelId="topic-label"
                        name="topic"
                        value={formData.topic}
                        label="Chủ đề"
                        onChange={handleTopicChange}
                        required
                    >
                        {topics.map((topic) => (
                            <MenuItem key={topic} value={topic}>
                                {topic}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Câu hỏi của bạn"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                    placeholder="Mô tả chi tiết câu hỏi của bạn..."
                    helperText={`${formData.question.length}/20 ký tự tối thiểu`}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Đang gửi...' : 'Gửi câu hỏi'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AskQuestionForm; 