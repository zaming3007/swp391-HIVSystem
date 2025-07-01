using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("DoctorServices")]
    public class DoctorService
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [Column("doctor_id")]
        public string DoctorId { get; set; } = string.Empty;
        
        [Required]
        [Column("service_id")]
        public string ServiceId { get; set; } = string.Empty;
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }
        
        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }
    }
} 