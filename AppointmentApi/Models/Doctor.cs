using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("Doctors")]
    public class Doctor
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [Column("specialization")]
        public string Specialization { get; set; } = string.Empty;
        
        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;
        
        [Column("profile_image")]
        public string ProfileImage { get; set; } = string.Empty;
        
        [Column("available")]
        public bool Available { get; set; } = true;
        
        [Column("bio")]
        public string Bio { get; set; } = string.Empty;
        
        [Column("experience")]
        public int Experience { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<TimeSlot> WorkingHours { get; set; } = new List<TimeSlot>();
        
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
    }

    public class AvailableSlot
    {
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public List<string> AvailableTimes { get; set; } = new List<string>();
    }
} 