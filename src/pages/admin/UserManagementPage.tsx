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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    Grid,
    Card,
    CardContent,
    Alert,
    Snackbar,
    Tooltip,
    InputAdornment,
    Stack,
    Tabs,
    Tab
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    PersonAdd as PersonAddIcon,
    Visibility as ViewIcon,
    Block as BlockIcon,
    CheckCircle as ActiveIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    LocalHospital as DoctorIcon,
    Support as StaffIcon,
    People as CustomerIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'admin' | 'staff' | 'doctor' | 'customer';
    gender: string;
    dateOfBirth: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}

interface UserStats {
    totalUsers: number;
    totalCustomers: number;
    totalDoctors: number;
    totalStaff: number;
    totalAdmins: number;
    newUsersThisMonth: number;
}

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({
        totalUsers: 0,
        totalCustomers: 0,
        totalDoctors: 0,
        totalStaff: 0,
        totalAdmins: 0,
        newUsersThisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Table pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [selectedTab, setSelectedTab] = useState(0);

    // Dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'customer' as User['role'],
        gender: 'male',
        dateOfBirth: '',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchUserStats();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter, selectedTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Users');
            setUsers(response.data);
        } catch (error: any) {
            setError('Không thể tải danh sách người dùng');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await api.get('/Users/stats');
            setUserStats(response.data);
        } catch (error: any) {
            console.error('Error fetching user stats:', error);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm)
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Filter by tab
        if (selectedTab === 1) { // Customers
            filtered = filtered.filter(user => user.role === 'customer');
        } else if (selectedTab === 2) { // Staff
            filtered = filtered.filter(user => user.role === 'staff');
        } else if (selectedTab === 3) { // Doctors
            filtered = filtered.filter(user => user.role === 'doctor');
        } else if (selectedTab === 4) { // Admins
            filtered = filtered.filter(user => user.role === 'admin');
        }

        setFilteredUsers(filtered);
    };

    // ✏️ DEMO: Admin chỉnh sửa thông tin user (email, role, etc.)
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            password: ''
        });
        setEditDialogOpen(true);
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setViewDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    // 👤 DEMO: Admin tạo user mới với role và thông tin đăng nhập
    const handleAddUser = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'customer',
            gender: 'male',
            dateOfBirth: '',
            password: ''
        });
        setAddDialogOpen(true);
    };

    const submitEditUser = async () => {
        if (!selectedUser) return;

        try {
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            await api.put(`/Users/${selectedUser.id}`, updateData);
            setSuccess('Cập nhật người dùng thành công');
            setEditDialogOpen(false);
            fetchUsers();
            fetchUserStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể cập nhật người dùng');
        }
    };

    const submitAddUser = async () => {
        try {
            await api.post('/Users', formData);
            setSuccess('Thêm người dùng thành công');
            setAddDialogOpen(false);
            fetchUsers();
            fetchUserStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể thêm người dùng');
        }
    };

    const submitDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            await api.delete(`/Users/${selectedUser.id}`);
            setSuccess('Xóa người dùng thành công');
            setDeleteDialogOpen(false);
            fetchUsers();
            fetchUserStats();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Không thể xóa người dùng');
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <AdminIcon />;
            case 'doctor': return <DoctorIcon />;
            case 'staff': return <StaffIcon />;
            case 'customer': return <CustomerIcon />;
            default: return <PersonIcon />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'doctor': return 'primary';
            case 'staff': return 'warning';
            case 'customer': return 'success';
            default: return 'default';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'doctor': return 'Bác sĩ';
            case 'staff': return 'Nhân viên';
            case 'customer': return 'Khách hàng';
            default: return role;
        }
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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Quản lý người dùng
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý tất cả người dùng trong hệ thống
                </Typography>
            </Box>

            {/* User Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.totalUsers}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng người dùng
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <CustomerIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.totalCustomers}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Khách hàng
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <DoctorIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.totalDoctors}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Bác sĩ
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <StaffIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.totalStaff}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Nhân viên
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                                    <AdminIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.totalAdmins}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Quản trị viên
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <PersonAddIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{userStats.newUsersThisMonth}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Mới tháng này
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
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
                        <InputLabel>Vai trò</InputLabel>
                        <Select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            label="Vai trò"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="customer">Khách hàng</MenuItem>
                            <MenuItem value="staff">Nhân viên</MenuItem>
                            <MenuItem value="doctor">Bác sĩ</MenuItem>
                            <MenuItem value="admin">Quản trị viên</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddUser}
                    >
                        Thêm người dùng
                    </Button>
                </Stack>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Tất cả" />
                    <Tab label="Khách hàng" />
                    <Tab label="Nhân viên" />
                    <Tab label="Bác sĩ" />
                    <Tab label="Quản trị viên" />
                </Tabs>
            </Paper>

            {/* Users Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Người dùng</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography>Đang tải...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography>Không có dữ liệu</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        src={user.profileImage}
                                                        sx={{ mr: 2, width: 40, height: 40 }}
                                                    >
                                                        {user.firstName.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {user.firstName} {user.lastName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ID: {user.id.slice(0, 8)}...
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                                    {user.email}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                                    {user.phone || 'Chưa có'}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getRoleIcon(user.role)}
                                                    label={getRoleLabel(user.role)}
                                                    color={getRoleColor(user.role) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Xem chi tiết">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewUser(user)}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteUser(user)}
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
                    count={filteredUsers.length}
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

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Họ"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tên"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                                    label="Vai trò"
                                >
                                    <MenuItem value="customer">Khách hàng</MenuItem>
                                    <MenuItem value="staff">Nhân viên</MenuItem>
                                    <MenuItem value="doctor">Bác sĩ</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    label="Giới tính"
                                >
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                    <MenuItem value="other">Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày sinh"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mật khẩu mới (để trống nếu không đổi)"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
                    <Button onClick={submitEditUser} variant="contained">Cập nhật</Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Họ"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tên"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                                    label="Vai trò"
                                >
                                    <MenuItem value="customer">Khách hàng</MenuItem>
                                    <MenuItem value="staff">Nhân viên</MenuItem>
                                    <MenuItem value="doctor">Bác sĩ</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    label="Giới tính"
                                >
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                    <MenuItem value="other">Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày sinh"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Hủy</Button>
                    <Button onClick={submitAddUser} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* View User Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết người dùng</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    src={selectedUser.profileImage}
                                    sx={{ width: 80, height: 80, mr: 2 }}
                                >
                                    {selectedUser.firstName.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </Typography>
                                    <Chip
                                        icon={getRoleIcon(selectedUser.role)}
                                        label={getRoleLabel(selectedUser.role)}
                                        color={getRoleColor(selectedUser.role) as any}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{selectedUser.email}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
                                    <Typography variant="body1">{selectedUser.phone || 'Chưa có'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Giới tính</Typography>
                                    <Typography variant="body1">
                                        {selectedUser.gender === 'male' ? 'Nam' : selectedUser.gender === 'female' ? 'Nữ' : 'Khác'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Ngày sinh</Typography>
                                    <Typography variant="body1">{formatDate(selectedUser.dateOfBirth)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
                                    <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Cập nhật lần cuối</Typography>
                                    <Typography variant="body1">{formatDate(selectedUser.updatedAt)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {selectedUser.id}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
                    <Button onClick={() => {
                        setViewDialogOpen(false);
                        if (selectedUser) handleEditUser(selectedUser);
                    }} variant="contained">
                        Chỉnh sửa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa người dùng{' '}
                        <strong>
                            {selectedUser?.firstName} {selectedUser?.lastName}
                        </strong>?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={submitDeleteUser} color="error" variant="contained">
                        Xóa
                    </Button>
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
        </Box>
    );
};

export default UserManagementPage;
