using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class AppointmentReminder
    {
        [Key]
        public int ReminderID { get; set; }

        public int? AppointmentID { get; set; }

        [StringLength(20)]
        public string? ReminderType { get; set; } // Email, SMS, Push

        public DateTime? ReminderTime { get; set; }

        [StringLength(20)]
        public string? Status { get; set; } // Pending, Sent, Failed

        public DateTime? SentDate { get; set; }

        // Navigation properties
        [ForeignKey("AppointmentID")]
        public virtual Appointment? Appointment { get; set; }
    }
} 