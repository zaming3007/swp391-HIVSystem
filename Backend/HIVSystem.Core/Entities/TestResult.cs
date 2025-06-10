using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class TestResult
    {
        [Key]
        public int TestResultID { get; set; }
        public int? PatientID { get; set; }
        public int? DoctorID { get; set; }
        public int? FacilityID { get; set; }
        public DateTime TestDate { get; set; }
        // Add other properties as needed
    }
} 