using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using System.Security.Claims;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "doctor")]
    public class DoctorAppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DoctorAppointmentController> _logger;

        public DoctorAppointmentController(ApplicationDbContext context, ILogger<DoctorAppointmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/DoctorAppointment/my-appointments
        [HttpGet("my-appointments")]
        public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetMyAppointments(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                // Get doctor ID from JWT token
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new ApiResponse<List<AppointmentDto>>
                    {
                        Success = false,
                        Message = "Không thể xác định thông tin bác sĩ"
                    });
                }

                _logger.LogInformation("Doctor {DoctorId} requesting appointments - Page: {Page}, PageSize: {PageSize}", doctorId, page, pageSize);

                var query = _context.Appointments.Where(a => a.DoctorId == doctorId);

                // Apply filters
                if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(a => a.Status == statusEnum);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(a => a.Date >= fromDate.Value.Date);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(a => a.Date <= toDate.Value.Date);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                var appointments = await query
                    .OrderBy(a => a.Date)
                    .ThenBy(a => a.StartTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Convert to DTOs
                var appointmentDtos = new List<AppointmentDto>();
                foreach (var appointment in appointments)
                {
                    // Get doctor info
                    var doctor = await _context.Doctors.FindAsync(appointment.DoctorId);
                    
                    // Get service info  
                    var service = await _context.Services.FindAsync(appointment.ServiceId);

                    appointmentDtos.Add(new AppointmentDto
                    {
                        Id = appointment.Id,
                        PatientId = appointment.PatientId,
                        PatientName = appointment.PatientName,
                        DoctorId = appointment.DoctorId,
                        DoctorName = doctor?.FullName ?? "Unknown Doctor",
                        ServiceId = appointment.ServiceId,
                        ServiceName = service?.Name ?? "Unknown Service",
                        Date = appointment.Date,
                        StartTime = appointment.StartTime,
                        EndTime = appointment.EndTime,
                        Status = appointment.Status.ToString(),
                        Notes = appointment.Notes ?? "",
                        CreatedAt = appointment.CreatedAt,
                        UpdatedAt = appointment.UpdatedAt
                    });
                }

                _logger.LogInformation("Retrieved {Count} appointments for doctor {DoctorId}", appointmentDtos.Count, doctorId);

                return new ApiResponse<List<AppointmentDto>>
                {
                    Success = true,
                    Message = $"Lấy danh sách lịch hẹn thành công. Trang {page}/{Math.Ceiling((double)totalCount / pageSize)}",
                    Data = appointmentDtos,
                    Meta = new
                    {
                        TotalCount = totalCount,
                        Page = page,
                        PageSize = pageSize,
                        TotalPages = Math.Ceiling((double)totalCount / pageSize)
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for doctor");
                return StatusCode(500, new ApiResponse<List<AppointmentDto>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy danh sách lịch hẹn: " + ex.Message
                });
            }
        }

        // PUT: api/DoctorAppointment/{id}/status
        [HttpPut("{id}/status")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateAppointmentStatus(
            string id,
            [FromBody] UpdateDoctorStatusRequest request)
        {
            try
            {
                // Get doctor ID from JWT token
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new ApiResponse<AppointmentDto>
                    {
                        Success = false,
                        Message = "Không thể xác định thông tin bác sĩ"
                    });
                }

                _logger.LogInformation("Doctor {DoctorId} updating appointment {Id} status to {Status}", doctorId, id, request.Status);

                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<AppointmentDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
                }

                // Verify this appointment belongs to the doctor
                if (appointment.DoctorId != doctorId)
                {
                    return Forbid();
                }

                // Validate status transition
                if (!Enum.TryParse<AppointmentStatus>(request.Status, true, out var newStatus))
                {
                    return BadRequest(new ApiResponse<AppointmentDto>
                    {
                        Success = false,
                        Message = "Trạng thái không hợp lệ"
                    });
                }

                // Doctors can only confirm, complete, or cancel appointments
                if (newStatus != AppointmentStatus.Confirmed && 
                    newStatus != AppointmentStatus.Completed && 
                    newStatus != AppointmentStatus.Cancelled)
                {
                    return BadRequest(new ApiResponse<AppointmentDto>
                    {
                        Success = false,
                        Message = "Bác sĩ chỉ có thể xác nhận, hoàn thành hoặc hủy lịch hẹn"
                    });
                }

                // Update appointment
                appointment.Status = newStatus;
                appointment.UpdatedAt = DateTime.UtcNow;
                
                if (!string.IsNullOrEmpty(request.Notes))
                {
                    appointment.Notes = request.Notes;
                }

                await _context.SaveChangesAsync();

                // Get updated appointment with related data
                var doctor = await _context.Doctors.FindAsync(appointment.DoctorId);
                var service = await _context.Services.FindAsync(appointment.ServiceId);

                var appointmentDto = new AppointmentDto
                {
                    Id = appointment.Id,
                    PatientId = appointment.PatientId,
                    PatientName = appointment.PatientName,
                    DoctorId = appointment.DoctorId,
                    DoctorName = doctor?.FullName ?? "Unknown Doctor",
                    ServiceId = appointment.ServiceId,
                    ServiceName = service?.Name ?? "Unknown Service",
                    Date = appointment.Date,
                    StartTime = appointment.StartTime,
                    EndTime = appointment.EndTime,
                    Status = appointment.Status.ToString(),
                    Notes = appointment.Notes ?? "",
                    CreatedAt = appointment.CreatedAt,
                    UpdatedAt = appointment.UpdatedAt
                };

                _logger.LogInformation("Successfully updated appointment {Id} status to {Status}", id, newStatus);

                return new ApiResponse<AppointmentDto>
                {
                    Success = true,
                    Message = "Cập nhật trạng thái lịch hẹn thành công",
                    Data = appointmentDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment status");
                return StatusCode(500, new ApiResponse<AppointmentDto>
                {
                    Success = false,
                    Message = "Lỗi khi cập nhật trạng thái lịch hẹn: " + ex.Message
                });
            }
        }

        // GET: api/DoctorAppointment/today
        [HttpGet("today")]
        public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetTodayAppointments()
        {
            try
            {
                // Get doctor ID from JWT token
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new ApiResponse<List<AppointmentDto>>
                    {
                        Success = false,
                        Message = "Không thể xác định thông tin bác sĩ"
                    });
                }

                var today = DateTime.Today;
                var appointments = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId && a.Date.Date == today)
                    .OrderBy(a => a.StartTime)
                    .ToListAsync();

                // Convert to DTOs
                var appointmentDtos = new List<AppointmentDto>();
                foreach (var appointment in appointments)
                {
                    var doctor = await _context.Doctors.FindAsync(appointment.DoctorId);
                    var service = await _context.Services.FindAsync(appointment.ServiceId);

                    appointmentDtos.Add(new AppointmentDto
                    {
                        Id = appointment.Id,
                        PatientId = appointment.PatientId,
                        PatientName = appointment.PatientName,
                        DoctorId = appointment.DoctorId,
                        DoctorName = doctor?.FullName ?? "Unknown Doctor",
                        ServiceId = appointment.ServiceId,
                        ServiceName = service?.Name ?? "Unknown Service",
                        Date = appointment.Date,
                        StartTime = appointment.StartTime,
                        EndTime = appointment.EndTime,
                        Status = appointment.Status.ToString(),
                        Notes = appointment.Notes ?? "",
                        CreatedAt = appointment.CreatedAt,
                        UpdatedAt = appointment.UpdatedAt
                    });
                }

                return new ApiResponse<List<AppointmentDto>>
                {
                    Success = true,
                    Message = "Lấy lịch hẹn hôm nay thành công",
                    Data = appointmentDtos
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving today's appointments");
                return StatusCode(500, new ApiResponse<List<AppointmentDto>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy lịch hẹn hôm nay: " + ex.Message
                });
            }
        }
    }

    public class UpdateDoctorStatusRequest
    {
        public string Status { get; set; } = "";
        public string? Notes { get; set; }
    }
}
