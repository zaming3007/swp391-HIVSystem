using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace AuthApi.Models
{
    [Table("services")]
    public class Service
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("name")]
        [Required]
        public string Name { get; set; }
        
        [Column("description")]
        public string Description { get; set; }
        
        [Column("duration")]
        public int Duration { get; set; } = 30; // Mặc định 30 phút
        
        [Column("price")]
        public decimal Price { get; set; }
        
        [Column("category")]
        public string Category { get; set; }
        
        [Column("image_url")]
        public string ImageUrl { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<DoctorService> DoctorServices { get; set; } = new List<DoctorService>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
    
    [Table("doctor_services")]
    public class DoctorService
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("doctor_id")]
        public string DoctorId { get; set; }
        
        [Column("service_id")]
        public string ServiceId { get; set; }
        
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }
    }
} 