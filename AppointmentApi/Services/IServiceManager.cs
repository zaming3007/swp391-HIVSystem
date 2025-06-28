using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public interface IServiceManager
    {
        // Lấy tất cả dịch vụ
        Task<List<Service>> GetAllAsync();
        
        // Lấy dịch vụ theo ID
        Task<Service?> GetByIdAsync(string id);
        
        // Lấy dịch vụ theo danh mục
        Task<List<Service>> GetByCategoryAsync(string category);
        
        // Lấy tất cả các dịch vụ mà một bác sĩ cụ thể có thể thực hiện
        Task<List<Service>> GetServicesByDoctorIdAsync(string doctorId);
    }
} 