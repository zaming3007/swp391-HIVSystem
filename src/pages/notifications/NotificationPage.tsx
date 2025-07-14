import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Button,
    Tabs,
    Tab,
    IconButton,
    Alert,
    CircularProgress,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Event as EventIcon,
    QuestionAnswer as ConsultationIcon,
    Medication as ARVIcon,
    Article as BlogIcon,
    Settings as SystemIcon,
    AccessTime as ReminderIcon,
    Science as TestResultIcon,
    Delete as DeleteIcon,
    MarkEmailRead as MarkReadIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';
import { NotificationHelpers } from '../../services/notificationHelpers';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user, tabValue, page, filterType]);

    const loadNotifications = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const unreadOnly = tabValue === 1;
            const response = await notificationService.getUserNotifications(
                user.id || user.email || 'unknown',
                unreadOnly,
                page,
                20
            );

            if (response.success) {
                let filteredNotifications = response.data;

                // Filter by type if not 'all'
                if (filterType !== 'all') {
                    filteredNotifications = response.data.filter((n: Notification) => n.type === filterType);
                }

                setNotifications(filteredNotifications);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            setError('Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read if not already read
            if (!notification.isRead) {
                await notificationService.markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                );
            }

            // Navigate to action URL if available
            if (notification.actionUrl) {
                navigate(notification.actionUrl);
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async (notificationId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        try {
            await notificationService.markAllAsRead(user.id || user.email || 'unknown');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const createTestNotification = async () => {
        if (!user) return;
        try {
            await NotificationHelpers.notifyAppointmentBooked(
                user.id || user.email || 'unknown',
                'test-appointment-' + Date.now(),
                'BS. Test',
                new Date().toLocaleString('vi-VN')
            );
            loadNotifications();
        } catch (error) {
            console.error('Error creating test notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'appointment':
                return <EventIcon color="primary" />;
            case 'consultation':
                return <ConsultationIcon color="info" />;
            case 'arv':
                return <ARVIcon color="warning" />;
            case 'blog':
                return <BlogIcon color="success" />;
            case 'system':
                return <SystemIcon color="action" />;
            case 'reminder':
                return <ReminderIcon color="secondary" />;
            case 'test_result':
                return <TestResultIcon color="primary" />;
            default:
                return <SystemIcon color="action" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'error';
            case 'high':
                return 'warning';
            case 'normal':
                return 'primary';
            case 'low':
                return 'default';
            default:
                return 'default';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning">
                    Vui lòng đăng nhập để xem thông báo.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Thông báo
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={createTestNotification}
                        size="small"
                    >
                        Tạo thông báo test
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<MarkReadIcon />}
                        onClick={handleMarkAllAsRead}
                        size="small"
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Tất cả" />
                    <Tab label="Chưa đọc" />
                </Tabs>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Lọc theo loại</InputLabel>
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Lọc theo loại"
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="appointment">Lịch hẹn</MenuItem>
                        <MenuItem value="consultation">Tư vấn</MenuItem>
                        <MenuItem value="arv">ARV</MenuItem>
                        <MenuItem value="test_result">Kết quả xét nghiệm</MenuItem>
                        <MenuItem value="reminder">Nhắc nhở</MenuItem>
                        <MenuItem value="system">Hệ thống</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Không có thông báo nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {tabValue === 1 ? 'Tất cả thông báo đã được đọc' : 'Chưa có thông báo nào'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <List>
                        {notifications.map((notification) => (
                            <Card key={notification.id} sx={{ mb: 2 }}>
                                <ListItem
                                    button
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                        '&:hover': {
                                            bgcolor: 'action.selected'
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        {getNotificationIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: notification.isRead ? 'normal' : 'bold',
                                                        flex: 1
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={notification.priority}
                                                        size="small"
                                                        color={getPriorityColor(notification.priority) as any}
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </Typography>
                                                    {!notification.isRead && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                            title="Đánh dấu đã đọc"
                                                        >
                                                            <MarkReadIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleDelete(notification.id, e)}
                                                        title="Xóa"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {notification.message}
                                                </Typography>
                                                {notification.actionText && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<LaunchIcon />}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {notification.actionText}
                                                    </Button>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </Card>
                        ))}
                    </List>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, newPage) => setPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default NotificationPage;
