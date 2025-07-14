using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using AppointmentApi.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Notification/user/{userId} - Get notifications for user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserNotifications(string userId, [FromQuery] bool? unreadOnly = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsDeleted);

                if (unreadOnly == true)
                {
                    query = query.Where(n => !n.IsRead);
                }

                var totalCount = await query.CountAsync();

                var notifications = await query
                    .OrderByDescending(n => n.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(n => new NotificationResponse
                    {
                        Id = n.Id,
                        Title = n.Title,
                        Message = n.Message,
                        Type = n.Type,
                        Priority = n.Priority ?? "normal",
                        ActionUrl = n.ActionUrl,
                        ActionText = n.ActionText,
                        IsRead = n.IsRead,
                        CreatedAt = n.CreatedAt,
                        RelatedEntityId = n.RelatedEntityId,
                        RelatedEntityType = n.RelatedEntityType,
                        Metadata = n.Metadata
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = notifications,
                    pagination = new
                    {
                        page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving notifications", error = ex.Message });
            }
        }

        // GET: api/Notification/user/{userId}/unread-count - Get unread count
        [HttpGet("user/{userId}/unread-count")]
        public async Task<ActionResult> GetUnreadCount(string userId)
        {
            try
            {
                var count = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead && !n.IsDeleted)
                    .CountAsync();

                return Ok(new { success = true, count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error getting unread count", error = ex.Message });
            }
        }

        // POST: api/Notification - Create notification
        [HttpPost]
        public async Task<ActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = request.UserId,
                    Title = request.Title,
                    Message = request.Message,
                    Type = request.Type,
                    Priority = request.Priority ?? "normal",
                    ActionUrl = request.ActionUrl,
                    ActionText = request.ActionText,
                    RelatedEntityId = request.RelatedEntityId,
                    RelatedEntityType = request.RelatedEntityType,
                    CreatedBy = request.CreatedBy,
                    Metadata = request.Metadata
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                // Send real-time notification via SignalR
                await _hubContext.Clients.User(request.UserId).SendAsync("ReceiveNotification", new NotificationResponse
                {
                    Id = notification.Id,
                    Title = notification.Title,
                    Message = notification.Message,
                    Type = notification.Type,
                    Priority = notification.Priority ?? "normal",
                    ActionUrl = notification.ActionUrl,
                    ActionText = notification.ActionText,
                    IsRead = notification.IsRead,
                    CreatedAt = notification.CreatedAt,
                    RelatedEntityId = notification.RelatedEntityId,
                    RelatedEntityType = notification.RelatedEntityType,
                    Metadata = notification.Metadata
                });

                return Ok(new { success = true, message = "Notification created successfully", data = notification });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating notification", error = ex.Message });
            }
        }

        // PUT: api/Notification/{id}/mark-read - Mark notification as read
        [HttpPut("{id}/mark-read")]
        public async Task<ActionResult> MarkAsRead(string id)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(id);
                if (notification == null)
                {
                    return NotFound(new { success = false, message = "Notification not found" });
                }

                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Notification marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error marking notification as read", error = ex.Message });
            }
        }

        // PUT: api/Notification/user/{userId}/mark-all-read - Mark all notifications as read
        [HttpPut("user/{userId}/mark-all-read")]
        public async Task<ActionResult> MarkAllAsRead(string userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead && !n.IsDeleted)
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.IsRead = true;
                    notification.ReadAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = $"Marked {notifications.Count} notifications as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error marking all notifications as read", error = ex.Message });
            }
        }

        // DELETE: api/Notification/{id} - Delete notification
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNotification(string id)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(id);
                if (notification == null)
                {
                    return NotFound(new { success = false, message = "Notification not found" });
                }

                notification.IsDeleted = true;
                notification.DeletedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Notification deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error deleting notification", error = ex.Message });
            }
        }

        // POST: api/Notification/bulk - Create multiple notifications
        [HttpPost("bulk")]
        public async Task<ActionResult> CreateBulkNotifications([FromBody] List<CreateNotificationRequest> requests)
        {
            try
            {
                var notifications = new List<Notification>();

                foreach (var request in requests)
                {
                    var notification = new Notification
                    {
                        UserId = request.UserId,
                        Title = request.Title,
                        Message = request.Message,
                        Type = request.Type,
                        Priority = request.Priority ?? "normal",
                        ActionUrl = request.ActionUrl,
                        ActionText = request.ActionText,
                        RelatedEntityId = request.RelatedEntityId,
                        RelatedEntityType = request.RelatedEntityType,
                        CreatedBy = request.CreatedBy,
                        Metadata = request.Metadata
                    };

                    notifications.Add(notification);
                }

                _context.Notifications.AddRange(notifications);
                await _context.SaveChangesAsync();

                // Send real-time notifications via SignalR
                foreach (var notification in notifications)
                {
                    await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification", new NotificationResponse
                    {
                        Id = notification.Id,
                        Title = notification.Title,
                        Message = notification.Message,
                        Type = notification.Type,
                        Priority = notification.Priority ?? "normal",
                        ActionUrl = notification.ActionUrl,
                        ActionText = notification.ActionText,
                        IsRead = notification.IsRead,
                        CreatedAt = notification.CreatedAt,
                        RelatedEntityId = notification.RelatedEntityId,
                        RelatedEntityType = notification.RelatedEntityType,
                        Metadata = notification.Metadata
                    });
                }

                return Ok(new { success = true, message = $"Created {notifications.Count} notifications successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating bulk notifications", error = ex.Message });
            }
        }

        // POST: api/Notification/test - Create test notification for demo
        [HttpPost("test")]
        public async Task<ActionResult> CreateTestNotification([FromQuery] string userId = "customer@gmail.com")
        {
            try
            {
                var notification = new Notification
                {
                    UserId = userId,
                    Title = "Test Notification",
                    Message = $"This is a test notification created at {DateTime.Now:HH:mm:ss}",
                    Type = "system",
                    Priority = "normal",
                    ActionUrl = "/notifications",
                    ActionText = "View Details",
                    CreatedBy = "system"
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                // Send real-time notification via SignalR
                await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", new NotificationResponse
                {
                    Id = notification.Id,
                    Title = notification.Title,
                    Message = notification.Message,
                    Type = notification.Type,
                    Priority = notification.Priority ?? "normal",
                    ActionUrl = notification.ActionUrl,
                    ActionText = notification.ActionText,
                    IsRead = notification.IsRead,
                    CreatedAt = notification.CreatedAt,
                    RelatedEntityId = notification.RelatedEntityId,
                    RelatedEntityType = notification.RelatedEntityType,
                    Metadata = notification.Metadata
                });

                return Ok(new
                {
                    success = true,
                    message = "Test notification created and sent successfully!",
                    data = notification,
                    timestamp = DateTime.Now.ToString("HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating test notification", error = ex.Message });
            }
        }
    }
}
