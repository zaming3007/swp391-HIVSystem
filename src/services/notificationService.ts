import * as signalR from '@microsoft/signalr';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    actionUrl?: string;
    actionText?: string;
    isRead: boolean;
    createdAt: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    metadata?: string;
}

export interface CreateNotificationRequest {
    userId: string;
    title: string;
    message: string;
    type: string;
    priority?: string;
    actionUrl?: string;
    actionText?: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    createdBy?: string;
    metadata?: string;
}

class NotificationService {
    private connection: signalR.HubConnection | null = null;
    private baseUrl = 'http://localhost:5002/api/Notification';
    private hubUrl = 'http://localhost:5002/notificationHub';

    // Initialize SignalR connection
    async initializeConnection(userId: string): Promise<void> {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.hubUrl, {
                    accessTokenFactory: () => localStorage.getItem('authToken') || ''
                })
                .withAutomaticReconnect()
                .build();

            await this.connection.start();
            
            // Join user group
            await this.connection.invoke('JoinUserGroup', userId);
            
            console.log('SignalR Connected');
        } catch (error) {
            console.error('SignalR Connection Error:', error);
        }
    }

    // Disconnect SignalR
    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }

    // Listen for notifications
    onNotificationReceived(callback: (notification: Notification) => void): void {
        if (this.connection) {
            this.connection.on('ReceiveNotification', callback);
        }
    }

    // Remove notification listener
    offNotificationReceived(): void {
        if (this.connection) {
            this.connection.off('ReceiveNotification');
        }
    }

    // Get user notifications
    async getUserNotifications(userId: string, unreadOnly = false, page = 1, pageSize = 20): Promise<any> {
        try {
            const response = await fetch(
                `${this.baseUrl}/user/${userId}?unreadOnly=${unreadOnly}&page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    // Get unread count
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const response = await fetch(`${this.baseUrl}/user/${userId}/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread count');
            }

            const data = await response.json();
            return data.count || 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }

    // Create notification
    async createNotification(request: CreateNotificationRequest): Promise<any> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error('Failed to create notification');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markAsRead(notificationId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${notificationId}/mark-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            return await response.json();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read
    async markAllAsRead(userId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/user/${userId}/mark-all-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            return await response.json();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Delete notification
    async deleteNotification(notificationId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    // Create bulk notifications
    async createBulkNotifications(requests: CreateNotificationRequest[]): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/bulk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requests)
            });

            if (!response.ok) {
                throw new Error('Failed to create bulk notifications');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating bulk notifications:', error);
            throw error;
        }
    }

    // Helper methods for different notification types
    async createAppointmentNotification(userId: string, appointmentId: string, title: string, message: string, actionUrl?: string): Promise<any> {
        return this.createNotification({
            userId,
            title,
            message,
            type: 'appointment',
            priority: 'normal',
            actionUrl,
            actionText: 'Xem chi tiết',
            relatedEntityId: appointmentId,
            relatedEntityType: 'appointment',
            createdBy: 'system'
        });
    }

    async createConsultationNotification(userId: string, consultationId: string, title: string, message: string, actionUrl?: string): Promise<any> {
        return this.createNotification({
            userId,
            title,
            message,
            type: 'consultation',
            priority: 'normal',
            actionUrl,
            actionText: 'Xem tư vấn',
            relatedEntityId: consultationId,
            relatedEntityType: 'consultation',
            createdBy: 'system'
        });
    }

    async createARVNotification(userId: string, regimenId: string, title: string, message: string, priority = 'high', actionUrl?: string): Promise<any> {
        return this.createNotification({
            userId,
            title,
            message,
            type: 'arv',
            priority,
            actionUrl,
            actionText: 'Xem phác đồ',
            relatedEntityId: regimenId,
            relatedEntityType: 'arv_regimen',
            createdBy: 'system'
        });
    }

    async createSystemNotification(userId: string, title: string, message: string, priority = 'normal'): Promise<any> {
        return this.createNotification({
            userId,
            title,
            message,
            type: 'system',
            priority,
            createdBy: 'system'
        });
    }
}

export const notificationService = new NotificationService();
export default notificationService;
