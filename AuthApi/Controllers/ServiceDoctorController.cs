using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceDoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ServiceDoctorController> _logger;

        public ServiceDoctorController(ApplicationDbContext context, ILogger<ServiceDoctorController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/ServiceDoctor/available/{serviceId}
        [HttpGet("available/{serviceId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableDoctorsForService(string serviceId)
        {
            try
            {
                // Check if service exists
                var service = await _context.Services.FindAsync(serviceId);
                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                // Get doctors assigned to this service
                var assignedDoctorIds = await _context.DoctorServices
                    .Where(ds => ds.ServiceId == serviceId)
                    .Select(ds => ds.DoctorId)
                    .ToListAsync();

                // If no doctors are assigned, return all active doctors
                if (!assignedDoctorIds.Any())
                {
                    var allDoctors = await _context.Doctors
                        .Where(d => d.Available)
                        .Select(d => new
                        {
                            d.Id,
                            d.FullName,
                            d.Specialization,
                            d.Email,
                            IsActive = d.Available,
                            IsAssigned = false,
                            AvailabilityNote = "Tất cả bác sĩ có thể thực hiện dịch vụ này"
                        })
                        .OrderBy(d => d.FullName)
                        .ToListAsync();

                    return Ok(new
                    {
                        serviceId,
                        serviceName = service.Name,
                        hasSpecificAssignments = false,
                        availableDoctors = allDoctors,
                        message = "Dịch vụ này có thể được thực hiện bởi tất cả bác sĩ"
                    });
                }

                // If doctors are assigned, return only assigned doctors
                var assignedDoctors = await _context.Doctors
                    .Where(d => assignedDoctorIds.Contains(d.Id) && d.Available)
                    .Select(d => new
                    {
                        d.Id,
                        d.FullName,
                        d.Specialization,
                        d.Email,
                        IsActive = d.Available,
                        IsAssigned = true,
                        AvailabilityNote = "Bác sĩ được chỉ định cho dịch vụ này"
                    })
                    .OrderBy(d => d.FullName)
                    .ToListAsync();

                return Ok(new
                {
                    serviceId,
                    serviceName = service.Name,
                    hasSpecificAssignments = true,
                    availableDoctors = assignedDoctors,
                    message = $"Dịch vụ này chỉ có thể được thực hiện bởi {assignedDoctors.Count} bác sĩ được chỉ định"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available doctors for service {ServiceId}", serviceId);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách bác sĩ" });
            }
        }

        // GET: api/ServiceDoctor/service/{serviceId}/doctors
        [HttpGet("service/{serviceId}/doctors")]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctorsByService(string serviceId)
        {
            try
            {
                var service = await _context.Services
                    .Include(s => s.DoctorServices)
                        .ThenInclude(ds => ds.Doctor)
                    .FirstOrDefaultAsync(s => s.Id == serviceId);

                if (service == null)
                {
                    return NotFound(new { message = "Không tìm thấy dịch vụ" });
                }

                var doctors = service.DoctorServices
                    .Where(ds => ds.Doctor.Available)
                    .Select(ds => new
                    {
                        ds.Doctor.Id,
                        ds.Doctor.FullName,
                        ds.Doctor.Specialization,
                        ds.Doctor.Email,
                        IsActive = ds.Doctor.Available
                    })
                    .OrderBy(d => d.FullName)
                    .ToList();

                return Ok(new
                {
                    serviceId,
                    serviceName = service.Name,
                    assignedDoctors = doctors,
                    doctorCount = doctors.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctors for service {ServiceId}", serviceId);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách bác sĩ" });
            }
        }

        // GET: api/ServiceDoctor/doctor/{doctorId}/services
        [HttpGet("doctor/{doctorId}/services")]
        public async Task<ActionResult<IEnumerable<object>>> GetServicesByDoctor(string doctorId)
        {
            try
            {
                var doctor = await _context.Doctors
                    .Include(d => d.DoctorServices)
                        .ThenInclude(ds => ds.Service)
                    .FirstOrDefaultAsync(d => d.Id == doctorId);

                if (doctor == null)
                {
                    return NotFound(new { message = "Không tìm thấy bác sĩ" });
                }

                var services = doctor.DoctorServices
                    .Where(ds => ds.Service.IsActive)
                    .Select(ds => new
                    {
                        ds.Service.Id,
                        ds.Service.Name,
                        ds.Service.Description,
                        ds.Service.Price,
                        ds.Service.Duration,
                        ds.Service.Category,
                        ds.Service.IsActive
                    })
                    .OrderBy(s => s.Name)
                    .ToList();

                return Ok(new
                {
                    doctorId,
                    doctorName = doctor.FullName,
                    assignedServices = services,
                    serviceCount = services.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting services for doctor {DoctorId}", doctorId);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách dịch vụ" });
            }
        }
    }
}
