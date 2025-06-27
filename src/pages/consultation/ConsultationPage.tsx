import React, { useState } from 'react';
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
    SelectChangeEvent
} from '@mui/material';
import {
    Send as SendIcon,
    ForumOutlined as ForumIcon,
    AccessTime as TimeIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { RootState } from '../../store';
import { Consultation } from '../../types';

const ConsultationPage: React.FC = () => {
    const theme = useTheme();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [consultations, setConsultations] = useState<Consultation[]>(sampleConsultations);
    const [openNewConsultation, setOpenNewConsultation] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        question: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('all');

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

    const handleSubmitConsultation = () => {
        // Validate form
        if (!formData.topic.trim() || !formData.question.trim()) {
            setFormError('Please fill in all fields');
            return;
        }

        if (formData.question.trim().length < 20) {
            setFormError('Your question should be at least 20 characters long');
            return;
        }

        setFormError('');
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const newConsultation: Consultation = {
                id: Math.random().toString(36).substr(2, 9),
                patientId: user?.id || '',
                topic: formData.topic,
                question: formData.question,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            setConsultations([newConsultation, ...consultations]);
            setSubmitting(false);
            setSubmitSuccess(true);

            // Close dialog after showing success message
            setTimeout(() => {
                handleCloseNewConsultation();
                setSubmitSuccess(false);
            }, 2000);
        }, 1500);
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

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                        Please login to access consultations
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    My Consultations
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenNewConsultation}
                >
                    New Consultation
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        About Consultations
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Use our consultation service to ask questions about gender healthcare, transition processes, or any health concerns.
                        Our team of healthcare professionals will respond to your questions, typically within 24-48 hours.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Note: Consultations are not a substitute for emergency medical care or in-person medical appointments.
                    </Typography>
                </Paper>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                    Filter by topic:
                </Typography>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={selectedTopic}
                        onChange={handleTopicFilter}
                    >
                        <MenuItem value="all">All Topics</MenuItem>
                        <MenuItem value="hormone">Hormone Therapy</MenuItem>
                        <MenuItem value="surgery">Surgery</MenuItem>
                        <MenuItem value="mental">Mental Health</MenuItem>
                        <MenuItem value="general">General Health</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {filteredConsultations.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No consultations found
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenNewConsultation}
                        sx={{ mt: 2 }}
                    >
                        Start a New Consultation
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
                                            label={consultation.status}
                                            sx={{
                                                backgroundColor: getStatusColor(consultation.status),
                                                color: '#fff',
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                            Question:
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
                                                    Response from {consultation.responderName || 'Healthcare Professional'}:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {consultation.response}
                                                </Typography>
                                                {consultation.respondedAt && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Responded {formatDistanceToNow(new Date(consultation.respondedAt), { addSuffix: true })}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {consultation.status === 'pending' && (
                                        <Button size="small" color="primary">
                                            Edit Question
                                        </Button>
                                    )}
                                    {consultation.status === 'answered' && (
                                        <Button size="small" color="primary" startIcon={<ForumIcon />}>
                                            Follow-up Question
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}

            {/* New Consultation Dialog */}
            <Dialog open={openNewConsultation} onClose={handleCloseNewConsultation} maxWidth="md" fullWidth>
                <DialogTitle>
                    {submitSuccess ? 'Consultation Submitted' : 'New Consultation'}
                </DialogTitle>
                <DialogContent>
                    {submitSuccess ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Your consultation has been submitted successfully!
                            </Alert>
                            <DialogContentText>
                                A healthcare professional will respond to your question as soon as possible. You can view the status of your consultation on this page.
                            </DialogContentText>
                        </Box>
                    ) : (
                        <>
                            {formError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {formError}
                                </Alert>
                            )}
                            <DialogContentText sx={{ mb: 3 }}>
                                Please provide details about your consultation request. Be as specific as possible to receive the most helpful response.
                            </DialogContentText>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Topic"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleInputChange}
                                        disabled={submitting}
                                        placeholder="e.g., Hormone Therapy, Surgery Consultation, Mental Health Support"
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Your Question"
                                        name="question"
                                        value={formData.question}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={6}
                                        disabled={submitting}
                                        placeholder="Describe your question or concern in detail..."
                                    />
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewConsultation}>
                        {submitSuccess ? 'Close' : 'Cancel'}
                    </Button>
                    {!submitSuccess && (
                        <Button
                            onClick={handleSubmitConsultation}
                            variant="contained"
                            color="primary"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                        >
                            {submitting ? 'Submitting...' : 'Submit Consultation'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

// Sample data
const sampleConsultations: Consultation[] = [
    {
        id: 'c123456',
        patientId: '1',
        topic: 'Hormone Therapy Questions',
        question: 'I\'m considering starting hormone therapy (estrogen) and would like to know more about the potential side effects. What are the most common side effects I should be aware of, and are there any long-term health concerns I should consider?',
        response: 'Common side effects of estrogen therapy include breast tenderness, mood changes, and decreased libido. Long-term considerations include potential increased risk of blood clots and certain types of cancer. However, these risks are generally low for most people and must be weighed against the benefits of gender-affirming care. I recommend scheduling an in-person consultation to discuss your specific health profile and create a personalized plan.',
        status: 'answered',
        createdAt: '2023-05-10T14:30:00Z',
        respondedAt: '2023-05-11T09:15:00Z',
        responderName: 'Dr. Sarah Johnson',
    },
    {
        id: 'c123457',
        patientId: '1',
        topic: 'Mental Health Support During Transition',
        question: 'I\'ve been experiencing anxiety as I begin my transition journey. What mental health resources do you offer specifically for transgender patients? Are there support groups or counseling services available?',
        status: 'pending',
        createdAt: '2023-05-18T16:45:00Z',
    },
    {
        id: 'c123458',
        patientId: '1',
        topic: 'Surgery Recovery Information',
        question: 'I\'m scheduled for top surgery next month and would like more information about the recovery process. How long should I expect to take off work? Are there specific post-operative care instructions I should follow?',
        response: 'Recovery from top surgery typically requires 1-2 weeks off work for desk jobs, longer for physical work. Specific post-operative care includes drain management (if applicable), limited arm movement for 2-4 weeks, scar care, and wearing a compression vest. We\'ll provide detailed instructions before your surgery, but I\'d be happy to discuss specific concerns at your pre-op appointment next week.',
        status: 'answered',
        createdAt: '2023-04-05T10:20:00Z',
        respondedAt: '2023-04-06T13:40:00Z',
        responderName: 'Dr. Michael Chen',
    },
];

export default ConsultationPage; 