using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public interface IAppointmentService
    {
        // Lấy tất cả các lịch hẹn
        Task<List<Appointment>> GetAllAsync();
        
        // Lấy lịch hẹn theo ID
        Task<Appointment?> GetByIdAsync(string id);
        
        // Lấy các lịch hẹn của một bệnh nhân
        Task<List<Appointment>> GetByPatientIdAsync(string patientId);
        
        // Lấy các lịch hẹn của một bác sĩ
        Task<List<Appointment>> GetByDoctorIdAsync(string doctorId);
        
        // Tạo lịch hẹn mới
        Task<Appointment> CreateAsync(string patientId, string patientName, AppointmentCreateDto appointmentDto);
        
        // Cập nhật lịch hẹn
        Task<Appointment?> UpdateAsync(string id, AppointmentUpdateDto appointmentDto);
        
        // Xóa/hủy lịch hẹn
        Task<bool> CancelAsync(string id);
        
        // Lấy các khung giờ trống cho bác sĩ theo ngày
        Task<List<string>> GetAvailableSlotsAsync(string doctorId, DateTime date, string serviceId);
    }
} 