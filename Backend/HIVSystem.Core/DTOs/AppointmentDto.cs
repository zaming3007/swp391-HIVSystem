using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.DTOs
{
    public class CreateAppointmentDto
    {
        public int? PatientID { get; set; }
        
        [Required]
        public int DoctorID { get; set; }
        
        public int? FacilityID { get; set; }
        
        [Required]
        public DateTime AppointmentDate { get; set; }
        
        [Required]
        public TimeSpan AppointmentTime { get; set; }
        
        public string? AppointmentType { get; set; } = "Regular";
        
        public string? Purpose { get; set; }
        
        public string? Notes { get; set; }
        
        public bool IsAnonymous { get; set; } = false;
    }

    public class AppointmentDto
    {
        public int AppointmentID { get; set; }
        public int? PatientID { get; set; }
        public int? DoctorID { get; set; }
        public int? FacilityID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string? AppointmentType { get; set; }
        public string? Purpose { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public bool IsAnonymous { get; set; }
        public bool ReminderSent { get; set; }
        public DateTime CreatedDate { get; set; }
        
        // Navigation properties
        public string? PatientName { get; set; }
        public string? DoctorName { get; set; }
        public string? FacilityName { get; set; }
    }

    public class UpdateAppointmentDto
    {
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string? AppointmentType { get; set; }
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }

    public class AppointmentSearchDto
    {
        public int? PatientID { get; set; }
        public int? DoctorID { get; set; }
        public int? FacilityID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Status { get; set; }
        public bool? IsAnonymous { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
} 