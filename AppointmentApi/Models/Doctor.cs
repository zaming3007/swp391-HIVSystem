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
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public string Specialization { get; set; } = string.Empty;
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Phone { get; set; } = string.Empty;
        
        public string ProfileImage { get; set; } = string.Empty;
        
        public bool Available { get; set; } = true;
        
        public string Bio { get; set; } = string.Empty;
        
        public int Experience { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
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