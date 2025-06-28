namespace AppointmentApi.Models
{
    public class Service
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; } = 30; // Mặc định 30 phút
        public decimal Price { get; set; } = 0;
        public string Category { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> DoctorIds { get; set; } = new List<string>(); // Bác sĩ có thể thực hiện dịch vụ này
    }

    // Response model để sử dụng với API
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
} 