using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class Doctor
    {
        [Key]
        public int DoctorID { get; set; }

        public int? UserID { get; set; }

        [StringLength(100)]
        public string? Specialty { get; set; }

        [StringLength(255)]
        public string? Qualification { get; set; }

        [StringLength(50)]
        public string? LicenseNumber { get; set; }

        public string? Biography { get; set; }

        public int? YearsOfExperience { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ConsultationFee { get; set; }

        [StringLength(20)]
        public string VerificationStatus { get; set; } = "Pending"; // Pending, Verified, Rejected

        public DateTime? VerificationDate { get; set; }

        public int? VerifiedBy { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual User? User { get; set; }

        [ForeignKey("VerifiedBy")]
        public virtual User? VerifiedByUser { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<DoctorEducation> Educations { get; set; } = new List<DoctorEducation>();
        public virtual ICollection<DoctorCertification> Certifications { get; set; } = new List<DoctorCertification>();
        public virtual ICollection<DoctorSchedule> Schedules { get; set; } = new List<DoctorSchedule>();
        public virtual ICollection<DoctorAvailability> Availabilities { get; set; } = new List<DoctorAvailability>();
        public virtual ICollection<FacilityDoctor> FacilityDoctors { get; set; } = new List<FacilityDoctor>();
        public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
        public virtual ICollection<TreatmentPlan> TreatmentPlans { get; set; } = new List<TreatmentPlan>();
    }
} 