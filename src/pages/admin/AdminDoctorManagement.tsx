import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    ToggleOff as ToggleOffIcon,
    ToggleOn as ToggleOnIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    experience: number;
    bio: string;
    available: boolean;
    profileImage: string;
    createdAt: string;
    updatedAt?: string;
}

interface CreateDoctorData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    specialization: string;
    experience: number;
    bio: string;
}

const AdminDoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [actionType, setActionType] = useState<'view' | 'create' | 'edit' | 'delete'>('view');
    const [formData, setFormData] = useState<CreateDoctorData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        gender: 'male',
        dateOfBirth: '',
        specialization: '',
        experience: 0,
        bio: ''
    });

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [searchTerm, specializationFilter, availabilityFilter, doctors]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/AdminDoctor');
            if (response.data.success) {
                setDoctors(response.data.data || []);
            } else {
                console.error('Failed to load doctors:', response.data.message);
            }
        } catch (error) {
            console.error('Error loading doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = doctors;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by specialization
        if (specializationFilter !== 'all') {
            filtered = filtered.filter(doctor => doctor.specialization === specializationFilter);
        }

        // Filter by availability
        if (availabilityFilter !== 'all') {
            filtered = filtered.filter(doctor => 
                availabilityFilter === 'available' ? doctor.available : !doctor.available
            );
        }

        setFilteredDoctors(filtered);
    };

    const handleAction = (doctor: Doctor | null, action: 'view' | 'create' | 'edit' | 'delete') => {
        setSelectedDoctor(doctor);
        setActionType(action);
        
        if (action === 'create') {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                gender: 'male',
                dateOfBirth: '',
                specialization: '',
                experience: 0,
                bio: ''
            });
        } else if (action === 'edit' && doctor) {
            setFormData({
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                password: '',
                phone: doctor.phone,
                gender: 'male', // Default since we don't have this in doctor data
                dateOfBirth: '',
                specialization: doctor.specialization,
                experience: doctor.experience,
                bio: doctor.bio
            });
        }
        
        setOpenDialog(true);
    };

    const handleSubmit = async () => {
        try {
            if (actionType === 'create') {
                const response = await api.post('/AdminDoctor', formData);
                if (response.data.success) {
                    await loadDoctors();
                    setOpenDialog(false);
                    alert('Tạo bác sĩ thành công!');
                } else {
                    alert('Lỗi: ' + response.data.message);
                }
            } else if (actionType === 'edit' && selectedDoctor) {
                const updateData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    specialization: formData.specialization,
                    experience: formData.experience,
                    bio: formData.bio,
                    available: selectedDoctor.available
                };
                
                const response = await api.put(`/AdminDoctor/${selectedDoctor.id}`, updateData);
                if (response.data.success) {
                    await loadDoctors();
                    setOpenDialog(false);
                    alert('Cập nhật bác sĩ thành công!');
                } else {
                    alert('Lỗi: ' + response.data.message);
                }
            } else if (actionType === 'delete' && selectedDoctor) {
                const response = await api.delete(`/AdminDoctor/${selectedDoctor.id}`);
                if (response.data.success) {
                    await loadDoctors();
                    setOpenDialog(false);
                    alert('Xóa bác sĩ thành công!');
                } else {
                    alert('Lỗi: ' + response.data.message);
                }
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleAvailability = async (doctorId: string) => {
        try {
            const response = await api.put(`/AdminDoctor/${doctorId}/toggle-availability`);
            if (response.data.success) {
                await loadDoctors();
                alert(response.data.message);
            } else {
                alert('Lỗi: ' + response.data.message);
            }
        } catch (error: any) {
            console.error('Error toggling availability:', error);
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const getSpecializations = () => {
        const specializations = [...new Set(doctors.map(d => d.specialization))];
        return specializations;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Đang tải danh sách bác sĩ...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Quản lý bác sĩ
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Quản lý danh sách bác sĩ trong hệ thống
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleAction(null, 'create')}
                >
                    Thêm bác sĩ mới
                </Button>
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
                                        Tổng bác sĩ
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctors.length}
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
                                    <ToggleOnIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đang hoạt động
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctors.filter(d => d.available).length}
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
                                    <ToggleOffIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Không hoạt động
                                    </Typography>
                                    <Typography variant="h5">
                                        {doctors.filter(d => !d.available).length}
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
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chuyên khoa
                                    </Typography>
                                    <Typography variant="h5">
                                        {getSpecializations().length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm bác sĩ..."
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
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Chuyên khoa</InputLabel>
                            <Select
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                                label="Chuyên khoa"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {getSpecializations().map(spec => (
                                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="available">Đang hoạt động</MenuItem>
                                <MenuItem value="unavailable">Không hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setSpecializationFilter('all');
                                setAvailabilityFilter('all');
                            }}
                            fullWidth
                        >
                            Xóa bộ lọc
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Doctors Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bác sĩ</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Chuyên khoa</TableCell>
                            <TableCell>Kinh nghiệm</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDoctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {doctor.firstName} {doctor.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {doctor.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{doctor.email}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                                <TableCell>{doctor.experience} năm</TableCell>
                                <TableCell>
                                    <Chip
                                        label={doctor.available ? 'Hoạt động' : 'Không hoạt động'}
                                        color={doctor.available ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleAction(doctor, 'view')}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAction(doctor, 'edit')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={doctor.available ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                                            <IconButton
                                                size="small"
                                                color={doctor.available ? 'warning' : 'success'}
                                                onClick={() => handleToggleAvailability(doctor.id)}
                                            >
                                                {doctor.available ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleAction(doctor, 'delete')}
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

            {/* Action Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {actionType === 'create' && 'Thêm bác sĩ mới'}
                    {actionType === 'edit' && 'Chỉnh sửa bác sĩ'}
                    {actionType === 'view' && 'Chi tiết bác sĩ'}
                    {actionType === 'delete' && 'Xóa bác sĩ'}
                </DialogTitle>
                <DialogContent>
                    {actionType === 'delete' ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Bạn có chắc chắn muốn xóa bác sĩ <strong>{selectedDoctor?.firstName} {selectedDoctor?.lastName}</strong>?
                            <br />
                            Hành động này không thể hoàn tác.
                        </Alert>
                    ) : actionType === 'view' && selectedDoctor ? (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Họ tên:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</Typography>
                                    <Typography><strong>Email:</strong> {selectedDoctor.email}</Typography>
                                    <Typography><strong>Điện thoại:</strong> {selectedDoctor.phone}</Typography>
                                    <Typography><strong>Chuyên khoa:</strong> {selectedDoctor.specialization}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Kinh nghiệm:</strong> {selectedDoctor.experience} năm</Typography>
                                    <Typography><strong>Trạng thái:</strong> {selectedDoctor.available ? 'Hoạt động' : 'Không hoạt động'}</Typography>
                                    <Typography><strong>Ngày tạo:</strong> {formatDate(selectedDoctor.createdAt)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography><strong>Tiểu sử:</strong></Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>{selectedDoctor.bio}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tên"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        required
                                    />
                                </Grid>
                                {actionType === 'create' && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Mật khẩu"
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Giới tính</InputLabel>
                                                <Select
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                                    label="Giới tính"
                                                >
                                                    <MenuItem value="male">Nam</MenuItem>
                                                    <MenuItem value="female">Nữ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Ngày sinh"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Chuyên khoa"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Kinh nghiệm (năm)"
                                        type="number"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                                        inputProps={{ min: 0, max: 50 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tiểu sử"
                                        multiline
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Hủy
                    </Button>
                    {actionType !== 'view' && (
                        <Button onClick={handleSubmit} variant="contained">
                            {actionType === 'create' && 'Tạo bác sĩ'}
                            {actionType === 'edit' && 'Cập nhật'}
                            {actionType === 'delete' && 'Xóa'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDoctorManagement;
