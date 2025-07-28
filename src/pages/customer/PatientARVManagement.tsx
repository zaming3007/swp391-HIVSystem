import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Grid,
    LinearProgress,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar
} from '@mui/material';
import {
    LocalPharmacy as PharmacyIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    TrendingUp as TrendingUpIcon,
    ExpandMore as ExpandMoreIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import arvApi from '../../services/arvApi';

interface CurrentRegimen {
    id: string;
    doctorName: string;
    startDate: string;
    status: string;
    notes: string;
    reason: string;
    regimen: {
        id: string;
        name: string;
        description: string;
        lineOfTreatment: string;
        medications: ARVMedication[];
    };
    daysOnTreatment: number;
}

interface ARVMedication {
    id: string;
    medicationName: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    instructions: string;
    sideEffects: string;
}

interface AdherenceStatistics {
    totalRecords: number;
    averageAdherence: number;
    last7DaysAdherence: number;
    last30DaysAdherence: number;
    consecutiveDays: number;
    recentRecords: AdherenceRecord[];
}

interface AdherenceRecord {
    recordDate: string;
    adherencePercentage: number;
    takenDoses: number;
    totalDoses: number;
}

const PatientARVManagement: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [currentRegimen, setCurrentRegimen] = useState<CurrentRegimen | null>(null);
    const [adherenceStats, setAdherenceStats] = useState<AdherenceStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    const [sideEffectDialogOpen, setSideEffectDialogOpen] = useState(false);
    const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalDoses, setTotalDoses] = useState(1);
    const [takenDoses, setTakenDoses] = useState(1);
    const [medicationNotes, setMedicationNotes] = useState('');

    // Side effect states
    const [sideEffect, setSideEffect] = useState('');
    const [severity, setSeverity] = useState('Nhẹ');
    const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        loadCurrentRegimen();
        loadAdherenceStatistics();
    }, []);

    // Helper function for showing notifications
    const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const loadCurrentRegimen = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await arvApi.get('/PatientARV/current-regimen');

            if (response.data.success) {
                setCurrentRegimen(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải thông tin phác đồ');
            }
        } catch (error: any) {
            console.error('Error loading current regimen:', error);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const loadAdherenceStatistics = async () => {
        try {
            const response = await arvApi.get('/PatientARV/adherence-statistics');

            if (response.data.success) {
                setAdherenceStats(response.data.data);
            }
        } catch (error: any) {
            console.error('Error loading adherence statistics:', error);
        }
    };

    const handleRecordMedication = async () => {
        if (!currentRegimen) return;

        try {
            setLoading(true);
            const response = await arvApi.post('/PatientARV/record-medication', {
                patientRegimenId: currentRegimen.id,
                recordDate: new Date(recordDate).toISOString(),
                totalDoses,
                takenDoses,
                notes: medicationNotes
            });

            if (response.data.success) {
                setMedicationDialogOpen(false);
                setMedicationNotes('');
                loadAdherenceStatistics();
                showNotification('Đã ghi nhận việc uống thuốc thành công!', 'success');
            } else {
                setError(response.data.message || 'Không thể ghi nhận uống thuốc');
            }
        } catch (error: any) {
            console.error('Error recording medication:', error);
            setError('Lỗi khi ghi nhận uống thuốc');
        } finally {
            setLoading(false);
        }
    };

    const handleReportSideEffect = async () => {
        if (!currentRegimen) return;

        try {
            setLoading(true);
            const response = await arvApi.post('/PatientARV/report-side-effect', {
                patientRegimenId: currentRegimen.id,
                sideEffect,
                severity,
                onsetDate: new Date(onsetDate).toISOString(),
                description
            });

            if (response.data.success) {
                setSideEffectDialogOpen(false);
                setSideEffect('');
                setDescription('');
                showNotification('Đã báo cáo tác dụng phụ thành công! Bác sĩ sẽ theo dõi và tư vấn cho bạn.', 'success');
            } else {
                setError(response.data.message || 'Không thể báo cáo tác dụng phụ');
            }
        } catch (error: any) {
            console.error('Error reporting side effect:', error);
            setError('Lỗi khi báo cáo tác dụng phụ');
        } finally {
            setLoading(false);
        }
    };

    const getAdherenceColor = (percentage: number) => {
        if (percentage >= 95) return 'success';
        if (percentage >= 80) return 'warning';
        return 'error';
    };

    const renderCurrentRegimenTab = () => {
        if (!currentRegimen) {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            Bạn chưa được kê đơn phác đồ điều trị nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                            Vui lòng liên hệ với bác sĩ để được tư vấn và kê đơn phác đồ phù hợp
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Grid container spacing={3}>
                {/* Regimen Info */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <AssignmentIcon color="primary" />
                                <Typography variant="h6">
                                    Phác đồ điều trị hiện tại
                                </Typography>
                                <Chip
                                    label={currentRegimen.status}
                                    color="primary"
                                    size="small"
                                />
                            </Box>

                            <Typography variant="h5" color="primary" gutterBottom>
                                {currentRegimen.regimen.name}
                            </Typography>

                            <Typography variant="body1" paragraph>
                                {currentRegimen.regimen.description}
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Bác sĩ kê đơn:
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentRegimen.doctorName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày bắt đầu:
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(currentRegimen.startDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Số ngày điều trị:
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentRegimen.daysOnTreatment} ngày
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tuyến điều trị:
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentRegimen.regimen.lineOfTreatment}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {currentRegimen.reason && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Lý do kê đơn:
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentRegimen.reason}
                                    </Typography>
                                </Box>
                            )}

                            {currentRegimen.notes && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Ghi chú của bác sĩ:
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentRegimen.notes}
                                    </Typography>
                                </Box>
                            )}

                            {/* Medications */}
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Thuốc trong phác đồ
                            </Typography>

                            {currentRegimen.regimen.medications?.map((medication) => (
                                <Accordion key={medication.id} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <PharmacyIcon color="primary" />
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {medication.medicationName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {medication.dosage} - {medication.frequency}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Hoạt chất:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {medication.activeIngredient}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Hướng dẫn sử dụng:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {medication.instructions}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tác dụng phụ có thể gặp:
                                                </Typography>
                                                <Typography variant="body1" color="warning.main">
                                                    {medication.sideEffects}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Thao tác nhanh
                            </Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ScheduleIcon />}
                                onClick={() => setMedicationDialogOpen(true)}
                                sx={{ mb: 2 }}
                            >
                                Ghi nhận uống thuốc
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                color="warning"
                                startIcon={<WarningIcon />}
                                onClick={() => setSideEffectDialogOpen(true)}
                            >
                                Báo cáo tác dụng phụ
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Adherence Summary */}
                    {adherenceStats && (
                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tuân thủ điều trị
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tuân thủ trung bình:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={adherenceStats.averageAdherence}
                                            color={getAdherenceColor(adherenceStats.averageAdherence)}
                                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                        />
                                        <Typography variant="body2" fontWeight="bold">
                                            {adherenceStats.averageAdherence.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        7 ngày gần nhất:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={adherenceStats.last7DaysAdherence}
                                            color={getAdherenceColor(adherenceStats.last7DaysAdherence)}
                                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                        />
                                        <Typography variant="body2" fontWeight="bold">
                                            {adherenceStats.last7DaysAdherence.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    Số ngày tuân thủ liên tiếp: <strong>{adherenceStats.consecutiveDays}</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Phác đồ điều trị ARV của tôi
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Phác đồ hiện tại" />
                    <Tab label="Lịch sử tuân thủ" />
                    <Tab label="Tác dụng phụ" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && renderCurrentRegimenTab()}
            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Lịch sử tuân thủ điều trị</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Theo dõi việc uống thuốc hàng ngày của bạn
                        </Typography>
                    </CardContent>
                </Card>
            )}
            {tabValue === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Lịch sử tác dụng phụ</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Các tác dụng phụ đã báo cáo và tình trạng xử lý
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Record Medication Dialog */}
            <Dialog open={medicationDialogOpen} onClose={() => setMedicationDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ghi nhận uống thuốc</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ngày uống thuốc"
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                        />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Tổng số liều cần uống"
                                    type="number"
                                    value={totalDoses}
                                    onChange={(e) => setTotalDoses(parseInt(e.target.value) || 1)}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Số liều đã uống"
                                    type="number"
                                    value={takenDoses}
                                    onChange={(e) => setTakenDoses(parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0, max: totalDoses }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Ghi chú"
                            multiline
                            rows={3}
                            value={medicationNotes}
                            onChange={(e) => setMedicationNotes(e.target.value)}
                            placeholder="Ghi chú về việc uống thuốc (tùy chọn)"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMedicationDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleRecordMedication} variant="contained" disabled={loading}>
                        Ghi nhận
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Report Side Effect Dialog */}
            <Dialog open={sideEffectDialogOpen} onClose={() => setSideEffectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Báo cáo tác dụng phụ</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Tác dụng phụ"
                            value={sideEffect}
                            onChange={(e) => setSideEffect(e.target.value)}
                            sx={{ mb: 2 }}
                            placeholder="Ví dụ: Buồn nôn, đau đầu, phát ban..."
                        />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Mức độ nghiêm trọng</InputLabel>
                            <Select
                                value={severity}
                                label="Mức độ nghiêm trọng"
                                onChange={(e) => setSeverity(e.target.value)}
                            >
                                <MenuItem value="Nhẹ">Nhẹ</MenuItem>
                                <MenuItem value="Trung bình">Trung bình</MenuItem>
                                <MenuItem value="Nặng">Nặng</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Ngày xuất hiện"
                            type="date"
                            value={onsetDate}
                            onChange={(e) => setOnsetDate(e.target.value)}
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            label="Mô tả chi tiết"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả chi tiết về tác dụng phụ, thời gian xuất hiện, mức độ ảnh hưởng..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSideEffectDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleReportSideEffect}
                        variant="contained"
                        disabled={loading || !sideEffect}
                        color="warning"
                    >
                        Báo cáo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PatientARVManagement;
