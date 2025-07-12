using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using AppointmentApi.Services;
using System.Security.Claims;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminAppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminAppointmentController> _logger;

        public AdminAppointmentController(
            IAppointmentService appointmentService,
            ApplicationDbContext context,
            ILogger<AdminAppointmentController> logger)
        {
            _appointmentService = appointmentService;
            _context = context;
            _logger = logger;
        }

        // GET: api/AdminAppointment
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetAllAppointments(
            [FromQuery] string? status = null,
            [FromQuery] string? doctorId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.Appointments.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(status))
                {
                    if (Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                    {
                        query = query.Where(a => a.Status == statusEnum);
                    }
                }

                if (!string.IsNullOrEmpty(doctorId))
                {
                    query = query.Where(a => a.DoctorId == doctorId);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(a => a.Date >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(a => a.Date <= toDate.Value);
                }

                var appointments = await query
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return new ApiResponse<List<Appointment>>
                {
                    Success = true,
                    Message = "Lấy danh sách lịch hẹn thành công",
                    Data = appointments
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all appointments");
                return StatusCode(500, new ApiResponse<List<Appointment>>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy danh sách lịch hẹn"
                });
            }
        }

        // GET: api/AdminAppointment/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<ApiResponse<AppointmentStatistics>>> GetStatistics()
        {
            try
            {
                var today = DateTime.Today;
                var thisWeek = today.AddDays(-(int)today.DayOfWeek);
                var thisMonth = new DateTime(today.Year, today.Month, 1);

                var statistics = new AppointmentStatistics
                {
                    TotalAppointments = await _context.Appointments.CountAsync(),
                    TodayAppointments = await _context.Appointments
                        .CountAsync(a => a.Date.Date == today),
                    ThisWeekAppointments = await _context.Appointments
                        .CountAsync(a => a.Date >= thisWeek && a.Date < thisWeek.AddDays(7)),
                    ThisMonthAppointments = await _context.Appointments
                        .CountAsync(a => a.Date >= thisMonth && a.Date < thisMonth.AddMonths(1)),
                    PendingAppointments = await _context.Appointments
                        .CountAsync(a => a.Status == AppointmentStatus.Pending),
                    ConfirmedAppointments = await _context.Appointments
                        .CountAsync(a => a.Status == AppointmentStatus.Confirmed),
                    CompletedAppointments = await _context.Appointments
                        .CountAsync(a => a.Status == AppointmentStatus.Completed),
                    CancelledAppointments = await _context.Appointments
                        .CountAsync(a => a.Status == AppointmentStatus.Cancelled)
                };

                // Get appointments by doctor
                var appointmentsByDoctor = await _context.Appointments
                    .GroupBy(a => new { a.DoctorId, a.DoctorName })
                    .Select(g => new DoctorAppointmentCount
                    {
                        DoctorId = g.Key.DoctorId,
                        DoctorName = g.Key.DoctorName,
                        AppointmentCount = g.Count(),
                        PendingCount = g.Count(a => a.Status == AppointmentStatus.Pending),
                        ConfirmedCount = g.Count(a => a.Status == AppointmentStatus.Confirmed),
                        CompletedCount = g.Count(a => a.Status == AppointmentStatus.Completed)
                    })
                    .ToListAsync();

                statistics.AppointmentsByDoctor = appointmentsByDoctor;

                return new ApiResponse<AppointmentStatistics>
                {
                    Success = true,
                    Message = "Lấy thống kê lịch hẹn thành công",
                    Data = statistics
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointment statistics");
                return StatusCode(500, new ApiResponse<AppointmentStatistics>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy thống kê lịch hẹn"
                });
            }
        }

        // PUT: api/AdminAppointment/{id}/status
        [HttpPut("{id}/status")]
        public async Task<ActionResult<ApiResponse<Appointment>>> UpdateAppointmentStatus(
            string id,
            [FromBody] UpdateAppointmentStatusRequest request)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
                }

                var oldStatus = appointment.Status;
                appointment.Status = request.Status;
                appointment.UpdatedAt = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(request.Notes))
                {
                    appointment.Notes = request.Notes;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin updated appointment {AppointmentId} status from {OldStatus} to {NewStatus}",
                    id, oldStatus, request.Status);

                return new ApiResponse<Appointment>
                {
                    Success = true,
                    Message = "Cập nhật trạng thái lịch hẹn thành công",
                    Data = appointment
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment status {AppointmentId}", id);
                return StatusCode(500, new ApiResponse<Appointment>
                {
                    Success = false,
                    Message = "Lỗi server khi cập nhật trạng thái lịch hẹn"
                });
            }
        }

        // PUT: api/AdminAppointment/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Appointment>>> UpdateAppointment(
            string id,
            [FromBody] AdminUpdateAppointmentRequest request)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
                }

                // Update appointment details
                appointment.Date = request.Date;
                appointment.StartTime = request.StartTime;
                appointment.EndTime = request.EndTime;
                appointment.Status = request.Status;
                appointment.Notes = request.Notes ?? appointment.Notes;
                appointment.UpdatedAt = DateTime.UtcNow;

                // Update doctor if changed
                if (!string.IsNullOrEmpty(request.DoctorId) && request.DoctorId != appointment.DoctorId)
                {
                    appointment.DoctorId = request.DoctorId;
                    appointment.DoctorName = request.DoctorName ?? appointment.DoctorName;
                }

                // Update service if changed
                if (!string.IsNullOrEmpty(request.ServiceId) && request.ServiceId != appointment.ServiceId)
                {
                    appointment.ServiceId = request.ServiceId;
                    appointment.ServiceName = request.ServiceName ?? appointment.ServiceName;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin updated appointment {AppointmentId}", id);

                return new ApiResponse<Appointment>
                {
                    Success = true,
                    Message = "Cập nhật lịch hẹn thành công",
                    Data = appointment
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment {AppointmentId}", id);
                return StatusCode(500, new ApiResponse<Appointment>
                {
                    Success = false,
                    Message = "Lỗi server khi cập nhật lịch hẹn"
                });
            }
        }

        // DELETE: api/AdminAppointment/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteAppointment(string id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
                }

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin deleted appointment {AppointmentId}", id);

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Xóa lịch hẹn thành công"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment {AppointmentId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Lỗi server khi xóa lịch hẹn"
                });
            }
        }

        // POST: api/AdminAppointment/{id}/reschedule
        [HttpPost("{id}/reschedule")]
        public async Task<ActionResult<ApiResponse<Appointment>>> RescheduleAppointment(
            string id,
            [FromBody] RescheduleAppointmentRequest request)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Không tìm thấy lịch hẹn"
                    });
                }

                // Check if new time slot is available
                var conflictingAppointment = await _context.Appointments
                    .Where(a => a.Id != id &&
                               a.DoctorId == appointment.DoctorId &&
                               a.Date.Date == request.NewDate.Date &&
                               a.Status != AppointmentStatus.Cancelled &&
                               ((string.Compare(request.NewStartTime, a.StartTime) >= 0 && string.Compare(request.NewStartTime, a.EndTime) < 0) ||
                                (string.Compare(request.NewEndTime, a.StartTime) > 0 && string.Compare(request.NewEndTime, a.EndTime) <= 0)))
                    .FirstOrDefaultAsync();

                if (conflictingAppointment != null)
                {
                    return BadRequest(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Khung giờ mới đã có lịch hẹn khác"
                    });
                }

                appointment.Date = request.NewDate;
                appointment.StartTime = request.NewStartTime;
                appointment.EndTime = request.NewEndTime;
                appointment.Notes = $"{appointment.Notes}\n[Admin] Đã dời lịch: {request.Reason}";
                appointment.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin rescheduled appointment {AppointmentId} to {NewDate} {NewTime}",
                    id, request.NewDate, request.NewStartTime);

                return new ApiResponse<Appointment>
                {
                    Success = true,
                    Message = "Dời lịch hẹn thành công",
                    Data = appointment
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rescheduling appointment {AppointmentId}", id);
                return StatusCode(500, new ApiResponse<Appointment>
                {
                    Success = false,
                    Message = "Lỗi server khi dời lịch hẹn"
                });
            }
        }
    }

    // DTOs for Admin Appointment Management
    public class AppointmentStatistics
    {
        public int TotalAppointments { get; set; }
        public int TodayAppointments { get; set; }
        public int ThisWeekAppointments { get; set; }
        public int ThisMonthAppointments { get; set; }
        public int PendingAppointments { get; set; }
        public int ConfirmedAppointments { get; set; }
        public int CompletedAppointments { get; set; }
        public int CancelledAppointments { get; set; }
        public List<DoctorAppointmentCount> AppointmentsByDoctor { get; set; } = new();
    }

    public class DoctorAppointmentCount
    {
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public int AppointmentCount { get; set; }
        public int PendingCount { get; set; }
        public int ConfirmedCount { get; set; }
        public int CompletedCount { get; set; }
    }

    public class UpdateAppointmentStatusRequest
    {
        public AppointmentStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class AdminUpdateAppointmentRequest
    {
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public AppointmentStatus Status { get; set; }
        public string? Notes { get; set; }
        public string? DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? ServiceId { get; set; }
        public string? ServiceName { get; set; }
    }

    public class RescheduleAppointmentRequest
    {
        public DateTime NewDate { get; set; }
        public string NewStartTime { get; set; } = string.Empty;
        public string NewEndTime { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }
}
