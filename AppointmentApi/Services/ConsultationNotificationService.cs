using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AppointmentApi.Services
{
    public class ConsultationNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ConsultationNotificationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

        public ConsultationNotificationService(IServiceProvider serviceProvider, ILogger<ConsultationNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Consultation Notification Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndNotifyConsultationEvents();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking consultation events");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndNotifyConsultationEvents()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                await CheckNewConsultationQuestions(context, notificationService);
                await CheckAnsweredConsultations(context, notificationService);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndNotifyConsultationEvents");
            }
        }

        private async Task CheckNewConsultationQuestions(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                // Get new consultation questions in the last 5 minutes that haven't been notified
                var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);

                // TODO: Uncomment when Consultations table is added to ApplicationDbContext
                var newConsultations = new List<dynamic>(); // Temporary placeholder
                /*
                var newConsultations = await context.Consultations
                    .Where(c => c.CreatedAt >= fiveMinutesAgo &&
                               !context.Notifications.Any(n =>
                                   n.RelatedEntityId == c.Id &&
                                   n.Type == NotificationTypes.CONSULTATION &&
                                   n.Metadata.Contains("new_consultation_question")))
                    .ToListAsync();
                */

                foreach (var consultation in newConsultations)
                {
                    try
                    {
                        // TODO: Uncomment when Consultations table is available
                        /*
                        // Get available doctors to notify
                        var availableDoctors = await GetAvailableDoctorsAsync(context);

                        var questionPreview = consultation.Question.Length > 100
                            ? consultation.Question.Substring(0, 100) + "..."
                            : consultation.Question;

                        foreach (var doctorId in availableDoctors)
                        {
                            await notificationService.NotifyNewConsultationQuestionAsync(
                                doctorId,
                                consultation.Id,
                                consultation.CustomerName ?? "Khách hàng",
                                questionPreview
                            );
                        }

                        // Also notify staff
                        var staffUsers = await GetStaffUsersAsync(context);
                        foreach (var staffId in staffUsers)
                        {
                            await notificationService.NotifyStaffConsultationAsync(
                                staffId,
                                consultation.Id,
                                "Câu hỏi mới",
                                $"Từ {consultation.CustomerName ?? "Khách hàng"}"
                            );
                        }

                        _logger.LogInformation($"New consultation notification sent for consultation {consultation.Id}");
                        */
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send new consultation notification");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking new consultation questions");
            }
        }

        private async Task CheckAnsweredConsultations(ApplicationDbContext context, INotificationService notificationService)
        {
            try
            {
                // TODO: Uncomment when Answers table is added to ApplicationDbContext
                /*
                // Get consultations that were answered in the last 5 minutes
                var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);

                var answeredConsultations = await context.Answers
                    .Where(a => a.CreatedAt >= fiveMinutesAgo &&
                               !context.Notifications.Any(n =>
                                   n.RelatedEntityId == a.ConsultationId &&
                                   n.Type == NotificationTypes.CONSULTATION &&
                                   n.Metadata.Contains("consultation_answered")))
                    .Include(a => a.Consultation)
                    .ToListAsync();
                */
                var answeredConsultations = new List<dynamic>(); // Temporary placeholder

                foreach (var answer in answeredConsultations)
                {
                    try
                    {
                        if (answer.Consultation != null)
                        {
                            // Notify patient that their consultation was answered
                            await notificationService.CreateNotificationAsync(new CreateNotificationRequest
                            {
                                UserId = answer.Consultation.CustomerId,
                                Title = "💬 Tư vấn đã được trả lời",
                                Message = $"Câu hỏi tư vấn của bạn đã được bác sĩ trả lời",
                                Type = NotificationTypes.CONSULTATION,
                                Priority = NotificationPriorities.HIGH,
                                ActionUrl = $"/consultations/{answer.ConsultationId}",
                                ActionText = "Xem câu trả lời",
                                RelatedEntityId = answer.ConsultationId,
                                RelatedEntityType = "consultation",
                                CreatedBy = "system",
                                Metadata = System.Text.Json.JsonSerializer.Serialize(new
                                {
                                    consultationId = answer.ConsultationId,
                                    answeredBy = answer.DoctorName ?? "Bác sĩ",
                                    answeredAt = answer.CreatedAt.ToString("dd/MM/yyyy HH:mm"),
                                    eventType = "consultation_answered"
                                })
                            });

                            // Notify staff about the answered consultation
                            var staffUsers = await GetStaffUsersAsync(context);
                            foreach (var staffId in staffUsers)
                            {
                                await notificationService.NotifyStaffConsultationAsync(
                                    staffId,
                                    answer.ConsultationId,
                                    "Đã trả lời",
                                    $"Bởi {answer.DoctorName ?? "Bác sĩ"}"
                                );
                            }

                            _logger.LogInformation($"Consultation answered notification sent for consultation {answer.ConsultationId}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send answered consultation notification for {answer.ConsultationId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking answered consultations");
            }
        }

        private async Task<List<string>> GetAvailableDoctorsAsync(ApplicationDbContext context)
        {
            try
            {
                var availableDoctors = await context.Doctors
                    .Where(d => d.Available)
                    .Select(d => d.Id)
                    .ToListAsync();

                // Add default test doctors if none found
                if (!availableDoctors.Any())
                {
                    availableDoctors.Add("doctor@gmail.com");
                }

                return availableDoctors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available doctors");
                return new List<string> { "doctor@gmail.com" };
            }
        }

        private async Task<List<string>> GetStaffUsersAsync(ApplicationDbContext context)
        {
            try
            {
                // This would typically call AuthApi to get staff users
                // For now, return default staff users
                return new List<string> { "staff@gmail.com" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting staff users");
                return new List<string> { "staff@gmail.com" };
            }
        }
    }
}
