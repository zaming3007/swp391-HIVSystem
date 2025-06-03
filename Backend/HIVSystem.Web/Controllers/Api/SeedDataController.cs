using Microsoft.AspNetCore.Mvc;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SeedDataController> _logger;

        public SeedDataController(ApplicationDbContext context, ILogger<SeedDataController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("doctors")]
        public async Task<ActionResult> SeedDoctors()
        {
            try
            {
                // Check if doctors already exist (both username starting with "dr." and RoleID = 2)
                var existingDoctorUsers = await _context.Users
                    .Where(u => u.Username.StartsWith("dr.") || u.RoleID == 2)
                    .CountAsync();
                    
                if (existingDoctorUsers > 0)
                {
                    return Ok(new { 
                        message = $"Database already has {existingDoctorUsers} doctor users. Skipping seed.",
                        note = "Use 'Get Database Status' to see current doctors"
                    });
                }

                // Create sample users for doctors
                var doctorUsers = new List<User>
                {
                    new User
                    {
                        Username = "dr.nguyen",
                        PasswordHash = "doctor123", // Plain text for testing
                        Email = "dr.nguyen@hivsystem.com",
                        FullName = "Dr. Nguyễn Văn An - HIV/AIDS Specialist",
                        PhoneNumber = "0901234567",
                        Gender = "Male",
                        Address = "123 Đường ABC, Quận 1, TP.HCM",
                        RoleID = 2, // Doctor role
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "dr.tran",
                        PasswordHash = "doctor123",
                        Email = "dr.tran@hivsystem.com",
                        FullName = "Dr. Trần Thị Bình - Infectious Disease",
                        PhoneNumber = "0901234568",
                        Gender = "Female",
                        Address = "456 Đường XYZ, Quận 3, TP.HCM",
                        RoleID = 2,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "dr.le",
                        PasswordHash = "doctor123",
                        Email = "dr.le@hivsystem.com",
                        FullName = "Dr. Lê Minh Cường - Immunology",
                        PhoneNumber = "0901234569",
                        Gender = "Male",
                        Address = "789 Đường DEF, Quận 7, TP.HCM",
                        RoleID = 2,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "dr.pham",
                        PasswordHash = "doctor123",
                        Email = "dr.pham@hivsystem.com",
                        FullName = "Dr. Phạm Thu Hương - General Medicine",
                        PhoneNumber = "0901234570",
                        Gender = "Female",
                        Address = "321 Đường GHI, Quận 5, TP.HCM",
                        RoleID = 2,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    }
                };

                await _context.Users.AddRangeAsync(doctorUsers);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Sample doctor users created successfully!",
                    doctorsCreated = doctorUsers.Count,
                    note = "These doctors have RoleID = 2 and can be found in the appointment booking system.",
                    doctors = doctorUsers.Select(d => new { d.Username, d.FullName, d.RoleID }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding doctors");
                return StatusCode(500, new { message = "Error creating sample doctors: " + ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<ActionResult> GetDatabaseStatus()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                var doctorUserCount = await _context.Users.Where(u => u.Username.StartsWith("dr.") || u.RoleID == 2).CountAsync();
                var allDoctors = await _context.Users
                    .Where(u => u.Username.StartsWith("dr.") || u.RoleID == 2)
                    .Select(u => new { u.UserID, u.Username, u.FullName, u.RoleID, u.IsActive })
                    .ToListAsync();

                return Ok(new
                {
                    users = userCount,
                    doctors = doctorUserCount,
                    schedules = 0, // Not implemented in current schema
                    appointments = 0, // Not implemented in current schema
                    doctorDetails = allDoctors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting database status");
                return StatusCode(500, new { message = "Error getting database status: " + ex.Message });
            }
        }

        [HttpGet("debug/users")]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var allUsers = await _context.Users
                    .Select(u => new { 
                        u.UserID, 
                        u.Username, 
                        u.FullName, 
                        u.RoleID, 
                        u.IsActive,
                        u.Email,
                        u.CreatedDate
                    })
                    .OrderBy(u => u.UserID)
                    .ToListAsync();

                return Ok(new
                {
                    totalUsers = allUsers.Count,
                    users = allUsers,
                    doctorUsers = allUsers.Where(u => u.Username.StartsWith("dr.") || u.RoleID == 2).ToList(),
                    activeUsers = allUsers.Where(u => u.IsActive).Count()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { message = "Error getting all users: " + ex.Message });
            }
        }
    }
} 