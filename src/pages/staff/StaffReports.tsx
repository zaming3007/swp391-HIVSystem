import React, { useState } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    LinearProgress,
    Avatar,
    Divider
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    EventNote as AppointmentIcon,
    QuestionAnswer as ConsultationIcon,
    Article as BlogIcon,
    People as PeopleIcon,
    Assessment as ReportIcon,
    Download as DownloadIcon,
    DateRange as DateIcon
} from '@mui/icons-material';

// Mock data for reports
const mockMonthlyStats = {
    appointments: {
        total: 156,
        growth: 12.5,
        confirmed: 142,
        pending: 8,
        cancelled: 6
    },
    consultations: {
        total: 89,
        growth: -5.2,
        answered: 76,
        pending: 13
    },
    blogPosts: {
        total: 25,
        growth: 8.7,
        published: 23,
        draft: 2
    },
    users: {
        total: 234,
        growth: 15.3,
        active: 189,
        new: 45
    }
};

const mockAppointmentsByService = [
    { service: 'Tư vấn HIV', count: 45, percentage: 28.8 },
    { service: 'Xét nghiệm', count: 38, percentage: 24.4 },
    { service: 'Tái khám', count: 32, percentage: 20.5 },
    { service: 'Điều trị ARV', count: 25, percentage: 16.0 },
    { service: 'Tư vấn tâm lý', count: 16, percentage: 10.3 }
];

const mockConsultationsByCategory = [
    { category: 'Phòng ngừa', count: 28, percentage: 31.5 },
    { category: 'Điều trị', count: 24, percentage: 27.0 },
    { category: 'Xét nghiệm', count: 18, percentage: 20.2 },
    { category: 'Tâm lý', count: 12, percentage: 13.5 },
    { category: 'Khác', count: 7, percentage: 7.8 }
];

const mockTopDoctors = [
    { name: 'BS. Trần Thị B', appointments: 32, consultations: 18, rating: 4.8 },
    { name: 'BS. Phạm Văn D', appointments: 28, consultations: 15, rating: 4.7 },
    { name: 'BS. Nguyễn Thị F', appointments: 25, consultations: 12, rating: 4.6 },
    { name: 'BS. Lê Thị H', appointments: 22, consultations: 10, rating: 4.5 }
];

const StaffReports: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [selectedReport, setSelectedReport] = useState('overview');

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? 'success.main' : 'error.main';
    };

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
    };

    const handleExportReport = () => {
        // Mock export functionality
        alert('Báo cáo đã được xuất thành công!');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Báo cáo & Thống kê
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Tổng quan và phân tích dữ liệu hoạt động hệ thống
                </Typography>
            </Box>

            {/* Controls */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Khoảng thời gian</InputLabel>
                            <Select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                label="Khoảng thời gian"
                            >
                                <MenuItem value="thisWeek">Tuần này</MenuItem>
                                <MenuItem value="thisMonth">Tháng này</MenuItem>
                                <MenuItem value="lastMonth">Tháng trước</MenuItem>
                                <MenuItem value="thisQuarter">Quý này</MenuItem>
                                <MenuItem value="thisYear">Năm này</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Loại báo cáo</InputLabel>
                            <Select
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                label="Loại báo cáo"
                            >
                                <MenuItem value="overview">Tổng quan</MenuItem>
                                <MenuItem value="appointments">Lịch hẹn</MenuItem>
                                <MenuItem value="consultations">Tư vấn</MenuItem>
                                <MenuItem value="doctors">Bác sĩ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportReport}
                            fullWidth
                        >
                            Xuất báo cáo
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            startIcon={<DateIcon />}
                            fullWidth
                        >
                            Tùy chỉnh ngày
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Lịch hẹn
                                    </Typography>
                                    <Typography variant="h4">
                                        {mockMonthlyStats.appointments.total}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Box sx={{ color: getGrowthColor(mockMonthlyStats.appointments.growth), mr: 1 }}>
                                            {getGrowthIcon(mockMonthlyStats.appointments.growth)}
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: getGrowthColor(mockMonthlyStats.appointments.growth) }}
                                        >
                                            {Math.abs(mockMonthlyStats.appointments.growth)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <AppointmentIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tư vấn
                                    </Typography>
                                    <Typography variant="h4">
                                        {mockMonthlyStats.consultations.total}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Box sx={{ color: getGrowthColor(mockMonthlyStats.consultations.growth), mr: 1 }}>
                                            {getGrowthIcon(mockMonthlyStats.consultations.growth)}
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: getGrowthColor(mockMonthlyStats.consultations.growth) }}
                                        >
                                            {Math.abs(mockMonthlyStats.consultations.growth)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <ConsultationIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Bài viết Blog
                                    </Typography>
                                    <Typography variant="h4">
                                        {mockMonthlyStats.blogPosts.total}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Box sx={{ color: getGrowthColor(mockMonthlyStats.blogPosts.growth), mr: 1 }}>
                                            {getGrowthIcon(mockMonthlyStats.blogPosts.growth)}
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: getGrowthColor(mockMonthlyStats.blogPosts.growth) }}
                                        >
                                            {Math.abs(mockMonthlyStats.blogPosts.growth)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <BlogIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Người dùng
                                    </Typography>
                                    <Typography variant="h4">
                                        {mockMonthlyStats.users.total}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Box sx={{ color: getGrowthColor(mockMonthlyStats.users.growth), mr: 1 }}>
                                            {getGrowthIcon(mockMonthlyStats.users.growth)}
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: getGrowthColor(mockMonthlyStats.users.growth) }}
                                        >
                                            {Math.abs(mockMonthlyStats.users.growth)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <PeopleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detailed Reports */}
            <Grid container spacing={3}>
                {/* Appointments by Service */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Lịch hẹn theo dịch vụ
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dịch vụ</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Tỷ lệ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockAppointmentsByService.map((item) => (
                                        <TableRow key={item.service}>
                                            <TableCell>{item.service}</TableCell>
                                            <TableCell align="right">{item.count}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Box sx={{ width: 60, mr: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={item.percentage} 
                                                        />
                                                    </Box>
                                                    <Typography variant="body2">
                                                        {item.percentage}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Consultations by Category */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Tư vấn theo danh mục
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Danh mục</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Tỷ lệ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockConsultationsByCategory.map((item) => (
                                        <TableRow key={item.category}>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell align="right">{item.count}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Box sx={{ width: 60, mr: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={item.percentage} 
                                                            color="secondary"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2">
                                                        {item.percentage}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Top Doctors Performance */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Hiệu suất bác sĩ
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bác sĩ</TableCell>
                                        <TableCell align="right">Lịch hẹn</TableCell>
                                        <TableCell align="right">Tư vấn</TableCell>
                                        <TableCell align="right">Đánh giá</TableCell>
                                        <TableCell align="right">Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockTopDoctors.map((doctor) => (
                                        <TableRow key={doctor.name}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                        {doctor.name.split(' ').pop()?.charAt(0)}
                                                    </Avatar>
                                                    {doctor.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">{doctor.appointments}</TableCell>
                                            <TableCell align="right">{doctor.consultations}</TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={`${doctor.rating}/5.0`}
                                                    color={doctor.rating >= 4.5 ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label="Hoạt động"
                                                    color="success"
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StaffReports;
