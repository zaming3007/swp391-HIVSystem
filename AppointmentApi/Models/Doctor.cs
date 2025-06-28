namespace AppointmentApi.Models
{
    public class Doctor
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfileImage { get; set; } = string.Empty;
        public bool Available { get; set; } = true;
        public string Bio { get; set; } = string.Empty;
        public int Experience { get; set; }
        public List<TimeSlot> WorkingHours { get; set; } = new List<TimeSlot>();

        // Hỗ trợ cho hiển thị
        public string FullName => $"{FirstName} {LastName}";
    }

    public class TimeSlot
    {
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }

    public class AvailableSlot
    {
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public List<string> AvailableTimes { get; set; } = new List<string>();
    }
} 