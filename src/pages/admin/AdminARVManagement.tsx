import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Tabs,
    Tab,
    Button,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Divider,
    LinearProgress,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Medication as MedicationIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface ARVRegimen {
    id: string;
    name: string;
    description: string;
    category: string;
    lineOfTreatment: string;
    isActive: boolean;
    medications: ARVMedication[];
}

interface ARVMedication {
    id: string;
    dosage: string;
    frequency: string;
    instructions: string;
    timingInstructions: string;
    drug: {
        id: string;
        name: string;
        activeIngredient: string;
        drugClass: string;
        sideEffects: string;
    };
}

interface PatientRegimen {
    id: string;
    patientId: string;
    regimenName: string;
    startDate: string;
    status: string;
    doctorName: string;
    notes: string;
}

const AdminARVManagement: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    
    // Data states
    const [regimens, setRegimens] = useState<ARVRegimen[]>([]);
    const [patientRegimens, setPatientRegimens] = useState<PatientRegimen[]>([]);
    const [adherenceStats, setAdherenceStats] = useState<any[]>([]);

    // Dialog states
    const [regimenDialogOpen, setRegimenDialogOpen] = useState(false);
    const [selectedRegimen, setSelectedRegimen] = useState<ARVRegimen | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadRegimens(),
                loadPatientRegimens(),
                loadAdherenceStats()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const loadRegimens = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/ARV/regimens', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRegimens(data.data || []);
            } else {
                throw new Error('Failed to load regimens');
            }
        } catch (error) {
            console.error('Error loading regimens:', error);
            // Use mock data for demo
            setRegimens([
                {
                    id: 'regimen-001',
                    name: 'TDF/3TC/EFV',
                    description: 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz',
                    category: 'Điều trị ban đầu',
                    lineOfTreatment: 'Tuyến 1',
                    isActive: true,
                    medications: [
                        {
                            id: 'med-001',
                            dosage: '300mg',
                            frequency: '1 lần/ngày',
                            instructions: 'Uống sau bữa ăn',
                            timingInstructions: 'Buổi tối',
                            drug: {
                                id: 'drug-001',
                                name: 'Tenofovir Disoproxil Fumarate',
                                activeIngredient: 'Tenofovir DF',
                                drugClass: 'NRTI',
                                sideEffects: 'Buồn nôn, đau đầu, mệt mỏi'
                            }
                        }
                    ]
                }
            ]);
        }
    };

    const loadPatientRegimens = async () => {
        try {
            // Mock data for demo
            setPatientRegimens([
                {
                    id: 'patient-regimen-001',
                    patientId: 'customer-001',
                    regimenName: 'TDF/3TC/EFV',
                    startDate: '2025-01-15',
                    status: 'Đang điều trị',
                    doctorName: 'BS. Nguyễn Văn A',
                    notes: 'Bệnh nhân tuân thủ điều trị tốt'
                }
            ]);
        } catch (error) {
            console.error('Error loading patient regimens:', error);
        }
    };

    const loadAdherenceStats = async () => {
        try {
            // Mock data for demo
            setAdherenceStats([
                {
                    patientId: 'customer-001',
                    patientName: 'Nguyễn Văn A',
                    currentRegimen: 'TDF/3TC/EFV',
                    averageAdherence: 96.67,
                    lastRecordDate: '2025-07-13',
                    status: 'Tốt'
                }
            ]);
        } catch (error) {
            console.error('Error loading adherence stats:', error);
        }
    };

    const renderRegimensTab = () => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Quản lý phác đồ ARV
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setRegimenDialogOpen(true)}
                    >
                        Thêm phác đồ mới
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên phác đồ</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Tuyến điều trị</TableCell>
                                <TableCell>Số thuốc</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {regimens.map((regimen) => (
                                <TableRow key={regimen.id}>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {regimen.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {regimen.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={regimen.category} 
                                            color="primary" 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={regimen.lineOfTreatment} 
                                            color="secondary" 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {regimen.medications?.length || 0} thuốc
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={regimen.isActive ? 'Hoạt động' : 'Ngừng sử dụng'}
                                            color={regimen.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => {
                                                    setSelectedRegimen(regimen);
                                                    setRegimenDialogOpen(true);
                                                }}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
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

    const renderPatientRegimensTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Phác đồ điều trị của bệnh nhân
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã bệnh nhân</TableCell>
                                <TableCell>Phác đồ</TableCell>
                                <TableCell>Ngày bắt đầu</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Bác sĩ kê đơn</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientRegimens.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell>{pr.patientId}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {pr.regimenName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(pr.startDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={pr.status}
                                            color={pr.status === 'Đang điều trị' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{pr.doctorName}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="outlined">
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    const renderAdherenceStatsTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Thống kê tuân thủ điều trị
                </Typography>

                <Grid container spacing={3}>
                    {adherenceStats.map((stat) => (
                        <Grid item xs={12} md={6} lg={4} key={stat.patientId}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {stat.patientName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Phác đồ: {stat.currentRegimen}
                                    </Typography>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Mức độ tuân thủ trung bình
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={stat.averageAdherence} 
                                                sx={{ width: '100%', height: 8 }}
                                                color={stat.averageAdherence >= 95 ? 'success' : 
                                                       stat.averageAdherence >= 85 ? 'warning' : 'error'}
                                            />
                                            <Typography variant="body2" fontWeight="bold">
                                                {stat.averageAdherence.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Ghi nhận gần nhất: {new Date(stat.lastRecordDate).toLocaleDateString('vi-VN')}
                                        </Typography>
                                        <Chip 
                                            label={stat.status}
                                            color={stat.status === 'Tốt' ? 'success' : 'warning'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quản lý ARV - Admin
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab icon={<MedicationIcon />} label="Phác đồ ARV" iconPosition="start" />
                    <Tab icon={<PersonIcon />} label="Bệnh nhân điều trị" iconPosition="start" />
                    <Tab icon={<TrendingUpIcon />} label="Thống kê tuân thủ" iconPosition="start" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && renderRegimensTab()}
            {tabValue === 1 && renderPatientRegimensTab()}
            {tabValue === 2 && renderAdherenceStatsTab()}

            {/* Regimen Details Dialog */}
            <Dialog 
                open={regimenDialogOpen} 
                onClose={() => setRegimenDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedRegimen ? `Chi tiết phác đồ: ${selectedRegimen.name}` : 'Thêm phác đồ mới'}
                </DialogTitle>
                <DialogContent>
                    {selectedRegimen && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin phác đồ
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Mô tả:</strong> {selectedRegimen.description}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Danh mục:</strong> {selectedRegimen.category}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Tuyến điều trị:</strong> {selectedRegimen.lineOfTreatment}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                Danh sách thuốc
                            </Typography>
                            {selectedRegimen.medications?.map((med, index) => (
                                <Card key={med.id} variant="outlined" sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {med.drug?.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Hoạt chất: {med.drug?.activeIngredient} | Nhóm: {med.drug?.drugClass}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Liều dùng:</strong> {med.dosage} - {med.frequency}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Hướng dẫn:</strong> {med.instructions}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Thời gian uống:</strong> {med.timingInstructions}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRegimenDialogOpen(false)}>Đóng</Button>
                    {!selectedRegimen && (
                        <Button variant="contained">Lưu</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminARVManagement;
