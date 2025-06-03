using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class PatientAllergy
    {
        [Key]
        public int AllergyID { get; set; }
        public int? PatientID { get; set; }
        public string? AllergyType { get; set; }
        // Add other properties as needed
    }
} 