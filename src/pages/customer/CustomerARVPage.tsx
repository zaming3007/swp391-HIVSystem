import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Paper,
    Stack,
    Button,
    Snackbar
} from '@mui/material';
import {
    LocalPharmacy as PharmacyIcon,
    ExpandMore as ExpandMoreIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    MedicalServices as MedicalIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

interface ARVRegimen {
    id: number;
    patientId: string;
    regimenId: number;
    regimenName: string;
    regimenDescription: string;
    prescribedBy: string;
    prescribedDate: string;
    startDate: string;
    endDate?: string;
    status: string;
    notes: string;
    medications: ARVMedication[];
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

const CustomerARVPage: React.FC = () => {
    const [regimens, setRegimens] = useState<ARVRegimen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        loadPatientRegimens();
    }, []);

    const loadPatientRegimens = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user ID from localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError('Vui lòng đăng nhập để xem thông tin phác đồ');
                return;
            }

            const user = JSON.parse(userStr);
            console.log('User from localStorage:', user);

            // Try different possible ID fields
            const patientId = user.id || user.userId || user.email || user.username;
            console.log('Using patientId:', patientId);

            if (!patientId) {
                setError('Không thể xác định ID người dùng');
                return;
            }

            const response = await fetch(`http://localhost:5002/api/ARVPrescription/patient/${patientId}/regimens`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setRegimens(data.data);
                    console.log('Loaded regimens:', data.data);
                } else {
                    setError(data.message || 'Không thể tải thông tin phác đồ');
                }
            } else {
                setError('Lỗi kết nối server');
            }
        } catch (error) {
            console.error('Error loading regimens:', error);
            setError('Có lỗi xảy ra khi tải thông tin phác đồ');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'discontinued':
                return 'error';
            case 'completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'Đang điều trị';
            case 'discontinued':
                return 'Đã ngừng';
            case 'completed':
                return 'Hoàn thành';
            default:
                return status;
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

    const activeRegimen = regimens.find(r => r.status.toLowerCase() === 'active');

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PharmacyIcon sx={{ mr: 2, color: 'primary.main' }} />
                    Phác đồ ARV của tôi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Theo dõi các phác đồ điều trị ARV mà bác sĩ đã kê cho bạn
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Current Active Regimen */}
            {activeRegimen && (
                <Paper elevation={2} sx={{ mb: 4, p: 3, border: '2px solid', borderColor: 'success.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                            Phác đồ hiện tại
                        </Typography>
                        <Chip
                            label={getStatusText(activeRegimen.status)}
                            color={getStatusColor(activeRegimen.status) as any}
                            sx={{ ml: 2 }}
                        />
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                                {activeRegimen.regimenName}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {activeRegimen.regimenDescription}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày bắt đầu:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatDate(activeRegimen.startDate)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Bác sĩ kê đơn:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {activeRegimen.prescribedBy}
                                    </Typography>
                                </Box>
                            </Box>

                            {activeRegimen.notes && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ghi chú của bác sĩ:
                                    </Typography>
                                    <Typography variant="body1">
                                        {activeRegimen.notes}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {/* Medications */}
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                        Danh sách thuốc
                    </Typography>
                    {activeRegimen.medications.map((medication, index) => (
                        <Accordion key={medication.id} sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MedicalIcon color="primary" />
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
                                    {medication.sideEffects && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tác dụng phụ có thể gặp:
                                            </Typography>
                                            <Typography variant="body1" color="warning.main">
                                                {medication.sideEffects}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            )}

            {/* All Regimens History */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Lịch sử phác đồ điều trị
            </Typography>

            {regimens.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body1">
                        Chưa có phác đồ ARV nào được kê.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Vui lòng liên hệ với bác sĩ để được tư vấn và kê đơn phác đồ điều trị phù hợp.
                    </Typography>
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {regimens.map((regimen) => (
                        <Grid item xs={12} key={regimen.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                {regimen.regimenName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {regimen.regimenDescription}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={getStatusText(regimen.status)}
                                            color={getStatusColor(regimen.status) as any}
                                            size="small"
                                        />
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Ngày kê đơn:
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatDate(regimen.prescribedDate)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Ngày bắt đầu:
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatDate(regimen.startDate)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Bác sĩ:
                                            </Typography>
                                            <Typography variant="body2">
                                                {regimen.prescribedBy}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">
                                                Số thuốc:
                                            </Typography>
                                            <Typography variant="body2">
                                                {regimen.medications.length} loại
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {regimen.notes && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Ghi chú:
                                            </Typography>
                                            <Typography variant="body2">
                                                {regimen.notes}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="info"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerARVPage;
