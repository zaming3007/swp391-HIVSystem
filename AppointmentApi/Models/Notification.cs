using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    public class Notification
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(50)]
        public required string UserId { get; set; } // Người nhận thông báo

        [Required]
        [StringLength(100)]
        public required string Title { get; set; } // Tiêu đề thông báo

        [Required]
        [StringLength(500)]
        public required string Message { get; set; } // Nội dung thông báo

        [Required]
        [StringLength(50)]
        public required string Type { get; set; } // appointment, consultation, arv, blog, system...

        [StringLength(50)]
        public string? Priority { get; set; } = "normal"; // low, normal, high, urgent

        [StringLength(200)]
        public string? ActionUrl { get; set; } // URL để navigate khi click

        [StringLength(100)]
        public string? ActionText { get; set; } // Text cho action button

        [StringLength(50)]
        public string? RelatedEntityId { get; set; } // ID của entity liên quan (appointment_id, consultation_id...)

        [StringLength(50)]
        public string? RelatedEntityType { get; set; } // appointment, consultation, arv_regimen...

        public bool IsRead { get; set; } = false;

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReadAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        [StringLength(50)]
        public string? CreatedBy { get; set; } // Người tạo thông báo (system, doctor_id, staff_id...)

        // Metadata JSON cho các thông tin bổ sung
        [StringLength(1000)]
        public string? Metadata { get; set; }
    }

    // DTO cho tạo notification
    public class CreateNotificationRequest
    {
        public required string UserId { get; set; }
        public required string Title { get; set; }
        public required string Message { get; set; }
        public required string Type { get; set; }
        public string? Priority { get; set; } = "normal";
        public string? ActionUrl { get; set; }
        public string? ActionText { get; set; }
        public string? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
        public string? CreatedBy { get; set; }
        public string? Metadata { get; set; }
    }

    // DTO cho response
    public class NotificationResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string? ActionUrl { get; set; }
        public string? ActionText { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
        public string? Metadata { get; set; }
    }

    // DTO cho update notification
    public class UpdateNotificationRequest
    {
        public bool? IsRead { get; set; }
        public bool? IsDeleted { get; set; }
    }

    // Notification types constants
    public static class NotificationTypes
    {
        public const string APPOINTMENT = "appointment";
        public const string CONSULTATION = "consultation";
        public const string ARV = "arv";
        public const string BLOG = "blog";
        public const string SYSTEM = "system";
        public const string REMINDER = "reminder";
        public const string TEST_RESULT = "test_result";
        public const string MEDICATION = "medication";
        public const string SECURITY = "security";
        public const string USER_MANAGEMENT = "user_management";
    }

    // Notification priorities
    public static class NotificationPriorities
    {
        public const string LOW = "low";
        public const string NORMAL = "normal";
        public const string HIGH = "high";
        public const string URGENT = "urgent";
    }
}
