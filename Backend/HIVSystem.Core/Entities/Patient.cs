using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class Patient
    {
        [Key]
        public int PatientID { get; set; }

        public int? UserID { get; set; }

        [StringLength(20)]
        public string? PatientCode { get; set; }

        [StringLength(5)]
        public string? BloodType { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Height { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Weight { get; set; }

        [StringLength(100)]
        public string? EmergencyContact { get; set; }

        [StringLength(15)]
        public string? EmergencyPhone { get; set; }

        [StringLength(50)]
        public string? EmergencyRelationship { get; set; }

        [StringLength(255)]
        public string? InsuranceInfo { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual User? User { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<PatientMedicalHistory> MedicalHistories { get; set; } = new List<PatientMedicalHistory>();
        public virtual ICollection<PatientAllergy> Allergies { get; set; } = new List<PatientAllergy>();
        public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
        public virtual ICollection<TreatmentPlan> TreatmentPlans { get; set; } = new List<TreatmentPlan>();
    }
} 