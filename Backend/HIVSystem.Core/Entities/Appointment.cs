using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class Appointment
    {
        [Key]
        public int AppointmentID { get; set; }

        public int? PatientID { get; set; }

        public int? DoctorID { get; set; }

        public int? FacilityID { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        [StringLength(50)]
        public string? AppointmentType { get; set; } // Regular, Follow-up, Emergency

        [StringLength(255)]
        public string? Purpose { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Scheduled"; // Scheduled, Confirmed, Completed, Cancelled, No-show

        public string? Notes { get; set; }

        public bool IsAnonymous { get; set; } = false;

        public bool ReminderSent { get; set; } = false;

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        [ForeignKey("PatientID")]
        public virtual Patient? Patient { get; set; }

        [ForeignKey("DoctorID")]
        public virtual Doctor? Doctor { get; set; }

        [ForeignKey("FacilityID")]
        public virtual Facility? Facility { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User? CreatedByUser { get; set; }

        public virtual ICollection<AppointmentReminder> Reminders { get; set; } = new List<AppointmentReminder>();
    }
} 