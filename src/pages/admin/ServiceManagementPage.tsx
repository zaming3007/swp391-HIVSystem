import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Grid,
    Card,
    CardContent,
    Alert,
    Snackbar,
    Tooltip,
    InputAdornment,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    MedicalServices as MedicalServicesIcon,
    Visibility as ViewIcon,
    LocalHospital as LocalHospitalIcon,
    AttachMoney as AttachMoneyIcon,
    Category as CategoryIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    assignedDoctors?: Doctor[];
    doctorCount?: number;
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    email: string;
    available: boolean;
}

interface DoctorService {
    id: string;
    doctorId: string;
    serviceId: string;
    doctor: Doctor;
    service: Service;
}

interface ServiceStats {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    totalCategories: number;
    averagePrice: number;
}

const ServiceManagementPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [serviceStats, setServiceStats] = useState<ServiceStats>({
        totalServices: 0,
        activeServices: 0,
        inactiveServices: 0,
        totalCategories: 0,
        averagePrice: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Table pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [doctorAssignDialogOpen, setDoctorAssignDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: '',
        isActive: true
    });

    useEffect(() => {
        fetchServices();
        fetchServiceStats();
        fetchDoctors();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, categoryFilter, statusFilter]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Services/with-doctors');
            setServices(response.data);
        } catch (error: any) {
            setError('Không thể tải danh sách dịch vụ');
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/AdminDoctor');
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error: any) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchServiceStats = async () => {
        try {
            const response = await api.get('/Services/stats');
            setServiceStats(response.data);
        } catch (error: any) {
            console.error('Error fetching service stats:', error);
        }
    };

    const filterServices = () => {
        let filtered = services;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(service => service.category === categoryFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            filtered = filtered.filter(service => service.isActive === isActive);
        }

        setFilteredServices(filtered);
    };

    const handleEditService = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category,
            isActive: service.isActive
        });
        setEditDialogOpen(true);
    };

    const handleViewService = (service: Service) => {
        setSelectedService(service);
        setViewDialogOpen(true);
    };

    const handleDeleteService = (service: Service) => {
        setSelectedService(service);
        setDeleteDialogOpen(true);
    };

    const handleAddService = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            duration: 30,
            category: '',
            isActive: true
        });
        setAddDialogOpen(true);
    };

    const submitEditService = async () => {
        if (!selectedService) return;

        try {
            await api.put(`/Services/${selectedService.id}`, formData);
            setSuccess('Cập nhật dịch vụ thành công');
            setEditDialogOpen(false);
            fetchServices();
            fetchServiceStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể cập nhật dịch vụ');
        }
    };

    const submitAddService = async () => {
        try {
            await api.post('/Services', formData);
            setSuccess('Thêm dịch vụ thành công');
            setAddDialogOpen(false);
            fetchServices();
            fetchServiceStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể thêm dịch vụ');
        }
    };

    const submitDeleteService = async () => {
        if (!selectedService) return;

        try {
            await api.delete(`/Services/${selectedService.id}`);
            setSuccess('Xóa dịch vụ thành công');
            setDeleteDialogOpen(false);
            fetchServices();
            fetchServiceStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể xóa dịch vụ');
        }
    };

    const handleDoctorAssignment = (service: Service) => {
        setSelectedService(service);
        const assignedDoctorIds = service.assignedDoctors?.map(d => d.id) || [];
        setSelectedDoctorIds(assignedDoctorIds);
        setDoctorAssignDialogOpen(true);
    };

    const submitDoctorAssignment = async () => {
        if (!selectedService) return;

        try {
            await api.post(`/Services/${selectedService.id}/assign-doctors`, {
                doctorIds: selectedDoctorIds
            });
            setSuccess('Cập nhật phân công bác sĩ thành công');
            setDoctorAssignDialogOpen(false);
            fetchServices();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể cập nhật phân công bác sĩ');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUniqueCategories = () => {
        const categories = services.map(service => service.category);
        return [...new Set(categories)];
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    🏥 Quản lý dịch vụ
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý tất cả dịch vụ y tế trong hệ thống
                </Typography>
            </Box>

            {/* Service Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MedicalServicesIcon sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">{serviceStats.totalServices}</Typography>
                                    <Typography variant="body2">
                                        Tổng dịch vụ
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalHospitalIcon sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">{serviceStats.activeServices}</Typography>
                                    <Typography variant="body2">
                                        Đang hoạt động
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">{serviceStats.inactiveServices}</Typography>
                                    <Typography variant="body2">
                                        Tạm dừng
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">{serviceStats.totalCategories}</Typography>
                                    <Typography variant="body2">
                                        Danh mục
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        color: 'white',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">{serviceStats.averagePrice.toLocaleString('vi-VN')}đ</Typography>
                                    <Typography variant="body2">
                                        Giá trung bình
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        placeholder="Tìm kiếm theo tên, mô tả, danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1, minWidth: 300 }}
                    />
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Danh mục"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            {getUniqueCategories().map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Trạng thái"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="active">Hoạt động</MenuItem>
                            <MenuItem value="inactive">Tạm dừng</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddService}
                    >
                        Thêm dịch vụ
                    </Button>
                </Stack>
            </Paper>

            {/* Services Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dịch vụ</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Bác sĩ phụ trách</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography>Đang tải...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredServices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography>Không có dữ liệu</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredServices
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((service) => (
                                        <TableRow key={service.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 1,
                                                            mr: 2,
                                                            bgcolor: 'primary.main',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '20px'
                                                        }}
                                                    >
                                                        🏥
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {service.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {service.description.length > 50
                                                                ? service.description.substring(0, 50) + '...'
                                                                : service.description
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={service.category}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" color="primary">
                                                    {formatPrice(service.price)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {service.duration} phút
                                            </TableCell>
                                            <TableCell>
                                                {service.assignedDoctors && service.assignedDoctors.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {service.assignedDoctors.slice(0, 2).map((doctor) => (
                                                            <Chip
                                                                key={doctor.id}
                                                                label={`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                                                                size="small"
                                                                color="info"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                        {service.assignedDoctors.length > 2 && (
                                                            <Chip
                                                                label={`+${service.assignedDoctors.length - 2}`}
                                                                size="small"
                                                                color="default"
                                                            />
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Chip
                                                        label="Tất cả bác sĩ"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={service.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                    color={service.isActive ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(service.createdAt)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Xem chi tiết">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewService(service)}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Phân công bác sĩ">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDoctorAssignment(service)}
                                                        color="primary"
                                                    >
                                                        <PersonAddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditService(service)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteService(service)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredServices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />
            </Paper>

            {/* Add Service Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Thêm dịch vụ mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tên dịch vụ"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Danh mục"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Giá (VNĐ)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Thời gian (phút)"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value as boolean })}
                                    label="Trạng thái"
                                >
                                    <MenuItem value={true}>Hoạt động</MenuItem>
                                    <MenuItem value={false}>Tạm dừng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Hủy</Button>
                    <Button onClick={submitAddService} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbars */}
            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
            >
                <Alert onClose={() => setSuccess(null)} severity="success">
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            {/* Doctor Assignment Dialog */}
            <Dialog open={doctorAssignDialogOpen} onClose={() => setDoctorAssignDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Phân công bác sĩ cho dịch vụ: {selectedService?.name}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Chọn bác sĩ có thể thực hiện dịch vụ này. Nếu không chọn bác sĩ nào, tất cả bác sĩ sẽ có thể thực hiện dịch vụ.
                    </Typography>

                    <Grid container spacing={2}>
                        {doctors.map((doctor) => (
                            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedDoctorIds.includes(doctor.id) ? 2 : 1,
                                        borderColor: selectedDoctorIds.includes(doctor.id) ? 'primary.main' : 'divider',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: 2
                                        }
                                    }}
                                    onClick={() => {
                                        if (selectedDoctorIds.includes(doctor.id)) {
                                            setSelectedDoctorIds(prev => prev.filter(id => id !== doctor.id));
                                        } else {
                                            setSelectedDoctorIds(prev => [...prev, doctor.id]);
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                                                {(doctor.firstName || '').charAt(0)}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2" noWrap>
                                                    {`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {doctor.specialization}
                                                </Typography>
                                            </Box>
                                            {selectedDoctorIds.includes(doctor.id) && (
                                                <CheckCircleIcon color="primary" />
                                            )}
                                        </Box>
                                        <Chip
                                            label={doctor.available ? 'Hoạt động' : 'Tạm dừng'}
                                            color={doctor.available ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {selectedDoctorIds.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Đã chọn {selectedDoctorIds.length} bác sĩ:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedDoctorIds.map(doctorId => {
                                    const doctor = doctors.find(d => d.id === doctorId);
                                    return doctor ? (
                                        <Chip
                                            key={doctorId}
                                            label={`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                                            onDelete={() => setSelectedDoctorIds(prev => prev.filter(id => id !== doctorId))}
                                            color="primary"
                                            size="small"
                                        />
                                    ) : null;
                                })}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDoctorAssignDialogOpen(false)}>Hủy</Button>
                    <Button onClick={() => setSelectedDoctorIds([])}>Xóa tất cả</Button>
                    <Button onClick={submitDoctorAssignment} variant="contained">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ServiceManagementPage;
