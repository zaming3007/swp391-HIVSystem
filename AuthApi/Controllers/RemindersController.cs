using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RemindersController : ControllerBase
    {
        private readonly IReminderService _reminderService;
        private readonly ILogger<RemindersController> _logger;

        public RemindersController(IReminderService reminderService, ILogger<RemindersController> logger)
        {
            _reminderService = reminderService;
            _logger = logger;
        }

        // GET: api/Reminders
        [HttpGet]
        public async Task<IActionResult> GetReminders()
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reminders = await _reminderService.GetAllRemindersAsync(userId);
                return Ok(reminders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reminders");
                return BadRequest(new { message = "Could not retrieve reminders" });
            }
        }

        // GET: api/Reminders/type/{reminderType}
        [HttpGet("type/{reminderType}")]
        public async Task<IActionResult> GetRemindersByType(string reminderType)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reminders = await _reminderService.GetRemindersByTypeAsync(userId, reminderType);
                return Ok(reminders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reminders of type {reminderType}");
                return BadRequest(new { message = $"Could not retrieve reminders of type {reminderType}" });
            }
        }

        // GET: api/Reminders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReminder(string id)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reminder = await _reminderService.GetReminderByIdAsync(id, userId);
                if (reminder == null)
                {
                    return NotFound(new { message = "Reminder not found" });
                }

                return Ok(reminder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reminder with ID {id}");
                return BadRequest(new { message = "Could not retrieve reminder" });
            }
        }

        // POST: api/Reminders
        [HttpPost]
        public async Task<IActionResult> CreateReminder(Reminder reminder)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                reminder.UserId = userId;
                var createdReminder = await _reminderService.CreateReminderAsync(reminder);
                return CreatedAtAction(nameof(GetReminder), new { id = createdReminder.Id }, createdReminder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reminder");
                return BadRequest(new { message = "Could not create reminder" });
            }
        }

        // PUT: api/Reminders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReminder(string id, Reminder reminder)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                if (id != reminder.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var updatedReminder = await _reminderService.UpdateReminderAsync(id, reminder, userId);
                if (updatedReminder == null)
                {
                    return NotFound(new { message = "Reminder not found" });
                }

                return Ok(updatedReminder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating reminder with ID {id}");
                return BadRequest(new { message = "Could not update reminder" });
            }
        }

        // DELETE: api/Reminders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(string id)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var result = await _reminderService.DeleteReminderAsync(id, userId);
                if (!result)
                {
                    return NotFound(new { message = "Reminder not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting reminder with ID {id}");
                return BadRequest(new { message = "Could not delete reminder" });
            }
        }

        // GET: api/Reminders/upcoming
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingReminders([FromQuery] int days = 7)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reminders = await _reminderService.GetUpcomingRemindersAsync(userId, days);
                return Ok(reminders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting upcoming reminders");
                return BadRequest(new { message = "Could not retrieve upcoming reminders" });
            }
        }

        // GET: api/Reminders/today
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayReminders()
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reminders = await _reminderService.GetTodayRemindersAsync(userId);
                return Ok(reminders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting today's reminders");
                return BadRequest(new { message = "Could not retrieve today's reminders" });
            }
        }

        // PUT: api/Reminders/{id}/markAsRead
        [HttpPut("{id}/markAsRead")]
        public async Task<IActionResult> MarkReminderAsRead(string id)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var result = await _reminderService.MarkReminderAsReadAsync(id, userId);
                if (!result)
                {
                    return NotFound(new { message = "Reminder not found" });
                }

                return Ok(new { message = "Reminder marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error marking reminder with ID {id} as read");
                return BadRequest(new { message = "Could not mark reminder as read" });
            }
        }
    }
} 