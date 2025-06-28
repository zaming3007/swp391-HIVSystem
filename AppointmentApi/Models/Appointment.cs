using System.Text.Json.Serialization;

namespace AppointmentApi.Models
{
    public class Appointment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PatientId { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public enum AppointmentStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
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