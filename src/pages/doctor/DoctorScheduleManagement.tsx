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
    Avatar,
    CircularProgress
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
import { RootState } from '../../store';
import doctorService, { DoctorScheduleDto } from '../../services/doctorService';

// Interface for schedule display
interface ScheduleDay {
    id: string;
    dayOfWeek: number;
    dayName: string;
    shifts: ScheduleShift[];
}

interface ScheduleShift {
    id: string;
    startTime: string;
    endTime: string;
    type: 'morning' | 'afternoon' | 'evening';
    status: 'available' | 'unavailable';
}

const DoctorScheduleManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState('current');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete'>('add');

    // Load doctor's schedule from database
    useEffect(() => {
        const loadDoctorSchedule = async () => {
            if (!user?.id) return;

            setLoading(true);
            try {
                const scheduleData = await doctorService.getDoctorSchedule(user.id);
                const formattedSchedule = formatScheduleData(scheduleData);
                setSchedule(formattedSchedule);
            } catch (error) {
                console.error('Error loading doctor schedule:', error);
                // Fallback to empty schedule
                setSchedule(getEmptySchedule());
            } finally {
                setLoading(false);
            }
        };

        loadDoctorSchedule();
    }, [user?.id]);

    // Convert API data to display format
    const formatScheduleData = (apiData: DoctorScheduleDto[]): ScheduleDay[] => {
        return apiData.map(day => ({
            id: day.id || day.dayOfWeek.toString(),
            dayOfWeek: day.dayOfWeek,
            dayName: day.dayName,
            shifts: day.timeSlots.map(slot => {
                const startHour = parseInt(slot.startTime.split(':')[0]);
                const type = startHour < 12 ? 'morning' : startHour < 17 ? 'afternoon' : 'evening';

                return {
                    id: slot.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    type: type as 'morning' | 'afternoon' | 'evening',
                    status: slot.isAvailable ? 'available' : 'unavailable'
                };
            })
        }));
    };

    // Get empty schedule template
    const getEmptySchedule = (): ScheduleDay[] => {
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return dayNames.map((dayName, index) => ({
            id: index.toString(),
            dayOfWeek: index,
            dayName,
            shifts: []
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'unavailable':
                return 'error';
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
            default:
                return <ScheduleIcon />;
        }
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

    const getCurrentWeekRange = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

        const formatDate = (date: Date) => {
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        };

        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}/${today.getFullYear()}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Đang tải lịch làm việc...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Lịch làm việc của tôi
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Xem lịch làm việc và ca trực của bác sĩ {user?.firstName} {user?.lastName}
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                    Đây là lịch làm việc chỉ xem. Để chỉnh sửa lịch làm việc, vui lòng liên hệ quản trị viên.
                </Alert>
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
                                        {getCurrentWeekRange()}
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
                            Lịch làm việc tuần từ {getCurrentWeekRange()}
                        </Alert>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="outlined"
                            startIcon={<ScheduleIcon />}
                            onClick={() => window.location.reload()}
                            fullWidth
                        >
                            Làm mới lịch
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
                            <TableCell>Ca sáng</TableCell>
                            <TableCell>Ca chiều</TableCell>
                            <TableCell>Tổng giờ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedule.map((day) => {
                            const morningShifts = day.shifts.filter(shift => shift.type === 'morning');
                            const afternoonShifts = day.shifts.filter(shift => shift.type === 'afternoon');
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
                                        {morningShifts.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                {morningShifts.map((shift, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            icon={getStatusIcon(shift.status)}
                                                            label={`${shift.startTime}-${shift.endTime}`}
                                                            color={getStatusColor(shift.status)}
                                                            size="small"
                                                        />
                                                        <Typography variant="caption">
                                                            {getStatusText(shift.status)}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Không có ca
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {afternoonShifts.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                {afternoonShifts.map((shift, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            icon={getStatusIcon(shift.status)}
                                                            label={`${shift.startTime}-${shift.endTime}`}
                                                            color={getStatusColor(shift.status)}
                                                            size="small"
                                                        />
                                                        <Typography variant="caption">
                                                            {getStatusText(shift.status)}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Không có ca
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {totalHours.toFixed(1)}h
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            Chỉ xem
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Quick Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => window.print()}
                >
                    In lịch làm việc
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                >
                    Làm mới dữ liệu
                </Button>
                <Button
                    variant="contained"
                    onClick={() => alert('Để chỉnh sửa lịch làm việc, vui lòng liên hệ quản trị viên.')}
                >
                    Yêu cầu chỉnh sửa
                </Button>
            </Box>
        </Box>
    );
};

export default DoctorScheduleManagement;
