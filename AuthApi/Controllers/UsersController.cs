using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;
using System.Security.Claims;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        u.Email,
                        u.Phone,
                        u.Role,
                        u.Gender,
                        u.DateOfBirth,
                        u.ProfileImage,
                        u.CreatedAt,
                        u.UpdatedAt
                    })
                    .OrderByDescending(u => u.CreatedAt)
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách người dùng" });
            }
        }

        // GET: api/Users/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetUserStats()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var totalCustomers = await _context.Users.CountAsync(u => u.Role == "customer");
                var totalDoctors = await _context.Users.CountAsync(u => u.Role == "doctor");
                var totalStaff = await _context.Users.CountAsync(u => u.Role == "staff");
                var totalAdmins = await _context.Users.CountAsync(u => u.Role == "admin");

                var startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var newUsersThisMonth = await _context.Users
                    .CountAsync(u => u.CreatedAt >= startOfMonth);

                return Ok(new
                {
                    totalUsers,
                    totalCustomers,
                    totalDoctors,
                    totalStaff,
                    totalAdmins,
                    newUsersThisMonth
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user stats");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải thống kê người dùng" });
            }
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(string id)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        u.Email,
                        u.Phone,
                        u.Role,
                        u.Gender,
                        u.DateOfBirth,
                        u.ProfileImage,
                        u.CreatedAt,
                        u.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user {UserId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải thông tin người dùng" });
            }
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<object>> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Email và mật khẩu không được để trống" });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email đã tồn tại trong hệ thống" });
                }

                // Create new user
                var user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone ?? "",
                    Role = request.Role,
                    Gender = request.Gender,
                    DateOfBirth = request.DateOfBirth,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User created successfully: {Email} with role {Role}", user.Email, user.Role);

                return Ok(new
                {
                    message = "Tạo người dùng thành công",
                    user = new
                    {
                        user.Id,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.Phone,
                        user.Role,
                        user.Gender,
                        user.DateOfBirth,
                        user.CreatedAt,
                        user.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tạo người dùng" });
            }
        }

        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                // Check if email is being changed and if it already exists
                if (request.Email != user.Email)
                {
                    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.Id != id);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Email đã tồn tại trong hệ thống" });
                    }
                }

                // Update user properties
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Email = request.Email;
                user.Phone = request.Phone ?? "";
                user.Role = request.Role;
                user.Gender = request.Gender;
                user.DateOfBirth = request.DateOfBirth;
                user.UpdatedAt = DateTime.UtcNow;

                // Update password if provided
                if (!string.IsNullOrEmpty(request.Password))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("User updated successfully: {Email}", user.Email);

                return Ok(new { message = "Cập nhật người dùng thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật người dùng" });
            }
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                // Prevent deleting the current admin user
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (user.Id == currentUserId)
                {
                    return BadRequest(new { message = "Không thể xóa tài khoản của chính mình" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User deleted successfully: {Email}", user.Email);

                return Ok(new { message = "Xóa người dùng thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi xóa người dùng" });
            }
        }
    }

    public class CreateUserRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = "customer";
        public string Gender { get; set; } = "male";
        public string DateOfBirth { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = "customer";
        public string Gender { get; set; } = "male";
        public string DateOfBirth { get; set; } = string.Empty;
        public string? Password { get; set; }
    }
}
