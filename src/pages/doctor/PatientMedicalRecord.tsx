import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Tabs,
    Tab,
    Avatar,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    LinearProgress
} from '@mui/material';
import {
    Person as PersonIcon,
    LocalPharmacy as PharmacyIcon,
    Biotech as TestIcon,
    EventNote as AppointmentIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Mock patient data
const mockPatientData = {
    id: '4',
    name: 'Nguyễn Văn A',
    email: 'patient1@example.com',
    phone: '0123456789',
    dateOfBirth: '1988-05-15',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    emergencyContact: 'Nguyễn Thị B - 0987654321',
    hivStatus: 'Positive',
    diagnosisDate: '2023-08-15',
    currentRegimen: {
        id: 1,
        name: 'TDF/FTC + DTG',
        startDate: '2023-09-01',
        status: 'Active',
        adherence: 95
    },
    testResults: [
        {
            id: '1',
            testType: 'Viral Load',
            result: '< 50 copies/ml',
            date: '2024-01-10',
            status: 'Normal',
            notes: 'Không phát hiện được virus'
        },
        {
            id: '2',
            testType: 'CD4 Count',
            result: '650 cells/μL',
            date: '2024-01-10',
            status: 'Good',
            notes: 'Hệ miễn dịch tốt'
        },
        {
            id: '3',
            testType: 'Liver Function',
            result: 'ALT: 25 U/L, AST: 22 U/L',
            date: '2024-01-05',
            status: 'Normal',
            notes: 'Chức năng gan bình thường'
        }
    ],
    appointments: [
        {
            id: '1',
            date: '2024-01-25',
            time: '09:00',
            service: 'Tái khám',
            status: 'confirmed',
            notes: 'Kiểm tra hiệu quả điều trị'
        },
        {
            id: '2',
            date: '2024-01-15',
            time: '10:30',
            service: 'Tư vấn',
            status: 'completed',
            notes: 'Tư vấn về tuân thủ điều trị'
        }
    ],
    treatmentHistory: [
        {
            id: '1',
            action: 'Bắt đầu điều trị ARV',
            regimen: 'TDF/FTC + DTG',
            date: '2023-09-01',
            doctor: 'BS. Trần Thị B',
            notes: 'Bắt đầu phác đồ tuyến 1'
        },
        {
            id: '2',
            action: 'Xét nghiệm định kỳ',
            regimen: null,
            date: '2023-12-01',
            doctor: 'BS. Trần Thị B',
            notes: 'Viral load không phát hiện được'
        }
    ]
};

const PatientMedicalRecord: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(mockPatientData);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load patient data based on patientId
        // This would be an API call in real implementation
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [patientId]);

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
            case 'good':
            case 'active':
                return 'success';
            case 'warning':
            case 'pending':
                return 'warning';
            case 'abnormal':
            case 'high':
                return 'error';
            default:
                return 'default';
        }
    };

    const getAdherenceColor = (adherence: number) => {
        if (adherence >= 95) return 'success';
        if (adherence >= 85) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Đang tải hồ sơ bệnh nhân...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/doctor/patients')}
                    variant="outlined"
                >
                    Quay lại
                </Button>
                <Box>
                    <Typography variant="h4" component="h1">
                        Hồ sơ bệnh nhân
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Chi tiết hồ sơ y tế và lịch sử điều trị
                    </Typography>
                </Box>
            </Box>

            {/* Patient Info Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', mb: 2 }}>
                                    <PersonIcon sx={{ fontSize: 50 }} />
                                </Avatar>
                                <Typography variant="h5" gutterBottom>
                                    {patient.name}
                                </Typography>
                                <Chip
                                    label={patient.hivStatus}
                                    color={patient.hivStatus === 'Positive' ? 'error' : 'success'}
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin cá nhân
                            </Typography>
                            <Typography><strong>Tuổi:</strong> {calculateAge(patient.dateOfBirth)} tuổi</Typography>
                            <Typography><strong>Giới tính:</strong> {patient.gender}</Typography>
                            <Typography><strong>Ngày sinh:</strong> {formatDate(patient.dateOfBirth)}</Typography>
                            <Typography><strong>Email:</strong> {patient.email}</Typography>
                            <Typography><strong>Điện thoại:</strong> {patient.phone}</Typography>
                            <Typography><strong>Địa chỉ:</strong> {patient.address}</Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin y tế
                            </Typography>
                            <Typography><strong>Ngày chẩn đoán:</strong> {formatDate(patient.diagnosisDate)}</Typography>
                            <Typography><strong>Liên hệ khẩn cấp:</strong> {patient.emergencyContact}</Typography>
                            
                            {patient.currentRegimen && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Phác đồ hiện tại:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PharmacyIcon color="primary" />
                                        <Typography fontWeight="medium">
                                            {patient.currentRegimen.name}
                                        </Typography>
                                        <Chip
                                            label={patient.currentRegimen.status}
                                            color="success"
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2">
                                        Bắt đầu: {formatDate(patient.currentRegimen.startDate)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <Typography variant="body2">
                                            Tuân thủ: {patient.currentRegimen.adherence}%
                                        </Typography>
                                        <Chip
                                            label={`${patient.currentRegimen.adherence}%`}
                                            color={getAdherenceColor(patient.currentRegimen.adherence)}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Kết quả xét nghiệm" icon={<TestIcon />} />
                    <Tab label="Lịch hẹn" icon={<AppointmentIcon />} />
                    <Tab label="Lịch sử điều trị" icon={<AssignmentIcon />} />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {selectedTab === 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Kết quả xét nghiệm gần đây
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Loại xét nghiệm</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                        <TableCell>Ngày xét nghiệm</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {patient.testResults.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TestIcon color="primary" />
                                                    {test.testType}
                                                </Box>
                                            </TableCell>
                                            <TableCell fontWeight="medium">
                                                {test.result}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(test.date)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={test.status}
                                                    color={getStatusColor(test.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {test.notes}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {selectedTab === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Lịch hẹn
                        </Typography>
                        <List>
                            {patient.appointments.map((appointment, index) => (
                                <React.Fragment key={appointment.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {appointment.status === 'completed' ? (
                                                <CheckCircleIcon color="success" />
                                            ) : appointment.status === 'confirmed' ? (
                                                <ScheduleIcon color="primary" />
                                            ) : (
                                                <WarningIcon color="warning" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {appointment.service}
                                                    </Typography>
                                                    <Chip
                                                        label={appointment.status === 'completed' ? 'Đã hoàn thành' : 
                                                               appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                                        color={getStatusColor(appointment.status)}
                                                        size="small"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        <strong>Thời gian:</strong> {formatDate(appointment.date)} - {appointment.time}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {appointment.notes}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < patient.appointments.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {selectedTab === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Lịch sử điều trị
                        </Typography>
                        <List>
                            {patient.treatmentHistory.map((history, index) => (
                                <React.Fragment key={history.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TrendingUpIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {history.action}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        <strong>Ngày:</strong> {formatDate(history.date)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Bác sĩ:</strong> {history.doctor}
                                                    </Typography>
                                                    {history.regimen && (
                                                        <Typography variant="body2">
                                                            <strong>Phác đồ:</strong> {history.regimen}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" color="text.secondary">
                                                        {history.notes}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < patient.treatmentHistory.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<AppointmentIcon />}
                    onClick={() => navigate(`/doctor/appointments/new?patientId=${patient.id}`)}
                >
                    Đặt lịch hẹn
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<PharmacyIcon />}
                    onClick={() => navigate(`/doctor/patients/${patient.id}/prescribe`)}
                >
                    Kê đơn thuốc
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<TestIcon />}
                    onClick={() => alert('Tính năng yêu cầu xét nghiệm sẽ được phát triển trong phiên bản tiếp theo')}
                >
                    Yêu cầu xét nghiệm
                </Button>
            </Box>
        </Box>
    );
};

export default PatientMedicalRecord;
