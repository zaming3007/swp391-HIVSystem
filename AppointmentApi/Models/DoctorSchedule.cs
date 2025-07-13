using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    // Using existing TimeSlot model from database instead of creating new tables

    // DTOs for API
    public class DoctorScheduleDto
    {
        public string Id { get; set; }
        public string DoctorId { get; set; }
        public int DayOfWeek { get; set; }
        public string DayName { get; set; }
        public bool IsWorking { get; set; }
        public List<TimeSlotDto> TimeSlots { get; set; } = new List<TimeSlotDto>();
    }

    public class TimeSlotDto
    {
        public string Id { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class UpdateDoctorScheduleRequest
    {
        public string DoctorId { get; set; }
        public List<DoctorScheduleDto> WorkingHours { get; set; } = new List<DoctorScheduleDto>();
    }
}
