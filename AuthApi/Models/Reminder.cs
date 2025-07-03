using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("Reminders")]
    public class Reminder
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("user_id")]
        [Required]
        public string UserId { get; set; }
        
        [Column("title")]
        [Required]
        public string Title { get; set; }
        
        [Column("description")]
        public string Description { get; set; }
        
        [Column("reminder_type")]
        [Required]
        public string ReminderType { get; set; } // "medication" hoặc "appointment"
        
        [Column("start_date")]
        [Required]
        public DateTime StartDate { get; set; }
        
        [Column("end_date")]
        public DateTime? EndDate { get; set; }
        
        [Column("time")]
        [Required]
        public TimeSpan Time { get; set; }
        
        [Column("recurrence")]
        public string Recurrence { get; set; } // "daily", "weekly", "monthly", "none"
        
        [Column("recurrence_days")]
        public string RecurrenceDays { get; set; } // Format JSON array để lưu các ngày trong tuần, ví dụ: "[1,3,5]" cho Thứ 2, Thứ 4, Thứ 6
        
        [Column("is_active")]
        public bool IsActive { get; set; } = true;
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [Column("medication_name")]
        public string MedicationName { get; set; } // Dành cho nhắc nhở uống thuốc
        
        [Column("dosage")]
        public string Dosage { get; set; } // Liều lượng thuốc
        
        [Column("doctor_id")]
        public string DoctorId { get; set; } // Dành cho lịch tái khám
        
        [Column("appointment_id")]
        public string AppointmentId { get; set; } // ID của cuộc hẹn gốc
        
        [Column("is_read")]
        public bool IsRead { get; set; } = false; // Người dùng đã đọc thông báo chưa
        
        [Column("last_notification_sent")]
        public DateTime? LastNotificationSent { get; set; } // Thời điểm gửi thông báo gần nhất
        
        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
} 