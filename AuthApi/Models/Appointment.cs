using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AuthApi.Models
{
    [Table("Appointments")]
    public class Appointment
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("patient_id")]
        [Required]
        public string PatientId { get; set; }
        
        [Column("patient_name")]
        public string PatientName { get; set; }
        
        [Column("doctor_id")]
        [Required]
        public string DoctorId { get; set; }
        
        [Column("doctor_name")]
        public string DoctorName { get; set; }
        
        [Column("service_id")]
        [Required]
        public string ServiceId { get; set; }
        
        [Column("service_name")]
        public string ServiceName { get; set; }
        
        [Column("date")]
        public DateTime Date { get; set; }
        
        [Column("start_time")]
        public string StartTime { get; set; }
        
        [Column("end_time")]
        public string EndTime { get; set; }
        
        [Column("status")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        
        [Column("notes")]
        public string Notes { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("PatientId")]
        public virtual User Patient { get; set; }
        
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }
    }

    public enum AppointmentStatus
    {
        Pending = 0,
        Confirmed = 1,
        Completed = 2,
        Cancelled = 3,
        NoShow = 4
    }
} 