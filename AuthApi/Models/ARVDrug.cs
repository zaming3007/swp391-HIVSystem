using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    public class ARVDrug
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string GenericName { get; set; } = string.Empty;

        [StringLength(50)]
        public string BrandName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string DrugClass { get; set; } = string.Empty; // NRTI, NNRTI, PI, INSTI

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(100)]
        public string Dosage { get; set; } = string.Empty; // e.g., "300mg", "200mg/25mg"

        [StringLength(50)]
        public string Form { get; set; } = string.Empty; // Tablet, Capsule, Syrup

        [StringLength(1000)]
        public string SideEffects { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Contraindications { get; set; } = string.Empty;

        [StringLength(500)]
        public string Instructions { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public bool IsPregnancySafe { get; set; } = false;

        public bool IsPediatricSafe { get; set; } = false;

        [Range(0, 100)]
        public int MinAge { get; set; } = 0; // Minimum age in years

        [Range(0, 200)]
        public decimal MinWeight { get; set; } = 0; // Minimum weight in kg

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string CreatedBy { get; set; } = string.Empty;

        [StringLength(50)]
        public string UpdatedBy { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<ARVRegimenDrug> RegimenDrugs { get; set; } = new List<ARVRegimenDrug>();
    }

    public class ARVRegimen
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string RegimenType { get; set; } = string.Empty; // FirstLine, SecondLine, ThirdLine

        [StringLength(50)]
        public string TargetPopulation { get; set; } = string.Empty; // Adult, Pediatric, Pregnant, etc.

        [StringLength(1000)]
        public string Instructions { get; set; } = string.Empty;

        [StringLength(500)]
        public string Monitoring { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public bool IsPregnancySafe { get; set; } = false;

        public bool IsPediatricSafe { get; set; } = false;

        [Range(0, 100)]
        public int MinAge { get; set; } = 0;

        [Range(0, 200)]
        public decimal MinWeight { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string CreatedBy { get; set; } = string.Empty;

        [StringLength(50)]
        public string UpdatedBy { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<ARVRegimenDrug> RegimenDrugs { get; set; } = new List<ARVRegimenDrug>();
        public virtual ICollection<PatientRegimen> PatientRegimens { get; set; } = new List<PatientRegimen>();
    }

    public class ARVRegimenDrug
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RegimenId { get; set; }

        [Required]
        public int DrugId { get; set; }

        [StringLength(100)]
        public string Dosage { get; set; } = string.Empty; // Specific dosage for this regimen

        [StringLength(50)]
        public string Frequency { get; set; } = string.Empty; // Once daily, Twice daily, etc.

        [StringLength(50)]
        public string Timing { get; set; } = string.Empty; // With food, Empty stomach, etc.

        [StringLength(500)]
        public string SpecialInstructions { get; set; } = string.Empty;

        public int SortOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("RegimenId")]
        public virtual ARVRegimen Regimen { get; set; } = null!;

        [ForeignKey("DrugId")]
        public virtual ARVDrug Drug { get; set; } = null!;
    }

    public class PatientRegimen
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string PatientId { get; set; } = string.Empty; // Reference to User.Id

        [Required]
        public int RegimenId { get; set; }

        [Required]
        [StringLength(50)]
        public string PrescribedBy { get; set; } = string.Empty; // Doctor's User.Id

        public DateTime PrescribedDate { get; set; } = DateTime.UtcNow;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Completed, Discontinued, Switched

        [StringLength(1000)]
        public string Notes { get; set; } = string.Empty;

        [StringLength(500)]
        public string DiscontinuationReason { get; set; } = string.Empty;

        public DateTime? LastReviewDate { get; set; }

        public DateTime? NextReviewDate { get; set; }

        [StringLength(50)]
        public string ReviewedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("RegimenId")]
        public virtual ARVRegimen Regimen { get; set; } = null!;

        [ForeignKey("PatientId")]
        public virtual User Patient { get; set; } = null!;

        [ForeignKey("PrescribedBy")]
        public virtual User Doctor { get; set; } = null!;

        public virtual ICollection<PatientRegimenHistory> History { get; set; } = new List<PatientRegimenHistory>();
        public virtual ICollection<PatientAdherence> AdherenceRecords { get; set; } = new List<PatientAdherence>();
    }

    public class PatientRegimenHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientRegimenId { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // Started, Modified, Discontinued, Switched

        [StringLength(1000)]
        public string Details { get; set; } = string.Empty;

        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string PerformedBy { get; set; } = string.Empty; // Doctor's User.Id

        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string Notes { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey("PatientRegimenId")]
        public virtual PatientRegimen PatientRegimen { get; set; } = null!;

        [ForeignKey("PerformedBy")]
        public virtual User PerformedByUser { get; set; } = null!;
    }

    public class PatientAdherence
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientRegimenId { get; set; }

        public DateTime RecordDate { get; set; } = DateTime.UtcNow;

        [Range(0, 100)]
        public decimal AdherencePercentage { get; set; } = 0;

        [StringLength(20)]
        public string Period { get; set; } = "Weekly"; // Daily, Weekly, Monthly

        [StringLength(1000)]
        public string Notes { get; set; } = string.Empty;

        [StringLength(500)]
        public string Challenges { get; set; } = string.Empty;

        [StringLength(50)]
        public string RecordedBy { get; set; } = string.Empty; // Doctor or Patient

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PatientRegimenId")]
        public virtual PatientRegimen PatientRegimen { get; set; } = null!;

        [ForeignKey("RecordedBy")]
        public virtual User RecordedByUser { get; set; } = null!;
    }
}
