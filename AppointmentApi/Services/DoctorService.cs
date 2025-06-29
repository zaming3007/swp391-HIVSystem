using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly ApplicationDbContext _context;

        public DoctorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Doctor>> GetAllAsync()
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }

        public async Task<Doctor?> GetByIdAsync(string id)
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
        
        public async Task<List<Doctor>> GetBySpecializationAsync(string specialization)
        {
            return await _context.Doctors
                .Where(d => d.Specialization.Equals(specialization, StringComparison.OrdinalIgnoreCase) && d.Available)
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }
        
        public async Task<List<Doctor>> GetDoctorsByServiceIdAsync(string serviceId)
        {
            // Tạm thời trả về tất cả bác sĩ - trong thực tế sẽ dùng bảng quan hệ giữa Doctor và Service
            return await _context.Doctors
                .Where(d => d.Available)
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }

        public async Task<List<TimeSlot>> GetScheduleAsync(string doctorId)
        {
            return await _context.TimeSlots
                .Where(t => t.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<List<AvailableSlot>> GetAvailableSlotsAsync(string doctorId, DateTime date)
        {
            var doctor = await _context.Doctors
                .Include(d => d.WorkingHours)
                .FirstOrDefaultAsync(d => d.Id == doctorId);
                
            if (doctor == null) return new List<AvailableSlot>();
            
            // Lấy lịch làm việc của bác sĩ trong ngày của tuần này
            var dayOfWeek = (int)date.DayOfWeek;
            var workingHours = doctor.WorkingHours
                .FirstOrDefault(wh => wh.DayOfWeek == dayOfWeek);
                
            if (workingHours == null) return new List<AvailableSlot>();
            
            // Lấy các cuộc hẹn của bác sĩ trong ngày
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && 
                       a.Date.Date == date.Date && 
                       a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();
                
            // Tạo các khung giờ khả dụng từ giờ làm việc
            var availableTimes = GenerateTimeSlots(
                workingHours.StartTime, 
                workingHours.EndTime, 
                30 // Mỗi slot 30 phút
            );
            
            // Loại bỏ các khung giờ đã có cuộc hẹn
            foreach (var appointment in appointments)
            {
                availableTimes.RemoveAll(time => 
                    IsTimeOverlap(time, CalculateEndTime(time, 30), 
                                 appointment.StartTime, appointment.EndTime));
            }
            
            return new List<AvailableSlot> 
            { 
                new AvailableSlot 
                { 
                    DoctorId = doctor.Id,
                    DoctorName = doctor.FullName,
                    Date = date,
                    AvailableTimes = availableTimes
                } 
            };
        }
        
        // Helper methods
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
            // Convert time strings to TimeSpan
            TimeSpan.TryParse(start1, out var startTime1);
            TimeSpan.TryParse(end1, out var endTime1);
            TimeSpan.TryParse(start2, out var startTime2);
            TimeSpan.TryParse(end2, out var endTime2);
            
            // Check if time periods overlap
            return startTime1 < endTime2 && endTime1 > startTime2;
        }
        
        private List<string> GenerateTimeSlots(string startTime, string endTime, int intervalMinutes)
        {
            var slots = new List<string>();
            
            if (!TimeSpan.TryParse(startTime, out var current) || 
                !TimeSpan.TryParse(endTime, out var end))
            {
                return slots;
            }
            
            while (current.Add(TimeSpan.FromMinutes(intervalMinutes)) <= end)
            {
                slots.Add($"{current.Hours:D2}:{current.Minutes:D2}");
                current = current.Add(TimeSpan.FromMinutes(intervalMinutes));
            }
            
            return slots;
        }
        
        public async Task<bool> IsAvailableAsync(string doctorId, DateTime date, string startTime, int durationMinutes)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null || !doctor.Available) return false;
            
            // Kiểm tra xem bác sĩ có làm việc vào thời điểm này không
            var dayOfWeek = (int)date.DayOfWeek;
            var workingHours = await _context.TimeSlots
                .FirstOrDefaultAsync(wh => wh.DoctorId == doctorId && wh.DayOfWeek == dayOfWeek);
                
            if (workingHours == null) return false;
            
            // Kiểm tra thời gian nằm trong giờ làm việc
            if (!TimeInWorkingHours(startTime, durationMinutes, workingHours.StartTime, workingHours.EndTime))
                return false;
                
            // Kiểm tra xem đã có cuộc hẹn nào trong khoảng thời gian này chưa
            var endTime = CalculateEndTime(startTime, durationMinutes);
            
            var existingAppointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && 
                       a.Date.Date == date.Date && 
                       a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();
                
            foreach (var appointment in existingAppointments)
            {
                if (IsTimeOverlap(startTime, endTime, appointment.StartTime, appointment.EndTime))
                    return false;
            }
            
            return true;
        }
        
        private bool TimeInWorkingHours(string timeToCheck, int durationMinutes, string workingStart, string workingEnd)
        {
            TimeSpan.TryParse(timeToCheck, out var checkTime);
            TimeSpan.TryParse(workingStart, out var startTime);
            TimeSpan.TryParse(workingEnd, out var endTime);
            
            var checkEndTime = checkTime.Add(TimeSpan.FromMinutes(durationMinutes));
            
            return checkTime >= startTime && checkEndTime <= endTime;
        }
    }
} 