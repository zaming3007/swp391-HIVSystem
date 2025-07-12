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
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("patient_id")]
        public string PatientId { get; set; } = string.Empty;

        [Column("patient_name")]
        public string PatientName { get; set; } = string.Empty;

        [Required]
        [Column("doctor_id")]
        public string DoctorId { get; set; } = string.Empty;

        [Required]
        [Column("doctor_name")]
        public string DoctorName { get; set; } = string.Empty;

        [Required]
        [Column("service_id")]
        public string ServiceId { get; set; } = string.Empty;

        [Column("service_name")]
        public string ServiceName { get; set; } = string.Empty;

        [Column("date")]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Column("start_time")]
        public string StartTime { get; set; } = string.Empty;

        [Column("end_time")]
        public string EndTime { get; set; } = string.Empty;

        [Column("status")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        [Column("notes")]
        public string Notes { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Column("appointment_type")]
        public AppointmentType AppointmentType { get; set; } = AppointmentType.Offline;

        [Column("meeting_link")]
        public string? MeetingLink { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }

        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }
    }

    public enum AppointmentStatus
    {
        Pending = 0,
        Confirmed = 1,
        Completed = 2,
        Cancelled = 3,
        NoShow = 4
    }

    public enum AppointmentType
    {
        Offline = 0,
        Online = 1
    }

    // Dto để tạo lịch hẹn mới
    public class AppointmentCreateDto
    {
        public string DoctorId { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public AppointmentType AppointmentType { get; set; } = AppointmentType.Offline;
    }

    // Dto để cập nhật lịch hẹn
    public class AppointmentUpdateDto
    {
        public DateTime? Date { get; set; }
        public string? StartTime { get; set; }
        public AppointmentStatus? Status { get; set; }
        public string? Notes { get; set; }
    }

    // New request class to match client's request structure
    public class AppointmentRequest
    {
        public AppointmentCreateDto AppointmentDto { get; set; }
        public string PatientId { get; set; }
        public string PatientName { get; set; }
    }

    // Dto để trả về thông tin lịch hẹn đầy đủ
    public class AppointmentDto
    {
        public string Id { get; set; } = string.Empty;
        public string PatientId { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public AppointmentType AppointmentType { get; set; } = AppointmentType.Offline;
        public string? MeetingLink { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}