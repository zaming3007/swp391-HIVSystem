using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AppointmentApi.Services
{
    public class AppointmentReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AppointmentReminderService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1); // Check every hour

        public AppointmentReminderService(IServiceProvider serviceProvider, ILogger<AppointmentReminderService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Appointment Reminder Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndSendReminders();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking appointment reminders");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndSendReminders()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                var tomorrow = DateTime.Today.AddDays(1);
                var dayAfterTomorrow = DateTime.Today.AddDays(2);

                // Get appointments for tomorrow and day after tomorrow that haven't been reminded
                var upcomingAppointments = await context.Appointments
                    .Where(a => (a.Date.Date == tomorrow || a.Date.Date == dayAfterTomorrow) &&
                               a.Status == AppointmentStatus.Confirmed &&
                               !context.Notifications.Any(n => 
                                   n.RelatedEntityId == a.Id && 
                                   n.Type == NotificationTypes.REMINDER &&
                                   n.CreatedAt.Date == DateTime.Today))
                    .ToListAsync();

                foreach (var appointment in upcomingAppointments)
                {
                    try
                    {
                        await notificationService.NotifyAppointmentReminderAsync(appointment.Id);
                        _logger.LogInformation($"Reminder sent for appointment {appointment.Id}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send reminder for appointment {appointment.Id}");
                    }
                }

                if (upcomingAppointments.Any())
                {
                    _logger.LogInformation($"Sent {upcomingAppointments.Count} appointment reminders");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndSendReminders");
            }
        }
    }
}
