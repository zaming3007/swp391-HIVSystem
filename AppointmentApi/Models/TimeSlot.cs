using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("TimeSlots")]
    public class TimeSlot
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        public string DoctorId { get; set; } = string.Empty;
        
        public int DayOfWeek { get; set; }
        
        public string StartTime { get; set; } = string.Empty;
        
        public string EndTime { get; set; } = string.Empty;
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }
    }
} 