import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import {
    Science as ScienceIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Remove as RemoveIcon,
    LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import testResultService from '../../services/testResultService';

interface TestResult {
    id: string;
    testType: string;
    testName: string;
    result: string;
    unit?: string;
    referenceRange?: string;
    status: string;
    testDate: string;
    labName?: string;
    notes?: string;
}

interface TestSummary {
    latestCD4?: TestResult;
    latestViralLoad?: TestResult;
    recentTests: TestResult[];
    totalTestsCount: number;
}

const TestResults: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
    const [allTests, setAllTests] = useState<TestResult[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // ARV Management states
    const [arvData, setArvData] = useState<any>(null);
    const [arvLoading, setArvLoading] = useState(false);

    useEffect(() => {
        loadTestResults();
        if (tabValue === 4) { // ARV tab
            loadARVData();
        }
    }, [tabValue]);

    const loadARVData = async () => {
        try {
            setArvLoading(true);
            const userId = localStorage.getItem('userId') || 'customer-001';

            // Load ARV summary
            const response = await fetch(`http://localhost:5002/api/ARV/patient/${userId}/summary`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setArvData(data.data);
            } else {
                // Use mock data for demo
                setArvData({
                    patientId: userId,
                    currentRegimen: {
                        id: 'patient-regimen-001',
                        regimenName: 'TDF/3TC/EFV',
                        startDate: '2025-01-15T00:00:00Z',
                        duration: 179,
                        status: 'Đang điều trị',
                        medicationCount: 3,
                        doctorName: 'BS. Nguyễn Văn A'
                    },
                    totalRegimens: 1,
                    latestAdherence: {
                        recordDate: '2025-07-13T00:00:00Z',
                        adherencePercentage: 93.33,
                        takenDoses: 28,
                        totalDoses: 30
                    },
                    averageAdherence: 96.67
                });
            }
        } catch (error) {
            console.error('Error loading ARV data:', error);
            setError('Không thể tải dữ liệu ARV');
        } finally {
            setArvLoading(false);
        }
    };

    const loadTestResults = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load test summary and all tests
            const [summaryResponse, allTestsResponse] = await Promise.all([
                testResultService.getPatientTestSummary(),
                testResultService.getPatientTestResults()
            ]);

            if (summaryResponse.success) {
                setTestSummary(summaryResponse.data);
            }

            if (allTestsResponse.success) {
                setAllTests(allTestsResponse.data);
            }
        } catch (error) {
            console.error('Error loading test results:', error);
            setError('Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return 'success';
            case 'abnormal':
                return 'warning';
            case 'critical':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return <TrendingUpIcon />;
            case 'abnormal':
                return <RemoveIcon />;
            case 'critical':
                return <TrendingDownIcon />;
            default:
                return <ScienceIcon />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Kết quả xét nghiệm
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Key Indicators */}
            {testSummary && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* CD4 Count */}
                    {testSummary.latestCD4 && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6">
                                            CD4 Count (Mới nhất)
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" color="primary" gutterBottom>
                                        {testSummary.latestCD4.result} {testSummary.latestCD4.unit}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Chip
                                            icon={getStatusIcon(testSummary.latestCD4.status)}
                                            label={testSummary.latestCD4.status === 'Normal' ? 'Bình thường' :
                                                testSummary.latestCD4.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                            color={getStatusColor(testSummary.latestCD4.status) as any}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày xét nghiệm: {formatDate(testSummary.latestCD4.testDate)}
                                    </Typography>
                                    {testSummary.latestCD4.referenceRange && (
                                        <Typography variant="body2" color="text.secondary">
                                            Giá trị tham chiếu: {testSummary.latestCD4.referenceRange}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Viral Load */}
                    {testSummary.latestViralLoad && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ScienceIcon sx={{ mr: 1, color: 'secondary.main' }} />
                                        <Typography variant="h6">
                                            Tải lượng virus (Mới nhất)
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" color="secondary" gutterBottom>
                                        {testSummary.latestViralLoad.result} {testSummary.latestViralLoad.unit}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Chip
                                            icon={getStatusIcon(testSummary.latestViralLoad.status)}
                                            label={testSummary.latestViralLoad.status === 'Normal' ? 'Bình thường' :
                                                testSummary.latestViralLoad.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                            color={getStatusColor(testSummary.latestViralLoad.status) as any}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày xét nghiệm: {formatDate(testSummary.latestViralLoad.testDate)}
                                    </Typography>
                                    {testSummary.latestViralLoad.referenceRange && (
                                        <Typography variant="body2" color="text.secondary">
                                            Giá trị tham chiếu: {testSummary.latestViralLoad.referenceRange}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Tabs for different views */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Tất cả kết quả" />
                        <Tab label="CD4 Count" />
                        <Tab label="Tải lượng virus" />
                        <Tab label="Xét nghiệm khác" />
                        <Tab label="Phác đồ ARV" />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* All Tests */}
                    {tabValue === 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên xét nghiệm</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ngày xét nghiệm</TableCell>
                                        <TableCell>Phòng xét nghiệm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTests.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {test.testName}
                                                </Typography>
                                                {test.referenceRange && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tham chiếu: {test.referenceRange}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {test.result} {test.unit}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(test.status)}
                                                    label={test.status === 'Normal' ? 'Bình thường' :
                                                        test.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                                    color={getStatusColor(test.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(test.testDate)}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {test.labName || 'Không có thông tin'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* CD4 Tests */}
                    {tabValue === 1 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày xét nghiệm</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTests.filter(test => test.testType === 'CD4').map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell>{formatDate(test.testDate)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {test.result} {test.unit}
                                                </Typography>
                                                {test.referenceRange && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tham chiếu: {test.referenceRange}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(test.status)}
                                                    label={test.status === 'Normal' ? 'Bình thường' :
                                                        test.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                                    color={getStatusColor(test.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {test.notes || 'Không có ghi chú'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Viral Load Tests */}
                    {tabValue === 2 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày xét nghiệm</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTests.filter(test => test.testType === 'ViralLoad').map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell>{formatDate(test.testDate)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {test.result} {test.unit}
                                                </Typography>
                                                {test.referenceRange && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tham chiếu: {test.referenceRange}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(test.status)}
                                                    label={test.status === 'Normal' ? 'Bình thường' :
                                                        test.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                                    color={getStatusColor(test.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {test.notes || 'Không có ghi chú'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Other Tests */}
                    {tabValue === 3 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên xét nghiệm</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ngày xét nghiệm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTests.filter(test => test.testType === 'Other').map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {test.testName}
                                                </Typography>
                                                {test.referenceRange && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tham chiếu: {test.referenceRange}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {test.result} {test.unit}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(test.status)}
                                                    label={test.status === 'Normal' ? 'Bình thường' :
                                                        test.status === 'Abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                                    color={getStatusColor(test.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(test.testDate)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* ARV Management Tab */}
                    {tabValue === 4 && (
                        <Box>
                            {arvLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <Typography>Đang tải dữ liệu ARV...</Typography>
                                </Box>
                            ) : arvData ? (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin phác đồ ARV hiện tại
                                    </Typography>

                                    {arvData.currentRegimen ? (
                                        <Card variant="outlined" sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    {arvData.currentRegimen.regimenName}
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Ngày bắt đầu: {new Date(arvData.currentRegimen.startDate).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Thời gian điều trị: {arvData.currentRegimen.duration} ngày
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Số loại thuốc: {arvData.currentRegimen.medicationCount}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Bác sĩ kê đơn: {arvData.currentRegimen.doctorName}
                                                        </Typography>
                                                        <Chip
                                                            label={arvData.currentRegimen.status}
                                                            color="success"
                                                            size="small"
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Hiện tại bạn chưa có phác đồ ARV nào được kê đơn.
                                        </Alert>
                                    )}

                                    <Typography variant="h6" gutterBottom>
                                        Thống kê tuân thủ điều trị
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h4" color="primary" gutterBottom>
                                                        {arvData.averageAdherence.toFixed(1)}%
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Mức độ tuân thủ trung bình
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h4" color="primary" gutterBottom>
                                                        {arvData.totalRegimens}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Tổng số phác đồ đã sử dụng
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h4" color="primary" gutterBottom>
                                                        {arvData.latestAdherence?.adherencePercentage.toFixed(1) || 0}%
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Tuân thủ gần nhất
                                                    </Typography>
                                                    {arvData.latestAdherence && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(arvData.latestAdherence.recordDate).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => window.location.href = '/app/arv-management'}
                                        >
                                            Xem chi tiết quản lý ARV
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Alert severity="warning">
                                    Không thể tải dữ liệu ARV. Vui lòng thử lại sau.
                                </Alert>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {allTests.length === 0 && !loading && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Chưa có kết quả xét nghiệm nào. Vui lòng liên hệ với bác sĩ để được tư vấn.
                </Alert>
            )}
        </Container>
    );
};

export default TestResults;
