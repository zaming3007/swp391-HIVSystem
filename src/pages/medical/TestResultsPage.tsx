import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Tabs,
    Tab,
    Divider,
    Card,
    CardContent,
    Alert,
    Skeleton,
    LinearProgress,
    Stack,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VirusIcon from '@mui/icons-material/Coronavirus';
import MedicationIcon from '@mui/icons-material/Medication';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';

import { CD4Test, ViralLoadTest, ARVRegimen, MedicalVisit, TestStatistics } from '../../types';
import { getCD4Tests, getViralLoadTests, getARVRegimens, getMedicalVisits, getTestStatistics } from '../../services/medicalTestService';
import CD4Chart from '../../components/medicalTest/CD4Chart';
import ViralLoadChart from '../../components/medicalTest/ViralLoadChart';
import ARVRegimenCard from '../../components/medicalTest/ARVRegimenCard';
import MedicalVisitList from '../../components/medicalTest/MedicalVisitList';

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
            id={`test-results-tabpanel-${index}`}
            aria-labelledby={`test-results-tab-${index}`}
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

const TestResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [tabValue, setTabValue] = useState(0);
    const [cd4Tests, setCD4Tests] = useState<CD4Test[]>([]);
    const [viralLoadTests, setViralLoadTests] = useState<ViralLoadTest[]>([]);
    const [arvRegimens, setARVRegimens] = useState<ARVRegimen[]>([]);
    const [medicalVisits, setMedicalVisits] = useState<MedicalVisit[]>([]);
    const [stats, setStats] = useState<TestStatistics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check authentication
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login?redirect=/app/test-results', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch test results
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [cd4Data, viralLoadData, arvData, visitsData, statsData] = await Promise.all([
                    getCD4Tests(),
                    getViralLoadTests(),
                    getARVRegimens(),
                    getMedicalVisits(),
                    getTestStatistics()
                ]);

                setCD4Tests(cd4Data);
                setViralLoadTests(viralLoadData);
                setARVRegimens(arvData);
                setMedicalVisits(visitsData);
                setStats(statsData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch test results', err);
                setError('Không thể tải dữ liệu xét nghiệm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Handle view test details from medical visit
    const handleViewCD4Detail = (testId: string) => {
        setTabValue(0); // Switch to CD4 tab
    };

    const handleViewViralLoadDetail = (testId: string) => {
        setTabValue(1); // Switch to Viral Load tab
    };

    // Render loading state
    if (loading) {
        return (
            <Container>
                <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        <Skeleton width="60%" />
                    </Typography>
                    <Skeleton variant="rectangular" height={150} />
                    <Box sx={{ mt: 4 }}>
                        <Skeleton variant="rectangular" height={400} />
                    </Box>
                </Box>
            </Container>
        );
    }

    // Render error state
    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    // Get the current active ARV regimen
    const activeRegimen = arvRegimens.find(regimen => regimen.status === 'active');

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <HealthAndSafetyIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Hồ sơ y tế của tôi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Theo dõi kết quả xét nghiệm, phác đồ ARV, đơn thuốc và lịch sử điều trị HIV của bạn.
                </Typography>
            </Box>

            {/* Stats Overview */}
            <Paper elevation={0} variant="outlined" sx={{ mb: 4, p: 2 }}>
                <Grid container spacing={3}>
                    {/* CD4 Current Stats */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <BloodtypeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    CD4 Hiện tại
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}>
                                    <Typography variant="h5" component="div">
                                        {cd4Tests.length > 0
                                            ? cd4Tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].value
                                            : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        cells/mm³
                                    </Typography>
                                </Box>
                                {stats && stats.averageCD4 && (
                                    <Typography variant="caption" color="text.secondary">
                                        Trung bình: {Math.round(stats.averageCD4)} cells/mm³
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Viral Load Current Stats */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <VirusIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Tải lượng virus
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}>
                                    <Typography variant="h5" component="div">
                                        {viralLoadTests.length > 0
                                            ? viralLoadTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].value
                                            : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        copies/mL
                                    </Typography>
                                </Box>
                                {stats && stats.isViralSuppressed !== undefined && (
                                    <Chip
                                        label={stats.isViralSuppressed ? "Ức chế virus" : "Chưa ức chế virus"}
                                        size="small"
                                        color={stats.isViralSuppressed ? "success" : "warning"}
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Current ARV Regimen */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <MedicationIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Phác đồ ARV hiện tại
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="h5" component="div">
                                        {activeRegimen ? activeRegimen.regimenName : 'N/A'}
                                    </Typography>
                                </Box>
                                {activeRegimen && (
                                    <Typography variant="caption" color="text.secondary">
                                        Bắt đầu từ: {new Date(activeRegimen.startDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Medical Visits */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Lần khám gần nhất
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="h5" component="div">
                                        {medicalVisits.length > 0
                                            ? new Date(medicalVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString('vi-VN')
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                                {medicalVisits.length > 0 && medicalVisits[0].nextVisitDate && (
                                    <Typography variant="caption" color="text.secondary">
                                        Lịch tái khám: {new Date(medicalVisits[0].nextVisitDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs for different test results */}
            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab icon={<BloodtypeIcon />} label="CD4" />
                    <Tab icon={<VirusIcon />} label="Tải lượng virus" />
                    <Tab icon={<MedicationIcon />} label="Phác đồ ARV" />
                    <Tab icon={<EventNoteIcon />} label="Lịch sử khám bệnh" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <CD4Chart data={cd4Tests} height={400} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <ViralLoadChart data={viralLoadTests} height={400} />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <MedicationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Phác đồ ARV và đơn thuốc
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Theo dõi các phác đồ ARV và đơn thuốc mà bác sĩ đã kê cho bạn
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {/* Current Active Regimen */}
                    {activeRegimen && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Phác đồ hiện tại
                            </Typography>
                            <ARVRegimenCard regimen={activeRegimen} />
                        </Box>
                    )}

                    {/* All Regimens History */}
                    <Typography variant="h6" gutterBottom>
                        Lịch sử phác đồ ARV
                    </Typography>
                    {arvRegimens.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="body1">
                                Chưa có phác đồ ARV nào được kê.
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Vui lòng liên hệ với bác sĩ để được tư vấn và kê đơn phác đồ điều trị phù hợp.
                            </Typography>
                        </Alert>
                    ) : (
                        <Grid container spacing={2}>
                            {arvRegimens
                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                                .map(regimen => (
                                    <Grid item xs={12} key={regimen.id}>
                                        <ARVRegimenCard regimen={regimen} />
                                    </Grid>
                                ))}
                        </Grid>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <MedicalVisitList
                        visits={medicalVisits}
                        onViewCD4Detail={handleViewCD4Detail}
                        onViewViralLoadDetail={handleViewViralLoadDetail}
                    />
                </TabPanel>
            </Paper>

            {/* Guidance Information */}
            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body2">
                    <strong>Hướng dẫn đọc kết quả:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                    <li>
                        <Typography variant="body2">
                            <strong>CD4:</strong> Lượng tế bào CD4 thông thường nên ở mức 500-1500 cells/mm³.
                            Giá trị thấp hơn 500 cells/mm³ có thể cần chú ý đặc biệt.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Tải lượng virus:</strong> Mục tiêu điều trị là đưa tải lượng virus xuống dưới
                            ngưỡng phát hiện (thường là dưới 20 copies/mL).
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Phác đồ ARV:</strong> Tuân thủ điều trị theo phác đồ hiện tại và tham khảo ý kiến
                            bác sĩ trước khi có bất kỳ thay đổi nào.
                        </Typography>
                    </li>
                </Box>
            </Alert>
        </Container>
    );
};

export default TestResultsPage; 