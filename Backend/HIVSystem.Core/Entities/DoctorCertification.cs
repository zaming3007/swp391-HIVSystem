using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class DoctorCertification
    {
        [Key]
        public int CertificationID { get; set; }
        public int? DoctorID { get; set; }
        public string? CertificationName { get; set; }
        public string? IssuedBy { get; set; }
        // Add other properties as needed
    }
} 