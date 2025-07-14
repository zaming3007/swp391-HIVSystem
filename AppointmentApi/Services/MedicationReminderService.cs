using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AppointmentApi.Services
{
    public class MedicationReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MedicationReminderService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1); // Check every hour

        public MedicationReminderService(IServiceProvider serviceProvider, ILogger<MedicationReminderService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Medication Reminder Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndSendMedicationReminders();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking medication reminders");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndSendMedicationReminders()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                var currentHour = DateTime.Now.Hour;

                // Common medication reminder times: 8AM, 12PM, 6PM, 10PM
                var reminderHours = new[] { 8, 12, 18, 22 };

                if (!reminderHours.Contains(currentHour))
                {
                    return; // Only send reminders at specific hours
                }

                // TODO: Uncomment when ARVPrescriptions table is added to ApplicationDbContext
                var activePrescriptions = new List<dynamic>(); // Temporary placeholder
                /*
                // Get active ARV prescriptions that need reminders
                var activePrescriptions = await context.ARVPrescriptions
                    .Where(p => p.Status == "active" &&
                               p.StartDate <= DateTime.Today &&
                               (p.EndDate == null || p.EndDate >= DateTime.Today))
                    .ToListAsync();
                */

                foreach (var prescription in activePrescriptions)
                {
                    try
                    {
                        // TODO: Uncomment when ARVPrescriptions table is available
                        /*
                        // Check if reminder already sent today for this hour
                        var today = DateTime.Today;
                        var reminderAlreadySent = await context.Notifications
                            .AnyAsync(n => n.UserId == prescription.PatientId &&
                                          n.Type == NotificationTypes.ARV &&
                                          n.CreatedAt.Date == today &&
                                          n.Metadata.Contains($"\"reminderHour\":{currentHour}") &&
                                          n.RelatedEntityId == prescription.Id);

                        if (!reminderAlreadySent)
                        {
                            // Get regimen details
                            var regimen = await context.ARVRegimens
                                .FirstOrDefaultAsync(r => r.Id == prescription.RegimenId);

                            if (regimen != null)
                            {
                                var medicationName = regimen.Name;
                                var dosage = prescription.Dosage ?? "Theo chỉ định";
                                var frequency = GetFrequencyText(prescription.Frequency);

                                await notificationService.NotifyMedicationReminderAsync(
                                    prescription.PatientId,
                                    medicationName,
                                    dosage,
                                    frequency
                                );

                                _logger.LogInformation($"Medication reminder sent to patient {prescription.PatientId} for {medicationName}");
                            }
                        }
                        */
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send medication reminder");
                    }
                }

                if (activePrescriptions.Any())
                {
                    _logger.LogInformation($"Processed {activePrescriptions.Count} medication prescriptions for reminders");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndSendMedicationReminders");
            }
        }

        private string GetFrequencyText(string? frequency)
        {
            return frequency?.ToLower() switch
            {
                "once_daily" => "Một lần mỗi ngày",
                "twice_daily" => "Hai lần mỗi ngày",
                "three_times_daily" => "Ba lần mỗi ngày",
                "four_times_daily" => "Bốn lần mỗi ngày",
                "as_needed" => "Khi cần thiết",
                _ => frequency ?? "Theo chỉ định bác sĩ"
            };
        }
    }
}
