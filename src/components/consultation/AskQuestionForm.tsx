import { useState } from 'react';
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
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';

const categories = [
    'Sức khỏe sinh sản',
    'Kinh nguyệt',
    'Tâm lý',
    'Dinh dưỡng',
    'Khác'
];

const AskQuestionForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            category: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the data to your backend
        console.log('Submitting question:', formData);
        setShowSuccess(true);
        setFormData({
            title: '',
            category: '',
            content: ''
        });
        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Đặt câu hỏi mới
            </Typography>

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
                <TextField
                    fullWidth
                    label="Tiêu đề câu hỏi"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    placeholder="VD: Tôi muốn tìm hiểu về..."
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="category-label">Chủ đề</InputLabel>
                    <Select
                        labelId="category-label"
                        value={formData.category}
                        label="Chủ đề"
                        onChange={handleCategoryChange}
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Nội dung câu hỏi"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                    placeholder="Mô tả chi tiết câu hỏi của bạn..."
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<SendIcon />}
                    fullWidth
                >
                    Gửi câu hỏi
                </Button>
            </Box>
        </Paper>
    );
};

export default AskQuestionForm; 