import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Tooltip,
    Avatar,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Assignment as AssignIcon,
    Visibility as ViewIcon,
    Archive as ArchiveIcon,
    PriorityHigh as HighPriorityIcon,
    Schedule as ClockIcon,
    CheckCircle as CompletedIcon,
    Person as PersonIcon,
    Reply as ReplyIcon
} from '@mui/icons-material';
import { consultationService } from '../../services/consultationService';
import { Consultation } from '../../types';
import doctorService, { DoctorSimple } from '../../services/doctorService';

// Remove duplicate interface - using imported Consultation type

// Mock data
const mockConsultations: Consultation[] = [
    {
        id: '1',
        question: 'Tôi có thể làm xét nghiệm HIV ở đâu? Chi phí như thế nào?',
        submittedAt: '2024-01-15T08:30:00',
        priority: 'high',
        status: 'pending',
        category: 'Xét nghiệm',
        isAnonymous: true
    },
    {
        id: '2',
        question: 'Thuốc ARV có tác dụng phụ gì không? Tôi đang lo lắng về việc này.',
        submittedAt: '2024-01-15T10:15:00',
        priority: 'medium',
        status: 'assigned',
        assignedDoctor: 'BS. Trần Thị B',
        category: 'Điều trị',
        isAnonymous: false,
        patientName: 'Nguyễn Văn A'
    },
    {
        id: '3',
        question: 'Làm thế nào để phòng ngừa HIV hiệu quả nhất?',
        submittedAt: '2024-01-14T14:20:00',
        priority: 'low',
        status: 'answered',
        assignedDoctor: 'BS. Phạm Văn D',
        response: 'Để phòng ngừa HIV hiệu quả, bạn nên: 1) Sử dụng bao cao su khi quan hệ tình dục...',
        responseAt: '2024-01-14T16:30:00',
        category: 'Phòng ngừa',
        isAnonymous: true
    },
    {
        id: '4',
        question: 'Tôi vừa có quan hệ không an toàn, cần làm gì ngay?',
        submittedAt: '2024-01-15T12:45:00',
        priority: 'high',
        status: 'assigned',
        assignedDoctor: 'BS. Nguyễn Thị F',
        category: 'Cấp cứu',
        isAnonymous: true
    }
];

// Mock doctors removed - now using real data from doctorService

const StaffConsultationManagement: React.FC = () => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
    const [actionType, setActionType] = useState<'assign' | 'view' | 'archive' | 'reply'>('view');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<DoctorSimple[]>([]);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Load consultations and doctors from database
    useEffect(() => {
        loadConsultations();
        loadDoctors();
    }, []);

    useEffect(() => {
        filterConsultations();
    }, [statusFilter, priorityFilter, categoryFilter, selectedTab, consultations]);

    const loadConsultations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get all consultations for staff management
            const allConsultations = await consultationService.getPendingConsultations();
            const answeredConsultations = await consultationService.getAnsweredConsultations();

            // Combine all consultations
            const combinedConsultations = [...allConsultations, ...answeredConsultations];
            console.log('Loaded consultations for staff:', combinedConsultations);

            setConsultations(combinedConsultations);
        } catch (err) {
            console.error('Error loading consultations:', err);
            setError('Không thể tải danh sách tư vấn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        try {
            const doctorsList = await doctorService.getSimpleDoctors();
            console.log('Loaded doctors for staff:', doctorsList);
            setDoctors(doctorsList);
        } catch (err) {
            console.error('Error loading doctors:', err);
            // Keep empty array if error
        }
    };

    const filterConsultations = () => {
        let filtered = consultations;

        // Filter by tab
        if (selectedTab === 1) {
            filtered = filtered.filter(cons => cons.status === 'pending');
        } else if (selectedTab === 2) {
            filtered = filtered.filter(cons => cons.status === 'assigned');
        } else if (selectedTab === 3) {
            filtered = filtered.filter(cons => cons.priority === 'high');
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(cons => cons.status === statusFilter);
        }

        // Filter by priority
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(cons => cons.priority === priorityFilter);
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(cons => cons.category === categoryFilter);
        }

        setFilteredConsultations(filtered);
    };

    const handleAction = (consultation: Consultation, action: 'assign' | 'view' | 'archive' | 'reply') => {
        setSelectedConsultation(consultation);
        setActionType(action);
        setSelectedDoctor(''); // Reset doctor selection
        setResponse(consultation.response || ''); // Set existing response if any
        setOpenDialog(true);
    };

    const handleReply = async () => {
        if (!selectedConsultation || !response.trim()) {
            return;
        }

        try {
            setLoading(true);

            // Submit answer using consultation service
            const updatedConsultation = await consultationService.answerConsultation(
                selectedConsultation.id,
                response.trim(),
                'staff-001' // Staff ID - should get from auth context
            );

            if (updatedConsultation) {
                // Update local state
                setConsultations(prev =>
                    prev.map(cons =>
                        cons.id === selectedConsultation.id
                            ? { ...cons, status: 'answered', response: response.trim() }
                            : cons
                    )
                );

                // Close dialog and reset
                setOpenDialog(false);
                setResponse('');
                setSelectedConsultation(null);

                console.log('Response sent successfully by staff');
            }
        } catch (err) {
            console.error('Error sending response:', err);
            setError('Không thể gửi câu trả lời. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAction = () => {
        if (!selectedConsultation) return;

        const updatedConsultations = consultations.map(cons => {
            if (cons.id === selectedConsultation.id) {
                switch (actionType) {
                    case 'assign':
                        return {
                            ...cons,
                            status: 'assigned' as const,
                            assignedDoctor: selectedDoctor
                        };
                    case 'archive':
                        return { ...cons, status: 'archived' as const };
                    default:
                        return cons;
                }
            }
            return cons;
        });

        setConsultations(updatedConsultations);
        setOpenDialog(false);
        setSelectedConsultation(null);
        setSelectedDoctor('');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'assigned':
                return 'info';
            case 'answered':
                return 'success';
            case 'archived':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'assigned':
                return 'Đã phân công';
            case 'answered':
                return 'Đã trả lời';
            case 'archived':
                return 'Đã lưu trữ';
            default:
                return status;
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'Cao';
            case 'medium':
                return 'Trung bình';
            case 'low':
                return 'Thấp';
            default:
                return priority;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const getActionTitle = () => {
        switch (actionType) {
            case 'assign':
                return 'Phân công tư vấn';
            case 'archive':
                return 'Lưu trữ tư vấn';
            case 'view':
                return 'Chi tiết tư vấn';
            default:
                return '';
        }
    };

    // Get unique categories for filter
    const uniqueCategories = Array.from(new Set(consultations.map(cons => cons.category)));

    // Computed values for statistics
    const pendingConsultations = consultations.filter(cons => cons.status === 'pending');
    const answeredConsultations = consultations.filter(cons => cons.status === 'answered');
    const assignedConsultations = consultations.filter(cons => cons.status === 'assigned');
    const highPriorityConsultations = consultations.filter(cons => cons.status === 'pending'); // All pending for now

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý tư vấn
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Xem và quản lý tất cả câu hỏi tư vấn từ bệnh nhân
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
                </Box>
            )}

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
                                        Tổng tư vấn
                                    </Typography>
                                    <Typography variant="h5">
                                        {consultations.length}
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
                                    <ClockIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chờ xử lý
                                    </Typography>
                                    <Typography variant="h5">
                                        {pendingConsultations.length}
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
                                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                                    <HighPriorityIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Ưu tiên cao
                                    </Typography>
                                    <Typography variant="h5">
                                        {consultations.filter(cons => cons.priority === 'high').length}
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
                                    <CompletedIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đã trả lời
                                    </Typography>
                                    <Typography variant="h5">
                                        {consultations.filter(cons => cons.status === 'answered').length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Tất cả" />
                    <Tab label="Chờ xử lý" />
                    <Tab label="Đã phân công" />
                    <Tab label="Ưu tiên cao" />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="pending">Chờ xử lý</MenuItem>
                                <MenuItem value="assigned">Đã phân công</MenuItem>
                                <MenuItem value="answered">Đã trả lời</MenuItem>
                                <MenuItem value="archived">Đã lưu trữ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Độ ưu tiên</InputLabel>
                            <Select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                label="Độ ưu tiên"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="high">Cao</MenuItem>
                                <MenuItem value="medium">Trung bình</MenuItem>
                                <MenuItem value="low">Thấp</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Danh mục</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Danh mục"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {uniqueCategories.map(category => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setStatusFilter('all');
                                setPriorityFilter('all');
                                setCategoryFilter('all');
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Consultations Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Câu hỏi</TableCell>
                            <TableCell>Người gửi</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Độ ưu tiên</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Bác sĩ phụ trách</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredConsultations.map((consultation) => (
                            <TableRow key={consultation.id}>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography variant="body2" noWrap>
                                        {consultation.question}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {consultation.patientName || 'Bệnh nhân'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{consultation.category}</TableCell>
                                <TableCell>
                                    <Chip
                                        label="Bình thường"
                                        color="default"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(consultation.status)}
                                        color={getStatusColor(consultation.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {consultation.responderName || '-'}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption">
                                        {new Date(consultation.createdAt).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleAction(consultation, 'view')}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {consultation.status === 'pending' && (
                                            <>
                                                <Tooltip title="Trả lời">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleAction(consultation, 'reply')}
                                                    >
                                                        <ReplyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Phân công">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => handleAction(consultation, 'assign')}
                                                    >
                                                        <AssignIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {consultation.status === 'answered' && (
                                            <Tooltip title="Lưu trữ">
                                                <IconButton
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() => handleAction(consultation, 'archive')}
                                                >
                                                    <ArchiveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{getActionTitle()}</DialogTitle>
                <DialogContent>
                    {selectedConsultation && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Câu hỏi:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                {selectedConsultation.question}
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Người gửi:</strong> {selectedConsultation.patientName || 'Bệnh nhân'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Danh mục:</strong> {selectedConsultation.category}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Trạng thái:</strong> {getStatusText(selectedConsultation.status)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Thời gian gửi:</strong> {new Date(selectedConsultation.createdAt).toLocaleString('vi-VN')}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {selectedConsultation.response && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Câu trả lời:
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                                        {selectedConsultation.response}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Trả lời bởi {selectedConsultation.assignedDoctor} lúc {selectedConsultation.responseAt && formatDate(selectedConsultation.responseAt)}
                                    </Typography>
                                </>
                            )}

                            {actionType === 'assign' && (
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel>Chọn bác sĩ</InputLabel>
                                    <Select
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                        label="Chọn bác sĩ"
                                    >
                                        {doctors.map(doctor => (
                                            <MenuItem key={doctor.id} value={doctor.id}>
                                                {doctor.name} - {doctor.specialization}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {actionType === 'reply' && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Câu trả lời của bạn:
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Nhập câu trả lời cho bệnh nhân..."
                                        variant="outlined"
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {actionType === 'view' ? 'Đóng' : 'Hủy'}
                    </Button>
                    {actionType === 'reply' && (
                        <Button
                            onClick={handleReply}
                            color="primary"
                            variant="contained"
                            disabled={!response.trim()}
                        >
                            Gửi câu trả lời
                        </Button>
                    )}
                    {actionType !== 'view' && actionType !== 'reply' && (
                        <Button
                            onClick={handleConfirmAction}
                            color="primary"
                            variant="contained"
                            disabled={actionType === 'assign' && !selectedDoctor}
                        >
                            {actionType === 'assign' ? 'Phân công' : 'Lưu trữ'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaffConsultationManagement;
