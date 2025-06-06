using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVHealthcareSystem.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentID { get; set; }

        public int? PatientID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        public int? FacilityID { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        [StringLength(50)]
        public string? AppointmentType { get; set; }

        [StringLength(255)]
        public string? Purpose { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Scheduled";

        public string? Notes { get; set; }

        public bool IsAnonymous { get; set; } = false;

        public bool ReminderSent { get; set; } = false;

        // Additional fields for anonymous appointments
        [StringLength(255)]
        public string? PatientName { get; set; }

        [StringLength(20)]
        public string? PatientPhone { get; set; }

        [StringLength(255)]
        public string? PatientEmail { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ConsultationFee { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        [ForeignKey("PatientID")]
        public virtual User? Patient { get; set; }

        // Temporarily disable Doctor navigation property to avoid EF conflicts
        // [ForeignKey("DoctorID")]
        // public virtual Doctor Doctor { get; set; } = null!;

        [ForeignKey("FacilityID")]
        public virtual Facility? Facility { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User? Creator { get; set; }
    }
} 