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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {
    Add as AddIcon,
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

interface PatientTestResultsProps {
    patientId: string;
    patientName: string;
}

const PatientTestResults: React.FC<PatientTestResultsProps> = ({ patientId, patientName }) => {
    const [loading, setLoading] = useState(true);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [testSummary, setTestSummary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newTestResult, setNewTestResult] = useState({
        testType: 'CD4',
        testName: 'CD4 Count',
        result: '',
        unit: '',
        referenceRange: '',
        status: 'Normal',
        testDate: new Date().toISOString().split('T')[0],
        labName: '',
        notes: ''
    });

    useEffect(() => {
        loadTestResults();
    }, [patientId]);

    const loadTestResults = async () => {
        try {
            setLoading(true);
            setError(null);

            const [resultsResponse, summaryResponse] = await Promise.all([
                testResultService.getDoctorPatientTestResults(patientId),
                testResultService.getDoctorPatientTestSummary(patientId)
            ]);

            if (resultsResponse.success) {
                setTestResults(resultsResponse.data);
            }

            if (summaryResponse.success) {
                setTestSummary(summaryResponse.data);
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

    const handleAddTestResult = async () => {
        try {
            const testData = {
                ...newTestResult,
                patientId,
                doctorId: localStorage.getItem('userId') || 'doctor-001',
                testDate: new Date(newTestResult.testDate).toISOString()
            };

            const response = await testResultService.createTestResult(testData);
            if (response.success) {
                setAddDialogOpen(false);
                setNewTestResult({
                    testType: 'CD4',
                    testName: 'CD4 Count',
                    result: '',
                    unit: '',
                    referenceRange: '',
                    status: 'Normal',
                    testDate: new Date().toISOString().split('T')[0],
                    labName: '',
                    notes: ''
                });
                loadTestResults(); // Reload data
            } else {
                setError(response.message || 'Không thể thêm kết quả xét nghiệm');
            }
        } catch (error) {
            console.error('Error adding test result:', error);
            setError('Có lỗi xảy ra khi thêm kết quả xét nghiệm');
        }
    };

    const handleTestTypeChange = (testType: string) => {
        setNewTestResult({
            ...newTestResult,
            testType,
            testName: testType === 'CD4' ? 'CD4 Count' : 
                     testType === 'ViralLoad' ? 'HIV RNA Viral Load' : 
                     'Other Test',
            unit: testType === 'CD4' ? 'cells/μL' : 
                  testType === 'ViralLoad' ? 'copies/mL' : '',
            referenceRange: testType === 'CD4' ? '500-1600' : 
                           testType === 'ViralLoad' ? '<50' : ''
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Kết quả xét nghiệm - {patientName}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                >
                    Thêm kết quả
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Key Indicators */}
            {testSummary && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Latest CD4 */}
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
                                        Ngày: {formatDate(testSummary.latestCD4.testDate)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Latest Viral Load */}
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
                                        Ngày: {formatDate(testSummary.latestViralLoad.testDate)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* All Test Results */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Tất cả kết quả xét nghiệm
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Loại xét nghiệm</TableCell>
                                    <TableCell>Tên xét nghiệm</TableCell>
                                    <TableCell>Kết quả</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày xét nghiệm</TableCell>
                                    <TableCell>Phòng xét nghiệm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {testResults.map((test) => (
                                    <TableRow key={test.id}>
                                        <TableCell>
                                            <Chip 
                                                label={test.testType} 
                                                color={test.testType === 'CD4' ? 'primary' : 
                                                       test.testType === 'ViralLoad' ? 'secondary' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
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

                    {testResults.length === 0 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Chưa có kết quả xét nghiệm nào cho bệnh nhân này.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Add Test Result Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Thêm kết quả xét nghiệm</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại xét nghiệm</InputLabel>
                                <Select
                                    value={newTestResult.testType}
                                    onChange={(e) => handleTestTypeChange(e.target.value)}
                                    label="Loại xét nghiệm"
                                >
                                    <MenuItem value="CD4">CD4 Count</MenuItem>
                                    <MenuItem value="ViralLoad">Viral Load</MenuItem>
                                    <MenuItem value="Other">Xét nghiệm khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Tên xét nghiệm"
                                value={newTestResult.testName}
                                onChange={(e) => setNewTestResult({ ...newTestResult, testName: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Kết quả"
                                value={newTestResult.result}
                                onChange={(e) => setNewTestResult({ ...newTestResult, result: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Đơn vị"
                                value={newTestResult.unit}
                                onChange={(e) => setNewTestResult({ ...newTestResult, unit: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={newTestResult.status}
                                    onChange={(e) => setNewTestResult({ ...newTestResult, status: e.target.value })}
                                    label="Trạng thái"
                                >
                                    <MenuItem value="Normal">Bình thường</MenuItem>
                                    <MenuItem value="Abnormal">Bất thường</MenuItem>
                                    <MenuItem value="Critical">Nghiêm trọng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giá trị tham chiếu"
                                value={newTestResult.referenceRange}
                                onChange={(e) => setNewTestResult({ ...newTestResult, referenceRange: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Ngày xét nghiệm"
                                type="date"
                                value={newTestResult.testDate}
                                onChange={(e) => setNewTestResult({ ...newTestResult, testDate: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phòng xét nghiệm"
                                value={newTestResult.labName}
                                onChange={(e) => setNewTestResult({ ...newTestResult, labName: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ghi chú"
                                multiline
                                rows={3}
                                value={newTestResult.notes}
                                onChange={(e) => setNewTestResult({ ...newTestResult, notes: e.target.value })}
                                fullWidth
                                placeholder="Ghi chú về kết quả xét nghiệm"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleAddTestResult} variant="contained">
                        Thêm kết quả
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatientTestResults;
