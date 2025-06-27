import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Divider,
    useTheme,
    Tab,
    Tabs
} from '@mui/material';
import { QuestionAnswer, Send, History } from '@mui/icons-material';
import QuestionList from '../../components/consultation/QuestionList';
import QuestionDetail from '../../components/consultation/QuestionDetail';
import AskQuestionForm from '../../components/consultation/AskQuestionForm';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`consultation-tabpanel-${index}`}
            aria-labelledby={`consultation-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const ConsultationQAPage = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

    // Mock data - in a real app this would come from your backend
    const mockQuestions = [
        {
            id: '1',
            title: 'Câu hỏi về sức khỏe sinh sản',
            content: 'Tôi muốn tìm hiểu thêm về các biện pháp tránh thai an toàn...',
            status: 'answered' as const,
            createdAt: '2024-01-15T10:30:00Z',
            category: 'Sức khỏe sinh sản',
            answers: [
                {
                    id: 'a1',
                    content: 'Có nhiều phương pháp tránh thai hiện đại và an toàn...',
                    createdAt: '2024-01-15T14:20:00Z',
                    counselor: 'Bs. Nguyễn Văn A'
                }
            ]
        },
        {
            id: '2',
            title: 'Thắc mắc về kinh nguyệt không đều',
            content: 'Gần đây chu kì của tôi không đều, tôi nên làm gì?',
            status: 'pending' as const,
            createdAt: '2024-01-18T09:15:00Z',
            category: 'Kinh nguyệt'
        }
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSelectedQuestionId(null);
    };

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

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={selectedQuestionId ? 6 : 12}>
                        <AskQuestionForm />
                    </Grid>
                    {selectedQuestionId && (
                        <Grid item xs={12} md={6}>
                            <QuestionDetail
                                question={mockQuestions.find(q => q.id === selectedQuestionId)!}
                                onClose={() => setSelectedQuestionId(null)}
                            />
                        </Grid>
                    )}
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={selectedQuestionId ? 6 : 12}>
                        <QuestionList
                            questions={mockQuestions}
                            selectedQuestionId={selectedQuestionId}
                            onQuestionSelect={setSelectedQuestionId}
                        />
                    </Grid>
                    {selectedQuestionId && (
                        <Grid item xs={12} md={6}>
                            <QuestionDetail
                                question={mockQuestions.find(q => q.id === selectedQuestionId)!}
                                onClose={() => setSelectedQuestionId(null)}
                            />
                        </Grid>
                    )}
                </Grid>
            </TabPanel>
        </Container>
    );
};

export default ConsultationQAPage; 