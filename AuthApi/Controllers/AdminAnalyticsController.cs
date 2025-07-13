using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;
using System.Net.Http;
using System.Text.Json;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminAnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<AdminAnalyticsController> _logger;
        private readonly IConfiguration _configuration;

        public AdminAnalyticsController(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory,
            ILogger<AdminAnalyticsController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _configuration = configuration;
        }

        // GET: api/AdminAnalytics/overview
        [HttpGet("overview")]
        public async Task<ActionResult<ApiResponse<SystemOverview>>> GetSystemOverview()
        {
            try
            {
                // Debug logging
                _logger.LogInformation("AdminAnalytics/overview called by user: {UserId}, Role: {UserRole}",
                    User.Identity?.Name,
                    string.Join(",", User.Claims.Where(c => c.Type == "role").Select(c => c.Value)));

                if (!User.IsInRole("admin"))
                {
                    _logger.LogWarning("Access denied for user {UserId} - not in admin role", User.Identity?.Name);
                    return Forbid();
                }
                var overview = new SystemOverview();

                // User statistics
                overview.TotalUsers = await _context.Users.CountAsync();
                overview.TotalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
                overview.TotalDoctors = await _context.Doctors.CountAsync();
                overview.TotalStaff = await _context.Users.CountAsync(u => u.Role == "Staff");
                overview.ActiveDoctors = await _context.Doctors.CountAsync(d => d.Available);

                // Recent registrations (last 30 days)
                var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
                overview.NewUsersThisMonth = await _context.Users
                    .CountAsync(u => u.CreatedAt >= thirtyDaysAgo);

                // Note: Appointment statistics removed as per admin requirements

                // User growth data (last 12 months)
                var userGrowthData = new List<MonthlyUserGrowth>();
                for (int i = 11; i >= 0; i--)
                {
                    var monthStart = DateTime.UtcNow.AddMonths(-i).Date.AddDays(1 - DateTime.UtcNow.AddMonths(-i).Day);
                    var monthEnd = monthStart.AddMonths(1);

                    var monthlyData = new MonthlyUserGrowth
                    {
                        Month = monthStart.ToString("yyyy-MM"),
                        MonthName = monthStart.ToString("MMM yyyy"),
                        NewUsers = await _context.Users
                            .CountAsync(u => u.CreatedAt >= monthStart && u.CreatedAt < monthEnd),
                        NewCustomers = await _context.Users
                            .CountAsync(u => u.CreatedAt >= monthStart && u.CreatedAt < monthEnd && u.Role == "Customer"),
                        NewDoctors = await _context.Doctors
                            .CountAsync(d => d.CreatedAt >= monthStart && d.CreatedAt < monthEnd)
                    };

                    userGrowthData.Add(monthlyData);
                }

                overview.UserGrowthData = userGrowthData;

                // System health metrics
                overview.SystemHealth = new SystemHealth
                {
                    DatabaseStatus = "Healthy",
                    LastBackup = DateTime.UtcNow.AddDays(-1), // Mock data
                    SystemUptime = TimeSpan.FromDays(30), // Mock data
                    ActiveSessions = await _context.Users.CountAsync(u => u.CreatedAt >= DateTime.UtcNow.AddHours(-24)) // Mock data since LastLoginAt doesn't exist
                };

                return new ApiResponse<SystemOverview>
                {
                    Success = true,
                    Message = "Lấy tổng quan hệ thống thành công",
                    Data = overview
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system overview");
                return StatusCode(500, new ApiResponse<SystemOverview>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy tổng quan hệ thống"
                });
            }
        }

        // GET: api/AdminAnalytics/users
        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<UserAnalytics>>> GetUserAnalytics()
        {
            try
            {
                var analytics = new UserAnalytics();

                // User distribution by role
                var usersByRole = await _context.Users
                    .GroupBy(u => u.Role)
                    .Select(g => new RoleDistribution
                    {
                        Role = g.Key,
                        Count = g.Count(),
                        Percentage = 0 // Will calculate after getting total
                    })
                    .ToListAsync();

                var totalUsers = usersByRole.Sum(r => r.Count);
                foreach (var role in usersByRole)
                {
                    role.Percentage = totalUsers > 0 ? (double)role.Count / totalUsers * 100 : 0;
                }

                analytics.UsersByRole = usersByRole;

                // User registration trends (last 7 days)
                var registrationTrends = new List<DailyRegistration>();
                for (int i = 6; i >= 0; i--)
                {
                    var date = DateTime.UtcNow.AddDays(-i).Date;
                    var nextDate = date.AddDays(1);

                    var dailyData = new DailyRegistration
                    {
                        Date = date.ToString("yyyy-MM-dd"),
                        DateName = date.ToString("MMM dd"),
                        Registrations = await _context.Users
                            .CountAsync(u => u.CreatedAt >= date && u.CreatedAt < nextDate)
                    };

                    registrationTrends.Add(dailyData);
                }

                analytics.RegistrationTrends = registrationTrends;

                // Active users (created within last 30 days - mock data since LastLoginAt doesn't exist)
                var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
                analytics.ActiveUsers = await _context.Users
                    .CountAsync(u => u.CreatedAt >= thirtyDaysAgo);

                // User demographics
                analytics.UserDemographics = new UserDemographics
                {
                    AverageAge = 35, // Mock data - would need to calculate from DateOfBirth
                    GenderDistribution = new List<GenderDistribution>
                    {
                        new() { Gender = "Male", Count = await _context.Users.CountAsync(u => u.Gender == "male") },
                        new() { Gender = "Female", Count = await _context.Users.CountAsync(u => u.Gender == "female") }
                    }
                };

                return new ApiResponse<UserAnalytics>
                {
                    Success = true,
                    Message = "Lấy phân tích người dùng thành công",
                    Data = analytics
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                return StatusCode(500, new ApiResponse<UserAnalytics>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy phân tích người dùng"
                });
            }
        }

        // GET: api/AdminAnalytics/doctors
        [HttpGet("doctors")]
        public async Task<ActionResult<ApiResponse<DoctorAnalytics>>> GetDoctorAnalytics()
        {
            try
            {
                var analytics = new DoctorAnalytics();

                // Doctor statistics
                analytics.TotalDoctors = await _context.Doctors.CountAsync();
                analytics.ActiveDoctors = await _context.Doctors.CountAsync(d => d.Available);
                analytics.InactiveDoctors = analytics.TotalDoctors - analytics.ActiveDoctors;

                // Doctors by specialization
                var doctorsBySpecialization = await _context.Doctors
                    .GroupBy(d => d.Specialization)
                    .Select(g => new SpecializationDistribution
                    {
                        Specialization = g.Key,
                        Count = g.Count(),
                        ActiveCount = g.Count(d => d.Available)
                    })
                    .ToListAsync();

                analytics.DoctorsBySpecialization = doctorsBySpecialization;

                // Experience distribution
                var experienceRanges = new List<ExperienceRange>
                {
                    new() { Range = "0-2 years", Min = 0, Max = 2 },
                    new() { Range = "3-5 years", Min = 3, Max = 5 },
                    new() { Range = "6-10 years", Min = 6, Max = 10 },
                    new() { Range = "11-15 years", Min = 11, Max = 15 },
                    new() { Range = "15+ years", Min = 16, Max = 100 }
                };

                foreach (var range in experienceRanges)
                {
                    range.Count = await _context.Doctors
                        .CountAsync(d => d.Experience >= range.Min && d.Experience <= range.Max);
                }

                analytics.ExperienceDistribution = experienceRanges;

                return new ApiResponse<DoctorAnalytics>
                {
                    Success = true,
                    Message = "Lấy phân tích bác sĩ thành công",
                    Data = analytics
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctor analytics");
                return StatusCode(500, new ApiResponse<DoctorAnalytics>
                {
                    Success = false,
                    Message = "Lỗi server khi lấy phân tích bác sĩ"
                });
            }
        }
    }

    // Analytics DTOs
    public class SystemOverview
    {
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalDoctors { get; set; }
        public int TotalStaff { get; set; }
        public int ActiveDoctors { get; set; }
        public int NewUsersThisMonth { get; set; }
        public List<MonthlyUserGrowth> UserGrowthData { get; set; } = new();
        public SystemHealth SystemHealth { get; set; } = new();
    }

    public class MonthlyUserGrowth
    {
        public string Month { get; set; } = string.Empty;
        public string MonthName { get; set; } = string.Empty;
        public int NewUsers { get; set; }
        public int NewCustomers { get; set; }
        public int NewDoctors { get; set; }
    }

    public class SystemHealth
    {
        public string DatabaseStatus { get; set; } = string.Empty;
        public DateTime LastBackup { get; set; }
        public TimeSpan SystemUptime { get; set; }
        public int ActiveSessions { get; set; }
    }

    public class UserAnalytics
    {
        public List<RoleDistribution> UsersByRole { get; set; } = new();
        public List<DailyRegistration> RegistrationTrends { get; set; } = new();
        public int ActiveUsers { get; set; }
        public UserDemographics UserDemographics { get; set; } = new();
    }

    public class RoleDistribution
    {
        public string Role { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class DailyRegistration
    {
        public string Date { get; set; } = string.Empty;
        public string DateName { get; set; } = string.Empty;
        public int Registrations { get; set; }
    }

    public class UserDemographics
    {
        public double AverageAge { get; set; }
        public List<GenderDistribution> GenderDistribution { get; set; } = new();
    }

    public class GenderDistribution
    {
        public string Gender { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class DoctorAnalytics
    {
        public int TotalDoctors { get; set; }
        public int ActiveDoctors { get; set; }
        public int InactiveDoctors { get; set; }
        public List<SpecializationDistribution> DoctorsBySpecialization { get; set; } = new();
        public List<ExperienceRange> ExperienceDistribution { get; set; } = new();
    }

    public class SpecializationDistribution
    {
        public string Specialization { get; set; } = string.Empty;
        public int Count { get; set; }
        public int ActiveCount { get; set; }
    }

    public class ExperienceRange
    {
        public string Range { get; set; } = string.Empty;
        public int Min { get; set; }
        public int Max { get; set; }
        public int Count { get; set; }
    }

    // Note: Appointment-related models removed as per admin requirements
}
