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
    AccordionDetails,
    LinearProgress
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
import arvService from '../../services/arvService';
import CreateRegimenDialog from '../../components/arv/CreateRegimenDialog';

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

    // New states for patient interaction
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [adherenceDialogOpen, setAdherenceDialogOpen] = useState(false);
    const [regimenDialogOpen, setRegimenDialogOpen] = useState(false);
    const [patientAdherence, setPatientAdherence] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [createRegimenOpen, setCreateRegimenOpen] = useState(false);

    useEffect(() => {
        loadPatients();
        loadRegimens();
        loadNotifications();
    }, []);

    // New functions for patient interaction
    const handleViewPatientAdherence = async (patientId: string) => {
        try {
            setSelectedPatientId(patientId);
            // Call API to get patient adherence data
            const response = await fetch(`http://localhost:5002/api/PatientARV/patient/${patientId}/adherence`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPatientAdherence(data.data || []);
            } else {
                // Mock data for demo
                setPatientAdherence([
                    {
                        recordDate: '2025-07-13',
                        adherencePercentage: 93.33,
                        takenDoses: 28,
                        totalDoses: 30,
                        notes: 'Quên uống 2 lần trong tháng'
                    },
                    {
                        recordDate: '2025-06-13',
                        adherencePercentage: 100,
                        takenDoses: 30,
                        totalDoses: 30,
                        notes: 'Tuân thủ hoàn toàn'
                    }
                ]);
            }
            setAdherenceDialogOpen(true);
        } catch (error) {
            console.error('Error fetching patient adherence:', error);
            setError('Không thể tải dữ liệu tuân thủ của bệnh nhân');
        }
    };

    const handleAdjustRegimen = (patientId: string) => {
        setSelectedPatientId(patientId);
        const patient = patients.find(p => p.patientId === patientId);
        if (patient) {
            setSelectedPatient(patient);
            setRegimenDialogOpen(true);
        }
    };

    const loadNotifications = async () => {
        try {
            // Mock notifications for demo
            setNotifications([
                {
                    id: 1,
                    patientId: 'customer-001',
                    patientName: 'Nguyễn Văn A',
                    type: 'adherence_low',
                    message: 'Mức độ tuân thủ giảm xuống 85% trong tuần qua',
                    timestamp: '2025-07-13T10:30:00Z',
                    read: false
                },
                {
                    id: 2,
                    patientId: 'customer-002',
                    patientName: 'Trần Thị B',
                    type: 'adherence_good',
                    message: 'Tuân thủ điều trị tốt, đạt 98% trong tháng qua',
                    timestamp: '2025-07-12T15:20:00Z',
                    read: false
                }
            ]);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load real patient data from doctor-patients endpoint
            const response = await fetch('http://localhost:5002/api/ARVPrescription/doctor-patients', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    // Transform API data to match our interface
                    const transformedPatients = data.data.map((patient: any) => ({
                        patientId: patient.patientId,
                        patientName: patient.patientName,
                        lastAppointment: patient.lastAppointment,
                        totalAppointments: patient.totalAppointments,
                        currentRegimen: patient.currentRegimen ? {
                            id: patient.currentRegimen.id,
                            name: patient.currentRegimen.name,
                            status: patient.currentRegimen.status
                        } : undefined
                    }));
                    setPatients(transformedPatients);
                } else {
                    // Use mock data if no real patients found
                    setPatients([
                        {
                            patientId: 'customer-001',
                            patientName: 'Nguyễn Văn A',
                            lastAppointment: '2025-07-10',
                            totalAppointments: 5,
                            currentRegimen: {
                                id: 'patient-regimen-001',
                                name: 'TDF/3TC/EFV',
                                status: 'Đang điều trị'
                            }
                        },
                        {
                            patientId: 'customer-002',
                            patientName: 'Trần Thị B',
                            lastAppointment: '2025-07-08',
                            totalAppointments: 3,
                            currentRegimen: undefined
                        }
                    ]);
                }
            } else {
                throw new Error('API not available');
            }
        } catch (error: any) {
            console.error('Error loading patients:', error);
            // Fallback to mock data
            setPatients([
                {
                    patientId: 'customer-001',
                    patientName: 'Nguyễn Văn A',
                    lastAppointment: '2025-07-10',
                    totalAppointments: 5,
                    currentRegimen: {
                        id: 'patient-regimen-001',
                        name: 'TDF/3TC/EFV',
                        status: 'Đang điều trị'
                    }
                },
                {
                    patientId: 'customer-002',
                    patientName: 'Trần Thị B',
                    lastAppointment: '2025-07-08',
                    totalAppointments: 3,
                    currentRegimen: undefined
                }
            ]);
            setError('Sử dụng dữ liệu demo - API chưa sẵn sàng');
        } finally {
            setLoading(false);
        }
    };

    const loadRegimens = async () => {
        try {
            const response = await arvService.getRegimens();
            if (response.success) {
                setRegimens(response.data);
                setError(null); // Clear any previous errors
            } else {
                setError('Không thể tải danh sách phác đồ');
            }
        } catch (error: any) {
            console.error('Error loading regimens:', error);
            setError('Lỗi khi tải danh sách phác đồ ARV');
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
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewPatientAdherence(patient.patientId)}
                                            >
                                                Xem tuân thủ
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleAdjustRegimen(patient.patientId)}
                                            >
                                                Điều chỉnh phác đồ
                                            </Button>
                                        </Box>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Danh sách phác đồ ARV ({regimens.length})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateRegimenOpen(true)}
                    >
                        Tạo phác đồ mới
                    </Button>
                </Box>

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

    const renderNotificationsTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Thông báo từ bệnh nhân
                </Typography>

                {notifications.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    backgroundColor: notification.read ? 'inherit' : 'action.hover',
                                    border: notification.read ? '1px solid' : '2px solid',
                                    borderColor: notification.read ? 'divider' : 'primary.main'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {notification.patientName}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(notification.timestamp).toLocaleString('vi-VN')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={notification.type === 'adherence_low' ? 'Tuân thủ thấp' : 'Tuân thủ tốt'}
                                                color={notification.type === 'adherence_low' ? 'error' : 'success'}
                                                size="small"
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewPatientAdherence(notification.patientId)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography color="text.secondary">
                        Không có thông báo mới
                    </Typography>
                )}
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
                    <Tab label={`Thông báo ${notifications.filter(n => !n.read).length > 0 ? `(${notifications.filter(n => !n.read).length})` : ''}`} />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && renderPatientsTab()}
            {tabValue === 1 && renderRegimensTab()}
            {tabValue === 2 && renderPatientHistoryTab()}
            {tabValue === 3 && renderAdherenceTab()}
            {tabValue === 4 && renderNotificationsTab()}

            {/* Patient Adherence Dialog */}
            <Dialog
                open={adherenceDialogOpen}
                onClose={() => setAdherenceDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Thông tin tuân thủ điều trị - {patients.find(p => p.patientId === selectedPatientId)?.patientName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {patientAdherence.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày ghi nhận</TableCell>
                                            <TableCell>Tỷ lệ tuân thủ</TableCell>
                                            <TableCell>Liều đã uống</TableCell>
                                            <TableCell>Tổng liều</TableCell>
                                            <TableCell>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {patientAdherence.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(record.recordDate).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={record.adherencePercentage}
                                                            sx={{ width: 100 }}
                                                            color={record.adherencePercentage >= 95 ? 'success' :
                                                                record.adherencePercentage >= 85 ? 'warning' : 'error'}
                                                        />
                                                        <Typography variant="body2">
                                                            {record.adherencePercentage.toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{record.takenDoses}</TableCell>
                                                <TableCell>{record.totalDoses}</TableCell>
                                                <TableCell>{record.notes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>Chưa có dữ liệu tuân thủ điều trị</Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdherenceDialogOpen(false)}>Đóng</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // TODO: Add note or recommendation for patient
                            alert('Chức năng gửi lời khuyên cho bệnh nhân sẽ được phát triển');
                        }}
                    >
                        Gửi lời khuyên
                    </Button>
                </DialogActions>
            </Dialog>

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

            {/* Create Regimen Dialog */}
            <CreateRegimenDialog
                open={createRegimenOpen}
                onClose={() => setCreateRegimenOpen(false)}
                onSuccess={() => {
                    loadRegimens(); // Refresh regimens list
                    setCreateRegimenOpen(false);
                }}
            />
        </Box>
    );
};

export default DoctorARVManagement;
