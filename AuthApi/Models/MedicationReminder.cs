using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("MedicationReminders")]
    public class MedicationReminder
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("user_id")]
        [Required]
        public string UserId { get; set; }
        
        [Column("medication_name")]
        [Required]
        public string MedicationName { get; set; }
        
        [Column("dosage")]
        public string Dosage { get; set; }
        
        [Column("frequency")]
        public string Frequency { get; set; } // Ví dụ: "daily", "twice_daily", "weekly"
        
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        
        [Column("end_date")]
        public DateTime? EndDate { get; set; }
        
        [Column("reminder_times")]
        public string ReminderTimes { get; set; } // Lưu dưới dạng chuỗi JSON, ví dụ: ["08:00", "20:00"]
        
        [Column("notes")]
        public string Notes { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
} 