using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace AppointmentApi.Services
{
    public class UserManagementNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserManagementNotificationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(10); // Check every 10 minutes

        public UserManagementNotificationService(IServiceProvider serviceProvider, ILogger<UserManagementNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("User Management Notification Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndNotifyUserEvents();
                    await GenerateSystemReports();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking user management events");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndNotifyUserEvents()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                await CheckNewUserRegistrations(context, notificationService);
                await CheckDoctorAdditions(context, notificationService);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndNotifyUserEvents");
            }
        }

        private async Task CheckNewUserRegistrations(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                // Check for new appointments as a proxy for new user registrations
                // (since we don't have direct access to AuthApi user registration events)
                var tenMinutesAgo = DateTime.UtcNow.AddMinutes(-10);

                var newPatients = await context.Appointments
                    .Where(a => a.CreatedAt >= tenMinutesAgo)
                    .GroupBy(a => a.PatientId)
                    .Select(g => new { PatientId = g.Key, FirstAppointment = g.Min(a => a.CreatedAt), PatientName = g.First().PatientName })
                    .Where(p => p.FirstAppointment >= tenMinutesAgo)
                    .ToListAsync();

                foreach (var newPatient in newPatients)
                {
                    try
                    {
                        // Check if we already notified about this user
                        var alreadyNotified = await context.Notifications
                            .AnyAsync(n => n.RelatedEntityId == newPatient.PatientId &&
                                          n.Type == NotificationTypes.SYSTEM &&
                                          n.Metadata.Contains("new_user_registration"));

                        if (!alreadyNotified)
                        {
                            var adminUsers = await GetAdminUsersAsync(context);
                            foreach (var adminId in adminUsers)
                            {
                                await notificationService.NotifyNewUserRegistrationAsync(
                                    adminId,
                                    newPatient.PatientId,
                                    "customer",
                                    $"{newPatient.PatientName} (từ đặt lịch hẹn)"
                                );
                            }

                            _logger.LogInformation($"New user registration notification sent for patient {newPatient.PatientId}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send new user notification for {newPatient.PatientId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking new user registrations");
            }
        }

        private async Task CheckDoctorAdditions(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                // Check for newly added doctors
                var tenMinutesAgo = DateTime.UtcNow.AddMinutes(-10);

                var newDoctors = await context.Doctors
                    .Where(d => d.CreatedAt >= tenMinutesAgo &&
                               !context.Notifications.Any(n =>
                                   n.RelatedEntityId == d.Id &&
                                   n.Type == NotificationTypes.SYSTEM &&
                                   n.Metadata.Contains("new_doctor_added")))
                    .ToListAsync();

                foreach (var doctor in newDoctors)
                {
                    try
                    {
                        var adminUsers = await GetAdminUsersAsync(context);
                        foreach (var adminId in adminUsers)
                        {
                            await notificationService.NotifyUserManagementEventAsync(
                                adminId,
                                doctor.Id,
                                "Thêm bác sĩ mới",
                                $"Bác sĩ {doctor.FirstName} {doctor.LastName} - {doctor.Specialization}"
                            );
                        }

                        _logger.LogInformation($"New doctor notification sent for doctor {doctor.Id}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send new doctor notification for {doctor.Id}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking new doctor additions");
            }
        }

        private async Task GenerateSystemReports()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                // Generate hourly system reports (only at specific hours)
                var currentHour = DateTime.Now.Hour;
                var reportHours = new[] { 9, 15, 21 }; // 9AM, 3PM, 9PM

                if (reportHours.Contains(currentHour))
                {
                    await GenerateAppointmentReport(context, notificationService);
                    await GenerateConsultationReport(context, notificationService);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating system reports");
            }
        }

        private async Task GenerateAppointmentReport(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                var today = DateTime.Today;
                var todayAppointments = await context.Appointments
                    .Where(a => a.Date.Date == today)
                    .CountAsync();

                var pendingAppointments = await context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Pending)
                    .CountAsync();

                var summary = $"Hôm nay: {todayAppointments} lịch hẹn, {pendingAppointments} chờ xác nhận";

                var adminUsers = await GetAdminUsersAsync(context);
                foreach (var adminId in adminUsers)
                {
                    await notificationService.NotifySystemReportAsync(
                        adminId,
                        "Báo cáo lịch hẹn",
                        summary
                    );
                }

                _logger.LogInformation($"Appointment report sent: {summary}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating appointment report");
            }
        }

        private async Task GenerateConsultationReport(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                var today = DateTime.Today;
                // TODO: Uncomment when Consultations table is available
                var todayConsultations = 0; // Temporary placeholder
                var unansweredConsultations = 0; // Temporary placeholder
                /*
                var todayConsultations = await context.Consultations
                    .Where(c => c.CreatedAt.Date == today)
                    .CountAsync();

                var unansweredConsultations = await context.Consultations
                    .Where(c => !context.Answers.Any(a => a.ConsultationId == c.Id))
                    .CountAsync();
                */

                var summary = $"Hôm nay: {todayConsultations} câu hỏi mới, {unansweredConsultations} chưa trả lời";

                var adminUsers = await GetAdminUsersAsync(context);
                foreach (var adminId in adminUsers)
                {
                    await notificationService.NotifySystemReportAsync(
                        adminId,
                        "Báo cáo tư vấn",
                        summary
                    );
                }

                _logger.LogInformation($"Consultation report sent: {summary}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating consultation report");
            }
        }

        private async Task<List<string>> GetAdminUsersAsync(ApplicationDbContext context)
        {
            try
            {
                // This would typically call AuthApi to get admin users
                // For now, return default admin users
                return new List<string> { "admin@gmail.com" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin users");
                return new List<string> { "admin@gmail.com" };
            }
        }
    }
}
