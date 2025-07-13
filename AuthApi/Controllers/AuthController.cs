using System;
using System.Threading.Tasks;
using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;
        private readonly IWebHostEnvironment _environment;

        public AuthController(
            IUserService userService,
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<AuthController> logger,
            IWebHostEnvironment environment)
        {
            _userService = userService;
            _context = context;
            _emailService = emailService;
            _logger = logger;
            _environment = environment;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                var response = await _userService.LoginAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                var response = await _userService.RegisterAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userService.GetUserByIdAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            try
            {
                // Try to get userId from JWT token claim first
                var userId = User.FindFirst("sub")?.Value;

                // If userId is null or empty, try to get it from request body
                if (string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(request.UserId))
                {
                    userId = request.UserId;
                    Console.WriteLine($"Using userId from request body: {userId}");
                }

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var updatedUser = await _userService.UpdateProfileAsync(userId, request);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Password Reset Endpoints

        [HttpPost("send-reset-code")]
        public async Task<IActionResult> SendResetCode([FromBody] SendResetCodeRequest request)
        {
            try
            {
                // Validate email format
                if (string.IsNullOrEmpty(request.Email) || !IsValidEmail(request.Email))
                {
                    return BadRequest(new { message = "Email không hợp lệ" });
                }

                // In development, ALWAYS create test code 000000 for any email FIRST
                if (_environment.IsDevelopment())
                {
                    // Remove old test codes for this email
                    var oldTestCodes = await _context.PasswordResetCodes
                        .Where(p => p.Email.ToLower() == request.Email.ToLower() && p.Code == "000000")
                        .ToListAsync();

                    if (oldTestCodes.Any())
                    {
                        _context.PasswordResetCodes.RemoveRange(oldTestCodes);
                        await _context.SaveChangesAsync();
                    }

                    // Add new test code
                    var testCode = new PasswordResetCode
                    {
                        Email = request.Email,
                        Code = "000000",
                        ExpiresAt = DateTime.UtcNow.AddMinutes(30), // 30 minutes for test
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.PasswordResetCodes.Add(testCode);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation($"=== TEST CODE CREATED ===");
                    _logger.LogInformation($"Email: {request.Email}");
                    _logger.LogInformation($"Test Code: 000000 (expires in 30 min)");
                    _logger.LogInformation($"========================");
                }

                // Check if user exists (don't reveal if email exists or not for security)
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

                // Always return success message for security (don't reveal if email exists)
                var response = new
                {
                    success = true,
                    message = "Nếu email tồn tại trong hệ thống, mã xác minh đã được gửi",
                    expiresIn = 300
                };

                if (user != null)
                {
                    // Check rate limiting
                    var recentCodes = await _context.PasswordResetCodes
                        .Where(p => p.Email.ToLower() == request.Email.ToLower() &&
                                   p.CreatedAt > DateTime.UtcNow.AddHours(-1))
                        .CountAsync();

                    if (recentCodes >= 3)
                    {
                        return BadRequest(new { message = "Đã vượt quá số lần gửi mã. Vui lòng thử lại sau 1 giờ." });
                    }

                    // Generate 6-digit code (with default test code in development)
                    var code = GenerateVerificationCode();

                    _logger.LogInformation($"=== GENERATED CODE DEBUG ===");
                    _logger.LogInformation($"Email: {user.Email}");
                    _logger.LogInformation($"Generated Code: '{code}'");
                    _logger.LogInformation($"Code Length: {code.Length}");
                    _logger.LogInformation($"============================");

                    // Save to database
                    var resetCode = new PasswordResetCode
                    {
                        Email = user.Email,
                        Code = code,
                        ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.PasswordResetCodes.Add(resetCode);
                    await _context.SaveChangesAsync();

                    // Send email
                    try
                    {
                        await _emailService.SendPasswordResetCodeAsync(user.Email, code);
                        _logger.LogInformation($"Password reset code sent to {user.Email}");
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogError(emailEx, $"Failed to send email to {user.Email}, but code was saved to database");
                        // Continue execution - code is saved in database for testing
                    }

                    // Log codes for development
                    if (_environment.IsDevelopment())
                    {
                        _logger.LogInformation($"=== REAL CODE GENERATED ===");
                        _logger.LogInformation($"Email: {user.Email}");
                        _logger.LogInformation($"Generated Code: {code}");
                        _logger.LogInformation($"Test Code: 000000 (also available)");
                        _logger.LogInformation($"===========================");
                    }
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending reset code");
                return StatusCode(500, new { message = "Đã xảy ra lỗi. Vui lòng thử lại sau." });
            }
        }

        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
                {
                    return BadRequest(new { message = "Email và mã xác minh không được để trống" });
                }

                // In development, always accept test code 000000
                if (_environment.IsDevelopment() && request.Code == "000000")
                {
                    _logger.LogInformation($"=== TEST CODE ACCEPTED ===");
                    _logger.LogInformation($"Email: {request.Email}");
                    _logger.LogInformation($"Code: 000000 (test code)");
                    _logger.LogInformation($"========================");

                    // Generate temporary token for password reset with email embedded
                    var testToken = $"TEST_{request.Email}_{GenerateSecureToken()}";

                    return Ok(new
                    {
                        success = true,
                        token = testToken,
                        message = "Mã xác minh đúng (test code)"
                    });
                }

                // Find the reset code
                var resetCode = await _context.PasswordResetCodes
                    .Where(p => p.Email.ToLower() == request.Email.ToLower() &&
                               p.Code == request.Code)
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefaultAsync();

                if (resetCode == null)
                {
                    return BadRequest(new { message = "Mã xác minh không đúng" });
                }

                // Check if code is valid first (before incrementing attempts)
                if (resetCode.IsExpired)
                {
                    return BadRequest(new { message = "Mã xác minh đã hết hạn" });
                }
                if (resetCode.IsUsed)
                {
                    return BadRequest(new { message = "Mã xác minh đã được sử dụng" });
                }
                if (resetCode.AttemptCount >= 5)
                {
                    return BadRequest(new { message = "Đã vượt quá số lần thử. Vui lòng gửi mã mới." });
                }

                // Increment attempt count only once
                resetCode.AttemptCount++;

                // Generate temporary token for password reset
                var tempToken = GenerateSecureToken();

                // Save changes (only AttemptCount increment, NOT IsUsed)
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    token = tempToken,
                    message = "Mã xác minh đúng"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying reset code");
                return StatusCode(500, new { message = "Đã xảy ra lỗi. Vui lòng thử lại sau." });
            }
        }

        [HttpPost("reset-password-with-token")]
        public async Task<IActionResult> ResetPasswordWithToken([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token) ||
                    string.IsNullOrEmpty(request.NewPassword) ||
                    string.IsNullOrEmpty(request.ConfirmPassword))
                {
                    return BadRequest(new { message = "Tất cả các trường không được để trống" });
                }

                if (request.NewPassword != request.ConfirmPassword)
                {
                    return BadRequest(new { message = "Mật khẩu xác nhận không khớp" });
                }

                // Basic password validation (minimum length only)
                if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 6)
                {
                    return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
                }

                // In development, handle test tokens differently
                if (_environment.IsDevelopment() && request.Token.StartsWith("TEST_"))
                {
                    // Parse email from test token: TEST_{email}_{random}
                    var tokenParts = request.Token.Split('_');
                    if (tokenParts.Length >= 3)
                    {
                        var targetEmail = tokenParts[1];

                        // Find the user by email
                        var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == targetEmail.ToLower());

                        if (targetUser != null)
                        {
                            targetUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                            await _context.SaveChangesAsync();

                            _logger.LogInformation($"=== TEST PASSWORD RESET ===");
                            _logger.LogInformation($"Target Email: {targetEmail}");
                            _logger.LogInformation($"User Updated: {targetUser.Email}");
                            _logger.LogInformation($"New password: {request.NewPassword}");
                            _logger.LogInformation($"Password hash updated successfully");
                            _logger.LogInformation($"===========================");

                            return Ok(new
                            {
                                success = true,
                                message = $"Mật khẩu đã được cập nhật thành công cho {targetUser.Email} (test mode)"
                            });
                        }
                        else
                        {
                            return BadRequest(new { message = $"Không tìm thấy user với email: {targetEmail}" });
                        }
                    }
                }

                // For real tokens, find recent reset codes that haven't been used for password reset
                var recentResetCodes = await _context.PasswordResetCodes
                    .Where(p => p.CreatedAt > DateTime.UtcNow.AddMinutes(-10) && !p.IsUsed && p.ExpiresAt > DateTime.UtcNow)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                // Use the most recent valid one
                var resetRecord = recentResetCodes.FirstOrDefault();

                if (resetRecord == null)
                {
                    return BadRequest(new { message = "Token không hợp lệ hoặc đã hết hạn" });
                }

                // Find user
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == resetRecord.Email.ToLower());
                if (user == null)
                {
                    return BadRequest(new { message = "Người dùng không tồn tại" });
                }

                // Update password
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                // Mark reset code as used
                resetRecord.IsUsed = true;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Password reset successful for user {user.Email}");

                return Ok(new
                {
                    success = true,
                    message = "Mật khẩu đã được cập nhật thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password");
                return StatusCode(500, new { message = "Đã xảy ra lỗi. Vui lòng thử lại sau." });
            }
        }

        // Development/Testing endpoint to get reset code
        [HttpGet("get-reset-code/{email}")]
        public async Task<IActionResult> GetResetCodeForTesting(string email)
        {
            try
            {
                // Only allow in development environment
                if (!_environment.IsDevelopment())
                {
                    return NotFound();
                }

                var allCodes = await _context.PasswordResetCodes
                    .Where(p => p.Email.ToLower() == email.ToLower())
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                if (!allCodes.Any())
                {
                    return NotFound(new { message = "No reset codes found for this email" });
                }

                return Ok(new
                {
                    email = email,
                    codes = allCodes.Select(c => new
                    {
                        code = c.Code,
                        expiresAt = c.ExpiresAt,
                        isExpired = c.IsExpired,
                        isUsed = c.IsUsed,
                        attemptCount = c.AttemptCount,
                        createdAt = c.CreatedAt
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reset code for testing");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Development/Testing endpoint to clear reset codes
        [HttpDelete("clear-reset-codes/{email}")]
        public async Task<IActionResult> ClearResetCodesForTesting(string email)
        {
            try
            {
                // Only allow in development environment
                if (!_environment.IsDevelopment())
                {
                    return NotFound();
                }

                var codes = await _context.PasswordResetCodes
                    .Where(p => p.Email.ToLower() == email.ToLower())
                    .ToListAsync();

                if (codes.Any())
                {
                    _context.PasswordResetCodes.RemoveRange(codes);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Cleared {codes.Count} reset codes for {email}");
                }

                return Ok(new { message = $"Cleared {codes.Count} reset codes for {email}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing reset codes for testing");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Helper methods
        private string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private string GenerateSecureToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }

        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email))
                {
                    return BadRequest(new { message = "Email không được để trống" });
                }

                var subject = "Test Email từ HIV Treatment System";
                var body = $@"
                    <h2>🧪 Test Email</h2>
                    <p>Đây là email test từ HIV Treatment System.</p>
                    <p><strong>Thời gian:</strong> {DateTime.Now:dd/MM/yyyy HH:mm:ss}</p>
                    <p><strong>Email nhận:</strong> {request.Email}</p>
                    <hr>
                    <p>Nếu bạn nhận được email này, cấu hình email đã hoạt động thành công! ✅</p>
                ";

                await _emailService.SendEmailAsync(request.Email, subject, body);

                _logger.LogInformation($"=== TEST EMAIL SENT ===");
                _logger.LogInformation($"To: {request.Email}");
                _logger.LogInformation($"Subject: {subject}");
                _logger.LogInformation($"======================");

                return Ok(new
                {
                    success = true,
                    message = $"Email test đã được gửi đến {request.Email}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test email");
                return StatusCode(500, new { message = "Lỗi gửi email: " + ex.Message });
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPassword(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8)
                return false;

            bool hasUpper = password.Any(char.IsUpper);
            bool hasLower = password.Any(char.IsLower);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecial = password.Any(ch => !char.IsLetterOrDigit(ch));

            return hasUpper && hasLower && hasDigit && hasSpecial;
        }
    }

    // Request/Response models
    public class SendResetCodeRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyResetCodeRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class TestEmailRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}