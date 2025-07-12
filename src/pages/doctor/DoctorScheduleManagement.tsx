import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Tooltip,
    Alert,
    Divider,
    Avatar
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as TimeIcon,
    Event as EventIcon,
    CheckCircle as AvailableIcon,
    Cancel as UnavailableIcon,
    LocalHospital as SickIcon,
    BeachAccess as VacationIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';

// Mock schedule data
const mockScheduleData = [
    {
        id: '1',
        dayOfWeek: 'monday',
        dayName: 'Thứ Hai',
        shifts: [
            { id: '1', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'available' },
            { id: '2', startTime: '13:00', endTime: '17:00', type: 'afternoon', status: 'available' }
        ]
    },
    {
        id: '2',
        dayOfWeek: 'tuesday',
        dayName: 'Thứ Ba',
        shifts: [
            { id: '3', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'available' },
            { id: '4', startTime: '13:00', endTime: '17:00', type: 'afternoon', status: 'unavailable' }
        ]
    },
    {
        id: '3',
        dayOfWeek: 'wednesday',
        dayName: 'Thứ Tư',
        shifts: [
            { id: '5', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'available' },
            { id: '6', startTime: '13:00', endTime: '17:00', type: 'afternoon', status: 'available' }
        ]
    },
    {
        id: '4',
        dayOfWeek: 'thursday',
        dayName: 'Thứ Năm',
        shifts: [
            { id: '7', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'sick' },
            { id: '8', startTime: '13:00', endTime: '17:00', type: 'afternoon', status: 'sick' }
        ]
    },
    {
        id: '5',
        dayOfWeek: 'friday',
        dayName: 'Thứ Sáu',
        shifts: [
            { id: '9', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'available' },
            { id: '10', startTime: '13:00', endTime: '17:00', type: 'afternoon', status: 'vacation' }
        ]
    },
    {
        id: '6',
        dayOfWeek: 'saturday',
        dayName: 'Thứ Bảy',
        shifts: [
            { id: '11', startTime: '08:00', endTime: '12:00', type: 'morning', status: 'available' }
        ]
    },
    {
        id: '7',
        dayOfWeek: 'sunday',
        dayName: 'Chủ Nhật',
        shifts: []
    }
];

const DoctorScheduleManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [schedule, setSchedule] = useState(mockScheduleData);
    const [selectedWeek, setSelectedWeek] = useState('current');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete'>('add');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'unavailable':
                return 'error';
            case 'sick':
                return 'warning';
            case 'vacation':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Có thể khám';
            case 'unavailable':
                return 'Không có mặt';
            case 'sick':
                return 'Nghỉ ốm';
            case 'vacation':
                return 'Nghỉ phép';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available':
                return <AvailableIcon />;
            case 'unavailable':
                return <UnavailableIcon />;
            case 'sick':
                return <SickIcon />;
            case 'vacation':
                return <VacationIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const handleAddShift = (day: any) => {
        setSelectedDay(day);
        setSelectedShift(null);
        setActionType('add');
        setOpenDialog(true);
    };

    const handleEditShift = (day: any, shift: any) => {
        setSelectedDay(day);
        setSelectedShift(shift);
        setActionType('edit');
        setOpenDialog(true);
    };

    const handleDeleteShift = (dayId: string, shiftId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ca làm việc này?')) {
            const updatedSchedule = schedule.map(day => {
                if (day.id === dayId) {
                    return {
                        ...day,
                        shifts: day.shifts.filter(shift => shift.id !== shiftId)
                    };
                }
                return day;
            });
            setSchedule(updatedSchedule);
        }
    };

    const handleSaveShift = () => {
        // Mock save functionality
        setOpenDialog(false);
        alert('Lịch làm việc đã được cập nhật!');
    };

    const getTotalHours = () => {
        return schedule.reduce((total, day) => {
            return total + day.shifts.reduce((dayTotal, shift) => {
                if (shift.status === 'available') {
                    const start = new Date(`2024-01-01 ${shift.startTime}`);
                    const end = new Date(`2024-01-01 ${shift.endTime}`);
                    return dayTotal + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }
                return dayTotal;
            }, 0);
        }, 0);
    };

    const getAvailableDays = () => {
        return schedule.filter(day =>
            day.shifts.some(shift => shift.status === 'available')
        ).length;
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý lịch làm việc
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Quản lý ca trực và thời gian làm việc của bác sĩ {user?.name}
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <TimeIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tổng giờ làm việc
                                    </Typography>
                                    <Typography variant="h5">
                                        {getTotalHours()}h/tuần
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
                                    <AvailableIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Ngày có thể khám
                                    </Typography>
                                    <Typography variant="h5">
                                        {getAvailableDays()}/7 ngày
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
                                    <EventIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Ca làm việc
                                    </Typography>
                                    <Typography variant="h5">
                                        {schedule.reduce((total, day) => total + day.shifts.length, 0)} ca
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
                                    <ScheduleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tuần hiện tại
                                    </Typography>
                                    <Typography variant="h6">
                                        15-21/01/2024
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Week Selector */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Chọn tuần</InputLabel>
                            <Select
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                label="Chọn tuần"
                            >
                                <MenuItem value="previous">Tuần trước</MenuItem>
                                <MenuItem value="current">Tuần này</MenuItem>
                                <MenuItem value="next">Tuần sau</MenuItem>
                                <MenuItem value="custom">Tùy chỉnh</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Alert severity="info" sx={{ py: 0.5 }}>
                            Lịch làm việc tuần từ 15/01 - 21/01/2024
                        </Alert>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => alert('Tính năng tạo template lịch làm việc sẽ được phát triển')}
                            fullWidth
                        >
                            Tạo template
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Schedule Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ngày trong tuần</TableCell>
                            <TableCell>Ca sáng (8:00-12:00)</TableCell>
                            <TableCell>Ca chiều (13:00-17:00)</TableCell>
                            <TableCell>Tổng giờ</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedule.map((day) => {
                            const morningShift = day.shifts.find(shift => shift.type === 'morning');
                            const afternoonShift = day.shifts.find(shift => shift.type === 'afternoon');
                            const totalHours = day.shifts.reduce((total, shift) => {
                                if (shift.status === 'available') {
                                    const start = new Date(`2024-01-01 ${shift.startTime}`);
                                    const end = new Date(`2024-01-01 ${shift.endTime}`);
                                    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                }
                                return total;
                            }, 0);

                            return (
                                <TableRow key={day.id}>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {day.dayName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {morningShift ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    icon={getStatusIcon(morningShift.status)}
                                                    label={`${morningShift.startTime}-${morningShift.endTime}`}
                                                    color={getStatusColor(morningShift.status)}
                                                    size="small"
                                                />
                                                <Typography variant="caption">
                                                    {getStatusText(morningShift.status)}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Không có ca
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {afternoonShift ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    icon={getStatusIcon(afternoonShift.status)}
                                                    label={`${afternoonShift.startTime}-${afternoonShift.endTime}`}
                                                    color={getStatusColor(afternoonShift.status)}
                                                    size="small"
                                                />
                                                <Typography variant="caption">
                                                    {getStatusText(afternoonShift.status)}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Không có ca
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {totalHours}h
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Thêm ca làm việc">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleAddShift(day)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {day.shifts.length > 0 && (
                                                <Tooltip title="Chỉnh sửa lịch">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => handleEditShift(day, day.shifts[0])}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Schedule Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === 'add' ? 'Thêm ca làm việc' : 'Chỉnh sửa ca làm việc'}
                    {selectedDay && ` - ${selectedDay.dayName}`}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Giờ bắt đầu"
                                    type="time"
                                    defaultValue={selectedShift?.startTime || '08:00'}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Giờ kết thúc"
                                    type="time"
                                    defaultValue={selectedShift?.endTime || '12:00'}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        defaultValue={selectedShift?.status || 'available'}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="available">Có thể khám</MenuItem>
                                        <MenuItem value="unavailable">Không có mặt</MenuItem>
                                        <MenuItem value="sick">Nghỉ ốm</MenuItem>
                                        <MenuItem value="vacation">Nghỉ phép</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ghi chú"
                                    multiline
                                    rows={3}
                                    placeholder="Ghi chú về ca làm việc..."
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveShift} variant="contained">
                        {actionType === 'add' ? 'Thêm ca' : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Quick Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => alert('Tính năng copy lịch tuần trước sẽ được phát triển')}
                >
                    Copy lịch tuần trước
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => alert('Tính năng xuất lịch làm việc sẽ được phát triển')}
                >
                    Xuất lịch làm việc
                </Button>
                <Button
                    variant="contained"
                    onClick={() => alert('Lịch làm việc đã được lưu!')}
                >
                    Lưu thay đổi
                </Button>
            </Box>
        </Box>
    );
};

export default DoctorScheduleManagement;
