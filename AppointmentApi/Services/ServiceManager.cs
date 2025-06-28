using AppointmentApi.Models;

namespace AppointmentApi.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly List<Service> _services = new List<Service>();

        public ServiceManager()
        {
            // Khởi tạo dữ liệu mẫu
            SeedDemoData();
        }

        public async Task<List<Service>> GetAllAsync()
        {
            return await Task.FromResult(_services.ToList());
        }

        public async Task<Service?> GetByIdAsync(string id)
        {
            return await Task.FromResult(_services.FirstOrDefault(s => s.Id == id));
        }

        public async Task<List<Service>> GetByCategoryAsync(string category)
        {
            return await Task.FromResult(_services.Where(s => 
                s.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .ToList());
        }

        public async Task<List<Service>> GetServicesByDoctorIdAsync(string doctorId)
        {
            // Trong thực tế, sẽ lấy từ mối quan hệ doctor-service trong database
            // Ở đây chúng ta trả về các dịch vụ có chứa doctorId trong DoctorIds
            return await Task.FromResult(_services.Where(s => s.DoctorIds.Contains(doctorId)).ToList());
        }
        
        private void SeedDemoData()
        {
            // Khởi tạo dữ liệu mẫu cho dịch vụ
            _services.Add(new Service
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
            
            _services.Add(new Service
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
            
            _services.Add(new Service
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
            
            _services.Add(new Service
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
            
            _services.Add(new Service
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