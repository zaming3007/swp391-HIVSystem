using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.SqlClient;

namespace HIVHealthcareSystem.Controllers
{
    public class TestController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public TestController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Test kết nối database và hiển thị thông tin
        public async Task<IActionResult> Database()
        {
            ViewBag.CanConnect = false;
            ViewBag.UserCount = 0;
            ViewBag.Users = new List<User>();
            ViewBag.TableExists = false;
            ViewBag.Error = null;

            try
            {
                // Kiểm tra kết nối database
                var canConnect = await _context.Database.CanConnectAsync();
                ViewBag.CanConnect = canConnect;

                if (!canConnect)
                {
                    ViewBag.Error = "Không thể kết nối đến database. Kiểm tra connection string và SQL Server.";
                    return View();
                }

                // Kiểm tra bảng Users có tồn tại không
                try
                {
                    var userCount = await _context.Users.CountAsync();
                    ViewBag.UserCount = userCount;
                    ViewBag.TableExists = true;

                    // Lấy danh sách users
                    var users = await _context.Users
                        .Select(u => new User
                        {
                            UserID = u.UserID,
                            Username = u.Username ?? "N/A",
                            FullName = u.FullName ?? "N/A",
                            Email = u.Email ?? "N/A",
                            IsActive = u.IsActive,
                            CreatedDate = u.CreatedDate
                        })
                        .Take(10)
                        .ToListAsync();
                    
                    ViewBag.Users = users;
                }
                catch (Exception tableEx)
                {
                    ViewBag.TableExists = false;
                    ViewBag.Error = $"Bảng Users không tồn tại hoặc có lỗi: {tableEx.Message}";
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = $"Lỗi kết nối database: {ex.Message}";
                if (ex.InnerException != null)
                {
                    ViewBag.Error += $" Inner Exception: {ex.InnerException.Message}";
                }
            }

            return View();
        }

        // Test tất cả connection strings
        public async Task<IActionResult> TestAllConnections()
        {
            var results = new List<object>();
            
            var connections = new Dictionary<string, string>
            {
                { "DefaultConnection", _configuration.GetConnectionString("DefaultConnection") },
                { "Alternative1", _configuration.GetConnectionString("Alternative1") },
                { "Alternative2", _configuration.GetConnectionString("Alternative2") },
                { "Alternative3", _configuration.GetConnectionString("Alternative3") },
                { "SQLAuth", _configuration.GetConnectionString("SQLAuth") }
            };

            foreach (var conn in connections)
            {
                var result = new
                {
                    Name = conn.Key,
                    ConnectionString = conn.Value,
                    CanConnect = false,
                    Error = "",
                    DatabaseExists = false
                };

                try
                {
                    using (var connection = new SqlConnection(conn.Value))
                    {
                        await connection.OpenAsync();
                        result = new
                        {
                            Name = conn.Key,
                            ConnectionString = conn.Value,
                            CanConnect = true,
                            Error = "",
                            DatabaseExists = await CheckDatabaseExists(connection)
                        };
                    }
                }
                catch (Exception ex)
                {
                    result = new
                    {
                        Name = conn.Key,
                        ConnectionString = conn.Value,
                        CanConnect = false,
                        Error = ex.Message,
                        DatabaseExists = false
                    };
                }

                results.Add(result);
            }

            ViewBag.Results = results;
            return View();
        }

        private async Task<bool> CheckDatabaseExists(SqlConnection connection)
        {
            try
            {
                var command = new SqlCommand("SELECT COUNT(*) FROM sys.databases WHERE name = 'HIVHealthcareSystem'", connection);
                var count = (int)await command.ExecuteScalarAsync();
                return count > 0;
            }
            catch
            {
                return false;
            }
        }

        // Tạo user test nếu chưa có
        public async Task<IActionResult> CreateTestUser()
        {
            try
            {
                // Kiểm tra kết nối trước
                var canConnect = await _context.Database.CanConnectAsync();
                if (!canConnect)
                {
                    TempData["Error"] = "Không thể kết nối đến database!";
                    return RedirectToAction("Database");
                }

                // Kiểm tra user admin đã tồn tại chưa
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == "admin");
                
                if (existingUser != null)
                {
                    TempData["Message"] = "User admin đã tồn tại!";
                    return RedirectToAction("Database");
                }

                // Tạo user test mới
                var testUser = new User
                {
                    Username = "admin",
                    PasswordHash = HashPassword("admin123"),
                    Email = "admin@test.com",
                    FullName = "Test Admin",
                    PhoneNumber = "0123456789",
                    Gender = "Male",
                    Address = "Test Address",
                    RoleID = 1,
                    IsAnonymous = false,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.Users.Add(testUser);
                await _context.SaveChangesAsync();

                TempData["Message"] = "✅ Đã tạo user test thành công! Username: admin, Password: admin123";
                return RedirectToAction("Database");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Lỗi khi tạo user: {ex.Message}";
                return RedirectToAction("Database");
            }
        }

        // Test hash password
        public IActionResult TestHash(string password = "admin123")
        {
            var hash = HashPassword(password);
            ViewBag.Password = password;
            ViewBag.Hash = hash;
            return View();
        }

        // Test connection string
        public IActionResult TestConnection()
        {
            var connectionString = _context.Database.GetConnectionString();
            ViewBag.ConnectionString = connectionString;
            
            try
            {
                var canConnect = _context.Database.CanConnect();
                ViewBag.CanConnect = canConnect;
                ViewBag.Message = canConnect ? "✅ Kết nối thành công!" : "❌ Kết nối thất bại!";
            }
            catch (Exception ex)
            {
                ViewBag.CanConnect = false;
                ViewBag.Error = ex.Message;
            }

            return View();
        }

        // Debug hash algorithms
        public IActionResult DebugHash()
        {
            var testPassword = "admin123";
            var results = new List<object>();

            // Test các loại hash khác nhau
            results.Add(new { 
                Algorithm = "SHA256 + Base64 (hiện tại)", 
                Hash = HashPasswordSHA256(testPassword),
                Method = "SHA256 -> Base64"
            });

            results.Add(new { 
                Algorithm = "MD5 + Base64", 
                Hash = HashPasswordMD5(testPassword),
                Method = "MD5 -> Base64"
            });

            results.Add(new { 
                Algorithm = "SHA256 + Hex", 
                Hash = HashPasswordSHA256Hex(testPassword),
                Method = "SHA256 -> Hex"
            });

            results.Add(new { 
                Algorithm = "Plain Text", 
                Hash = testPassword,
                Method = "No hashing"
            });

            ViewBag.Results = results;
            ViewBag.TestPassword = testPassword;
            return View();
        }

        // So sánh hash trong database với các loại hash
        public async Task<IActionResult> CompareHashes(string username = "admin")
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user == null)
                {
                    ViewBag.Error = $"User '{username}' không tồn tại";
                    return View();
                }

                var testPassword = username + "123"; // admin123, doctor123, etc.
                var storedHash = user.PasswordHash;

                var comparisons = new List<dynamic>
                {
                    new { 
                        Algorithm = "SHA256 + Base64", 
                        Generated = HashPasswordSHA256(testPassword),
                        Match = storedHash == HashPasswordSHA256(testPassword)
                    },
                    new { 
                        Algorithm = "MD5 + Base64", 
                        Generated = HashPasswordMD5(testPassword),
                        Match = storedHash == HashPasswordMD5(testPassword)
                    },
                    new { 
                        Algorithm = "SHA256 + Hex", 
                        Generated = HashPasswordSHA256Hex(testPassword),
                        Match = storedHash == HashPasswordSHA256Hex(testPassword)
                    },
                    new { 
                        Algorithm = "Plain Text", 
                        Generated = testPassword,
                        Match = storedHash == testPassword
                    }
                };

                ViewBag.Username = username;
                ViewBag.TestPassword = testPassword;
                ViewBag.StoredHash = storedHash;
                ViewBag.Comparisons = comparisons;
                ViewBag.CorrectAlgorithm = comparisons.FirstOrDefault(c => c.Match)?.Algorithm ?? "Không tìm thấy";

                return View();
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                return View();
            }
        }

        // Các hàm hash khác nhau
        private string HashPasswordSHA256(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private string HashPasswordMD5(string password)
        {
            using (var md5 = System.Security.Cryptography.MD5.Create())
            {
                var hashedBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private string HashPasswordSHA256Hex(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        private string HashPassword(string password)
        {
            // Sử dụng SHA256 + Base64 làm chuẩn
            return HashPasswordSHA256(password);
        }

        // Fix password hash cho users có sẵn
        public async Task<IActionResult> FixPasswordHashes()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                var updatedCount = 0;

                foreach (var user in users)
                {
                    string newHash = "";
                    
                    // Tạo hash mới dựa trên username
                    switch (user.Username?.ToLower())
                    {
                        case "admin":
                            newHash = HashPassword("admin123");
                            break;
                        case "doctor":
                            newHash = HashPassword("doctor123");
                            break;
                        case "patient":
                            newHash = HashPassword("patient123");
                            break;
                        default:
                            newHash = HashPassword("123456"); // default password
                            break;
                    }

                    if (user.PasswordHash != newHash)
                    {
                        user.PasswordHash = newHash;
                        user.ModifiedDate = DateTime.Now;
                        updatedCount++;
                    }
                }

                if (updatedCount > 0)
                {
                    await _context.SaveChangesAsync();
                    TempData["Message"] = $"✅ Đã cập nhật password hash cho {updatedCount} users!";
                }
                else
                {
                    TempData["Message"] = "ℹ️ Tất cả password hash đã đúng!";
                }

                return RedirectToAction("Database");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Lỗi khi cập nhật password: {ex.Message}";
                return RedirectToAction("Database");
            }
        }

        // Test login với username/password
        public async Task<IActionResult> TestLogin(string username = "admin", string password = "admin123")
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    ViewBag.Result = $"❌ User '{username}' không tồn tại";
                    ViewBag.Success = false;
                }
                else
                {
                    var inputHash = HashPassword(password);
                    var isMatch = user.PasswordHash == inputHash;

                    ViewBag.Result = isMatch ? 
                        $"✅ Login thành công cho user '{username}'" : 
                        $"❌ Password không đúng cho user '{username}'";
                    ViewBag.Success = isMatch;
                    ViewBag.StoredHash = user.PasswordHash;
                    ViewBag.InputHash = inputHash;
                    ViewBag.Username = username;
                    ViewBag.Password = password;
                }
            }
            catch (Exception ex)
            {
                ViewBag.Result = $"❌ Lỗi: {ex.Message}";
                ViewBag.Success = false;
            }

            return View();
        }

        // Convert tất cả passwords thành plain text
        public async Task<IActionResult> ConvertToPlainText()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                var updatedCount = 0;

                foreach (var user in users)
                {
                    string plainPassword = "";
                    
                    // Xác định plain password dựa trên username
                    switch (user.Username?.ToLower())
                    {
                        case "admin":
                            plainPassword = "admin123";
                            break;
                        case "doctor":
                            plainPassword = "doctor123";
                            break;
                        case "patient":
                            plainPassword = "patient123";
                            break;
                        default:
                            plainPassword = "123456"; // default password
                            break;
                    }

                    // Cập nhật thành plain text
                    if (user.PasswordHash != plainPassword)
                    {
                        user.PasswordHash = plainPassword; // Lưu plain text thay vì hash
                        user.ModifiedDate = DateTime.Now;
                        updatedCount++;
                    }
                }

                if (updatedCount > 0)
                {
                    await _context.SaveChangesAsync();
                    TempData["Message"] = $"✅ Đã chuyển {updatedCount} passwords thành plain text!";
                }
                else
                {
                    TempData["Message"] = "ℹ️ Tất cả passwords đã là plain text!";
                }

                return RedirectToAction("Database");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Lỗi khi chuyển đổi passwords: {ex.Message}";
                return RedirectToAction("Database");
            }
        }

        // Tạo users mới với plain text password
        public async Task<IActionResult> CreatePlainTextUsers()
        {
            try
            {
                // Xóa users cũ nếu có
                var existingUsers = await _context.Users.ToListAsync();
                if (existingUsers.Any())
                {
                    _context.Users.RemoveRange(existingUsers);
                    await _context.SaveChangesAsync();
                }

                // Tạo users mới với plain text password
                var newUsers = new List<User>
                {
                    new User
                    {
                        Username = "admin",
                        PasswordHash = "admin123", // Plain text, không hash
                        Email = "admin@test.com",
                        FullName = "Administrator",
                        PhoneNumber = "0123456789",
                        Gender = "Male",
                        Address = "Admin Address",
                        RoleID = 1,
                        IsAnonymous = false,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "doctor",
                        PasswordHash = "doctor123", // Plain text, không hash
                        Email = "doctor@test.com",
                        FullName = "Dr. John Smith",
                        PhoneNumber = "0987654321",
                        Gender = "Male",
                        Address = "Doctor Address",
                        RoleID = 2,
                        IsAnonymous = false,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "patient",
                        PasswordHash = "patient123", // Plain text, không hash
                        Email = "patient@test.com",
                        FullName = "Patient Test",
                        PhoneNumber = "0111222333",
                        Gender = "Female",
                        Address = "Patient Address",
                        RoleID = 3,
                        IsAnonymous = false,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    }
                };

                _context.Users.AddRange(newUsers);
                await _context.SaveChangesAsync();

                TempData["Message"] = "✅ Đã tạo 3 users mới với plain text passwords!<br>" +
                                    "🔑 Login accounts:<br>" +
                                    "• admin / admin123<br>" +
                                    "• doctor / doctor123<br>" +
                                    "• patient / patient123";

                return RedirectToAction("Database");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Lỗi khi tạo users: {ex.Message}";
                return RedirectToAction("Database");
            }
        }

        // Test chức năng Register
        public IActionResult TestRegister()
        {
            ViewBag.Title = "Test chức năng Đăng ký";
            return View();
        }

        // Thống kê users hiện tại
        public async Task<IActionResult> UserStats()
        {
            try
            {
                var stats = await _context.Users
                    .GroupBy(u => u.RoleID)
                    .Select(g => new
                    {
                        RoleID = g.Key,
                        Count = g.Count(),
                        ActiveCount = g.Count(u => u.IsActive),
                        InactiveCount = g.Count(u => !u.IsActive)
                    })
                    .ToListAsync();

                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
                var recentUsers = await _context.Users
                    .Where(u => u.CreatedDate >= DateTime.Now.AddDays(-7))
                    .CountAsync();

                ViewBag.Stats = stats;
                ViewBag.TotalUsers = totalUsers;
                ViewBag.ActiveUsers = activeUsers;
                ViewBag.RecentUsers = recentUsers;

                return View();
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Lỗi khi lấy thống kê: {ex.Message}";
                return RedirectToAction("Database");
            }
        }
    }
} 