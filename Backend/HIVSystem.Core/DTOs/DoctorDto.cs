namespace HIVSystem.Core.DTOs
{
    public class DoctorDto
    {
        public int DoctorID { get; set; }
        public int? UserID { get; set; }
        public string? FullName { get; set; }
        public string? Specialty { get; set; }
        public string? Qualification { get; set; }
        public string? Biography { get; set; }
        public int? YearsOfExperience { get; set; }
        public bool IsAvailable { get; set; }
        public decimal? ConsultationFee { get; set; }
        public string VerificationStatus { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
    }

    public class DoctorAvailabilityDto
    {
        public int DoctorID { get; set; }
        public string? DoctorName { get; set; }
        public DateTime Date { get; set; }
        public List<TimeSlotDto> AvailableSlots { get; set; } = new List<TimeSlotDto>();
    }

    public class TimeSlotDto
    {
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; }
        public string? Reason { get; set; }
    }

    public class DoctorScheduleDto
    {
        public int ScheduleID { get; set; }
        public int? DoctorID { get; set; }
        public int? DayOfWeek { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public int SlotDuration { get; set; }
        public int? MaxPatients { get; set; }
        public bool IsAvailable { get; set; }
        public string? Notes { get; set; }
    }
} 