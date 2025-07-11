using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("TimeSlots")]
    public class TimeSlot
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        
        [Column("doctor_id")]
        public string DoctorId { get; set; } = string.Empty;
        
        [Column("day_of_week")]
        public int DayOfWeek { get; set; }
        
        [Column("start_time")]
        public string StartTime { get; set; } = string.Empty;
        
        [Column("end_time")]
        public string EndTime { get; set; } = string.Empty;
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }
    }
} 