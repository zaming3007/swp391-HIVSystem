using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using System.Text.Json;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "staff")]
    public class StaffAppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StaffAppointmentController> _logger;

        public StaffAppointmentController(ApplicationDbContext context, ILogger<StaffAppointmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/StaffAppointment/all
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetAllAppointments(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? doctorId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Staff requesting all appointments - Page: {Page}, PageSize: {PageSize}", page, pageSize);

                var query = _context.Appointments.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(a => a.Status == statusEnum);
                }

                if (!string.IsNullOrEmpty(doctorId))
                {
                    query = query.Where(a => a.DoctorId == doctorId);
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
                    .OrderByDescending(a => a.CreatedAt)
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

                _logger.LogInformation("Retrieved {Count} appointments for staff", appointmentDtos.Count);

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
                _logger.LogError(ex, "Error retrieving appointments for staff");
                return StatusCode(500, new ApiResponse<List<AppointmentDto>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy danh sách lịch hẹn: " + ex.Message
                });
            }
        }

        // PUT: api/StaffAppointment/{id}/status
        [HttpPut("{id}/status")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateAppointmentStatus(
            string id,
            [FromBody] UpdateStatusRequest request)
        {
            try
            {
                _logger.LogInformation("Staff updating appointment {Id} status to {Status}", id, request.Status);

                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<AppointmentDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
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

        // GET: api/StaffAppointment/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<ApiResponse<AppointmentStatistics>>> GetAppointmentStatistics()
        {
            try
            {
                var today = DateTime.Today;
                var thisWeek = today.AddDays(-(int)today.DayOfWeek);
                var thisMonth = new DateTime(today.Year, today.Month, 1);

                var stats = new AppointmentStatistics
                {
                    TotalAppointments = await _context.Appointments.CountAsync(),
                    PendingAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Pending),
                    ConfirmedAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Confirmed),
                    CompletedAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Completed),
                    CancelledAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Cancelled),
                    TodayAppointments = await _context.Appointments.CountAsync(a => a.Date.Date == today),
                    ThisWeekAppointments = await _context.Appointments.CountAsync(a => a.Date >= thisWeek && a.Date < thisWeek.AddDays(7)),
                    ThisMonthAppointments = await _context.Appointments.CountAsync(a => a.Date >= thisMonth && a.Date < thisMonth.AddMonths(1))
                };

                return new ApiResponse<AppointmentStatistics>
                {
                    Success = true,
                    Message = "Lấy thống kê lịch hẹn thành công",
                    Data = stats
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointment statistics");
                return StatusCode(500, new ApiResponse<AppointmentStatistics>
                {
                    Success = false,
                    Message = "Lỗi khi lấy thống kê lịch hẹn: " + ex.Message
                });
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = "";
        public string? Notes { get; set; }
    }
}
