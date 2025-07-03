using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AuthApi.Models;

namespace AuthApi.Services
{
    public interface IReminderService
    {
        Task<IEnumerable<Reminder>> GetAllRemindersAsync(string userId);
        Task<IEnumerable<Reminder>> GetRemindersByTypeAsync(string userId, string reminderType);
        Task<Reminder> GetReminderByIdAsync(string reminderId, string userId);
        Task<Reminder> CreateReminderAsync(Reminder reminder);
        Task<Reminder> UpdateReminderAsync(string reminderId, Reminder reminder, string userId);
        Task<bool> DeleteReminderAsync(string reminderId, string userId);
        Task<IEnumerable<Reminder>> GetUpcomingRemindersAsync(string userId, int days = 7);
        Task<IEnumerable<Reminder>> GetTodayRemindersAsync(string userId);
        Task<bool> MarkReminderAsReadAsync(string reminderId, string userId);
        Task ProcessDueRemindersAsync(); // For background service to process due reminders
    }
} 