using Microsoft.AspNetCore.Mvc;
using HIVSystem.Web.Services;
using System.Text.Json;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        [HttpGet("my-notifications")]
        public IActionResult GetMyNotifications()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập" 
                    });
                }

                var userIdInt = int.Parse(userId);
                var notifications = MockMedicalDataService.GetUserNotifications(userIdInt);

                // Get read status from session storage simulation
                var readNotificationsKey = $"read_notifications_{userIdInt}";
                var readNotifications = HttpContext.Session.GetString(readNotificationsKey);
                var readIds = new List<string>();
                
                if (!string.IsNullOrEmpty(readNotifications))
                {
                    readIds = JsonSerializer.Deserialize<List<string>>(readNotifications) ?? new List<string>();
                }

                // Update read status based on session
                foreach (var notification in notifications)
                {
                    if (readIds.Contains(notification.Id))
                    {
                        notification.IsRead = true;
                    }
                }

                return Ok(new
                {
                    success = true,
                    data = notifications
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải thông báo: " + ex.Message
                });
            }
        }

        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Ok(new { 
                        success = true, 
                        count = 0 
                    });
                }

                var userIdInt = int.Parse(userId);
                var notifications = MockMedicalDataService.GetUserNotifications(userIdInt);

                // Get read status from session
                var readNotificationsKey = $"read_notifications_{userIdInt}";
                var readNotifications = HttpContext.Session.GetString(readNotificationsKey);
                var readIds = new List<string>();
                
                if (!string.IsNullOrEmpty(readNotifications))
                {
                    readIds = JsonSerializer.Deserialize<List<string>>(readNotifications) ?? new List<string>();
                }

                var unreadCount = notifications.Count(n => !readIds.Contains(n.Id));

                return Ok(new
                {
                    success = true,
                    count = unreadCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi đếm thông báo: " + ex.Message
                });
            }
        }

        [HttpPost("mark-read/{notificationId}")]
        public IActionResult MarkAsRead(string notificationId)
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập" 
                    });
                }

                var userIdInt = int.Parse(userId);
                var readNotificationsKey = $"read_notifications_{userIdInt}";
                var readNotifications = HttpContext.Session.GetString(readNotificationsKey);
                var readIds = new List<string>();
                
                if (!string.IsNullOrEmpty(readNotifications))
                {
                    readIds = JsonSerializer.Deserialize<List<string>>(readNotifications) ?? new List<string>();
                }

                if (!readIds.Contains(notificationId))
                {
                    readIds.Add(notificationId);
                    HttpContext.Session.SetString(readNotificationsKey, JsonSerializer.Serialize(readIds));
                }

                return Ok(new
                {
                    success = true,
                    message = "Đã đánh dấu đã đọc"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật trạng thái đọc: " + ex.Message
                });
            }
        }

        [HttpPost("mark-all-read")]
        public IActionResult MarkAllAsRead()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập" 
                    });
                }

                var userIdInt = int.Parse(userId);
                var notifications = MockMedicalDataService.GetUserNotifications(userIdInt);
                var allIds = notifications.Select(n => n.Id).ToList();

                var readNotificationsKey = $"read_notifications_{userIdInt}";
                HttpContext.Session.SetString(readNotificationsKey, JsonSerializer.Serialize(allIds));

                return Ok(new
                {
                    success = true,
                    message = "Đã đánh dấu tất cả đã đọc"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật trạng thái đọc: " + ex.Message
                });
            }
        }
    }
} 