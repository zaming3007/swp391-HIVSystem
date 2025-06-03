using System.ComponentModel.DataAnnotations;

namespace HIVHealthcareSystem.Models
{
    public class Facility
    {
        [Key]
        public int FacilityID { get; set; }

        [Required]
        [StringLength(100)]
        public string FacilityName { get; set; } = "";

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
    }
} 