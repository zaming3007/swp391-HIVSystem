using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly List<Doctor> _doctors = new List<Doctor>();
        private readonly List<Appointment> _appointments; // Tham chiếu đến danh sách lịch hẹn

        public DoctorService(List<Appointment> appointments)
        {
            _appointments = appointments;
            
            // Tạo dữ liệu demo
            SeedDemoData();
        }

        public async Task<List<Doctor>> GetAllAsync()
        {
            return await Task.FromResult(_doctors.Where(d => d.Available).ToList());
        }

        public async Task<Doctor?> GetByIdAsync(string id)
        {
            return await Task.FromResult(_doctors.FirstOrDefault(d => d.Id == id));
        }

        public async Task<List<Doctor>> GetBySpecializationAsync(string specialization)
        {
            return await Task.FromResult(
                _doctors.Where(d => d.Specialization.Equals(specialization, StringComparison.OrdinalIgnoreCase) && d.Available)
                        .ToList());
        }

        public async Task<List<Doctor>> GetDoctorsByServiceIdAsync(string serviceId)
        {
            // Giả lập: Trong thực tế sẽ lấy từ mối quan hệ DB
            // Ở đây chúng ta trả về tất cả bác sĩ có sẵn như demo
            return await GetAllAsync();
        }

        public async Task<List<TimeSlot>> GetScheduleAsync(string doctorId)
        {
            var doctor = await GetByIdAsync(doctorId);
            return doctor?.WorkingHours ?? new List<TimeSlot>();
        }

        public async Task<bool> IsAvailableAsync(string doctorId, DateTime date, string startTime, int durationMinutes)
        {
            var doctor = await GetByIdAsync(doctorId);
            if (doctor == null || !doctor.Available)
                return false;
                
            // Kiểm tra xem bác sĩ có lịch làm việc vào ngày này không
            var schedule = doctor.WorkingHours.FirstOrDefault(wh => wh.DayOfWeek == date.DayOfWeek);
            if (schedule == null)
                return false;
                
            // Kiểm tra xem thời gian bắt đầu và kết thúc có nằm trong lịch làm việc không
            if (!IsTimeWithinWorkingHours(startTime, durationMinutes, schedule))
                return false;
                
            // Kiểm tra xem bác sĩ đã có lịch hẹn vào thời gian này chưa
            var endTime = CalculateEndTime(startTime, durationMinutes);
            
            // Lấy tất cả các lịch hẹn của bác sĩ trong ngày
            var doctorAppointments = _appointments
                .Where(a => a.DoctorId == doctorId && 
                       a.Date.Date == date.Date && 
                       a.Status != AppointmentStatus.Cancelled)
                .ToList();
                
            // Kiểm tra xem có lịch hẹn chồng chéo không
            return !doctorAppointments.Any(a => IsTimeOverlap(startTime, endTime, a.StartTime, a.EndTime));
        }
        
        #region Helper Methods
        
        private bool IsTimeWithinWorkingHours(string startTime, int durationMinutes, TimeSlot schedule)
        {
            // Chuyển đổi các chuỗi thời gian thành TimeSpan
            TimeSpan.TryParse(startTime, out var start);
            TimeSpan.TryParse(schedule.StartTime, out var workStart);
            TimeSpan.TryParse(schedule.EndTime, out var workEnd);
            
            // Tính thời gian kết thúc của lịch hẹn
            var end = start.Add(TimeSpan.FromMinutes(durationMinutes));
            
            // Kiểm tra xem lịch hẹn có nằm trong lịch làm việc không
            return start >= workStart && end <= workEnd;
        }
        
        private string CalculateEndTime(string startTime, int durationMinutes)
        {
            TimeSpan.TryParse(startTime, out var start);
            var end = start.Add(TimeSpan.FromMinutes(durationMinutes));
            return $"{end.Hours:D2}:{end.Minutes:D2}";
        }
        
        private bool IsTimeOverlap(string start1, string end1, string start2, string end2)
        {
            // Chuyển đổi các chuỗi thời gian thành TimeSpan
            TimeSpan.TryParse(start1, out var startTime1);
            TimeSpan.TryParse(end1, out var endTime1);
            TimeSpan.TryParse(start2, out var startTime2);
            TimeSpan.TryParse(end2, out var endTime2);
            
            // Kiểm tra xem có chồng chéo không
            return startTime1 < endTime2 && endTime1 > startTime2;
        }
        
        private void SeedDemoData()
        {
            // Tạo dữ liệu mẫu cho bác sĩ
            _doctors.Add(new Doctor
            {
                Id = "doctor1",
                FirstName = "Nguyễn",
                LastName = "Văn A",
                Specialization = "Điều trị HIV/AIDS",
                Email = "nguyenvana@example.com",
                Phone = "0901234567",
                ProfileImage = "/images/doctors/doctor1.jpg",
                Bio = "Bác sĩ Nguyễn Văn A có hơn 10 năm kinh nghiệm trong lĩnh vực điều trị HIV/AIDS.",
                Experience = 10,
                WorkingHours = new List<TimeSlot>
                {
                    new TimeSlot { DayOfWeek = DayOfWeek.Monday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Tuesday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Wednesday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Thursday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Friday, StartTime = "08:00", EndTime = "17:00" }
                }
            });
            
            _doctors.Add(new Doctor
            {
                Id = "doctor2",
                FirstName = "Trần",
                LastName = "Thị B",
                Specialization = "Tâm lý học",
                Email = "tranthib@example.com",
                Phone = "0912345678",
                ProfileImage = "/images/doctors/doctor2.jpg",
                Bio = "Bác sĩ Trần Thị B là chuyên gia tâm lý với chuyên môn về hỗ trợ tâm lý cho bệnh nhân HIV/AIDS.",
                Experience = 8,
                WorkingHours = new List<TimeSlot>
                {
                    new TimeSlot { DayOfWeek = DayOfWeek.Tuesday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Thursday, StartTime = "08:00", EndTime = "17:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Saturday, StartTime = "08:00", EndTime = "12:00" }
                }
            });
            
            _doctors.Add(new Doctor
            {
                Id = "doctor3",
                FirstName = "Lê",
                LastName = "Văn C",
                Specialization = "Điều trị ARV",
                Email = "levanc@example.com",
                Phone = "0923456789",
                ProfileImage = "/images/doctors/doctor3.jpg",
                Bio = "Bác sĩ Lê Văn C chuyên về điều trị ARV và các phác đồ điều trị HIV/AIDS tiên tiến.",
                Experience = 12,
                WorkingHours = new List<TimeSlot>
                {
                    new TimeSlot { DayOfWeek = DayOfWeek.Monday, StartTime = "12:00", EndTime = "20:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Wednesday, StartTime = "12:00", EndTime = "20:00" },
                    new TimeSlot { DayOfWeek = DayOfWeek.Friday, StartTime = "12:00", EndTime = "20:00" }
                }
            });
        }
        
        #endregion
    }
} 