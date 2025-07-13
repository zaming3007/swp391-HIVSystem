using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;
using AuthApi.DTOs;
using AuthApi.Services;
using System.Security.Claims;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminDoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminDoctorController> _logger;
        private readonly IUserManagerService _userManager;

        public AdminDoctorController(
            ApplicationDbContext context,
            ILogger<AdminDoctorController> logger,
            IUserManagerService userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        // GET: api/AdminDoctor
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DoctorDto>>>> GetAllDoctors()
        {
            try
            {
                var doctors = await _context.Doctors
                    .Select(d => new DoctorDto
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Email = d.Email,
                        Phone = d.Phone,
                        Specialization = d.Specialization,
                        Experience = d.Experience,
                        Bio = d.Bio,
                        Available = d.Available,
                        ProfileImage = d.ProfileImage,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt
                    })
                    .ToListAsync();

                return new ApiResponse<List<DoctorDto>>
                {
                    Success = true,
                    Message = "Lấy danh sách bác sĩ thành công",
                    Data = doctors
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctors list");
                return StatusCode(500, new ApiResponse<List<DoctorDto>>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy danh sách bác sĩ"
                });
            }
        }

        // GET: api/AdminDoctor/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DoctorDto>>> GetDoctor(string id)
        {
            try
            {
                var doctor = await _context.Doctors
                    .Where(d => d.Id == id)
                    .Select(d => new DoctorDto
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Email = d.Email,
                        Phone = d.Phone,
                        Specialization = d.Specialization,
                        Experience = d.Experience,
                        Bio = d.Bio,
                        Available = d.Available,
                        ProfileImage = d.ProfileImage,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (doctor == null)
                {
                    return NotFound(new ApiResponse<DoctorDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy bác sĩ"
                    });
                }

                return new ApiResponse<DoctorDto>
                {
                    Success = true,
                    Message = "Lấy thông tin bác sĩ thành công",
                    Data = doctor
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctor {DoctorId}", id);
                return StatusCode(500, new ApiResponse<DoctorDto>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy thông tin bác sĩ"
                });
            }
        }

        // POST: api/AdminDoctor
        [HttpPost]
        public async Task<ActionResult<ApiResponse<DoctorDto>>> CreateDoctor(CreateDoctorDto createDoctorDto)
        {
            try
            {
                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == createDoctorDto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new ApiResponse<DoctorDto>
                    {
                        Success = false,
                        Message = "Email đã tồn tại trong hệ thống"
                    });
                }

                // Create User account
                var user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    FirstName = createDoctorDto.FirstName,
                    LastName = createDoctorDto.LastName,
                    Email = createDoctorDto.Email,
                    Phone = createDoctorDto.Phone,
                    Gender = createDoctorDto.Gender,
                    DateOfBirth = createDoctorDto.DateOfBirth?.ToString("yyyy-MM-dd") ?? "1990-01-01",
                    Role = "doctor", // lowercase to match existing data
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDoctorDto.Password),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);

                // Create Doctor profile
                var doctor = new Doctor
                {
                    Id = user.Id,
                    FirstName = createDoctorDto.FirstName,
                    LastName = createDoctorDto.LastName,
                    Email = createDoctorDto.Email,
                    Phone = createDoctorDto.Phone,
                    Specialization = createDoctorDto.Specialization,
                    Experience = createDoctorDto.Experience,
                    Bio = createDoctorDto.Bio,
                    Available = true,
                    ProfileImage = createDoctorDto.ProfileImage ?? "/doctor-profiles/default.jpg",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();

                var doctorDto = new DoctorDto
                {
                    Id = doctor.Id,
                    FirstName = doctor.FirstName,
                    LastName = doctor.LastName,
                    Email = doctor.Email,
                    Phone = doctor.Phone,
                    Specialization = doctor.Specialization,
                    Experience = doctor.Experience,
                    Bio = doctor.Bio,
                    Available = doctor.Available,
                    ProfileImage = doctor.ProfileImage,
                    CreatedAt = doctor.CreatedAt,
                    UpdatedAt = doctor.UpdatedAt
                };

                return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, new ApiResponse<DoctorDto>
                {
                    Success = true,
                    Message = "Tạo bác sĩ thành công",
                    Data = doctorDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating doctor");
                return StatusCode(500, new ApiResponse<DoctorDto>
                {
                    Success = false,
                    Message = "Lỗi server khi tạo bác sĩ"
                });
            }
        }

        // PUT: api/AdminDoctor/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<DoctorDto>>> UpdateDoctor(string id, UpdateDoctorDto updateDoctorDto)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                {
                    return NotFound(new ApiResponse<DoctorDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy bác sĩ"
                    });
                }

                // Update doctor profile
                doctor.FirstName = updateDoctorDto.FirstName;
                doctor.LastName = updateDoctorDto.LastName;
                doctor.Phone = updateDoctorDto.Phone;
                doctor.Specialization = updateDoctorDto.Specialization;
                doctor.Experience = updateDoctorDto.Experience;
                doctor.Bio = updateDoctorDto.Bio;
                doctor.Available = updateDoctorDto.Available;
                doctor.UpdatedAt = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(updateDoctorDto.ProfileImage))
                {
                    doctor.ProfileImage = updateDoctorDto.ProfileImage;
                }

                // Update user account
                var user = await _userManager.FindByIdAsync(id);
                if (user != null)
                {
                    user.FirstName = updateDoctorDto.FirstName;
                    user.LastName = updateDoctorDto.LastName;
                    user.Phone = updateDoctorDto.Phone;
                    await _userManager.UpdateAsync(user);
                }

                await _context.SaveChangesAsync();

                var doctorDto = new DoctorDto
                {
                    Id = doctor.Id,
                    FirstName = doctor.FirstName,
                    LastName = doctor.LastName,
                    Email = doctor.Email,
                    Phone = doctor.Phone,
                    Specialization = doctor.Specialization,
                    Experience = doctor.Experience,
                    Bio = doctor.Bio,
                    Available = doctor.Available,
                    ProfileImage = doctor.ProfileImage,
                    CreatedAt = doctor.CreatedAt,
                    UpdatedAt = doctor.UpdatedAt
                };

                return new ApiResponse<DoctorDto>
                {
                    Success = true,
                    Message = "Cập nhật bác sĩ thành công",
                    Data = doctorDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating doctor {DoctorId}", id);
                return StatusCode(500, new ApiResponse<DoctorDto>
                {
                    Success = false,
                    Message = "Lỗi server khi cập nhật bác sĩ"
                });
            }
        }

        // DELETE: api/AdminDoctor/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteDoctor(string id)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Không tìm thấy bác sĩ"
                    });
                }

                // Check if doctor has appointments
                var hasAppointments = await _context.Set<object>()
                    .FromSqlRaw("SELECT 1 FROM \"Appointments\" WHERE doctor_id = {0} LIMIT 1", id)
                    .AnyAsync();

                if (hasAppointments)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Không thể xóa bác sĩ vì còn có lịch hẹn"
                    });
                }

                // Remove doctor profile
                _context.Doctors.Remove(doctor);

                // Remove user account
                var user = await _userManager.FindByIdAsync(id);
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }

                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Xóa bác sĩ thành công"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting doctor {DoctorId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Lỗi server khi xóa bác sĩ"
                });
            }
        }

        // PUT: api/AdminDoctor/{id}/toggle-availability
        [HttpPut("{id}/toggle-availability")]
        public async Task<ActionResult<ApiResponse<object>>> ToggleAvailability(string id)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Không tìm thấy bác sĩ"
                    });
                }

                doctor.Available = !doctor.Available;
                doctor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = $"Đã {(doctor.Available ? "kích hoạt" : "vô hiệu hóa")} bác sĩ"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling doctor availability {DoctorId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Lỗi server khi thay đổi trạng thái bác sĩ"
                });
            }
        }
    }
}
