import React, { useState, useEffect } from 'react';
import {
    Box,
    Badge,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Button,
    Divider
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    from?: string;
    patientId?: string;
}

interface NotificationSystemProps {
    userRole: 'doctor' | 'patient';
    userId: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userRole, userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        // Set up polling for new notifications
        const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [userRole, userId]);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const loadNotifications = async () => {
        try {
            // Mock notifications based on user role
            if (userRole === 'doctor') {
                setNotifications([
                    {
                        id: '1',
                        title: 'Tuân thủ điều trị thấp',
                        message: 'Bệnh nhân Nguyễn Văn A có mức độ tuân thủ giảm xuống 85%',
                        type: 'warning',
                        timestamp: new Date().toISOString(),
                        read: false,
                        patientId: 'customer-001'
                    },
                    {
                        id: '2',
                        title: 'Ghi nhận tuân thủ mới',
                        message: 'Bệnh nhân Trần Thị B đã ghi nhận tuân thủ điều trị',
                        type: 'info',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        read: false,
                        patientId: 'customer-002'
                    }
                ]);
            } else {
                setNotifications([
                    {
                        id: '3',
                        title: 'Lời khuyên từ bác sĩ',
                        message: 'BS. Nguyễn Văn A: Hãy tiếp tục duy trì mức độ tuân thủ tốt!',
                        type: 'success',
                        timestamp: new Date().toISOString(),
                        read: false,
                        from: 'BS. Nguyễn Văn A'
                    },
                    {
                        id: '4',
                        title: 'Nhắc nhở uống thuốc',
                        message: 'Đã đến giờ uống thuốc ARV của bạn',
                        type: 'info',
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                        read: true
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(n => 
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const open = Boolean(anchorEl);

    return (
        <Box>
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-label="notifications"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
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
                    sx: { width: 400, maxHeight: 500 }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                            Thông báo
                        </Typography>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={markAllAsRead}
                            >
                                Đánh dấu đã đọc
                            </Button>
                        )}
                    </Box>
                    <Divider />
                </Box>

                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                sx={{
                                    backgroundColor: notification.read ? 'inherit' : 'action.hover',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'action.selected'
                                    }
                                }}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                                {notification.title}
                                            </Typography>
                                            <Chip
                                                label={notification.type}
                                                color={getTypeColor(notification.type) as any}
                                                size="small"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {notification.message}
                                            </Typography>
                                            {notification.from && (
                                                <Typography variant="caption" color="primary">
                                                    Từ: {notification.from}
                                                </Typography>
                                            )}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {new Date(notification.timestamp).toLocaleString('vi-VN')}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typography color="text.secondary" align="center">
                                        Không có thông báo mới
                                    </Typography>
                                }
                            />
                        </ListItem>
                    )}
                </List>
            </Popover>
        </Box>
    );
};

export default NotificationSystem;
