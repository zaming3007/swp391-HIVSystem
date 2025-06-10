using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class DoctorAvailability
    {
        [Key]
        public int AvailabilityID { get; set; }

        public int? DoctorID { get; set; }

        public DateTime? AvailabilityDate { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public bool IsAvailable { get; set; } = true;

        [StringLength(255)]
        public string? Reason { get; set; }

        // Navigation properties
        [ForeignKey("DoctorID")]
        public virtual Doctor? Doctor { get; set; }
    }
} 