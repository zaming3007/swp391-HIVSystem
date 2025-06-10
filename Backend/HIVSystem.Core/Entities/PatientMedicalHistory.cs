using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class PatientMedicalHistory
    {
        [Key]
        public int HistoryID { get; set; }
        public int? PatientID { get; set; }
        public string? Condition { get; set; }
        // Add other properties as needed
    }
} 