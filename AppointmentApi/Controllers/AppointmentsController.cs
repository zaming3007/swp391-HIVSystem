using AppointmentApi.Models;
using AppointmentApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AppointmentApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetAll()
        {
            // Chỉ admin mới có thể xem tất cả lịch hẹn
            if (!User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var appointments = await _appointmentService.GetAllAsync();
            return new ApiResponse<List<Appointment>> 
            { 
                Success = true, 
                Message = "Lấy danh sách lịch hẹn thành công", 
                Data = appointments 
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Appointment>>> GetById(string id)
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            if (appointment == null)
            {
                return NotFound(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = "Không tìm thấy lịch hẹn" 
                });
            }

            // Kiểm tra quyền: Chỉ admin hoặc chủ sở hữu mới có thể xem chi tiết
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("Admin") && appointment.PatientId != userId)
            {
                return Forbid();
            }

            return new ApiResponse<Appointment> 
            { 
                Success = true, 
                Message = "Lấy chi tiết lịch hẹn thành công", 
                Data = appointment 
            };
        }

        [HttpGet("patient")]
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetMyAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appointments = await _appointmentService.GetByPatientIdAsync(userId);

            return new ApiResponse<List<Appointment>> 
            { 
                Success = true, 
                Message = "Lấy danh sách lịch hẹn của bạn thành công", 
                Data = appointments 
            };
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetByDoctorId(string doctorId)
        {
            // Chỉ admin mới có thể xem lịch hẹn của bác sĩ
            if (!User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var appointments = await _appointmentService.GetByDoctorIdAsync(doctorId);

            return new ApiResponse<List<Appointment>> 
            { 
                Success = true, 
                Message = $"Lấy danh sách lịch hẹn của bác sĩ {doctorId} thành công", 
                Data = appointments 
            };
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Appointment>>> Create(AppointmentCreateDto appointmentDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Unknown";
                
                var appointment = await _appointmentService.CreateAsync(userId, userName, appointmentDto);
                
                return new ApiResponse<Appointment> 
                { 
                    Success = true, 
                    Message = "Đặt lịch hẹn thành công", 
                    Data = appointment 
                };
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Appointment>>> Update(string id, AppointmentUpdateDto appointmentDto)
        {
            try
            {
                var appointment = await _appointmentService.GetByIdAsync(id);
                if (appointment == null)
                {
                    return NotFound(new ApiResponse<Appointment> 
                    { 
                        Success = false, 
                        Message = "Không tìm thấy lịch hẹn" 
                    });
                }

                // Kiểm tra quyền: Chỉ admin hoặc chủ sở hữu mới có thể cập nhật
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!User.IsInRole("Admin") && appointment.PatientId != userId)
                {
                    return Forbid();
                }

                var updatedAppointment = await _appointmentService.UpdateAsync(id, appointmentDto);
                
                return new ApiResponse<Appointment> 
                { 
                    Success = true, 
                    Message = "Cập nhật lịch hẹn thành công", 
                    Data = updatedAppointment 
                };
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Cancel(string id)
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            if (appointment == null)
            {
                return NotFound(new ApiResponse<bool> 
                { 
                    Success = false, 
                    Message = "Không tìm thấy lịch hẹn" 
                });
            }

            // Kiểm tra quyền: Chỉ admin hoặc chủ sở hữu mới có thể hủy
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("Admin") && appointment.PatientId != userId)
            {
                return Forbid();
            }

            var result = await _appointmentService.CancelAsync(id);
            
            return new ApiResponse<bool> 
            { 
                Success = true, 
                Message = "Hủy lịch hẹn thành công", 
                Data = result 
            };
        }

        [HttpGet("available-slots")]
        public async Task<ActionResult<ApiResponse<List<string>>>> GetAvailableSlots(
            [FromQuery] string doctorId, 
            [FromQuery] DateTime date, 
            [FromQuery] string serviceId)
        {
            try
            {
                var slots = await _appointmentService.GetAvailableSlotsAsync(doctorId, date, serviceId);
                
                return new ApiResponse<List<string>> 
                { 
                    Success = true, 
                    Message = "Lấy danh sách slot trống thành công", 
                    Data = slots 
                };
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<List<string>> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
        }
    }
} 