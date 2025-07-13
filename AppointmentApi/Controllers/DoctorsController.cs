using AppointmentApi.Models;
using AppointmentApi.Services;
using AppointmentApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ApplicationDbContext _context;

        public DoctorsController(IDoctorService doctorService, ApplicationDbContext context)
        {
            _doctorService = doctorService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Doctor>>>> GetAll()
        {
            var doctors = await _doctorService.GetAllAsync();
            return new ApiResponse<List<Doctor>>
            {
                Success = true,
                Message = "Lấy danh sách bác sĩ thành công",
                Data = doctors
            };
        }

        // GET: api/doctors/simple - For dropdown lists
        [HttpGet("simple")]
        public async Task<ActionResult<List<object>>> GetSimpleList()
        {
            try
            {
                // Get doctors directly from context without includes to avoid circular reference
                var doctors = await _context.Doctors
                    .Where(d => d.Available)
                    .Select(d => new
                    {
                        id = d.Id,
                        name = $"{d.FirstName} {d.LastName}",
                        specialization = d.Specialization,
                        email = d.Email
                    })
                    .ToListAsync();

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách bác sĩ: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Doctor>>> GetById(string id)
        {
            var doctor = await _doctorService.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound(new ApiResponse<Doctor>
                {
                    Success = false,
                    Message = "Không tìm thấy bác sĩ"
                });
            }

            return new ApiResponse<Doctor>
            {
                Success = true,
                Message = "Lấy thông tin bác sĩ thành công",
                Data = doctor
            };
        }

        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<ApiResponse<List<Doctor>>>> GetBySpecialization(string specialization)
        {
            var doctors = await _doctorService.GetBySpecializationAsync(specialization);
            return new ApiResponse<List<Doctor>>
            {
                Success = true,
                Message = $"Lấy danh sách bác sĩ chuyên khoa {specialization} thành công",
                Data = doctors
            };
        }

        [HttpGet("service/{serviceId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<List<Doctor>>>> GetByServiceId(string serviceId)
        {
            try
            {
                var doctors = await _doctorService.GetDoctorsByServiceIdAsync(serviceId);
                return new ApiResponse<List<Doctor>>
                {
                    Success = true,
                    Message = $"Lấy danh sách bác sĩ có thể thực hiện dịch vụ {serviceId} thành công",
                    Data = doctors
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<Doctor>>
                {
                    Success = false,
                    Message = $"Lỗi khi lấy danh sách bác sĩ: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}/schedule")]
        public async Task<ActionResult<ApiResponse<List<TimeSlot>>>> GetSchedule(string id)
        {
            var doctor = await _doctorService.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound(new ApiResponse<List<TimeSlot>>
                {
                    Success = false,
                    Message = "Không tìm thấy bác sĩ"
                });
            }

            var schedule = await _doctorService.GetScheduleAsync(id);
            return new ApiResponse<List<TimeSlot>>
            {
                Success = true,
                Message = "Lấy lịch làm việc của bác sĩ thành công",
                Data = schedule
            };
        }

        [HttpGet("timeslots/{doctorId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<List<TimeSlot>>>> GetTimeSlots(string doctorId)
        {
            try
            {
                var timeSlots = await _doctorService.GetScheduleAsync(doctorId);

                Console.WriteLine($"Found {timeSlots.Count} time slots for doctor {doctorId}");
                foreach (var slot in timeSlots)
                {
                    Console.WriteLine($"Day: {slot.DayOfWeek}, Time: {slot.StartTime} - {slot.EndTime}");
                }

                return new ApiResponse<List<TimeSlot>>
                {
                    Success = true,
                    Message = "Lấy lịch làm việc của bác sĩ thành công",
                    Data = timeSlots
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting time slots: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new ApiResponse<List<TimeSlot>>
                {
                    Success = false,
                    Message = $"Lỗi khi lấy lịch làm việc: {ex.Message}"
                });
            }
        }

        [HttpPost("timeslots/{doctorId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<TimeSlot>>> CreateTimeSlot(string doctorId, [FromBody] TimeSlotCreateDto timeSlotDto)
        {
            try
            {
                var doctor = await _doctorService.GetByIdAsync(doctorId);
                if (doctor == null)
                {
                    return NotFound(new ApiResponse<TimeSlot>
                    {
                        Success = false,
                        Message = "Không tìm thấy bác sĩ"
                    });
                }

                var timeSlot = new TimeSlot
                {
                    DoctorId = doctorId,
                    DayOfWeek = timeSlotDto.DayOfWeek,
                    StartTime = timeSlotDto.StartTime,
                    EndTime = timeSlotDto.EndTime
                };

                _context.TimeSlots.Add(timeSlot);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Created time slot: Day {timeSlot.DayOfWeek}, Time: {timeSlot.StartTime} - {timeSlot.EndTime}");

                return new ApiResponse<TimeSlot>
                {
                    Success = true,
                    Message = "Tạo lịch làm việc thành công",
                    Data = timeSlot
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating time slot: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new ApiResponse<TimeSlot>
                {
                    Success = false,
                    Message = $"Lỗi khi tạo lịch làm việc: {ex.Message}"
                });
            }
        }
    }
}

namespace AppointmentApi.Models
{
    public class TimeSlotCreateDto
    {
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }
}