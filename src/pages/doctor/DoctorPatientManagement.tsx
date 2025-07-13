import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    MedicalServices as MedicalIcon,
    Assignment as AssignIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    LocalPharmacy as PharmacyIcon,
    TrendingUp as TrendingUpIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import arvService, { PatientRegimen, Patient } from '../../services/arvService';

interface PatientData {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    phone: string;
    lastVisit: string;
    status: string;
    currentRegimen?: string;
    adherence?: number;
    nextAppointment: string;
}

const DoctorPatientManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [patientRegimens, setPatientRegimens] = useState<PatientRegimen[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadPatients();
            loadPatientRegimens();
        }
    }, [user]);

    useEffect(() => {
        filterPatients();
    }, [searchTerm, statusFilter, patients]);

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            const patientsData = await arvService.getDoctorPatients();
            setPatients(patientsData);
        } catch (error) {
            console.error('Error loading patients:', error);
            setError('Không thể tải danh sách bệnh nhân');
        } finally {
            setLoading(false);
        }
    };

    const loadPatientRegimens = async () => {
        if (!user?.id) return;

        try {
            const regimens = await arvService.getPatientRegimensByDoctor(user.id);
            setPatientRegimens(regimens);
        } catch (error) {
            console.error('Error loading patient regimens:', error);
        }
    };

    const filterPatients = () => {
        let filtered = patients;

        if (searchTerm) {
            filtered = filtered.filter(patient =>
                patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            if (statusFilter === 'active') {
                filtered = filtered.filter(patient => patient.currentRegimen);
            } else if (statusFilter === 'inactive') {
                filtered = filtered.filter(patient => !patient.currentRegimen);
            }
        }

        setFilteredPatients(filtered);
    };

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setOpenDialog(true);
    };

    const handleViewRegimen = (patientId: string) => {
        navigate(`/doctor/regimens?patientId=${patientId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý bệnh nhân
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Danh sách bệnh nhân được phân công và quản lý phác đồ điều trị
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng bệnh nhân
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đang điều trị
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => p.currentRegimen).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <MedicalIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chưa có phác đồ
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => !p.currentRegimen).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <PharmacyIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Phác đồ đang dùng
                                    </Typography>
                                    <Typography variant="h5">
                                        {patientRegimens.filter(pr => pr.status === 'Active').length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm bệnh nhân..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="Active">Đang điều trị</MenuItem>
                                <MenuItem value="Under Review">Cần đánh giá</MenuItem>
                                <MenuItem value="Inactive">Không hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/doctor/patients/assign')}
                            fullWidth
                        >
                            Thêm bệnh nhân
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Patients Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bệnh nhân</TableCell>
                            <TableCell>Phác đồ hiện tại</TableCell>
                            <TableCell>Lần khám cuối</TableCell>
                            <TableCell>Tổng số lần khám</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>Đang tải...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Alert severity="error">{error}</Alert>
                                </TableCell>
                            </TableRow>
                        ) : filteredPatients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>Không có bệnh nhân nào</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPatients.map((patient) => (
                                <TableRow key={patient.patientId}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                {patient.patientName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {patient.patientName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {patient.patientId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {patient.currentRegimen ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {patient.currentRegimen.name}
                                                </Typography>
                                                <Chip
                                                    label={patient.currentRegimen.status}
                                                    color="success"
                                                    size="small"
                                                />
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Chưa có phác đồ
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(patient.lastAppointment)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {patient.totalAppointments} lần
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewPatient(patient)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {patient.currentRegimen ? (
                                                <Tooltip title="Xem phác đồ">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleViewRegimen(patient.patientId)}
                                                    >
                                                        <PharmacyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Kê đơn phác đồ">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => navigate('/doctor/regimens')}
                                                    >
                                                        <AssignIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Xem lịch sử khám">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => navigate(`/doctor/appointments?patientId=${patient.patientId}`)}
                                                >
                                                    <CalendarIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Patient Detail Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
                <DialogContent>
                    {selectedPatient && (
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin cá nhân
                                    </Typography>
                                    <Typography><strong>Họ tên:</strong> {selectedPatient.patientName}</Typography>
                                    <Typography><strong>ID:</strong> {selectedPatient.patientId}</Typography>
                                    <Typography><strong>Tổng số lần khám:</strong> {selectedPatient.totalAppointments}</Typography>
                                    <Typography><strong>Lần khám cuối:</strong> {formatDate(selectedPatient.lastAppointment)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin điều trị
                                    </Typography>
                                    {selectedPatient.currentRegimen ? (
                                        <>
                                            <Typography><strong>Phác đồ hiện tại:</strong> {selectedPatient.currentRegimen.name}</Typography>
                                            <Typography><strong>Trạng thái:</strong> {selectedPatient.currentRegimen.status}</Typography>
                                        </>
                                    ) : (
                                        <Typography><strong>Phác đồ hiện tại:</strong> Chưa có</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Đóng
                    </Button>
                    {selectedPatient && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenDialog(false);
                                navigate(`/doctor/regimens?patientId=${selectedPatient.patientId}`);
                            }}
                        >
                            Quản lý phác đồ
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorPatientManagement;
