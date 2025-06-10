using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class DoctorEducation
    {
        [Key]
        public int EducationID { get; set; }
        public int? DoctorID { get; set; }
        public string? Degree { get; set; }
        public string? Institution { get; set; }
        // Add other properties as needed
    }
} 