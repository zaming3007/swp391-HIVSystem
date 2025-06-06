using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using System.Security.Cryptography;
using System.Text;

namespace HIVHealthcareSystem.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

                if (user != null)
                {
                    bool passwordMatch = false;
                    
                    if (user.PasswordHash == request.Password)
                    {
                        passwordMatch = true;
                    }
                    else
                    {
                        var inputHash = HashPassword(request.Password);
                        if (user.PasswordHash == inputHash)
                        {
                            passwordMatch = true;
                            user.PasswordHash = request.Password;
                            user.ModifiedDate = DateTime.Now;
                            await _context.SaveChangesAsync();
                        }
                    }

                    if (passwordMatch)
                    {
                        user.LastLoginDate = DateTime.Now;
                        await _context.SaveChangesAsync();

                        return Ok(new LoginResponse
                        {
                            Success = true,
                            Message = "Đăng nhập thành công",
                            User = new UserDto
                            {
                                UserID = user.UserID,
                                Username = user.Username,
                                Email = user.Email,
                                FullName = user.FullName,
                                RoleID = user.RoleID
                            }
                        });
                    }
                }

                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponse
                {
                    Success = false,
                    Message = $"Lỗi server: {ex.Message}"
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Kiểm tra username đã tồn tại
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == request.Username);

                if (existingUser != null)
                {
                    return BadRequest(new RegisterResponse
                    {
                        Success = false,
                        Message = "Tên đăng nhập đã tồn tại"
                    });
                }

                // Kiểm tra email đã tồn tại
                var existingEmail = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingEmail != null)
                {
                    return BadRequest(new RegisterResponse
                    {
                        Success = false,
                        Message = "Email đã được sử dụng"
                    });
                }

                // Tạo user mới
                var newUser = new User
                {
                    Username = request.Username,
                    PasswordHash = request.Password,
                    Email = request.Email,
                    FullName = request.Username,
                    RoleID = 3, // Mặc định khách hàng
                    IsAnonymous = false,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "Đăng ký thành công"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new RegisterResponse
                {
                    Success = false,
                    Message = $"Lỗi server: {ex.Message}"
                });
            }
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { Success = false, Message = "Không tìm thấy người dùng" });
                }

                return Ok(new
                {
                    Success = true,
                    User = new UserProfileDto
                    {
                        UserID = user.UserID,
                        Username = user.Username,
                        Email = user.Email,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        DateOfBirth = user.DateOfBirth,
                        Gender = user.Gender,
                        Address = user.Address,
                        RoleID = user.RoleID
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("profile/{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] UpdateProfileRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { Success = false, Message = "Không tìm thấy người dùng" });
                }

                user.FullName = request.FullName;
                user.PhoneNumber = request.PhoneNumber;
                user.DateOfBirth = request.DateOfBirth;
                user.Gender = request.Gender;
                user.Address = request.Address;
                user.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { Success = true, Message = "Cập nhật thông tin thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                var username = HttpContext.Session.GetString("Username");

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username))
                {
                    return Ok(new { 
                        success = false, 
                        isAuthenticated = false,
                        message = "Người dùng chưa đăng nhập" 
                    });
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserID == int.Parse(userId) && u.IsActive);

                if (user == null)
                {
                    // Clear invalid session
                    HttpContext.Session.Clear();
                    return Ok(new { 
                        success = false, 
                        isAuthenticated = false,
                        message = "Phiên đăng nhập không hợp lệ" 
                    });
                }

                return Ok(new
                {
                    success = true,
                    isAuthenticated = true,
                    user = new
                    {
                        user.UserID,
                        user.Username,
                        user.FullName,
                        user.Email,
                        user.PhoneNumber,
                        user.DateOfBirth,
                        user.Gender,
                        user.Address
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server: " + ex.Message 
                });
            }
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }

    // DTOs
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDto? User { get; set; }
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }

    public class UserDto
    {
        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int RoleID { get; set; }
    }

    public class UserProfileDto : UserDto
    {
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
} 