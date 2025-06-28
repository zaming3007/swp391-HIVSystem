using AppointmentApi.Models;
using AppointmentApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorsController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
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
        public async Task<ActionResult<ApiResponse<List<Doctor>>>> GetByServiceId(string serviceId)
        {
            var doctors = await _doctorService.GetDoctorsByServiceIdAsync(serviceId);
            return new ApiResponse<List<Doctor>> 
            { 
                Success = true, 
                Message = $"Lấy danh sách bác sĩ có thể thực hiện dịch vụ {serviceId} thành công", 
                Data = doctors 
            };
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
    }
} 