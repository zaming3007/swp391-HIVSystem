using AppointmentApi.Models;
using AppointmentApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public ServicesController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Service>>>> GetAll()
        {
            var services = await _serviceManager.GetAllAsync();
            return new ApiResponse<List<Service>> 
            { 
                Success = true, 
                Message = "Lấy danh sách dịch vụ thành công", 
                Data = services 
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Service>>> GetById(string id)
        {
            var service = await _serviceManager.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new ApiResponse<Service> 
                { 
                    Success = false, 
                    Message = "Không tìm thấy dịch vụ" 
                });
            }

            return new ApiResponse<Service> 
            { 
                Success = true, 
                Message = "Lấy thông tin dịch vụ thành công", 
                Data = service 
            };
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<ApiResponse<List<Service>>>> GetByCategory(string category)
        {
            var services = await _serviceManager.GetByCategoryAsync(category);
            return new ApiResponse<List<Service>> 
            { 
                Success = true, 
                Message = $"Lấy danh sách dịch vụ thuộc danh mục {category} thành công", 
                Data = services 
            };
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<ApiResponse<List<Service>>>> GetByDoctorId(string doctorId)
        {
            var services = await _serviceManager.GetServicesByDoctorIdAsync(doctorId);
            return new ApiResponse<List<Service>> 
            { 
                Success = true, 
                Message = $"Lấy danh sách dịch vụ của bác sĩ {doctorId} thành công", 
                Data = services 
            };
        }
    }
} 