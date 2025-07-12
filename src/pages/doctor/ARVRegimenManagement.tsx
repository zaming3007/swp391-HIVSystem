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
    Tooltip
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
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [populationFilter, setPopulationFilter] = useState('all');
    const [selectedRegimen, setSelectedRegimen] = useState<ARVRegimen | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterRegimens();
    }, [searchTerm, typeFilter, populationFilter, regimens]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [regimensData, drugsData] = await Promise.all([
                arvService.getRegimens(),
                arvService.getDrugs()
            ]);
            setRegimens(regimensData);
            setDrugs(drugsData);
        } catch (error) {
            console.error('Error loading data:', error);
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

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý phác đồ ARV
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Tạo và quản lý các phác đồ điều trị ARV cho bệnh nhân
                </Typography>
            </Box>

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
                            onClick={() => alert('Tính năng tạo phác đồ sẽ được phát triển trong phiên bản tiếp theo')}
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
        </Box>
    );
};

export default ARVRegimenManagement;
