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
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Avatar,
    Tooltip,
    Alert,
    Divider,
    TextareaAutosize
} from '@mui/material';
import {
    Search as SearchIcon,
    Reply as ReplyIcon,
    Visibility as ViewIcon,
    Send as SendIcon,
    QuestionAnswer as QuestionIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CompletedIcon,
    PriorityHigh as HighPriorityIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';

// Mock data for consultations assigned to doctor
const mockConsultations = [
    {
        id: '1',
        patientId: '4',
        patientName: 'Nguyễn Văn A',
        isAnonymous: false,
        question: 'Tôi có thể ngừng uống thuốc ARV được không? Tôi cảm thấy khỏe mạnh rồi.',
        submittedAt: '2024-01-15T08:30:00',
        priority: 'high',
        category: 'Điều trị',
        status: 'assigned',
        assignedAt: '2024-01-15T09:00:00',
        response: null,
        responseAt: null
    },
    {
        id: '2',
        patientId: '5',
        patientName: 'Trần Thị B',
        isAnonymous: false,
        question: 'Kết quả xét nghiệm viral load của tôi có bình thường không? Số liệu là 50 copies/ml.',
        submittedAt: '2024-01-14T14:20:00',
        priority: 'medium',
        category: 'Xét nghiệm',
        status: 'assigned',
        assignedAt: '2024-01-14T15:00:00',
        response: null,
        responseAt: null
    },
    {
        id: '3',
        patientId: null,
        patientName: null,
        isAnonymous: true,
        question: 'Tôi bị tác dụng phụ từ thuốc ARV như buồn nôn và chóng mặt. Phải làm sao?',
        submittedAt: '2024-01-13T16:45:00',
        priority: 'high',
        category: 'Điều trị',
        status: 'assigned',
        assignedAt: '2024-01-13T17:00:00',
        response: null,
        responseAt: null
    },
    {
        id: '4',
        patientId: '6',
        patientName: 'Lê Văn C',
        isAnonymous: false,
        question: 'Tôi có thể uống rượu khi đang điều trị ARV không?',
        submittedAt: '2024-01-12T11:30:00',
        priority: 'medium',
        category: 'Điều trị',
        status: 'answered',
        assignedAt: '2024-01-12T12:00:00',
        response: 'Không nên uống rượu khi đang điều trị ARV vì có thể ảnh hưởng đến hiệu quả thuốc và gây tác dụng phụ. Rượu có thể làm tăng độc tính gan và giảm khả năng hấp thu thuốc.',
        responseAt: '2024-01-12T14:30:00'
    },
    {
        id: '5',
        patientId: null,
        patientName: null,
        isAnonymous: true,
        question: 'Làm thế nào để phòng ngừa HIV hiệu quả nhất?',
        submittedAt: '2024-01-11T09:15:00',
        priority: 'low',
        category: 'Phòng ngừa',
        status: 'answered',
        assignedAt: '2024-01-11T10:00:00',
        response: 'Để phòng ngừa HIV hiệu quả: 1) Sử dụng bao cao su khi quan hệ tình dục, 2) Không chia sẻ kim tiêm, 3) Xét nghiệm định kỳ, 4) PrEP cho nhóm nguy cơ cao, 5) Điều trị dự phòng sau phơi nhiễm nếu cần.',
        responseAt: '2024-01-11T16:20:00'
    }
];

const DoctorConsultationManagement: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [consultations, setConsultations] = useState(mockConsultations);
    const [filteredConsultations, setFilteredConsultations] = useState(mockConsultations);
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState<'view' | 'reply'>('view');
    const [response, setResponse] = useState('');

    useEffect(() => {
        filterConsultations();
    }, [selectedTab, searchTerm, priorityFilter, categoryFilter, consultations]);

    const filterConsultations = () => {
        let filtered = consultations;

        // Filter by tab
        if (selectedTab === 1) {
            filtered = filtered.filter(cons => cons.status === 'assigned');
        } else if (selectedTab === 2) {
            filtered = filtered.filter(cons => cons.priority === 'high');
        } else if (selectedTab === 3) {
            filtered = filtered.filter(cons => cons.status === 'answered');
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(cons =>
                cons.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cons.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cons.patientName && cons.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
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

    const handleAction = (consultation: any, action: 'view' | 'reply') => {
        setSelectedConsultation(consultation);
        setActionType(action);
        setResponse(consultation.response || '');
        setOpenDialog(true);
    };

    const handleSendResponse = () => {
        if (!selectedConsultation || !response.trim()) return;

        const updatedConsultations = consultations.map(cons => {
            if (cons.id === selectedConsultation.id) {
                return {
                    ...cons,
                    status: 'answered',
                    response: response.trim(),
                    responseAt: new Date().toISOString()
                };
            }
            return cons;
        });

        setConsultations(updatedConsultations);
        setOpenDialog(false);
        setSelectedConsultation(null);
        setResponse('');
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
            case 'assigned':
                return 'warning';
            case 'answered':
                return 'success';
            default:
                return 'default';
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

    const getStatusText = (status: string) => {
        switch (status) {
            case 'assigned':
                return 'Chờ trả lời';
            case 'answered':
                return 'Đã trả lời';
            default:
                return status;
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Vừa xong';
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} ngày trước`;
    };

    // Calculate stats
    const pendingConsultations = consultations.filter(cons => cons.status === 'assigned');
    const highPriorityConsultations = consultations.filter(cons => cons.priority === 'high');
    const answeredConsultations = consultations.filter(cons => cons.status === 'answered');

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý tư vấn
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Trả lời câu hỏi tư vấn được phân công cho bác sĩ {user?.name}
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <QuestionIcon />
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
                                    <ScheduleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Chờ trả lời
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
                                        {highPriorityConsultations.length}
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
                                        {answeredConsultations.length}
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
                    <Tab label="Chờ trả lời" />
                    <Tab label="Ưu tiên cao" />
                    <Tab label="Đã trả lời" />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm câu hỏi, danh mục..."
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
                                <MenuItem value="Điều trị">Điều trị</MenuItem>
                                <MenuItem value="Xét nghiệm">Xét nghiệm</MenuItem>
                                <MenuItem value="Phòng ngừa">Phòng ngừa</MenuItem>
                                <MenuItem value="Tâm lý">Tâm lý</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setPriorityFilter('all');
                                setCategoryFilter('all');
                            }}
                            fullWidth
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
                                    {consultation.isAnonymous ? (
                                        <Chip label="Ẩn danh" size="small" variant="outlined" />
                                    ) : (
                                        <Typography variant="body2">
                                            {consultation.patientName}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{consultation.category}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getPriorityText(consultation.priority)}
                                        color={getPriorityColor(consultation.priority)}
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
                                    <Typography variant="caption">
                                        {getTimeAgo(consultation.submittedAt)}
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
                                        {consultation.status === 'assigned' ? (
                                            <Tooltip title="Trả lời">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleAction(consultation, 'reply')}
                                                >
                                                    <ReplyIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Xem câu trả lời">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleAction(consultation, 'view')}
                                                >
                                                    <CompletedIcon />
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
                <DialogTitle>
                    {actionType === 'reply' ? 'Trả lời tư vấn' : 'Chi tiết tư vấn'}
                </DialogTitle>
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
                                        <strong>Người gửi:</strong> {selectedConsultation.isAnonymous ? 'Ẩn danh' : selectedConsultation.patientName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Danh mục:</strong> {selectedConsultation.category}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Độ ưu tiên:</strong> {getPriorityText(selectedConsultation.priority)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        <strong>Thời gian gửi:</strong> {formatDateTime(selectedConsultation.submittedAt)}
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
                                        Trả lời lúc {formatDateTime(selectedConsultation.responseAt)}
                                    </Typography>
                                </>
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
                            onClick={handleSendResponse}
                            color="primary"
                            variant="contained"
                            startIcon={<SendIcon />}
                            disabled={!response.trim()}
                        >
                            Gửi câu trả lời
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorConsultationManagement;
