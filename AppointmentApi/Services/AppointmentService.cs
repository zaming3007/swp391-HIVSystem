using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly List<Appointment> _appointments = new List<Appointment>();
        private readonly IDoctorService _doctorService;
        private readonly IServiceManager _serviceManager;

        public AppointmentService(IDoctorService doctorService, IServiceManager serviceManager)
        {
            _doctorService = doctorService;
            _serviceManager = serviceManager;
            
            // Tạo dữ liệu demo
            SeedDemoData();
        }

        public async Task<List<Appointment>> GetAllAsync()
        {
            // Trả về một bản sao của danh sách để tránh sửa đổi trực tiếp
            return await Task.FromResult(_appointments.ToList());
        }

        public async Task<Appointment?> GetByIdAsync(string id)
        {
            return await Task.FromResult(_appointments.FirstOrDefault(a => a.Id == id));
        }

        public async Task<List<Appointment>> GetByPatientIdAsync(string patientId)
        {
            return await Task.FromResult(_appointments.Where(a => a.PatientId == patientId).ToList());
        }

        public async Task<List<Appointment>> GetByDoctorIdAsync(string doctorId)
        {
            return await Task.FromResult(_appointments.Where(a => a.DoctorId == doctorId).ToList());
        }

        public async Task<Appointment> CreateAsync(string patientId, string patientName, AppointmentCreateDto appointmentDto)
        {
            // Lấy thông tin bác sĩ và dịch vụ
            var doctor = await _doctorService.GetByIdAsync(appointmentDto.DoctorId);
            var service = await _serviceManager.GetByIdAsync(appointmentDto.ServiceId);
            
            if (doctor == null)
                throw new ArgumentException($"Không tìm thấy bác sĩ với ID: {appointmentDto.DoctorId}");
                
            if (service == null)
                throw new ArgumentException($"Không tìm thấy dịch vụ với ID: {appointmentDto.ServiceId}");
            
            // Kiểm tra bác sĩ có sẵn không
            bool isAvailable = await _doctorService.IsAvailableAsync(
                appointmentDto.DoctorId, 
                appointmentDto.Date, 
                appointmentDto.StartTime, 
                service.Duration);
                
            if (!isAvailable)
                throw new InvalidOperationException("Bác sĩ không có sẵn tại thời điểm này");
            
            // Tính giờ kết thúc
            string endTime = CalculateEndTime(appointmentDto.StartTime, service.Duration);
            
            // Tạo lịch hẹn mới
            var appointment = new Appointment
            {
                PatientId = patientId,
                PatientName = patientName,
                DoctorId = appointmentDto.DoctorId,
                DoctorName = doctor.FullName,
                ServiceId = appointmentDto.ServiceId,
                ServiceName = service.Name,
                Date = appointmentDto.Date,
                StartTime = appointmentDto.StartTime,
                EndTime = endTime,
                Notes = appointmentDto.Notes,
                Status = AppointmentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            
            _appointments.Add(appointment);
            
            return appointment;
        }

        public async Task<Appointment?> UpdateAsync(string id, AppointmentUpdateDto appointmentDto)
        {
            var appointment = await GetByIdAsync(id);
            if (appointment == null)
                return null;
                
            // Nếu muốn đổi thời gian, cần kiểm tra xem bác sĩ có sẵn không
            if (appointmentDto.Date.HasValue || appointmentDto.StartTime != null)
            {
                var date = appointmentDto.Date ?? appointment.Date;
                var startTime = appointmentDto.StartTime ?? appointment.StartTime;
                
                // Lấy thời lượng dịch vụ
                var service = await _serviceManager.GetByIdAsync(appointment.ServiceId);
                if (service == null)
                    throw new ArgumentException($"Không tìm thấy dịch vụ với ID: {appointment.ServiceId}");
                
                // Kiểm tra tính khả dụng
                bool isAvailable = await _doctorService.IsAvailableAsync(
                    appointment.DoctorId, 
                    date, 
                    startTime, 
                    service.Duration);
                    
                if (!isAvailable)
                    throw new InvalidOperationException("Bác sĩ không có sẵn tại thời điểm này");
                
                // Cập nhật thông tin lịch hẹn
                if (appointmentDto.Date.HasValue)
                    appointment.Date = appointmentDto.Date.Value;
                    
                if (appointmentDto.StartTime != null)
                {
                    appointment.StartTime = appointmentDto.StartTime;
                    appointment.EndTime = CalculateEndTime(appointmentDto.StartTime, service.Duration);
                }
            }
            
            // Cập nhật trạng thái và ghi chú
            if (appointmentDto.Status.HasValue)
                appointment.Status = appointmentDto.Status.Value;
                
            if (appointmentDto.Notes != null)
                appointment.Notes = appointmentDto.Notes;
                
            appointment.UpdatedAt = DateTime.UtcNow;
            
            return appointment;
        }

        public async Task<bool> CancelAsync(string id)
        {
            var appointment = await GetByIdAsync(id);
            if (appointment == null)
                return false;
                
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;
            
            return true;
        }

        public async Task<List<string>> GetAvailableSlotsAsync(string doctorId, DateTime date, string serviceId)
        {
            // Lấy thông tin bác sĩ và dịch vụ
            var doctor = await _doctorService.GetByIdAsync(doctorId);
            var service = await _serviceManager.GetByIdAsync(serviceId);
            
            if (doctor == null || service == null)
                return new List<string>();
                
            // Lấy lịch làm việc của bác sĩ cho ngày cụ thể
            var schedule = (await _doctorService.GetScheduleAsync(doctorId))
                .FirstOrDefault(s => s.DayOfWeek == date.DayOfWeek);
                
            if (schedule == null)
                return new List<string>(); // Bác sĩ không làm việc vào ngày này
                
            // Lấy tất cả các lịch hẹn của bác sĩ trong ngày
            var doctorAppointments = _appointments
                .Where(a => a.DoctorId == doctorId && 
                       a.Date.Date == date.Date && 
                       a.Status != AppointmentStatus.Cancelled)
                .ToList();
                
            // Tạo danh sách các khung giờ từ lịch làm việc
            var availableSlots = GenerateTimeSlots(schedule.StartTime, schedule.EndTime, service.Duration);
            
            // Loại bỏ các khung giờ đã có lịch hẹn
            foreach (var appointment in doctorAppointments)
            {
                availableSlots.RemoveAll(slot => IsTimeOverlap(
                    slot, 
                    CalculateEndTime(slot, service.Duration), 
                    appointment.StartTime, 
                    appointment.EndTime));
            }
            
            return availableSlots;
        }
        
        #region Helper Methods
        
        private string CalculateEndTime(string startTime, int durationMinutes)
        {
            if (!TimeSpan.TryParse(startTime, out var timeSpan))
            {
                throw new ArgumentException("Invalid start time format");
            }
            
            var endTimeSpan = timeSpan.Add(TimeSpan.FromMinutes(durationMinutes));
            return $"{endTimeSpan.Hours:D2}:{endTimeSpan.Minutes:D2}";
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
        
        private List<string> GenerateTimeSlots(string startTime, string endTime, int durationMinutes)
        {
            var slots = new List<string>();
            
            TimeSpan.TryParse(startTime, out var currentTime);
            TimeSpan.TryParse(endTime, out var end);
            
            // Tạo các khung giờ với khoảng thời gian bằng với thời lượng dịch vụ
            while (currentTime.Add(TimeSpan.FromMinutes(durationMinutes)) <= end)
            {
                slots.Add($"{currentTime.Hours:D2}:{currentTime.Minutes:D2}");
                currentTime = currentTime.Add(TimeSpan.FromMinutes(30)); // Mỗi slot cách nhau 30 phút
            }
            
            return slots;
        }
        
        private void SeedDemoData()
        {
            // Demo data sẽ được thêm vào khi cần thiết
        }
        
        #endregion
    }
} 