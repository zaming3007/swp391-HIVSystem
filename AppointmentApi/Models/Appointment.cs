using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AppointmentApi.Models
{
    [Table("Appointments")]
    public class Appointment
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string PatientId { get; set; } = string.Empty;
        
        public string PatientName { get; set; } = string.Empty;
        
        [Required]
        public string DoctorId { get; set; } = string.Empty;
        
        public string DoctorName { get; set; } = string.Empty;
        
        [Required]
        public string ServiceId { get; set; } = string.Empty;
        
        public string ServiceName { get; set; } = string.Empty;
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        public string StartTime { get; set; } = string.Empty;
        
        public string EndTime { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        
        public string Notes { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }
        
        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }
    }

    public enum AppointmentStatus
    {
        Pending,
        Confirmed,
        Completed,
        Cancelled,
        NoShow
    }

    // Dto để tạo lịch hẹn mới
    public class AppointmentCreateDto
    {
        public string DoctorId { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    // Dto để cập nhật lịch hẹn
    public class AppointmentUpdateDto
    {
        public DateTime? Date { get; set; }
        public string? StartTime { get; set; }
        public AppointmentStatus? Status { get; set; }
        public string? Notes { get; set; }
    }
} 