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
    Alert
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
import arvService, { PatientRegimen } from '../../services/arvService';

// Mock data for patients - in real app, this would come from API
const mockPatients = [
    {
        id: '4',
        name: 'Nguyễn Văn A',
        email: 'patient1@example.com',
        age: 35,
        gender: 'Nam',
        phone: '0123456789',
        lastVisit: '2024-01-10',
        status: 'Active',
        currentRegimen: 'TDF/FTC + DTG',
        adherence: 95,
        nextAppointment: '2024-01-25'
    },
    {
        id: '5',
        name: 'Trần Thị B',
        email: 'patient2@example.com',
        age: 28,
        gender: 'Nữ',
        phone: '0987654321',
        lastVisit: '2024-01-08',
        status: 'Active',
        currentRegimen: 'TDF/FTC + EFV',
        adherence: 88,
        nextAppointment: '2024-01-22'
    },
    {
        id: '6',
        name: 'Lê Văn C',
        email: 'patient3@example.com',
        age: 42,
        gender: 'Nam',
        phone: '0369852147',
        lastVisit: '2024-01-05',
        status: 'Under Review',
        currentRegimen: null,
        adherence: null,
        nextAppointment: '2024-01-20'
    }
];

const DoctorPatientManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [patients, setPatients] = useState(mockPatients);
    const [filteredPatients, setFilteredPatients] = useState(mockPatients);
    const [patientRegimens, setPatientRegimens] = useState<PatientRegimen[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadPatientRegimens();
        }
    }, [user]);

    useEffect(() => {
        filterPatients();
    }, [searchTerm, statusFilter, patients]);

    const loadPatientRegimens = async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            const regimens = await arvService.getPatientRegimensByDoctor(user.id);
            setPatientRegimens(regimens);
        } catch (error) {
            console.error('Error loading patient regimens:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        let filtered = patients;

        if (searchTerm) {
            filtered = filtered.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone.includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(patient => patient.status === statusFilter);
        }

        setFilteredPatients(filtered);
    };

    const handleViewPatient = (patient: any) => {
        setSelectedPatient(patient);
        setOpenDialog(true);
    };

    const handlePrescribeRegimen = (patientId: string) => {
        navigate(`/doctor/patients/${patientId}/prescribe`);
    };

    const handleViewRegimen = (patientId: string) => {
        navigate(`/doctor/patients/${patientId}/regimen`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Under Review':
                return 'warning';
            case 'Inactive':
                return 'error';
            default:
                return 'default';
        }
    };

    const getAdherenceColor = (adherence: number | null) => {
        if (adherence === null) return 'default';
        if (adherence >= 95) return 'success';
        if (adherence >= 85) return 'warning';
        return 'error';
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
                                        {patients.filter(p => p.status === 'Active').length}
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
                                        Cần đánh giá
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => p.status === 'Under Review').length}
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
                            <TableCell>Tuổi/Giới tính</TableCell>
                            <TableCell>Liên hệ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Phác đồ hiện tại</TableCell>
                            <TableCell>Tuân thủ</TableCell>
                            <TableCell>Lần khám cuối</TableCell>
                            <TableCell>Hẹn tiếp theo</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            {patient.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {patient.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {patient.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {patient.age} tuổi
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {patient.gender}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {patient.email}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {patient.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={patient.status}
                                        color={getStatusColor(patient.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {patient.currentRegimen ? (
                                        <Typography variant="body2">
                                            {patient.currentRegimen}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có phác đồ
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {patient.adherence !== null ? (
                                        <Chip
                                            label={`${patient.adherence}%`}
                                            color={getAdherenceColor(patient.adherence)}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            N/A
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(patient.lastVisit)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(patient.nextAppointment)}
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
                                                    onClick={() => handleViewRegimen(patient.id)}
                                                >
                                                    <PharmacyIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Kê đơn phác đồ">
                                                <IconButton
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() => handlePrescribeRegimen(patient.id)}
                                                >
                                                    <AssignIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Đặt lịch hẹn">
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => navigate(`/doctor/appointments/new?patientId=${patient.id}`)}
                                            >
                                                <CalendarIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
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
                                    <Typography><strong>Họ tên:</strong> {selectedPatient.name}</Typography>
                                    <Typography><strong>Email:</strong> {selectedPatient.email}</Typography>
                                    <Typography><strong>Điện thoại:</strong> {selectedPatient.phone}</Typography>
                                    <Typography><strong>Tuổi:</strong> {selectedPatient.age}</Typography>
                                    <Typography><strong>Giới tính:</strong> {selectedPatient.gender}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin điều trị
                                    </Typography>
                                    <Typography><strong>Trạng thái:</strong> {selectedPatient.status}</Typography>
                                    <Typography><strong>Phác đồ hiện tại:</strong> {selectedPatient.currentRegimen || 'Chưa có'}</Typography>
                                    <Typography><strong>Tuân thủ:</strong> {selectedPatient.adherence ? `${selectedPatient.adherence}%` : 'N/A'}</Typography>
                                    <Typography><strong>Lần khám cuối:</strong> {formatDate(selectedPatient.lastVisit)}</Typography>
                                    <Typography><strong>Hẹn tiếp theo:</strong> {formatDate(selectedPatient.nextAppointment)}</Typography>
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
                                navigate(`/doctor/patients/${selectedPatient.id}/medical-record`);
                            }}
                        >
                            Xem hồ sơ y tế
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorPatientManagement;
