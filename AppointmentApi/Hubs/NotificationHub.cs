using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AppointmentApi.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
        }

        public async Task LeaveUserGroup(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
        }

        public override async Task OnConnectedAsync()
        {
            // Auto-join user to their personal group based on user ID
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Auto-leave user group
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Method to send notification to specific user
        public async Task SendNotificationToUser(string userId, object notification)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", notification);
        }

        // Method to send notification to user group
        public async Task SendNotificationToGroup(string groupName, object notification)
        {
            await Clients.Group(groupName).SendAsync("ReceiveNotification", notification);
        }

        // Method to broadcast notification to all connected clients
        public async Task BroadcastNotification(object notification)
        {
            await Clients.All.SendAsync("ReceiveNotification", notification);
        }

        // Method for clients to request their unread count
        public async Task RequestUnreadCount(string userId)
        {
            // This would typically call the notification service to get unread count
            // For now, we'll just acknowledge the request
            await Clients.Caller.SendAsync("UnreadCountRequested", userId);
        }

        // Method to mark notification as read via SignalR
        public async Task MarkNotificationAsRead(string notificationId)
        {
            // This would typically call the notification service to mark as read
            await Clients.Caller.SendAsync("NotificationMarkedAsRead", notificationId);
        }
    }
}
