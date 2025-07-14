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

        // Patient Notifications
        Task NotifyMedicationReminderAsync(string patientId, string medicationName, string dosage, string frequency);
        Task NotifyTestResultAvailableAsync(string patientId, string testType, string resultSummary);
        Task NotifyNewBlogPostAsync(string userId, string blogTitle, string category);
        Task NotifyAccountSecurityAsync(string userId, string securityEvent, string details);

        // Doctor Notifications
        Task NotifyNewConsultationQuestionAsync(string doctorId, string consultationId, string patientName, string questionPreview);

        // Staff Notifications
        Task NotifyStaffAppointmentUpdateAsync(string staffId, string appointmentId, string updateType, string details);
        Task NotifyStaffConsultationAsync(string staffId, string consultationId, string eventType, string details);

        // Admin Notifications
        Task NotifyNewUserRegistrationAsync(string adminId, string newUserId, string userRole, string userEmail);
        Task NotifySystemReportAsync(string adminId, string reportType, string summary);
        Task NotifyUserManagementEventAsync(string adminId, string targetUserId, string eventType, string details);

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

        // ============ PATIENT NOTIFICATIONS ============

        public async Task NotifyMedicationReminderAsync(string patientId, string medicationName, string dosage, string frequency)
        {
            try
            {
                var title = "💊 Nhắc nhở uống thuốc";
                var message = $"Đã đến giờ uống thuốc {medicationName} ({dosage}). Tần suất: {frequency}";

                var metadata = new
                {
                    medicationName,
                    dosage,
                    frequency,
                    reminderTime = DateTime.Now.ToString("HH:mm"),
                    eventType = "medication_reminder"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = patientId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.ARV,
                    Priority = NotificationPriorities.HIGH,
                    ActionUrl = "/arv-management",
                    ActionText = "Xem chi tiết",
                    RelatedEntityType = "medication",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"Medication reminder sent to patient {patientId} for {medicationName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending medication reminder: {ex.Message}");
            }
        }

        public async Task NotifyTestResultAvailableAsync(string patientId, string testType, string resultSummary)
        {
            try
            {
                var title = "🧪 Kết quả xét nghiệm có sẵn";
                var message = $"Kết quả xét nghiệm {testType} đã có. {resultSummary}";

                var metadata = new
                {
                    testType,
                    resultSummary,
                    availableDate = DateTime.Now.ToString("dd/MM/yyyy"),
                    eventType = "test_result_available"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = patientId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.TEST_RESULT,
                    Priority = NotificationPriorities.HIGH,
                    ActionUrl = "/test-results",
                    ActionText = "Xem kết quả",
                    RelatedEntityType = "test_result",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"Test result notification sent to patient {patientId} for {testType}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending test result notification: {ex.Message}");
            }
        }

        public async Task NotifyNewBlogPostAsync(string userId, string blogTitle, string category)
        {
            try
            {
                var title = "📚 Bài viết mới";
                var message = $"Bài viết mới trong danh mục {category}: {blogTitle}";

                var metadata = new
                {
                    blogTitle,
                    category,
                    publishDate = DateTime.Now.ToString("dd/MM/yyyy"),
                    eventType = "new_blog_post"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.BLOG,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = "/blog",
                    ActionText = "Đọc bài viết",
                    RelatedEntityType = "blog_post",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"New blog post notification sent to user {userId}: {blogTitle}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending blog post notification: {ex.Message}");
            }
        }

        public async Task NotifyAccountSecurityAsync(string userId, string securityEvent, string details)
        {
            try
            {
                var title = "🔐 Cảnh báo bảo mật tài khoản";
                var message = $"Sự kiện bảo mật: {securityEvent}. {details}";

                var priority = securityEvent.ToLower().Contains("login") ? NotificationPriorities.NORMAL : NotificationPriorities.HIGH;

                var metadata = new
                {
                    securityEvent,
                    details,
                    timestamp = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    eventType = "account_security"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.SYSTEM,
                    Priority = priority,
                    ActionUrl = "/profile/security",
                    ActionText = "Kiểm tra bảo mật",
                    RelatedEntityType = "security_event",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"Security notification sent to user {userId}: {securityEvent}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending security notification: {ex.Message}");
            }
        }

        // ============ DOCTOR NOTIFICATIONS ============

        public async Task NotifyNewConsultationQuestionAsync(string doctorId, string consultationId, string patientName, string questionPreview)
        {
            try
            {
                var title = "💬 Câu hỏi tư vấn mới";
                var message = $"Bệnh nhân {patientName} đã gửi câu hỏi tư vấn: {questionPreview}";

                var metadata = new
                {
                    consultationId,
                    patientName,
                    questionPreview,
                    receivedTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    eventType = "new_consultation_question"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = doctorId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.CONSULTATION,
                    Priority = NotificationPriorities.HIGH,
                    ActionUrl = $"/doctor/consultations/{consultationId}",
                    ActionText = "Trả lời tư vấn",
                    RelatedEntityId = consultationId,
                    RelatedEntityType = "consultation",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"New consultation notification sent to doctor {doctorId} for consultation {consultationId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending consultation notification to doctor: {ex.Message}");
            }
        }

        // ============ STAFF NOTIFICATIONS ============

        public async Task NotifyStaffAppointmentUpdateAsync(string staffId, string appointmentId, string updateType, string details)
        {
            try
            {
                var title = "📅 Cập nhật lịch hẹn";
                var message = $"Lịch hẹn {appointmentId} - {updateType}: {details}";

                var metadata = new
                {
                    appointmentId,
                    updateType,
                    details,
                    updateTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    eventType = "staff_appointment_update"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = staffId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.APPOINTMENT,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = $"/staff/appointments/{appointmentId}",
                    ActionText = "Xem chi tiết",
                    RelatedEntityId = appointmentId,
                    RelatedEntityType = "appointment",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"Staff appointment update notification sent to {staffId} for appointment {appointmentId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending staff appointment notification: {ex.Message}");
            }
        }

        public async Task NotifyStaffConsultationAsync(string staffId, string consultationId, string eventType, string details)
        {
            try
            {
                var title = "💬 Cập nhật tư vấn";
                var message = $"Tư vấn {consultationId} - {eventType}: {details}";

                var metadata = new
                {
                    consultationId,
                    eventType,
                    details,
                    updateTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    staffEventType = "staff_consultation_update"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = staffId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.CONSULTATION,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = $"/staff/consultations/{consultationId}",
                    ActionText = "Xem chi tiết",
                    RelatedEntityId = consultationId,
                    RelatedEntityType = "consultation",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"Staff consultation notification sent to {staffId} for consultation {consultationId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending staff consultation notification: {ex.Message}");
            }
        }

        // ============ ADMIN NOTIFICATIONS ============

        public async Task NotifyNewUserRegistrationAsync(string adminId, string newUserId, string userRole, string userEmail)
        {
            try
            {
                var title = "👤 Người dùng mới đăng ký";
                var message = $"Người dùng mới đăng ký: {userEmail} với vai trò {userRole}";

                var metadata = new
                {
                    newUserId,
                    userRole,
                    userEmail,
                    registrationTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    eventType = "new_user_registration"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = adminId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.SYSTEM,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = $"/admin/users/{newUserId}",
                    ActionText = "Xem người dùng",
                    RelatedEntityId = newUserId,
                    RelatedEntityType = "user",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"New user registration notification sent to admin {adminId} for user {newUserId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending new user registration notification: {ex.Message}");
            }
        }

        public async Task NotifySystemReportAsync(string adminId, string reportType, string summary)
        {
            try
            {
                var title = "📊 Báo cáo hệ thống";
                var message = $"Báo cáo {reportType}: {summary}";

                var metadata = new
                {
                    reportType,
                    summary,
                    reportTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    eventType = "system_report"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = adminId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.SYSTEM,
                    Priority = NotificationPriorities.NORMAL,
                    ActionUrl = "/admin/reports",
                    ActionText = "Xem báo cáo",
                    RelatedEntityType = "system_report",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"System report notification sent to admin {adminId}: {reportType}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending system report notification: {ex.Message}");
            }
        }

        public async Task NotifyUserManagementEventAsync(string adminId, string targetUserId, string eventType, string details)
        {
            try
            {
                var title = "👥 Quản lý người dùng";
                var message = $"Sự kiện quản lý người dùng: {eventType} - {details}";

                var priority = eventType.ToLower().Contains("delete") || eventType.ToLower().Contains("suspend")
                    ? NotificationPriorities.HIGH
                    : NotificationPriorities.NORMAL;

                var metadata = new
                {
                    targetUserId,
                    eventType,
                    details,
                    eventTime = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    managementEventType = "user_management_event"
                };

                await CreateNotificationAsync(new CreateNotificationRequest
                {
                    UserId = adminId,
                    Title = title,
                    Message = message,
                    Type = NotificationTypes.SYSTEM,
                    Priority = priority,
                    ActionUrl = $"/admin/users/{targetUserId}",
                    ActionText = "Xem chi tiết",
                    RelatedEntityId = targetUserId,
                    RelatedEntityType = "user_management",
                    CreatedBy = "system",
                    Metadata = System.Text.Json.JsonSerializer.Serialize(metadata)
                });

                Console.WriteLine($"User management notification sent to admin {adminId}: {eventType} for user {targetUserId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending user management notification: {ex.Message}");
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
