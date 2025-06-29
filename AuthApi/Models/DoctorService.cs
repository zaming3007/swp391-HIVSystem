using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("DoctorServices")]
    public class DoctorService
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("doctor_id")]
        [Required]
        public string DoctorId { get; set; }
        
        [Column("service_id")]
        [Required]
        public string ServiceId { get; set; }
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }
    }
} 