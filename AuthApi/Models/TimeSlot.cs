using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("TimeSlots")]
    public class TimeSlot
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("doctor_id")]
        [Required]
        public string DoctorId { get; set; }
        
        [Column("day_of_week")]
        public int DayOfWeek { get; set; }
        
        [Column("start_time")]
        [Required]
        public string StartTime { get; set; }
        
        [Column("end_time")]
        [Required]
        public string EndTime { get; set; }
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
    }
} 