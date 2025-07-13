using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ServicesController> _logger;

        public ServicesController(ApplicationDbContext context, ILogger<ServicesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetServices()
        {
            try
            {
                var services = await _context.Services
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Description,
                        s.Price,
                        s.Duration,
                        s.Category,
                        s.IsActive,
                        s.CreatedAt,
                        s.UpdatedAt
                    })
                    .OrderByDescending(s => s.CreatedAt)
                    .ToListAsync();

                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching services");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách dịch vụ" });
            }
        }

        // GET: api/Services/with-doctors
        [HttpGet("with-doctors")]
        public async Task<ActionResult<IEnumerable<object>>> GetServicesWithDoctors()
        {
            try
            {
                var services = await _context.Services
                    .Include(s => s.DoctorServices)
                        .ThenInclude(ds => ds.Doctor)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Description,
                        s.Price,
                        s.Duration,
                        s.Category,
                        s.IsActive,
                        s.CreatedAt,
                        s.UpdatedAt,
                        AssignedDoctors = s.DoctorServices.Select(ds => new
                        {
                            ds.Doctor.Id,
                            ds.Doctor.FullName,
                            ds.Doctor.Specialization,
                            ds.Doctor.Email,
                            IsActive = ds.Doctor.Available
                        }).ToList(),
                        DoctorCount = s.DoctorServices.Count()
                    })
                    .OrderByDescending(s => s.CreatedAt)
                    .ToListAsync();

                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching services with doctors");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách dịch vụ" });
            }
        }

        // GET: api/Services/stats
        [HttpGet("stats")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<object>> GetServiceStats()
        {
            try
            {
                var totalServices = await _context.Services.CountAsync();
                var activeServices = await _context.Services.CountAsync(s => s.IsActive);
                var inactiveServices = totalServices - activeServices;

                var categories = await _context.Services
                    .Select(s => s.Category)
                    .Distinct()
                    .CountAsync();

                var averagePrice = await _context.Services
                    .Where(s => s.IsActive)
                    .AverageAsync(s => (double?)s.Price) ?? 0;

                return Ok(new
                {
                    totalServices,
                    activeServices,
                    inactiveServices,
                    totalCategories = categories,
                    averagePrice
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching service stats");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải thống kê dịch vụ" });
            }
        }

        // GET: api/Services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetService(string id)
        {
            try
            {
                var service = await _context.Services
                    .Where(s => s.Id == id)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Description,
                        s.Price,
                        s.Duration,
                        s.Category,
                        s.IsActive,
                        s.CreatedAt,
                        s.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                return Ok(service);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching service {ServiceId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải thông tin dịch vụ" });
            }
        }

        // GET: api/Services/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByCategory(string category)
        {
            return await _context.Services
                .Where(s => s.Category == category)
                .ToListAsync();
        }

        // GET: api/Services/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByDoctorId(string doctorId)
        {
            var serviceIds = await _context.DoctorServices
                .Where(ds => ds.DoctorId == doctorId)
                .Select(ds => ds.ServiceId)
                .ToListAsync();

            var services = await _context.Services
                .Where(s => serviceIds.Contains(s.Id))
                .ToListAsync();

            return services;
        }

        // POST: api/Services
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<object>> CreateService([FromBody] CreateServiceRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Category))
                {
                    return BadRequest(new { message = "Tên dịch vụ và danh mục không được để trống" });
                }

                // Create new service
                var service = new Service
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    Duration = request.Duration,
                    Category = request.Category,
                    IsActive = request.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Services.Add(service);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Service created successfully: {ServiceName}", service.Name);

                return Ok(new
                {
                    message = "Tạo dịch vụ thành công",
                    service = new
                    {
                        service.Id,
                        service.Name,
                        service.Description,
                        service.Price,
                        service.Duration,
                        service.Category,
                        service.IsActive,
                        service.CreatedAt,
                        service.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating service");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tạo dịch vụ" });
            }
        }

        // PUT: api/Services/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> UpdateService(string id, [FromBody] UpdateServiceRequest request)
        {
            try
            {
                var service = await _context.Services.FindAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                // Update service properties
                service.Name = request.Name;
                service.Description = request.Description;
                service.Price = request.Price;
                service.Duration = request.Duration;
                service.Category = request.Category;
                service.IsActive = request.IsActive;
                service.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Service updated successfully: {ServiceName}", service.Name);

                return Ok(new { message = "Cập nhật dịch vụ thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating service {ServiceId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật dịch vụ" });
            }
        }

        // DELETE: api/Services/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteService(string id)
        {
            try
            {
                var service = await _context.Services.FindAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                _context.Services.Remove(service);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Service deleted successfully: {ServiceName}", service.Name);

                return Ok(new { message = "Xóa dịch vụ thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting service {ServiceId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi xóa dịch vụ" });
            }
        }

        // POST: api/Services/{id}/assign-doctors
        [HttpPost("{id}/assign-doctors")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> AssignDoctorsToService(string id, [FromBody] AssignDoctorsRequest request)
        {
            try
            {
                var service = await _context.Services.FindAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                // Remove existing assignments
                var existingAssignments = await _context.DoctorServices
                    .Where(ds => ds.ServiceId == id)
                    .ToListAsync();
                _context.DoctorServices.RemoveRange(existingAssignments);

                // Add new assignments
                foreach (var doctorId in request.DoctorIds)
                {
                    var doctor = await _context.Doctors.FindAsync(doctorId);
                    if (doctor != null)
                    {
                        _context.DoctorServices.Add(new DoctorService
                        {
                            Id = Guid.NewGuid().ToString(),
                            DoctorId = doctorId,
                            ServiceId = id
                        });
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Doctor assignments updated for service {ServiceId}", id);

                return Ok(new { message = "Cập nhật phân công bác sĩ thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning doctors to service {ServiceId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi phân công bác sĩ" });
            }
        }

        // POST: api/Services/activate-all
        [HttpPost("activate-all")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> ActivateAllServices()
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync("UPDATE \"Services\" SET is_active = true");
                _logger.LogInformation("All services activated successfully");
                return Ok(new { message = "Tất cả dịch vụ đã được kích hoạt" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating all services");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi kích hoạt dịch vụ" });
            }
        }
    }

    public class CreateServiceRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Duration { get; set; } = 30;
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateServiceRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Duration { get; set; } = 30;
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class AssignDoctorsRequest
    {
        public List<string> DoctorIds { get; set; } = new List<string>();
    }
}