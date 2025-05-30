using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Generic;

namespace HIVHealthcareSystem.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View("~/Views/Home/React.cshtml");
        }

        [HttpGet]
        public IActionResult ReactLogin()
        {
            return View("~/Views/Home/React.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Tìm user theo username
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == model.Username && u.IsActive);

                    if (user != null)
                    {
                        // So sánh plain text password (không hash)
                        bool passwordMatch = false;
                        
                        // Kiểm tra cả plain text và hash để tương thích
                        if (user.PasswordHash == model.Password)
                        {
                            // Password đã là plain text
                            passwordMatch = true;
                        }
                        else
                        {
                            // Thử so sánh với hash (để tương thích với data cũ)
                            var inputHash = HashPassword(model.Password);
                            if (user.PasswordHash == inputHash)
                            {
                                passwordMatch = true;
                                
                                // Cập nhật password thành plain text luôn
                                user.PasswordHash = model.Password;
                                user.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();
                            }
                        }

                        if (passwordMatch)
                        {
                            // Cập nhật last login
                            user.LastLoginDate = DateTime.Now;
                            await _context.SaveChangesAsync();

                            // Lưu user info vào session (đơn giản)
                            HttpContext.Session.SetString("UserId", user.UserID.ToString());
                            HttpContext.Session.SetString("Username", user.Username);
                            HttpContext.Session.SetString("FullName", user.FullName);

                            TempData["SuccessMessage"] = $"Đăng nhập thành công! Chào mừng {user.FullName}";
                            return RedirectToAction("Index", "Home");
                        }
                    }

                    ModelState.AddModelError("", "Tên đăng nhập hoặc mật khẩu không đúng.");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", $"Lỗi đăng nhập: {ex.Message}");
                }
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View("~/Views/Home/React.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Kiểm tra username đã tồn tại chưa
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == model.Username);

                    if (existingUser != null)
                    {
                        ModelState.AddModelError("Username", "Tên đăng nhập đã tồn tại");
                        return View(model);
                    }

                    // Kiểm tra email đã tồn tại chưa
                    var existingEmail = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == model.Email);

                    if (existingEmail != null)
                    {
                        ModelState.AddModelError("Email", "Email đã được sử dụng");
                        return View(model);
                    }

                    // Tạo user mới với thông tin mặc định
                    var newUser = new User
                    {
                        Username = model.Username,
                        PasswordHash = model.Password, // Lưu plain text password
                        Email = model.Email,
                        FullName = model.Username, // Đặt FullName mặc định là Username
                        PhoneNumber = null,
                        DateOfBirth = null,
                        Gender = null,
                        Address = null,
                        RoleID = 3, // Mặc định là khách hàng (role ID = 3)
                        IsAnonymous = false,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    };

                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();

                    TempData["SuccessMessage"] = $"Đăng ký thành công! Bạn có thể đăng nhập với tài khoản: {model.Username}";
                    return RedirectToAction("Login");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", $"Lỗi khi đăng ký: {ex.Message}");
                }
            }

            return View(model);
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            TempData["SuccessMessage"] = "Đăng xuất thành công!";
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            return View("~/Views/Home/React.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Profile(ProfileViewModel model)
        {
            var username = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(username))
            {
                return RedirectToAction("Login");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                    if (user == null)
                    {
                        return RedirectToAction("Login");
                    }

                    // Cập nhật thông tin
                    user.FullName = model.FullName;
                    user.PhoneNumber = model.PhoneNumber;
                    user.DateOfBirth = model.DateOfBirth;
                    user.Gender = model.Gender;
                    user.Address = model.Address;
                    user.ModifiedDate = DateTime.Now;

                    await _context.SaveChangesAsync();

                    // Cập nhật session với FullName mới
                    HttpContext.Session.SetString("FullName", user.FullName);

                    TempData["SuccessMessage"] = "Cập nhật thông tin cá nhân thành công!";
                    return RedirectToAction("Profile");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", $"Lỗi khi cập nhật: {ex.Message}");
                }
            }

            return View(model);
        }

        private List<RoleOption> GetRoleOptions()
        {
            return new List<RoleOption>
            {
                new RoleOption { Value = 1, Text = "Quản trị viên", Description = "Quản lý toàn bộ hệ thống" },
                new RoleOption { Value = 2, Text = "Bác sĩ", Description = "Chẩn đoán và điều trị bệnh nhân" },
                new RoleOption { Value = 3, Text = "Khách hàng", Description = "Người sử dụng dịch vụ chăm sóc sức khỏe" }
            };
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
} 