using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("Services")]
    public class Service
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public int Duration { get; set; } = 30; // Thời gian mặc định là 30 phút
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public string Category { get; set; } = string.Empty;
        
        public string ImageUrl { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        [NotMapped]
        public List<string> DoctorIds { get; set; } = new List<string>(); // Bác sĩ có thể thực hiện dịch vụ này
        
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }

    // Response model để sử dụng với API
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
} 