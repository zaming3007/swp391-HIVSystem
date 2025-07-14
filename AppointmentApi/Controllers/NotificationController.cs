using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using AppointmentApi.Hubs;
using AppointmentApi.Services;
using Microsoft.AspNetCore.SignalR;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly INotificationService _notificationService;

        public NotificationController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext, INotificationService notificationService)
        {
            _context = context;
            _hubContext = hubContext;
            _notificationService = notificationService;
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

        // POST: api/Notification/appointment/{appointmentId}/created - Trigger appointment created notification
        [HttpPost("appointment/{appointmentId}/created")]
        public async Task<IActionResult> NotifyAppointmentCreated(string appointmentId)
        {
            try
            {
                await _notificationService.NotifyAppointmentCreatedAsync(appointmentId);
                return Ok(new { success = true, message = "Appointment created notification sent" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending appointment notification", error = ex.Message });
            }
        }

        // POST: api/Notification/appointment/{appointmentId}/cancelled - Trigger appointment cancelled notification
        [HttpPost("appointment/{appointmentId}/cancelled")]
        public async Task<IActionResult> NotifyAppointmentCancelled(string appointmentId, [FromBody] CancelNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyAppointmentCancelledAsync(appointmentId, request.CancelledBy);
                return Ok(new { success = true, message = "Appointment cancelled notification sent" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending cancellation notification", error = ex.Message });
            }
        }

        // POST: api/Notification/appointment/{appointmentId}/confirmed - Trigger appointment confirmed notification
        [HttpPost("appointment/{appointmentId}/confirmed")]
        public async Task<IActionResult> NotifyAppointmentConfirmed(string appointmentId)
        {
            try
            {
                await _notificationService.NotifyAppointmentConfirmedAsync(appointmentId);
                return Ok(new { success = true, message = "Appointment confirmed notification sent" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending confirmation notification", error = ex.Message });
            }
        }

        // POST: api/Notification/appointment/{appointmentId}/rescheduled - Trigger appointment rescheduled notification
        [HttpPost("appointment/{appointmentId}/rescheduled")]
        public async Task<IActionResult> NotifyAppointmentRescheduled(string appointmentId, [FromBody] RescheduleNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyAppointmentRescheduledAsync(appointmentId, request.OldDateTime, request.NewDateTime);
                return Ok(new { success = true, message = "Appointment rescheduled notification sent" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending reschedule notification", error = ex.Message });
            }
        }

        // POST: api/Notification/doctor/{doctorId}/schedule-changed - Trigger doctor schedule changed notification
        [HttpPost("doctor/{doctorId}/schedule-changed")]
        public async Task<IActionResult> NotifyDoctorScheduleChanged(string doctorId, [FromBody] ScheduleChangeNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyDoctorScheduleChangedAsync(doctorId, request.ChangeDetails);
                return Ok(new { success = true, message = "Doctor schedule change notification sent" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending schedule change notification", error = ex.Message });
            }
        }

        // GET: api/Notification/demo - Demo notification system
        [HttpGet("demo")]
        public async Task<IActionResult> DemoNotificationSystem()
        {
            try
            {
                // Create demo appointment notification
                await _notificationService.CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = "customer-001",
                    Title = "Demo: Lịch hẹn mới được tạo",
                    Message = "Bạn có lịch hẹn mới với Bác sĩ Nguyễn Văn A vào 15/07/2025 lúc 09:00",
                    Type = NotificationTypes.APPOINTMENT,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = "/appointments",
                    ActionText = "Xem chi tiết",
                    RelatedEntityId = "demo-appointment-001",
                    RelatedEntityType = "appointment",
                    CreatedBy = "system"
                });

                // Create demo cancellation notification
                await _notificationService.CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = "customer-001",
                    Title = "Demo: Lịch hẹn đã bị hủy",
                    Message = "Lịch hẹn vào 16/07/2025 lúc 14:00 đã bị hủy bởi bác sĩ",
                    Type = NotificationTypes.APPOINTMENT,
                    Priority = NotificationPriorities.HIGH,
                    ActionUrl = "/appointments",
                    ActionText = "Xem lịch hẹn",
                    RelatedEntityId = "demo-appointment-002",
                    RelatedEntityType = "appointment",
                    CreatedBy = "system"
                });

                // Create demo reminder notification
                await _notificationService.CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = "customer-001",
                    Title = "Demo: Nhắc nhở lịch hẹn",
                    Message = "Bạn có lịch hẹn vào ngày mai 15/07/2025 lúc 09:00. Vui lòng đến đúng giờ.",
                    Type = NotificationTypes.REMINDER,
                    Priority = NotificationPriorities.HIGH,
                    ActionUrl = "/appointments",
                    ActionText = "Xem chi tiết",
                    RelatedEntityId = "demo-appointment-003",
                    RelatedEntityType = "appointment",
                    CreatedBy = "system"
                });

                return Ok(new
                {
                    success = true,
                    message = "Demo notifications created successfully!",
                    instructions = new
                    {
                        step1 = "Check notifications: GET /api/Notification/user/customer-001",
                        step2 = "Mark as read: PUT /api/Notification/{id}/read",
                        step3 = "Get unread count: GET /api/Notification/user/customer-001?unreadOnly=true"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating demo notifications", error = ex.Message });
            }
        }

        // ============ MANUAL TRIGGER ENDPOINTS ============

        // POST: api/Notification/medication-reminder - Manual medication reminder
        [HttpPost("medication-reminder")]
        public async Task<IActionResult> TriggerMedicationReminder([FromBody] MedicationReminderRequest request)
        {
            try
            {
                await _notificationService.NotifyMedicationReminderAsync(
                    request.PatientId,
                    request.MedicationName,
                    request.Dosage,
                    request.Frequency
                );
                return Ok(new { success = true, message = "Medication reminder sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending medication reminder", error = ex.Message });
            }
        }

        // POST: api/Notification/test-result - Manual test result notification
        [HttpPost("test-result")]
        public async Task<IActionResult> TriggerTestResultNotification([FromBody] TestResultNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyTestResultAvailableAsync(
                    request.PatientId,
                    request.TestType,
                    request.ResultSummary
                );
                return Ok(new { success = true, message = "Test result notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending test result notification", error = ex.Message });
            }
        }

        // POST: api/Notification/blog-post - Manual blog post notification
        [HttpPost("blog-post")]
        public async Task<IActionResult> TriggerBlogPostNotification([FromBody] BlogPostNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyNewBlogPostAsync(
                    request.UserId,
                    request.BlogTitle,
                    request.Category
                );
                return Ok(new { success = true, message = "Blog post notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending blog post notification", error = ex.Message });
            }
        }

        // POST: api/Notification/consultation-question - Manual consultation notification
        [HttpPost("consultation-question")]
        public async Task<IActionResult> TriggerConsultationNotification([FromBody] ConsultationNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyNewConsultationQuestionAsync(
                    request.DoctorId,
                    request.ConsultationId,
                    request.PatientName,
                    request.QuestionPreview
                );
                return Ok(new { success = true, message = "Consultation notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending consultation notification", error = ex.Message });
            }
        }

        // POST: api/Notification/security-alert - Manual security notification
        [HttpPost("security-alert")]
        public async Task<IActionResult> TriggerSecurityNotification([FromBody] SecurityNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyAccountSecurityAsync(
                    request.UserId,
                    request.SecurityEvent,
                    request.Details
                );
                return Ok(new { success = true, message = "Security notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending security notification", error = ex.Message });
            }
        }

        // POST: api/Notification/user-registration - Manual user registration notification
        [HttpPost("user-registration")]
        public async Task<IActionResult> TriggerUserRegistrationNotification([FromBody] UserRegistrationNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyNewUserRegistrationAsync(
                    request.AdminId,
                    request.NewUserId,
                    request.UserRole,
                    request.UserEmail
                );
                return Ok(new { success = true, message = "User registration notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error sending user registration notification", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CancelNotificationRequest
    {
        public required string CancelledBy { get; set; }
    }

    public class RescheduleNotificationRequest
    {
        public required string OldDateTime { get; set; }
        public required string NewDateTime { get; set; }
    }

    public class ScheduleChangeNotificationRequest
    {
        public required string ChangeDetails { get; set; }
    }

    public class MedicationReminderRequest
    {
        public required string PatientId { get; set; }
        public required string MedicationName { get; set; }
        public required string Dosage { get; set; }
        public required string Frequency { get; set; }
    }

    public class TestResultNotificationRequest
    {
        public required string PatientId { get; set; }
        public required string TestType { get; set; }
        public required string ResultSummary { get; set; }
    }

    public class BlogPostNotificationRequest
    {
        public required string UserId { get; set; }
        public required string BlogTitle { get; set; }
        public required string Category { get; set; }
    }

    public class ConsultationNotificationRequest
    {
        public required string DoctorId { get; set; }
        public required string ConsultationId { get; set; }
        public required string PatientName { get; set; }
        public required string QuestionPreview { get; set; }
    }

    public class SecurityNotificationRequest
    {
        public required string UserId { get; set; }
        public required string SecurityEvent { get; set; }
        public required string Details { get; set; }
    }

    public class UserRegistrationNotificationRequest
    {
        public required string AdminId { get; set; }
        public required string NewUserId { get; set; }
        public required string UserRole { get; set; }
        public required string UserEmail { get; set; }
    }
}
