using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class TreatmentPlan
    {
        [Key]
        public int PlanID { get; set; }
        public int? PatientID { get; set; }
        public int? DoctorID { get; set; }
        public string? PlanName { get; set; }
        public DateTime StartDate { get; set; }
        // Add other properties as needed
    }
} 