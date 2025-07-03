using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Data;
using AuthApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AuthApi.Services
{
    public class ReminderService : IReminderService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReminderService> _logger;

        public ReminderService(ApplicationDbContext context, ILogger<ReminderService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Reminder>> GetAllRemindersAsync(string userId)
        {
            return await _context.Reminders
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reminder>> GetRemindersByTypeAsync(string userId, string reminderType)
        {
            return await _context.Reminders
                .Where(r => r.UserId == userId && r.ReminderType == reminderType)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Reminder> GetReminderByIdAsync(string reminderId, string userId)
        {
            return await _context.Reminders
                .FirstOrDefaultAsync(r => r.Id == reminderId && r.UserId == userId);
        }

        public async Task<Reminder> CreateReminderAsync(Reminder reminder)
        {
            reminder.Id = Guid.NewGuid().ToString();
            reminder.CreatedAt = DateTime.UtcNow;
            reminder.IsActive = true;
            reminder.IsRead = false;

            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created reminder {reminder.Id} for user {reminder.UserId}");
            return reminder;
        }

        public async Task<Reminder> UpdateReminderAsync(string reminderId, Reminder reminderUpdate, string userId)
        {
            var reminder = await _context.Reminders
                .FirstOrDefaultAsync(r => r.Id == reminderId && r.UserId == userId);

            if (reminder == null)
            {
                return null;
            }

            // Cập nhật các thuộc tính
            reminder.Title = reminderUpdate.Title;
            reminder.Description = reminderUpdate.Description;
            reminder.ReminderType = reminderUpdate.ReminderType;
            reminder.StartDate = reminderUpdate.StartDate;
            reminder.EndDate = reminderUpdate.EndDate;
            reminder.Time = reminderUpdate.Time;
            reminder.Recurrence = reminderUpdate.Recurrence;
            reminder.RecurrenceDays = reminderUpdate.RecurrenceDays;
            reminder.IsActive = reminderUpdate.IsActive;
            reminder.MedicationName = reminderUpdate.MedicationName;
            reminder.Dosage = reminderUpdate.Dosage;
            reminder.DoctorId = reminderUpdate.DoctorId;
            reminder.AppointmentId = reminderUpdate.AppointmentId;
            reminder.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Updated reminder {reminderId} for user {userId}");

            return reminder;
        }

        public async Task<bool> DeleteReminderAsync(string reminderId, string userId)
        {
            var reminder = await _context.Reminders
                .FirstOrDefaultAsync(r => r.Id == reminderId && r.UserId == userId);

            if (reminder == null)
            {
                return false;
            }

            _context.Reminders.Remove(reminder);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Deleted reminder {reminderId} for user {userId}");

            return true;
        }

        public async Task<IEnumerable<Reminder>> GetUpcomingRemindersAsync(string userId, int days = 7)
        {
            var endDate = DateTime.UtcNow.AddDays(days);
            return await _context.Reminders
                .Where(r => r.UserId == userId && 
                            r.IsActive && 
                            r.StartDate <= endDate && 
                            (r.EndDate == null || r.EndDate >= DateTime.UtcNow))
                .OrderBy(r => r.StartDate)
                .ThenBy(r => r.Time)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reminder>> GetTodayRemindersAsync(string userId)
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Reminders
                .Where(r => r.UserId == userId && 
                            r.IsActive && 
                            r.StartDate.Date <= today && 
                            (r.EndDate == null || r.EndDate.Value.Date >= today))
                .OrderBy(r => r.Time)
                .ToListAsync();
        }

        public async Task<bool> MarkReminderAsReadAsync(string reminderId, string userId)
        {
            var reminder = await _context.Reminders
                .FirstOrDefaultAsync(r => r.Id == reminderId && r.UserId == userId);

            if (reminder == null)
            {
                return false;
            }

            reminder.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ProcessDueRemindersAsync()
        {
            var now = DateTime.UtcNow;
            var today = now.Date;

            // Lấy tất cả nhắc nhở đang hoạt động và đến hạn nhưng chưa gửi thông báo hôm nay
            var dueReminders = await _context.Reminders
                .Where(r => r.IsActive &&
                           r.StartDate.Date <= today &&
                           (r.EndDate == null || r.EndDate.Value.Date >= today) &&
                           (r.LastNotificationSent == null || r.LastNotificationSent.Value.Date < today))
                .ToListAsync();

            foreach (var reminder in dueReminders)
            {
                // Kiểm tra xem nhắc nhở có áp dụng cho ngày hôm nay không
                if (ShouldSendNotificationToday(reminder, now))
                {
                    // Gửi thông báo (trong môi trường thực, bạn sẽ gọi dịch vụ push notification ở đây)
                    _logger.LogInformation($"Sending notification for reminder {reminder.Id} to user {reminder.UserId}");
                    
                    // Cập nhật thời điểm gửi thông báo gần nhất
                    reminder.LastNotificationSent = now;
                    _context.Reminders.Update(reminder);
                }
            }

            await _context.SaveChangesAsync();
        }

        private bool ShouldSendNotificationToday(Reminder reminder, DateTime now)
        {
            var dayOfWeek = (int)now.DayOfWeek;
            
            // Kiểm tra nếu là hàng ngày
            if (reminder.Recurrence == "daily")
                return true;

            // Kiểm tra nếu là hàng tuần và ngày hiện tại phù hợp
            if (reminder.Recurrence == "weekly" && !string.IsNullOrEmpty(reminder.RecurrenceDays))
            {
                try
                {
                    var days = System.Text.Json.JsonSerializer.Deserialize<List<int>>(reminder.RecurrenceDays);
                    return days != null && days.Contains(dayOfWeek);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error parsing recurrence days for reminder {reminder.Id}");
                    return false;
                }
            }

            // Kiểm tra nếu là hàng tháng và ngày trong tháng phù hợp
            if (reminder.Recurrence == "monthly" && reminder.StartDate.Day == now.Day)
                return true;

            // Nếu không có lặp lại, chỉ thông báo vào ngày bắt đầu
            if (reminder.Recurrence == "none" || string.IsNullOrEmpty(reminder.Recurrence))
                return reminder.StartDate.Date == now.Date;

            return false;
        }
    }
} 