using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class Facility
    {
        [Key]
        public int FacilityID { get; set; }

        [Required]
        [StringLength(100)]
        public string FacilityName { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(50)]
        public string? City { get; set; }

        [StringLength(50)]
        public string? State { get; set; }

        [StringLength(20)]
        public string? ZipCode { get; set; }

        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [StringLength(255)]
        public string? OpeningHours { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<FacilityDoctor> FacilityDoctors { get; set; } = new List<FacilityDoctor>();
        public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
        public virtual ICollection<MedicationInventory> MedicationInventories { get; set; } = new List<MedicationInventory>();
    }
} 