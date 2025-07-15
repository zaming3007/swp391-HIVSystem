import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Tooltip,
    Tabs,
    Tab
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    LocalPharmacy as PharmacyIcon,
    Assignment as AssignIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import arvService, { ARVRegimen, ARVDrug } from '../../services/arvService';

const ARVRegimenManagement: React.FC = () => {
    const navigate = useNavigate();
    const [regimens, setRegimens] = useState<ARVRegimen[]>([]);
    const [filteredRegimens, setFilteredRegimens] = useState<ARVRegimen[]>([]);
    const [drugs, setDrugs] = useState<ARVDrug[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [populationFilter, setPopulationFilter] = useState('all');
    const [selectedRegimen, setSelectedRegimen] = useState<ARVRegimen | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [prescribeDialogOpen, setPrescribeDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<{ id: string, name: string } | null>(null);

    // Create regimen dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newRegimen, setNewRegimen] = useState({
        name: '',
        description: '',
        category: '',
        lineOfTreatment: '',
        selectedDrugs: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterRegimens();
    }, [searchTerm, typeFilter, populationFilter, regimens]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [regimensData, drugsData, patientsData] = await Promise.all([
                arvService.getRegimens(),
                arvService.getARVDrugs(),
                arvService.getDoctorPatients()
            ]);
            setRegimens(regimensData);
            setDrugs(drugsData);
            setPatients(patientsData);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const filterRegimens = () => {
        let filtered = regimens;

        if (searchTerm) {
            filtered = filtered.filter(regimen =>
                regimen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                regimen.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(regimen => regimen.regimenType === typeFilter);
        }

        if (populationFilter !== 'all') {
            filtered = filtered.filter(regimen => regimen.targetPopulation === populationFilter);
        }

        setFilteredRegimens(filtered);
    };

    const handleViewRegimen = (regimen: ARVRegimen) => {
        setSelectedRegimen(regimen);
        setOpenDialog(true);
    };

    const handleCreateRegimen = async () => {
        try {
            setLoading(true);

            // Create new regimen via service
            await arvService.createRegimen({
                name: newRegimen.name,
                description: newRegimen.description,
                category: newRegimen.category,
                lineOfTreatment: newRegimen.lineOfTreatment,
                selectedDrugs: newRegimen.selectedDrugs
            });

            // Reset form and close dialog
            setNewRegimen({
                name: '',
                description: '',
                category: '',
                lineOfTreatment: '',
                selectedDrugs: []
            });
            setCreateDialogOpen(false);

            // Reload data
            await loadData();

            alert('Tạo phác đồ thành công!');
        } catch (error) {
            console.error('Error creating regimen:', error);
            alert('Lỗi khi tạo phác đồ');
        } finally {
            setLoading(false);
        }
    };

    const handleDrugSelection = (drugId: string) => {
        const currentDrugs = newRegimen.selectedDrugs;
        if (currentDrugs.includes(drugId)) {
            setNewRegimen({
                ...newRegimen,
                selectedDrugs: currentDrugs.filter(id => id !== drugId)
            });
        } else {
            setNewRegimen({
                ...newRegimen,
                selectedDrugs: [...currentDrugs, drugId]
            });
        }
    };

    const handleEditRegimen = (id: number) => {
        navigate(`/doctor/regimens/edit/${id}`);
    };

    const handleDeleteRegimen = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phác đồ này?')) {
            try {
                await arvService.deleteRegimen(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting regimen:', error);
            }
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'FirstLine':
                return 'success';
            case 'SecondLine':
                return 'warning';
            case 'ThirdLine':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'FirstLine':
                return 'Tuyến 1';
            case 'SecondLine':
                return 'Tuyến 2';
            case 'ThirdLine':
                return 'Tuyến 3';
            default:
                return type;
        }
    };

    const getPopulationText = (population: string) => {
        switch (population) {
            case 'Adult':
                return 'Người lớn';
            case 'Pediatric':
                return 'Trẻ em';
            case 'Pregnant':
                return 'Phụ nữ mang thai';
            case 'Adolescent':
                return 'Thanh thiếu niên';
            default:
                return population;
        }
    };

    const getDrugClassColor = (drugClass: string) => {
        switch (drugClass) {
            case 'NRTI':
                return 'primary';
            case 'NNRTI':
                return 'secondary';
            case 'PI':
                return 'info';
            case 'INSTI':
                return 'success';
            default:
                return 'default';
        }
    };

    const handlePrescribeRegimen = (patientId: string, patientName: string) => {
        setSelectedPatient({ id: patientId, name: patientName });
        setPrescribeDialogOpen(true);
    };

    const handlePrescribeRegimenSubmit = async (regimenId: string) => {
        if (!selectedPatient) return;

        try {
            setLoading(true);
            await arvService.prescribeRegimen({
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                regimenId: regimenId,
                startDate: new Date(),
                notes: `Phác đồ được kê cho bệnh nhân ${selectedPatient.name}`,
                reason: 'Điều trị HIV theo phác đồ ARV'
            });

            setPrescribeDialogOpen(false);
            setSelectedPatient(null);
            await loadData(); // Reload để cập nhật thông tin bệnh nhân
            alert('Kê đơn phác đồ thành công!');
        } catch (error) {
            console.error('Error prescribing regimen:', error);
            alert('Lỗi khi kê đơn phác đồ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý phác đồ ARV
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Tạo và quản lý các phác đồ điều trị ARV cho bệnh nhân
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                    <Tab label="Quản lý phác đồ" />
                    <Tab label="Danh sách bệnh nhân" />
                </Tabs>
            </Paper>

            {currentTab === 0 && (
                <>
                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng phác đồ
                                    </Typography>
                                    <Typography variant="h5">
                                        {regimens.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tuyến 1
                                    </Typography>
                                    <Typography variant="h5">
                                        {regimens.filter(r => r.regimenType === 'FirstLine').length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        An toàn cho thai kỳ
                                    </Typography>
                                    <Typography variant="h5">
                                        {regimens.filter(r => r.isPregnancySafe).length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Dành cho trẻ em
                                    </Typography>
                                    <Typography variant="h5">
                                        {regimens.filter(r => r.isPediatricSafe).length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Filters and Actions */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Tìm kiếm phác đồ..."
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
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Tuyến điều trị</InputLabel>
                                    <Select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        label="Tuyến điều trị"
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        <MenuItem value="FirstLine">Tuyến 1</MenuItem>
                                        <MenuItem value="SecondLine">Tuyến 2</MenuItem>
                                        <MenuItem value="ThirdLine">Tuyến 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Đối tượng</InputLabel>
                                    <Select
                                        value={populationFilter}
                                        onChange={(e) => setPopulationFilter(e.target.value)}
                                        label="Đối tượng"
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        <MenuItem value="Adult">Người lớn</MenuItem>
                                        <MenuItem value="Pediatric">Trẻ em</MenuItem>
                                        <MenuItem value="Pregnant">Phụ nữ mang thai</MenuItem>
                                        <MenuItem value="Adolescent">Thanh thiếu niên</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setTypeFilter('all');
                                        setPopulationFilter('all');
                                    }}
                                    fullWidth
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setCreateDialogOpen(true)}
                                    fullWidth
                                >
                                    Tạo phác đồ
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Regimens Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên phác đồ</TableCell>
                                    <TableCell>Tuyến điều trị</TableCell>
                                    <TableCell>Đối tượng</TableCell>
                                    <TableCell>Số thuốc</TableCell>
                                    <TableCell>An toàn</TableCell>
                                    <TableCell>Độ tuổi tối thiểu</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRegimens.map((regimen) => (
                                    <TableRow key={regimen.id}>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {regimen.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {regimen.description}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getTypeText(regimen.regimenType)}
                                                color={getTypeColor(regimen.regimenType)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {getPopulationText(regimen.targetPopulation)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {regimen.drugs?.length || 0} thuốc
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {regimen.isPregnancySafe && (
                                                    <Chip label="Thai kỳ" size="small" color="success" variant="outlined" />
                                                )}
                                                {regimen.isPediatricSafe && (
                                                    <Chip label="Trẻ em" size="small" color="info" variant="outlined" />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {regimen.minAge} tuổi / {regimen.minWeight}kg
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Xem chi tiết">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewRegimen(regimen)}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => alert('Tính năng chỉnh sửa phác đồ sẽ được phát triển trong phiên bản tiếp theo')}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Kê đơn cho bệnh nhân">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => alert('Tính năng kê đơn sẽ được phát triển trong phiên bản tiếp theo')}
                                                    >
                                                        <AssignIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteRegimen(regimen.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Regimen Detail Dialog */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PharmacyIcon />
                                Chi tiết phác đồ ARV
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            {selectedRegimen && (
                                <Box sx={{ mt: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>
                                                {selectedRegimen.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {selectedRegimen.description}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Thông tin cơ bản
                                            </Typography>
                                            <Typography><strong>Tuyến điều trị:</strong> {getTypeText(selectedRegimen.regimenType)}</Typography>
                                            <Typography><strong>Đối tượng:</strong> {getPopulationText(selectedRegimen.targetPopulation)}</Typography>
                                            <Typography><strong>Độ tuổi tối thiểu:</strong> {selectedRegimen.minAge} tuổi</Typography>
                                            <Typography><strong>Cân nặng tối thiểu:</strong> {selectedRegimen.minWeight} kg</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Tính an toàn
                                            </Typography>
                                            <Typography>
                                                <strong>Thai kỳ:</strong> {selectedRegimen.isPregnancySafe ? 'An toàn' : 'Không khuyến cáo'}
                                            </Typography>
                                            <Typography>
                                                <strong>Trẻ em:</strong> {selectedRegimen.isPediatricSafe ? 'An toàn' : 'Không khuyến cáo'}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Danh sách thuốc
                                            </Typography>
                                            <List dense>
                                                {selectedRegimen.drugs?.map((drug, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {drug.drugName}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={drug.drugClass}
                                                                        color={getDrugClassColor(drug.drugClass)}
                                                                        size="small"
                                                                    />
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Box>
                                                                    <Typography variant="body2">
                                                                        <strong>Liều dùng:</strong> {drug.dosage} - {drug.frequency}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <strong>Thời điểm:</strong> {drug.timing}
                                                                    </Typography>
                                                                    {drug.specialInstructions && (
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            <strong>Lưu ý:</strong> {drug.specialInstructions}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>

                                        {selectedRegimen.instructions && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Hướng dẫn sử dụng
                                                </Typography>
                                                <Alert severity="info" icon={<InfoIcon />}>
                                                    {selectedRegimen.instructions}
                                                </Alert>
                                            </Grid>
                                        )}

                                        {selectedRegimen.monitoring && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Theo dõi và giám sát
                                                </Typography>
                                                <Alert severity="warning">
                                                    {selectedRegimen.monitoring}
                                                </Alert>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>
                                Đóng
                            </Button>
                            {selectedRegimen && (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setOpenDialog(false);
                                            alert('Tính năng chỉnh sửa phác đồ sẽ được phát triển trong phiên bản tiếp theo');
                                        }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setOpenDialog(false);
                                            alert('Tính năng kê đơn sẽ được phát triển trong phiên bản tiếp theo');
                                        }}
                                    >
                                        Kê đơn cho bệnh nhân
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </Dialog>

                    {/* Create Regimen Dialog */}
                    <Dialog
                        open={createDialogOpen}
                        onClose={() => setCreateDialogOpen(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Tạo phác đồ ARV mới</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Tên phác đồ"
                                            value={newRegimen.name}
                                            onChange={(e) => setNewRegimen({ ...newRegimen, name: e.target.value })}
                                            placeholder="VD: TDF/3TC/EFV"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Tuyến điều trị</InputLabel>
                                            <Select
                                                value={newRegimen.lineOfTreatment}
                                                onChange={(e) => setNewRegimen({ ...newRegimen, lineOfTreatment: e.target.value })}
                                            >
                                                <MenuItem value="Tuyến 1">Tuyến 1</MenuItem>
                                                <MenuItem value="Tuyến 2">Tuyến 2</MenuItem>
                                                <MenuItem value="Tuyến 3">Tuyến 3</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Loại phác đồ</InputLabel>
                                            <Select
                                                value={newRegimen.category}
                                                onChange={(e) => setNewRegimen({ ...newRegimen, category: e.target.value })}
                                            >
                                                <MenuItem value="Điều trị ban đầu">Điều trị ban đầu</MenuItem>
                                                <MenuItem value="Điều trị thay thế">Điều trị thay thế</MenuItem>
                                                <MenuItem value="Điều trị cứu vãn">Điều trị cứu vãn</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Mô tả"
                                            value={newRegimen.description}
                                            onChange={(e) => setNewRegimen({ ...newRegimen, description: e.target.value })}
                                            placeholder="Mô tả chi tiết về phác đồ điều trị..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            Chọn thuốc ARV
                                        </Typography>
                                        <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                                            {drugs.map((drug) => (
                                                <Box key={drug.id} sx={{ mb: 1 }}>
                                                    <Button
                                                        variant={newRegimen.selectedDrugs.includes(drug.id.toString()) ? "contained" : "outlined"}
                                                        onClick={() => handleDrugSelection(drug.id.toString())}
                                                        fullWidth
                                                        sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                            <Typography>{drug.name}</Typography>
                                                            <Chip
                                                                label={drug.category || drug.drugClass}
                                                                size="small"
                                                                color={newRegimen.selectedDrugs.includes(drug.id.toString()) ? "secondary" : "default"}
                                                            />
                                                        </Box>
                                                    </Button>
                                                </Box>
                                            ))}
                                        </Paper>
                                        {newRegimen.selectedDrugs.length > 0 && (
                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                Đã chọn {newRegimen.selectedDrugs.length} thuốc
                                            </Alert>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCreateDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCreateRegimen}
                                disabled={!newRegimen.name || !newRegimen.description || newRegimen.selectedDrugs.length === 0 || loading}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo phác đồ'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Prescribe Regimen Dialog */}
                    <Dialog open={prescribeDialogOpen} onClose={() => setPrescribeDialogOpen(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            Kê đơn phác đồ cho bệnh nhân: {selectedPatient?.name}
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Chọn phác đồ ARV phù hợp cho bệnh nhân
                            </Typography>
                            <Grid container spacing={2}>
                                {regimens.filter(r => r.isActive).map((regimen) => (
                                    <Grid item xs={12} sm={6} key={regimen.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: 3 }
                                            }}
                                            onClick={() => handlePrescribeRegimenSubmit(regimen.id)}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {regimen.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {regimen.description}
                                                </Typography>
                                                <Chip
                                                    label={regimen.category}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip
                                                    label={regimen.lineOfTreatment}
                                                    size="small"
                                                    color="secondary"
                                                />
                                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                    {regimen.medications?.length || 0} thuốc
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setPrescribeDialogOpen(false)}>
                                Hủy
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            {currentTab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Danh sách bệnh nhân
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên bệnh nhân</TableCell>
                                    <TableCell>Lần khám cuối</TableCell>
                                    <TableCell>Tổng lượt khám</TableCell>
                                    <TableCell>Phác đồ hiện tại</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.map((patient) => (
                                    <TableRow key={patient.patientId}>
                                        <TableCell>{patient.patientName}</TableCell>
                                        <TableCell>{patient.lastAppointment}</TableCell>
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
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handlePrescribeRegimen(patient.patientId, patient.patientName)}
                                            >
                                                Kê đơn
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default ARVRegimenManagement;
