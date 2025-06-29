using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly ApplicationDbContext _context;

        public ServiceManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Service>> GetAllAsync()
        {
            return await _context.Services.ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(string id)
        {
            return await _context.Services.FindAsync(id);
        }

        public async Task<List<Service>> GetByDoctorIdAsync(string doctorId)
        {
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == doctorId);
            if (!doctorExists) return new List<Service>();

            // Tạm thời trả về tất cả các dịch vụ (trong thực tế sẽ dùng bảng quan hệ)
            return await GetAllAsync();
        }

        public async Task<List<Service>> GetByCategoryAsync(string category)
        {
            return await _context.Services
                .Where(s => s.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }

        public async Task<List<Service>> GetServicesByDoctorIdAsync(string doctorId)
        {
            // Trong thực tế, sẽ lấy từ mối quan hệ doctor-service trong database
            // Ở đây chúng ta trả về các dịch vụ có chứa doctorId trong DoctorIds
            return await Task.FromResult(_context.Services.Where(s => s.DoctorIds.Contains(doctorId)).ToList());
        }
        
        private void SeedDemoData()
        {
            // Khởi tạo dữ liệu mẫu cho dịch vụ
            _context.Services.Add(new Service
            {
                Id = "service1",
                Name = "Khám và tư vấn HIV/AIDS",
                Description = "Dịch vụ khám, tư vấn và đánh giá tình trạng HIV/AIDS.",
                Duration = 30,
                Price = 200000,
                Category = "Tư vấn",
                ImageUrl = "/images/services/consultation.jpg",
                DoctorIds = new List<string> { "doctor1", "doctor3" }
            });
            
            _context.Services.Add(new Service
            {
                Id = "service2",
                Name = "Điều trị ARV",
                Description = "Điều trị bằng thuốc kháng vi-rút ARV và theo dõi tiến trình.",
                Duration = 45,
                Price = 300000,
                Category = "Điều trị",
                ImageUrl = "/images/services/arv-treatment.jpg",
                DoctorIds = new List<string> { "doctor1", "doctor3" }
            });
            
            _context.Services.Add(new Service
            {
                Id = "service3",
                Name = "Xét nghiệm HIV",
                Description = "Xét nghiệm HIV và các bệnh lây truyền qua đường tình dục.",
                Duration = 20,
                Price = 150000,
                Category = "Xét nghiệm",
                ImageUrl = "/images/services/hiv-test.jpg",
                DoctorIds = new List<string> { "doctor1", "doctor3" }
            });
            
            _context.Services.Add(new Service
            {
                Id = "service4",
                Name = "Tư vấn tâm lý",
                Description = "Tư vấn tâm lý cho bệnh nhân HIV/AIDS và người thân.",
                Duration = 60,
                Price = 350000,
                Category = "Tâm lý",
                ImageUrl = "/images/services/counseling.jpg",
                DoctorIds = new List<string> { "doctor2" }
            });
            
            _context.Services.Add(new Service
            {
                Id = "service5",
                Name = "Tư vấn dinh dưỡng",
                Description = "Tư vấn chế độ dinh dưỡng cho bệnh nhân HIV/AIDS.",
                Duration = 30,
                Price = 200000,
                Category = "Tư vấn",
                ImageUrl = "/images/services/nutrition.jpg",
                DoctorIds = new List<string> { "doctor1", "doctor2" }
            });
        }
    }
} 