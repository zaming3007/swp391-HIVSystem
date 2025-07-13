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
    Pagination,
    Grid,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    LocalPharmacy as PharmacyIcon,
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import arvApi from '../../services/arvApi';

interface ARVRegimen {
    id: string;
    name: string;
    description: string;
    category: string;
    lineOfTreatment: string;
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

interface Patient {
    patientId: string;
    patientName: string;
    lastAppointment: string;
    totalAppointments: number;
    currentRegimen?: {
        id: string;
        name: string;
        status: string;
    };
}

interface PatientRegimen {
    id: string;
    patientName: string;
    doctorName: string;
    regimen: ARVRegimen;
    startDate: string;
    endDate?: string;
    status: string;
    notes: string;
    reason: string;
    createdAt: string;
}

const DoctorARVManagement: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [regimens, setRegimens] = useState<ARVRegimen[]>([]);
    const [patientRegimens, setPatientRegimens] = useState<PatientRegimen[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [prescribeDialogOpen, setPrescribeDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedRegimen, setSelectedRegimen] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        loadPatients();
        loadRegimens();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await arvApi.get('/ARVPrescription/patients');

            if (response.data.success) {
                setPatients(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải danh sách bệnh nhân');
            }
        } catch (error: any) {
            console.error('Error loading patients:', error);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const loadRegimens = async () => {
        try {
            const response = await arvApi.get('/ARVPrescription/regimens');

            if (response.data.success) {
                setRegimens(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải danh sách phác đồ');
            }
        } catch (error: any) {
            console.error('Error loading regimens:', error);
            setError('Lỗi khi tải danh sách phác đồ');
        }
    };

    const loadPatientHistory = async (patientId: string) => {
        try {
            const response = await arvApi.get(`/ARVPrescription/patient/${patientId}/history`);

            if (response.data.success) {
                setPatientRegimens(response.data.data);
            }
        } catch (error: any) {
            console.error('Error loading patient history:', error);
        }
    };

    const handlePrescribeRegimen = async () => {
        if (!selectedPatient || !selectedRegimen) return;

        try {
            setLoading(true);
            const response = await arvApi.post('/ARVPrescription/prescribe', {
                patientId: selectedPatient.patientId,
                patientName: selectedPatient.patientName,
                regimenId: selectedRegimen,
                startDate: new Date(startDate).toISOString(),
                notes,
                reason
            });

            if (response.data.success) {
                setPrescribeDialogOpen(false);
                setSelectedPatient(null);
                setSelectedRegimen('');
                setNotes('');
                setReason('');
                loadPatients(); // Refresh patient list
                alert('Đã kê đơn phác đồ thành công!');
            } else {
                setError(response.data.message || 'Không thể kê đơn phác đồ');
            }
        } catch (error: any) {
            console.error('Error prescribing regimen:', error);
            setError('Lỗi khi kê đơn phác đồ');
        } finally {
            setLoading(false);
        }
    };

    const openPrescribeDialog = (patient: Patient) => {
        setSelectedPatient(patient);
        setPrescribeDialogOpen(true);
    };

    const renderPatientHistoryTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Lịch sử điều trị bệnh nhân</Typography>
                {patientRegimens.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Chưa có lịch sử điều trị nào
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bệnh nhân</TableCell>
                                    <TableCell>Phác đồ</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patientRegimens.map((regimen) => (
                                    <TableRow key={regimen.id}>
                                        <TableCell>{regimen.patientName}</TableCell>
                                        <TableCell>{regimen.regimen.name}</TableCell>
                                        <TableCell>{new Date(regimen.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={regimen.status}
                                                color={regimen.status === 'Đang điều trị' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{regimen.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );

    const renderAdherenceTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Theo dõi tuân thủ điều trị</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Theo dõi mức độ tuân thủ điều trị ARV của bệnh nhân
                </Typography>

                <Grid container spacing={3}>
                    {patients.filter(p => p.currentRegimen).map((patient) => (
                        <Grid item xs={12} md={6} key={patient.patientId}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {patient.patientName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Phác đồ: {patient.currentRegimen?.name}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Mức độ tuân thủ: Chưa có dữ liệu
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                // TODO: Implement adherence tracking
                                                alert('Chức năng theo dõi tuân thủ sẽ được phát triển');
                                            }}
                                        >
                                            Ghi nhận tuân thủ
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );

    const renderPatientsTab = () => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        Danh sách bệnh nhân
                    </Typography>
                    <Button variant="outlined" onClick={loadPatients}>
                        Làm mới
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên bệnh nhân</TableCell>
                                <TableCell>Lần khám gần nhất</TableCell>
                                <TableCell>Tổng lượt khám</TableCell>
                                <TableCell>Phác đồ hiện tại</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow key={patient.patientId}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon color="primary" />
                                            {patient.patientName}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(patient.lastAppointment).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>{patient.totalAppointments}</TableCell>
                                    <TableCell>
                                        {patient.currentRegimen ? (
                                            <Chip
                                                label={patient.currentRegimen.name}
                                                color="primary"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                label="Chưa có phác đồ"
                                                color="default"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Kê đơn phác đồ">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => openPrescribeDialog(patient)}
                                                >
                                                    <PharmacyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xem lịch sử">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        loadPatientHistory(patient.patientId);
                                                        setTabValue(2);
                                                    }}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    const renderRegimensTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Danh sách phác đồ ARV
                </Typography>

                {regimens.map((regimen) => (
                    <Accordion key={regimen.id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <AssignmentIcon color="primary" />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {regimen.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {regimen.category} - {regimen.lineOfTreatment}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={regimen.lineOfTreatment}
                                    color={regimen.lineOfTreatment === 'Tuyến 1' ? 'primary' : 'secondary'}
                                    size="small"
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph>
                                {regimen.description}
                            </Typography>

                            <Typography variant="subtitle2" gutterBottom>
                                Thuốc trong phác đồ:
                            </Typography>

                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên thuốc</TableCell>
                                            <TableCell>Hoạt chất</TableCell>
                                            <TableCell>Liều lượng</TableCell>
                                            <TableCell>Tần suất</TableCell>
                                            <TableCell>Hướng dẫn</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {regimen.medications?.map((medication) => (
                                            <TableRow key={medication.id}>
                                                <TableCell>{medication.medicationName}</TableCell>
                                                <TableCell>{medication.activeIngredient}</TableCell>
                                                <TableCell>{medication.dosage}</TableCell>
                                                <TableCell>{medication.frequency}</TableCell>
                                                <TableCell>{medication.instructions}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quản lý phác đồ ARV - Bác sĩ
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Danh sách bệnh nhân" />
                    <Tab label="Phác đồ ARV" />
                    <Tab label="Lịch sử điều trị" />
                    <Tab label="Theo dõi tuân thủ" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && renderPatientsTab()}
            {tabValue === 1 && renderRegimensTab()}
            {tabValue === 2 && renderPatientHistoryTab()}
            {tabValue === 3 && renderAdherenceTab()}

            {/* Prescribe Dialog */}
            <Dialog open={prescribeDialogOpen} onClose={() => setPrescribeDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Kê đơn phác đồ ARV</DialogTitle>
                <DialogContent>
                    {selectedPatient && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Bệnh nhân:</strong> {selectedPatient.patientName}
                            </Typography>

                            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                <InputLabel>Chọn phác đồ</InputLabel>
                                <Select
                                    value={selectedRegimen}
                                    label="Chọn phác đồ"
                                    onChange={(e) => setSelectedRegimen(e.target.value)}
                                >
                                    {regimens.map((regimen) => (
                                        <MenuItem key={regimen.id} value={regimen.id}>
                                            {regimen.name} - {regimen.lineOfTreatment}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Ngày bắt đầu"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                fullWidth
                                label="Lý do kê đơn"
                                multiline
                                rows={2}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Ghi chú"
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPrescribeDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handlePrescribeRegimen}
                        variant="contained"
                        disabled={loading || !selectedRegimen}
                    >
                        Kê đơn
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorARVManagement;
