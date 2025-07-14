using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AppointmentApi.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(CreateNotificationRequest request);
        Task CreateAppointmentNotificationAsync(string appointmentId, string eventType, string? additionalData = null);
        Task NotifyAppointmentCreatedAsync(string appointmentId);
        Task NotifyAppointmentCancelledAsync(string appointmentId, string cancelledBy);
        Task NotifyAppointmentConfirmedAsync(string appointmentId);
        Task NotifyAppointmentRescheduledAsync(string appointmentId, string oldDateTime, string newDateTime);
        Task NotifyAppointmentReminderAsync(string appointmentId);
        Task NotifyDoctorScheduleChangedAsync(string doctorId, string changeDetails);
        Task<List<NotificationResponse>> GetUserNotificationsAsync(string userId, bool unreadOnly = false);
        Task MarkAsReadAsync(string notificationId);
        Task MarkAllAsReadAsync(string userId);
        Task DeleteNotificationAsync(string notificationId);
    }

    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(CreateNotificationRequest request)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = request.UserId,
                Title = request.Title,
                Message = request.Message,
                Type = request.Type,
                Priority = request.Priority ?? NotificationPriorities.NORMAL,
                ActionUrl = request.ActionUrl,
                ActionText = request.ActionText,
                RelatedEntityId = request.RelatedEntityId,
                RelatedEntityType = request.RelatedEntityType,
                CreatedBy = request.CreatedBy ?? "system",
                Metadata = request.Metadata,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateAppointmentNotificationAsync(string appointmentId, string eventType, string? additionalData = null)
        {
            try
            {
                // Get appointment details
                var appointment = await _context.Appointments
                    .FirstOrDefaultAsync(a => a.Id == appointmentId);

                if (appointment == null) return;

                // Get doctor and patient info from Users table via AuthApi
                var doctorInfo = await GetUserInfoAsync(appointment.DoctorId);
                var patientInfo = await GetUserInfoAsync(appointment.PatientId);

                string title = "";
                string message = "";
                string priority = NotificationPriorities.NORMAL;
                string? actionUrl = null;
                string? actionText = null;

                switch (eventType.ToLower())
                {
                    case "created":
                        title = "Lịch hẹn mới được tạo";
                        message = $"Bạn có lịch hẹn mới với {(appointment.PatientId == appointment.PatientId ? doctorInfo?.FullName : patientInfo?.FullName)} vào {appointment.Date:dd/MM/yyyy} lúc {appointment.StartTime}";
                        actionUrl = "/appointments";
                        actionText = "Xem chi tiết";
                        break;

                    case "cancelled":
                        title = "Lịch hẹn đã bị hủy";
                        message = $"Lịch hẹn vào {appointment.Date:dd/MM/yyyy} lúc {appointment.StartTime} đã bị hủy. {additionalData}";
                        priority = NotificationPriorities.HIGH;
                        actionUrl = "/appointments";
                        actionText = "Xem lịch hẹn";
                        break;

                    case "confirmed":
                        title = "Lịch hẹn đã được xác nhận";
                        message = $"Lịch hẹn vào {appointment.Date:dd/MM/yyyy} lúc {appointment.StartTime} đã được xác nhận";
                        priority = NotificationPriorities.HIGH;
                        actionUrl = "/appointments";
                        actionText = "Xem chi tiết";
                        break;

                    case "rescheduled":
                        title = "Lịch hẹn đã được thay đổi";
                        message = $"Lịch hẹn đã được chuyển sang {appointment.Date:dd/MM/yyyy} lúc {appointment.StartTime}. {additionalData}";
                        priority = NotificationPriorities.HIGH;
                        actionUrl = "/appointments";
                        actionText = "Xem chi tiết";
                        break;

                    case "reminder":
                        title = "Nhắc nhở lịch hẹn";
                        message = $"Bạn có lịch hẹn vào {appointment.Date:dd/MM/yyyy} lúc {appointment.StartTime}. Vui lòng đến đúng giờ.";
                        priority = NotificationPriorities.HIGH;
                        actionUrl = "/appointments";
                        actionText = "Xem chi tiết";
                        break;
                }

                // Create metadata
                var metadata = new
                {
                    appointmentId = appointmentId,
                    appointmentDate = appointment.Date.ToString("yyyy-MM-dd"),
                    appointmentTime = appointment.StartTime,
                    doctorId = appointment.DoctorId,
                    patientId = appointment.PatientId,
                    eventType = eventType,
                    additionalData = additionalData
                };

                // Notify patient
                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = appointment.PatientId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.APPOINTMENT,
                    Priority = priority,
                    ActionUrl = actionUrl,
                    ActionText = actionText,
                    RelatedEntityId = appointmentId,
                    RelatedEntityType = "appointment",
                    CreatedBy = "system",
                    Metadata = JsonSerializer.Serialize(metadata)
                });

                // Notify doctor (except for patient-initiated actions)
                if (eventType.ToLower() != "cancelled" || additionalData?.Contains("bệnh nhân") != true)
                {
                    await CreateNotificationAsync(new CreateNotificationRequest
                    {
                        UserId = appointment.DoctorId,
                        Title = title,
                        Message = message.Replace("Bạn có", "Bạn có").Replace("với bạn", $"với bệnh nhân {patientInfo?.FullName}"),
                        Type = NotificationTypes.APPOINTMENT,
                        Priority = priority,
                        ActionUrl = "/doctor/appointments",
                        ActionText = actionText,
                        RelatedEntityId = appointmentId,
                        RelatedEntityType = "appointment",
                        CreatedBy = "system",
                        Metadata = JsonSerializer.Serialize(metadata)
                    });
                }
            }
            catch (Exception ex)
            {
                // Log error but don't throw to avoid breaking the main flow
                Console.WriteLine($"Error creating appointment notification: {ex.Message}");
            }
        }

        public async Task NotifyAppointmentCreatedAsync(string appointmentId)
        {
            await CreateAppointmentNotificationAsync(appointmentId, "created");
        }

        public async Task NotifyAppointmentCancelledAsync(string appointmentId, string cancelledBy)
        {
            string additionalInfo = cancelledBy.Contains("doctor") ? "Bác sĩ đã hủy lịch hẹn." :
                                   cancelledBy.Contains("patient") ? "Bệnh nhân đã hủy lịch hẹn." :
                                   "Lịch hẹn đã bị hủy bởi hệ thống.";
            await CreateAppointmentNotificationAsync(appointmentId, "cancelled", additionalInfo);
        }

        public async Task NotifyAppointmentConfirmedAsync(string appointmentId)
        {
            await CreateAppointmentNotificationAsync(appointmentId, "confirmed");
        }

        public async Task NotifyAppointmentRescheduledAsync(string appointmentId, string oldDateTime, string newDateTime)
        {
            string additionalInfo = $"Thời gian cũ: {oldDateTime}";
            await CreateAppointmentNotificationAsync(appointmentId, "rescheduled", additionalInfo);
        }

        public async Task NotifyAppointmentReminderAsync(string appointmentId)
        {
            await CreateAppointmentNotificationAsync(appointmentId, "reminder");
        }

        public async Task NotifyDoctorScheduleChangedAsync(string doctorId, string changeDetails)
        {
            try
            {
                // Get doctor info
                var doctorInfo = await GetUserInfoAsync(doctorId);
                if (doctorInfo == null) return;

                // Get all patients who have future appointments with this doctor
                var futureAppointments = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId &&
                               a.Date >= DateTime.Today &&
                               a.Status != AppointmentStatus.Cancelled)
                    .ToListAsync();

                var affectedPatients = futureAppointments.Select(a => a.PatientId).Distinct();

                foreach (var patientId in affectedPatients)
                {
                    await CreateNotificationAsync(new CreateNotificationRequest
                    {
                        UserId = patientId,
                        Title = "Thay đổi lịch làm việc của bác sĩ",
                        Message = $"Bác sĩ {doctorInfo.FullName} đã thay đổi lịch làm việc. {changeDetails}. Vui lòng kiểm tra lại lịch hẹn của bạn.",
                        Type = NotificationTypes.APPOINTMENT,
                        Priority = NotificationPriorities.HIGH,
                        ActionUrl = "/appointments",
                        ActionText = "Kiểm tra lịch hẹn",
                        RelatedEntityId = doctorId,
                        RelatedEntityType = "doctor_schedule",
                        CreatedBy = "system",
                        Metadata = JsonSerializer.Serialize(new { doctorId, changeDetails })
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating doctor schedule notification: {ex.Message}");
            }
        }

        public async Task<List<NotificationResponse>> GetUserNotificationsAsync(string userId, bool unreadOnly = false)
        {
            var query = _context.Notifications
                .Where(n => n.UserId == userId && !n.IsDeleted);

            if (unreadOnly)
            {
                query = query.Where(n => !n.IsRead);
            }

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(50) // Limit to 50 most recent
                .ToListAsync();

            return notifications.Select(n => new NotificationResponse
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                Priority = n.Priority ?? NotificationPriorities.NORMAL,
                ActionUrl = n.ActionUrl,
                ActionText = n.ActionText,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                RelatedEntityId = n.RelatedEntityId,
                RelatedEntityType = n.RelatedEntityType,
                Metadata = n.Metadata
            }).ToList();
        }

        public async Task MarkAsReadAsync(string notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification != null)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(string userId)
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
        }

        public async Task DeleteNotificationAsync(string notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification != null)
            {
                notification.IsDeleted = true;
                notification.DeletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        private async Task<UserInfo?> GetUserInfoAsync(string userId)
        {
            // This would typically call AuthApi to get user info
            // For now, return a placeholder
            return new UserInfo { Id = userId, FullName = "User " + userId };
        }
    }

    // Helper class for user info
    public class UserInfo
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
