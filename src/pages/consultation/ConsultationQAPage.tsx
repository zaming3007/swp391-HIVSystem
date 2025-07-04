import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Tabs,
    Tab,
    Paper,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button
} from '@mui/material';
import {
    QuestionAnswer,
    History,
    FilterList
} from '@mui/icons-material';
import { RootState } from '../../store';
import AskQuestionForm from '../../components/consultation/AskQuestionForm';
import QuestionList from '../../components/consultation/QuestionList';
import QuestionDetail from '../../components/consultation/QuestionDetail';
import { consultationService } from '../../services/consultationService';
import { Consultation } from '../../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`consultation-tabpanel-${index}`}
            aria-labelledby={`consultation-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ConsultationQAPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Consultation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [topics, setTopics] = useState<string[]>([]);

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login?redirect=/app/consultations', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Tải danh sách chủ đề
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

    // Tải danh sách câu hỏi
    useEffect(() => {
        const loadConsultations = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const data = await consultationService.getConsultations(user.id);
                setConsultations(data);
                setError(null);
            } catch (err) {
                console.error('Error loading consultations:', err);
                setError('Không thể tải dữ liệu tư vấn. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadConsultations();
        }
    }, [isAuthenticated, user?.id]);

    // Tải chi tiết câu hỏi khi chọn
    useEffect(() => {
        const loadQuestionDetail = async () => {
            if (!selectedQuestionId) {
                setSelectedQuestion(null);
                return;
            }

            try {
                const question = await consultationService.getConsultation(selectedQuestionId);
                setSelectedQuestion(question);
            } catch (err) {
                console.error('Error loading question detail:', err);
                setError('Không thể tải chi tiết câu hỏi. Vui lòng thử lại sau.');
            }
        };

        loadQuestionDetail();
    }, [selectedQuestionId]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleQuestionSelect = (id: string) => {
        setSelectedQuestionId(id);
    };

    const handleCloseDetail = () => {
        setSelectedQuestionId(null);
    };

    const handleTopicFilter = (event: SelectChangeEvent) => {
        setSelectedTopic(event.target.value);
    };

    // Lọc câu hỏi theo chủ đề
    const filteredConsultations = selectedTopic === 'all'
        ? consultations
        : consultations.filter(consultation =>
            (consultation.topic?.toLowerCase() || consultation.category?.toLowerCase())
                .includes(selectedTopic.toLowerCase())
        );

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
                Tư vấn & Giải đáp
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="consultation tabs"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab
                        icon={<QuestionAnswer sx={{ mr: 1 }} />}
                        iconPosition="start"
                        label="Đặt câu hỏi"
                    />
                    <Tab
                        icon={<History sx={{ mr: 1 }} />}
                        iconPosition="start"
                        label="Câu hỏi của tôi"
                    />
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={selectedQuestionId ? 6 : 12}>
                        <AskQuestionForm />
                    </Grid>
                    {selectedQuestionId && selectedQuestion && (
                        <Grid item xs={12} md={6}>
                            <QuestionDetail
                                question={selectedQuestion}
                                onClose={handleCloseDetail}
                            />
                        </Grid>
                    )}
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <FilterList sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Lọc theo chủ đề:
                    </Typography>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="topic-filter-label">Chủ đề</InputLabel>
                        <Select
                            labelId="topic-filter-label"
                            value={selectedTopic}
                            onChange={handleTopicFilter}
                            label="Chủ đề"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            {topics.map(topic => (
                                <MenuItem key={topic} value={topic}>
                                    {topic}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={selectedQuestionId ? 5 : 12}>
                        <QuestionList
                            questions={filteredConsultations}
                            selectedQuestionId={selectedQuestionId}
                            onQuestionSelect={handleQuestionSelect}
                            loading={loading}
                        />
                    </Grid>
                    {selectedQuestionId && selectedQuestion && (
                        <Grid item xs={12} md={7}>
                            <QuestionDetail
                                question={selectedQuestion}
                                onClose={handleCloseDetail}
                            />
                        </Grid>
                    )}
                </Grid>
            </TabPanel>
        </Container>
    );
};

export default ConsultationQAPage; 