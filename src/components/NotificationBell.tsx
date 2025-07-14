import React, { useState, useEffect, useRef } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    Button,
    Divider,
    Chip,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsNone as NotificationsNoneIcon,
    Event as EventIcon,
    QuestionAnswer as ConsultationIcon,
    Medication as ARVIcon,
    Article as BlogIcon,
    Settings as SystemIcon,
    AccessTime as ReminderIcon,
    Science as TestResultIcon,
    MarkEmailRead as MarkReadIcon,
    Delete as DeleteIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

interface NotificationBellProps {
    userId: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (userId) {
            initializeNotifications();
            startPolling();
        }

        return () => {
            cleanup();
        };
    }, [userId]);

    const initializeNotifications = async () => {
        try {
            // Initialize SignalR connection
            await notificationService.initializeConnection(userId);

            // Listen for real-time notifications
            notificationService.onNotificationReceived((notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show browser notification if permission granted
                if (Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/hivicon.png'
                    });
                }
            });

            // Load initial data
            await loadNotifications();
            await loadUnreadCount();
        } catch (error) {
            console.error('Error initializing notifications:', error);
            setError('Không thể kết nối hệ thống thông báo');
        }
    };

    const cleanup = () => {
        notificationService.offNotificationReceived();
        notificationService.disconnect();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const startPolling = () => {
        // Poll for unread count every 30 seconds as backup
        intervalRef.current = setInterval(async () => {
            await loadUnreadCount();
        }, 30000);
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getUserNotifications(userId, false, 1, 10);
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            setError('Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount(userId);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if (notifications.length === 0) {
            loadNotifications();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read if not already read
            if (!notification.isRead) {
                await notificationService.markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            // Navigate to action URL if available
            if (notification.actionUrl) {
                navigate(notification.actionUrl);
                handleClose();
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(userId);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            // Reload unread count
            await loadUnreadCount();
        } catch (error) {
            console.error('Error deleting notification:', error);
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
                return <NotificationsIcon color="action" />;
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

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ mr: 1 }}
            >
                <Badge badgeContent={unreadCount} color="error" max={99}>
                    {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 400, maxHeight: 600 }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Thông báo ({unreadCount})
                        </Typography>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                startIcon={<MarkReadIcon />}
                                onClick={handleMarkAllAsRead}
                            >
                                Đánh dấu tất cả đã đọc
                            </Button>
                        )}
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                Không có thông báo nào
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        button
                                        onClick={() => handleNotificationClick(notification)}
                                        sx={{
                                            bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                            borderRadius: 1,
                                            mb: 1,
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
                                                        variant="subtitle2"
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
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleDeleteNotification(notification.id, e)}
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
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </Typography>
                                                    {notification.actionText && (
                                                        <Box sx={{ mt: 1 }}>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<LaunchIcon />}
                                                            >
                                                                {notification.actionText}
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}

                    {notifications.length > 0 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="text"
                                onClick={() => {
                                    navigate('/notifications');
                                    handleClose();
                                }}
                            >
                                Xem tất cả thông báo
                            </Button>
                        </Box>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;
