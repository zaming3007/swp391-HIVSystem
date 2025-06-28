using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public interface IDoctorService
    {
        // Lấy tất cả bác sĩ
        Task<List<Doctor>> GetAllAsync();
        
        // Lấy bác sĩ theo ID
        Task<Doctor?> GetByIdAsync(string id);
        
        // Lấy bác sĩ theo chuyên khoa
        Task<List<Doctor>> GetBySpecializationAsync(string specialization);
        
        // Lấy bác sĩ có thể thực hiện dịch vụ cụ thể
        Task<List<Doctor>> GetDoctorsByServiceIdAsync(string serviceId);
        
        // Lấy thông tin lịch làm việc của bác sĩ
        Task<List<TimeSlot>> GetScheduleAsync(string doctorId);
        
        // Kiểm tra xem bác sĩ có sẵn tại thời điểm cụ thể không
        Task<bool> IsAvailableAsync(string doctorId, DateTime date, string startTime, int durationMinutes);
    }
} 