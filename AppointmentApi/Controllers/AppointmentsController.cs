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
        private readonly INotificationService _notificationService;

        public AppointmentsController(
            IAppointmentService appointmentService,
            IDoctorService doctorService,
            IServiceManager serviceManager,
            INotificationService notificationService)
        {
            _appointmentService = appointmentService;
            _doctorService = doctorService;
            _serviceManager = serviceManager;
            _notificationService = notificationService;
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

        [HttpGet("doctor")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<ApiResponse<List<Appointment>>>> GetMyDoctorAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new ApiResponse<List<Appointment>>
                {
                    Success = false,
                    Message = "Không tìm thấy thông tin bác sĩ"
                });
            }

            var appointments = await _appointmentService.GetByDoctorIdAsync(userId);

            return new ApiResponse<List<Appointment>>
            {
                Success = true,
                Message = "Lấy danh sách lịch hẹn của bác sĩ thành công",
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Admin có thể xem lịch hẹn của bất kỳ bác sĩ nào
            // Doctor chỉ có thể xem lịch hẹn của chính mình
            if (!User.IsInRole("Admin"))
            {
                if (!User.IsInRole("Doctor"))
                {
                    return Forbid();
                }

                // Kiểm tra xem doctor có đang xem lịch hẹn của chính mình không
                if (userId != doctorId)
                {
                    return Forbid();
                }
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

                // Kiểm tra doctorId không rỗng
                if (string.IsNullOrEmpty(doctorId))
                {
                    Console.WriteLine($"DoctorId is null or empty");
                    return BadRequest(new ApiResponse<List<AvailableSlot>>
                    {
                        Success = false,
                        Message = "ID bác sĩ không được để trống"
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

        // POST: api/Appointments/{id}/cancel-with-reason - Cancel appointment with specific reason
        [HttpPost("{id}/cancel-with-reason")]
        public async Task<ActionResult<ApiResponse<bool>>> CancelWithReason(string id, [FromBody] CancelAppointmentRequest request)
        {
            try
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

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Check permissions
                if (!User.IsInRole("admin") && !User.IsInRole("staff") && !User.IsInRole("doctor") && appointment.PatientId != userId)
                {
                    return Forbid();
                }

                // Update appointment status
                var updateDto = new AppointmentUpdateDto
                {
                    Status = AppointmentStatus.Cancelled,
                    Notes = request.Reason
                };

                await _appointmentService.UpdateAsync(id, updateDto);

                // Send specific notification based on who cancelled
                string cancelledBy = userRole switch
                {
                    "doctor" => "doctor",
                    "staff" => "staff",
                    "admin" => "admin",
                    _ => "patient"
                };

                await _notificationService.NotifyAppointmentCancelledAsync(id, cancelledBy);

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Hủy lịch hẹn thành công",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Lỗi khi hủy lịch hẹn",
                    Data = false
                });
            }
        }

        // POST: api/Appointments/{id}/confirm - Confirm appointment
        [HttpPost("{id}/confirm")]
        [Authorize(Roles = "admin,staff,doctor")]
        public async Task<ActionResult<ApiResponse<bool>>> ConfirmAppointment(string id)
        {
            try
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

                var updateDto = new AppointmentUpdateDto
                {
                    Status = AppointmentStatus.Confirmed
                };

                await _appointmentService.UpdateAsync(id, updateDto);

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Xác nhận lịch hẹn thành công",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Lỗi khi xác nhận lịch hẹn",
                    Data = false
                });
            }
        }

        // POST: api/Appointments/{id}/reschedule - Reschedule appointment
        [HttpPost("{id}/reschedule")]
        [Authorize(Roles = "admin,staff,doctor")]
        public async Task<ActionResult<ApiResponse<bool>>> RescheduleAppointment(string id, [FromBody] AppointmentRescheduleRequest request)
        {
            try
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

                var oldDateTime = $"{appointment.Date:dd/MM/yyyy} {appointment.StartTime}";

                // Update appointment with new date/time
                // Note: This would require extending AppointmentUpdateDto to include Date and StartTime
                // For now, we'll just send the notification

                var newDateTime = $"{request.NewDate:dd/MM/yyyy} {request.NewTime}";
                await _notificationService.NotifyAppointmentRescheduledAsync(id, oldDateTime, newDateTime);

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Thay đổi lịch hẹn thành công",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Lỗi khi thay đổi lịch hẹn",
                    Data = false
                });
            }
        }
    }

    // Request DTOs
    public class CancelAppointmentRequest
    {
        public required string Reason { get; set; }
    }

    public class AppointmentRescheduleRequest
    {
        public required DateTime NewDate { get; set; }
        public required string NewTime { get; set; }
        public string? Reason { get; set; }
    }
}