using AppointmentApi.Models;
using AppointmentApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace AppointmentApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorService _doctorService;
        private readonly IServiceManager _serviceManager;

        public AppointmentsController(
            IAppointmentService appointmentService, 
            IDoctorService doctorService,
            IServiceManager serviceManager)
        {
            _appointmentService = appointmentService;
            _doctorService = doctorService;
            _serviceManager = serviceManager;
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
            
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new ApiResponse<List<Appointment>>
                {
                    Success = false,
                    Message = "Không tìm thấy thông tin người dùng"
                });
            }
            
            var appointments = await _appointmentService.GetByPatientIdAsync(userId);

            return new ApiResponse<List<Appointment>> 
            { 
                Success = true, 
                Message = "Lấy danh sách lịch hẹn của bạn thành công", 
                Data = appointments 
            };
        }
        
        [HttpGet("patient/{patientId}")]
        [AllowAnonymous] // Cho phép truy cập mà không cần xác thực
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetByPatientId(string patientId)
        {
            if (string.IsNullOrEmpty(patientId))
            {
                return BadRequest(new ApiResponse<List<Appointment>>
                {
                    Success = false,
                    Message = "PatientId không được để trống"
                });
            }
            
            // Bỏ kiểm tra quyền để cho phép truy cập API này
            var appointments = await _appointmentService.GetByPatientIdAsync(patientId);

            return new ApiResponse<List<Appointment>> 
            { 
                Success = true, 
                Message = $"Lấy danh sách lịch hẹn của bệnh nhân thành công", 
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

        [HttpGet("doctor/{doctorId}/date/{date}")]
        [AllowAnonymous] // Cho phép truy cập mà không cần xác thực
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetByDoctorAndDate(string doctorId, string date)
        {
            try
            {
                if (string.IsNullOrEmpty(doctorId) || string.IsNullOrEmpty(date))
                {
                    return BadRequest(new ApiResponse<List<Appointment>>
                    {
                        Success = false,
                        Message = "DoctorId và ngày không được để trống"
                    });
                }

                if (!DateTime.TryParse(date, out DateTime appointmentDate))
                {
                    return BadRequest(new ApiResponse<List<Appointment>>
                    {
                        Success = false,
                        Message = "Định dạng ngày không hợp lệ"
                    });
                }

                // Lấy tất cả lịch hẹn của bác sĩ
                var allAppointments = await _appointmentService.GetByDoctorIdAsync(doctorId);
                
                // Lọc theo ngày
                var appointmentsOnDate = allAppointments
                    .Where(a => a.Date.Date == appointmentDate.Date)
                    .ToList();

                return new ApiResponse<List<Appointment>> 
                { 
                    Success = true, 
                    Message = $"Lấy danh sách lịch hẹn của bác sĩ {doctorId} vào ngày {date} thành công", 
                    Data = appointmentsOnDate 
                };
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<List<Appointment>> 
                { 
                    Success = false, 
                    Message = $"Lỗi khi lấy lịch hẹn: {ex.Message}" 
                });
            }
        }

        [HttpGet("available-slots")]
        [AllowAnonymous] // Cho phép truy cập mà không cần xác thực
        public async Task<ActionResult<ApiResponse<List<AvailableSlot>>>> GetAvailableSlots(
            [FromQuery] string doctorId, 
            [FromQuery] DateTime date)
        {
            try
            {
                Console.WriteLine($"GetAvailableSlots API called with doctorId={doctorId}, date={date:yyyy-MM-dd}");
                
                // Kiểm tra và chuyển đổi doctorId
                if (!int.TryParse(doctorId, out int _))
                {
                    Console.WriteLine($"Invalid doctorId format: {doctorId}");
                    return BadRequest(new ApiResponse<List<AvailableSlot>>
                    {
                        Success = false,
                        Message = "ID bác sĩ không hợp lệ"
                    });
                }
                
                var slots = await _doctorService.GetAvailableSlotsAsync(doctorId, date);
                
                Console.WriteLine($"API returning {slots.Count} available slot records");
                
                return new ApiResponse<List<AvailableSlot>> 
                { 
                    Success = true, 
                    Message = "Lấy danh sách khung giờ khả dụng thành công", 
                    Data = slots 
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GetAvailableSlots API: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return BadRequest(new ApiResponse<List<AvailableSlot>> 
                { 
                    Success = false, 
                    Message = $"Lỗi khi lấy khung giờ khả dụng: {ex.Message}" 
                });
            }
        }
        
        [HttpPost]
        [AllowAnonymous] // Cho phép truy cập mà không cần xác thực
        public async Task<ActionResult<ApiResponse<Appointment>>> Create([FromBody] AppointmentRequest request)
        {
            try
            {
                // Log chi tiết dữ liệu nhận được
                Console.WriteLine($"Creating appointment with data: {System.Text.Json.JsonSerializer.Serialize(request)}");
                
                var appointmentDto = request.AppointmentDto;
                var patientId = request.PatientId;
                var patientName = request.PatientName;
                
                if (appointmentDto == null)
                {
                    Console.WriteLine("Error: AppointmentDto is missing");
                    return BadRequest(new ApiResponse<Appointment> 
                    { 
                        Success = false, 
                        Message = "appointmentDto là bắt buộc" 
                    });
                }
                
                if (string.IsNullOrEmpty(patientId))
                {
                    Console.WriteLine("Error: PatientId is missing");
                    return BadRequest(new ApiResponse<Appointment> 
                    { 
                        Success = false, 
                        Message = "PatientId là bắt buộc" 
                    });
                }
                
                // Chuyển đổi và validate dữ liệu
                if (!DateTime.TryParse(appointmentDto.Date.ToString(), out DateTime parsedDate))
                {
                    return BadRequest(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Định dạng ngày không hợp lệ"
                    });
                }
                
                // Đảm bảo doctorId và serviceId là chuỗi
                if (appointmentDto.DoctorId == null)
                {
                    return BadRequest(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "DoctorId là bắt buộc"
                    });
                }
                
                if (appointmentDto.ServiceId == null)
                {
                    return BadRequest(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "ServiceId là bắt buộc"
                    });
                }
                
                // Đảm bảo chuỗi thời gian đúng định dạng
                if (!TimeSpan.TryParse(appointmentDto.StartTime, out _))
                {
                    return BadRequest(new ApiResponse<Appointment>
                    {
                        Success = false,
                        Message = "Định dạng thời gian không hợp lệ (HH:mm)"
                    });
                }
                
                // Tạo một bản sao của DTO để đảm bảo dữ liệu đúng
                var validDto = new AppointmentCreateDto
                {
                    DoctorId = appointmentDto.DoctorId,
                    ServiceId = appointmentDto.ServiceId,
                    Date = parsedDate,
                    StartTime = appointmentDto.StartTime,
                    Notes = appointmentDto.Notes ?? string.Empty,
                    AppointmentType = appointmentDto.AppointmentType
                };
                
                Console.WriteLine($"Calling AppointmentService.CreateAsync with validated data: {System.Text.Json.JsonSerializer.Serialize(validDto)}");
                var appointment = await _appointmentService.CreateAsync(patientId, patientName, validDto);
                
                return new ApiResponse<Appointment> 
                { 
                    Success = true, 
                    Message = "Đặt lịch hẹn thành công", 
                    Data = appointment 
                };
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"ArgumentException: {ex.Message}");
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"InvalidOperationException: {ex.Message}");
                return BadRequest(new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected exception: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new ApiResponse<Appointment> 
                { 
                    Success = false, 
                    Message = $"Lỗi không xác định: {ex.Message}" 
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

            var result = await _appointmentService.DeleteAsync(id);
            
            return new ApiResponse<bool> 
            { 
                Success = true, 
                Message = "Hủy lịch hẹn thành công", 
                Data = result 
            };
        }
    }
} 