using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class FacilityDoctor
    {
        [Key]
        public int FacilityDoctorID { get; set; }

        public int? FacilityID { get; set; }

        public int? DoctorID { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("FacilityID")]
        public virtual Facility? Facility { get; set; }

        [ForeignKey("DoctorID")]
        public virtual Doctor? Doctor { get; set; }
    }
} 