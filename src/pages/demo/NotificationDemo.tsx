import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Alert,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Divider
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Send as SendIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { notificationService } from '../../services/notificationService';
import { NotificationHelpers } from '../../services/notificationHelpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NotificationDemo: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [testType, setTestType] = useState('system');
    const [customTitle, setCustomTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    useEffect(() => {
        if (user) {
            loadNotifications();
            loadUnreadCount();
            initializeSignalR();
        }
    }, [user]);

    const initializeSignalR = async () => {
        if (!user) return;
        try {
            await notificationService.initializeConnection(user.id || user.email || 'unknown');
            notificationService.onNotificationReceived((notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                setMessage(`New notification received: ${notification.title}`);
            });
        } catch (error) {
            console.error('SignalR connection error:', error);
        }
    };

    const loadNotifications = async () => {
        if (!user) return;
        try {
            const response = await notificationService.getUserNotifications(
                user.id || user.email || 'unknown',
                false,
                1,
                10
            );
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const loadUnreadCount = async () => {
        if (!user) return;
        try {
            const count = await notificationService.getUnreadCount(user.id || user.email || 'unknown');
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const createTestNotification = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const userId = user.id || user.email || 'unknown';
            
            switch (testType) {
                case 'appointment':
                    await NotificationHelpers.notifyAppointmentBooked(
                        userId,
                        'test-apt-' + Date.now(),
                        'BS. Nguyễn Văn A',
                        new Date().toLocaleString('vi-VN')
                    );
                    break;
                case 'arv':
                    await NotificationHelpers.notifyARVPrescribed(
                        userId,
                        'test-regimen-' + Date.now(),
                        'BS. Trần Thị B',
                        'Efavirenz + Tenofovir + Emtricitabine'
                    );
                    break;
                case 'consultation':
                    await NotificationHelpers.notifyConsultationAnswered(
                        userId,
                        'test-consult-' + Date.now()
                    );
                    break;
                case 'custom':
                    await notificationService.createNotification({
                        userId,
                        title: customTitle || 'Custom Test Notification',
                        message: customMessage || 'This is a custom test notification',
                        type: 'system',
                        priority: 'normal',
                        actionUrl: '/notifications',
                        actionText: 'View Details',
                        createdBy: 'demo'
                    });
                    break;
                default:
                    await notificationService.createSystemNotification(
                        userId,
                        'System Test Notification',
                        'This is a system test notification created at ' + new Date().toLocaleString('vi-VN')
                    );
            }

            setMessage('Test notification created successfully!');
            setTimeout(() => {
                loadNotifications();
                loadUnreadCount();
            }, 1000);
        } catch (error: any) {
            setError('Error creating notification: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const createTestNotificationViaAPI = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const userId = user.id || user.email || 'unknown';
            const response = await fetch(`http://localhost:5002/api/Notification/test?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Test notification created via API: ' + data.message);
                setTimeout(() => {
                    loadNotifications();
                    loadUnreadCount();
                }, 1000);
            } else {
                setError('API call failed');
            }
        } catch (error: any) {
            setError('Error calling API: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            await notificationService.markAllAsRead(user.id || user.email || 'unknown');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            setMessage('All notifications marked as read');
        } catch (error: any) {
            setError('Error marking as read: ' + error.message);
        }
    };

    const clearNotifications = async () => {
        setNotifications([]);
        setUnreadCount(0);
        setMessage('Notifications cleared (UI only)');
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning">
                    Please login to test notification system.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    🔔 Notification System Demo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Test the in-app notification system with real-time updates
                </Typography>
            </Box>

            {message && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Create Test Notifications
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Notification Type</InputLabel>
                                <Select
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value)}
                                    label="Notification Type"
                                >
                                    <MenuItem value="system">System Notification</MenuItem>
                                    <MenuItem value="appointment">Appointment Booked</MenuItem>
                                    <MenuItem value="arv">ARV Prescribed</MenuItem>
                                    <MenuItem value="consultation">Consultation Answered</MenuItem>
                                    <MenuItem value="custom">Custom Notification</MenuItem>
                                </Select>
                            </FormControl>

                            {testType === 'custom' && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Custom Title"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Custom Message"
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        multiline
                                        rows={3}
                                        sx={{ mb: 2 }}
                                    />
                                </>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    onClick={createTestNotification}
                                    disabled={loading}
                                >
                                    Create via Service
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    onClick={createTestNotificationViaAPI}
                                    disabled={loading}
                                >
                                    Create via API
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Notifications ({unreadCount} unread)
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<RefreshIcon />}
                                        onClick={loadNotifications}
                                    >
                                        Refresh
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                    >
                                        Mark All Read
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={clearNotifications}
                                        color="error"
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                        No notifications yet. Create some test notifications!
                                    </Typography>
                                ) : (
                                    notifications.map((notification, index) => (
                                        <Box key={notification.id || index} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {notification.message}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                        <Chip label={notification.type} size="small" variant="outlined" />
                                                        <Chip label={notification.priority} size="small" color="primary" variant="outlined" />
                                                        {!notification.isRead && (
                                                            <Chip label="Unread" size="small" color="error" />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            {index < notifications.length - 1 && <Divider sx={{ mt: 2 }} />}
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    How to Test:
                </Typography>
                <Typography variant="body2" component="div">
                    <ol>
                        <li>Select a notification type from the dropdown</li>
                        <li>Click "Create via Service" to test the notification service</li>
                        <li>Click "Create via API" to test the API endpoint directly</li>
                        <li>Check the notification bell icon in the header</li>
                        <li>Visit the <a href="/notifications" target="_blank">full notifications page</a></li>
                        <li>Test real-time updates by creating notifications in multiple tabs</li>
                    </ol>
                </Typography>
            </Box>
        </Container>
    );
};

export default NotificationDemo;
