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
    Divider,
    LinearProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    Medication as MedicationIcon,
    History as HistoryIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import arvService from '../../services/arvServiceSimple';

interface Medication {
    drugId: string;
    drugName: string;
    dosage: string;
    frequency: string;
    instructions: string;
}

interface CurrentRegimen {
    id: string;
    regimenName: string;
    regimenDescription: string;
    category: string;
    lineOfTreatment: string;
    startDate: string;
    status: string;
    notes: string;
    medications: Medication[];
}

interface RegimenHistory {
    id: string;
    regimenName: string;
    regimenDescription: string;
    category: string;
    lineOfTreatment: string;
    startDate: string;
    endDate?: string;
    status: string;
    notes: string;
    duration: number;
    medications: Medication[];
}

interface AdherenceRecord {
    id: string;
    regimenName: string;
    recordDate: string;
    totalDoses: number;
    takenDoses: number;
    adherencePercentage: number;
    notes?: string;
}

interface ARVSummary {
    currentRegimen?: {
        id: string;
        regimenName: string;
        startDate: string;
        duration: number;
        status: string;
        medicationCount: number;
    };
    totalRegimens: number;
    latestAdherence?: {
        recordDate: string;
        adherencePercentage: number;
        takenDoses: number;
        totalDoses: number;
    };
    averageAdherence: number;
}

const ARVManagement: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [currentRegimen, setCurrentRegimen] = useState<CurrentRegimen | null>(null);
    const [regimenHistory, setRegimenHistory] = useState<RegimenHistory[]>([]);
    const [adherenceRecords, setAdherenceRecords] = useState<AdherenceRecord[]>([]);
    const [arvSummary, setARVSummary] = useState<ARVSummary | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [adherenceDialogOpen, setAdherenceDialogOpen] = useState(false);
    const [newAdherence, setNewAdherence] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        totalDoses: 30,
        takenDoses: 30,
        notes: ''
    });

    // New states for doctor interaction
    const [doctorMessages, setDoctorMessages] = useState<any[]>([]);
    const [showDoctorMessages, setShowDoctorMessages] = useState(false);

    useEffect(() => {
        loadARVData();
        loadDoctorMessages();
    }, []);

    const loadDoctorMessages = async () => {
        try {
            // Mock doctor messages for demo
            setDoctorMessages([
                {
                    id: 1,
                    doctorName: 'BS. Nguyễn Văn A',
                    message: 'Chúc mừng! Mức độ tuân thủ điều trị của bạn rất tốt. Hãy tiếp tục duy trì như vậy.',
                    timestamp: '2025-07-13T09:30:00Z',
                    type: 'encouragement',
                    read: false
                },
                {
                    id: 2,
                    doctorName: 'BS. Nguyễn Văn A',
                    message: 'Tôi nhận thấy bạn đã bỏ lỡ một số liều thuốc gần đây. Hãy cố gắng uống thuốc đúng giờ để đảm bảo hiệu quả điều trị.',
                    timestamp: '2025-07-12T14:20:00Z',
                    type: 'reminder',
                    read: true
                }
            ]);
        } catch (error) {
            console.error('Error loading doctor messages:', error);
        }
    };

    const loadARVData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [summaryResponse, currentResponse, historyResponse, adherenceResponse] = await Promise.all([
                arvService.getPatientARVSummary(),
                arvService.getCurrentRegimen(),
                arvService.getRegimenHistory(),
                arvService.getAdherenceRecords()
            ]);

            if (summaryResponse.success) {
                setARVSummary(summaryResponse.data);
            }

            if (currentResponse.success && currentResponse.data) {
                setCurrentRegimen(currentResponse.data);
            }

            if (historyResponse.success) {
                setRegimenHistory(historyResponse.data);
            }

            if (adherenceResponse.success) {
                setAdherenceRecords(adherenceResponse.data.records || []);
            }
        } catch (error) {
            console.error('Error loading ARV data:', error);
            setError('Không thể tải thông tin phác đồ ARV. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAdherenceColor = (percentage: number) => {
        if (percentage >= 95) return 'success';
        if (percentage >= 85) return 'warning';
        return 'error';
    };

    const handleRecordAdherence = async () => {
        try {
            const response = await arvService.recordPatientAdherence(newAdherence);
            if (response.success) {
                setAdherenceDialogOpen(false);
                setNewAdherence({
                    recordDate: new Date().toISOString().split('T')[0],
                    totalDoses: 30,
                    takenDoses: 30,
                    notes: ''
                });
                loadARVData(); // Reload data
            } else {
                setError(response.message || 'Không thể ghi nhận tuân thủ điều trị');
            }
        } catch (error) {
            console.error('Error recording adherence:', error);
            setError('Có lỗi xảy ra khi ghi nhận tuân thủ điều trị');
        }
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Quản lý phác đồ ARV
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowDoctorMessages(true)}
                        sx={{ position: 'relative' }}
                    >
                        Tin nhắn từ bác sĩ
                        {doctorMessages.filter(m => !m.read).length > 0 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {doctorMessages.filter(m => !m.read).length}
                            </Box>
                        )}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            {arvSummary && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Current Regimen Info */}
                    {arvSummary.currentRegimen && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <MedicationIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6">
                                            Phác đồ hiện tại
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {arvSummary.currentRegimen.regimenName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Bắt đầu: {formatDate(arvSummary.currentRegimen.startDate)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Thời gian điều trị: {arvSummary.currentRegimen.duration} ngày
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Số loại thuốc: {arvSummary.currentRegimen.medicationCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Adherence Info */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                                    <Typography variant="h6">
                                        Tuân thủ điều trị
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="success.main" gutterBottom>
                                    {arvSummary.averageAdherence}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={arvSummary.averageAdherence}
                                    color={getAdherenceColor(arvSummary.averageAdherence) as any}
                                    sx={{ mb: 2 }}
                                />
                                {arvSummary.latestAdherence && (
                                    <Typography variant="body2" color="text.secondary">
                                        Gần nhất: {arvSummary.latestAdherence.takenDoses}/{arvSummary.latestAdherence.totalDoses} liều
                                        ({formatDate(arvSummary.latestAdherence.recordDate)})
                                    </Typography>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setAdherenceDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                    size="small"
                                >
                                    Ghi nhận tuân thủ
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Phác đồ hiện tại" />
                        <Tab label="Lịch sử phác đồ" />
                        <Tab label="Tuân thủ điều trị" />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* Current Regimen */}
                    {tabValue === 0 && (
                        <Box>
                            {currentRegimen ? (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {currentRegimen.regimenName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {currentRegimen.regimenDescription}
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item>
                                            <Chip label={currentRegimen.category} color="primary" size="small" />
                                        </Grid>
                                        <Grid item>
                                            <Chip label={currentRegimen.lineOfTreatment} color="secondary" size="small" />
                                        </Grid>
                                        <Grid item>
                                            <Chip label={currentRegimen.status} color="success" size="small" />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" gutterBottom>
                                        Danh sách thuốc
                                    </Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Tên thuốc</TableCell>
                                                    <TableCell>Liều lượng</TableCell>
                                                    <TableCell>Tần suất</TableCell>
                                                    <TableCell>Hướng dẫn</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentRegimen.medications.map((med, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {med.drugName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{med.dosage}</TableCell>
                                                        <TableCell>{med.frequency}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {med.instructions}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {currentRegimen.notes && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Ghi chú từ bác sĩ
                                            </Typography>
                                            <Alert severity="info">
                                                {currentRegimen.notes}
                                            </Alert>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Alert severity="info">
                                    Bạn chưa có phác đồ điều trị nào. Vui lòng liên hệ với bác sĩ để được tư vấn.
                                </Alert>
                            )}
                        </Box>
                    )}

                    {/* Regimen History */}
                    {tabValue === 1 && (
                        <Box>
                            {regimenHistory.length > 0 ? (
                                regimenHistory.map((regimen, index) => (
                                    <Card key={regimen.id} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6">
                                                        {regimen.regimenName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {regimen.regimenDescription}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={regimen.status}
                                                    color={regimen.status === 'Đang điều trị' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </Box>

                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid item>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Bắt đầu: {formatDate(regimen.startDate)}
                                                    </Typography>
                                                </Grid>
                                                {regimen.endDate && (
                                                    <Grid item>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Kết thúc: {formatDate(regimen.endDate)}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                <Grid item>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Thời gian: {regimen.duration} ngày
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Thuốc trong phác đồ:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {regimen.medications.map((med, medIndex) => (
                                                    <Chip
                                                        key={medIndex}
                                                        label={`${med.drugName} (${med.dosage})`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>

                                            {regimen.notes && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ghi chú: {regimen.notes}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Alert severity="info">
                                    Chưa có lịch sử phác đồ điều trị.
                                </Alert>
                            )}
                        </Box>
                    )}

                    {/* Adherence Records */}
                    {tabValue === 2 && (
                        <Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày ghi nhận</TableCell>
                                            <TableCell>Phác đồ</TableCell>
                                            <TableCell>Liều đã uống</TableCell>
                                            <TableCell>Tỷ lệ tuân thủ</TableCell>
                                            <TableCell>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {adherenceRecords.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{formatDate(record.recordDate)}</TableCell>
                                                <TableCell>{record.regimenName}</TableCell>
                                                <TableCell>
                                                    {record.takenDoses}/{record.totalDoses}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={record.adherencePercentage}
                                                            color={getAdherenceColor(record.adherencePercentage) as any}
                                                            sx={{ width: 100, mr: 1 }}
                                                        />
                                                        <Typography variant="body2">
                                                            {record.adherencePercentage}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {record.notes || 'Không có ghi chú'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {adherenceRecords.length === 0 && (
                                <Alert severity="info">
                                    Chưa có ghi nhận tuân thủ điều trị nào.
                                </Alert>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Adherence Recording Dialog */}
            <Dialog open={adherenceDialogOpen} onClose={() => setAdherenceDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ghi nhận tuân thủ điều trị</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Ngày ghi nhận"
                                type="date"
                                value={newAdherence.recordDate}
                                onChange={(e) => setNewAdherence({ ...newAdherence, recordDate: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Tổng số liều"
                                type="number"
                                value={newAdherence.totalDoses}
                                onChange={(e) => setNewAdherence({ ...newAdherence, totalDoses: parseInt(e.target.value) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Số liều đã uống"
                                type="number"
                                value={newAdherence.takenDoses}
                                onChange={(e) => setNewAdherence({ ...newAdherence, takenDoses: parseInt(e.target.value) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ghi chú"
                                multiline
                                rows={3}
                                value={newAdherence.notes}
                                onChange={(e) => setNewAdherence({ ...newAdherence, notes: e.target.value })}
                                fullWidth
                                placeholder="Ghi chú về việc uống thuốc (tùy chọn)"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdherenceDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleRecordAdherence} variant="contained">
                        Ghi nhận
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Doctor Messages Dialog */}
            <Dialog
                open={showDoctorMessages}
                onClose={() => setShowDoctorMessages(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Tin nhắn từ bác sĩ
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {doctorMessages.length > 0 ? (
                            doctorMessages.map((message) => (
                                <Card
                                    key={message.id}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        backgroundColor: message.read ? 'inherit' : 'action.hover',
                                        border: message.read ? '1px solid' : '2px solid',
                                        borderColor: message.read ? 'divider' : 'primary.main'
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="h6" color="primary">
                                                {message.doctorName}
                                            </Typography>
                                            <Chip
                                                label={message.type === 'encouragement' ? 'Khuyến khích' : 'Nhắc nhở'}
                                                color={message.type === 'encouragement' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body1" gutterBottom>
                                            {message.message}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(message.timestamp).toLocaleString('vi-VN')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography color="text.secondary">
                                Chưa có tin nhắn từ bác sĩ
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDoctorMessages(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ARVManagement;
