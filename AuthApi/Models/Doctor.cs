using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AuthApi.Models
{
    [Table("Doctors")]
    public class Doctor
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("first_name")]
        [Required]
        public string FirstName { get; set; }
        
        [Column("last_name")]
        [Required]
        public string LastName { get; set; }
        
        [Column("specialization")]
        public string Specialization { get; set; }
        
        [Column("email")]
        public string Email { get; set; }
        
        [Column("phone")]
        public string Phone { get; set; }
        
        [Column("profile_image")]
        public string ProfileImage { get; set; }
        
        [Column("available")]
        public bool Available { get; set; } = true;
        
        [Column("bio")]
        public string Bio { get; set; }
        
        [Column("experience")]
        public int Experience { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        // Relationship with TimeSlots
        public virtual ICollection<TimeSlot> WorkingHours { get; set; } = new List<TimeSlot>();
        
        // Navigation properties
        public virtual ICollection<DoctorService> DoctorServices { get; set; } = new List<DoctorService>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
    }
} 