using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedTimeSlotsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SeedTimeSlotsController> _logger;

        public SeedTimeSlotsController(ApplicationDbContext context, ILogger<SeedTimeSlotsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("create-doctor-timeslots")]
        public async Task<IActionResult> CreateDoctorTimeSlots()
        {
            try
            {
                // Clear existing time slots
                var existingSlots = await _context.TimeSlots.ToListAsync();
                _context.TimeSlots.RemoveRange(existingSlots);
                await _context.SaveChangesAsync();

                var timeSlots = new List<TimeSlot>();

                // Doctor 1: Minh Nguyễn (doctor-001) - Monday, Wednesday, Friday
                // Monday (1)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-001-mon-1", DoctorId = "doctor-001", DayOfWeek = 1, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-001-mon-2", DoctorId = "doctor-001", DayOfWeek = 1, StartTime = "13:00", EndTime = "17:00" }
                });

                // Wednesday (3)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-001-wed-1", DoctorId = "doctor-001", DayOfWeek = 3, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-001-wed-2", DoctorId = "doctor-001", DayOfWeek = 3, StartTime = "13:00", EndTime = "17:00" }
                });

                // Friday (5)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-001-fri-1", DoctorId = "doctor-001", DayOfWeek = 5, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-001-fri-2", DoctorId = "doctor-001", DayOfWeek = 5, StartTime = "13:00", EndTime = "17:00" }
                });

                // Doctor 2: Hoa Trần (doctor-002) - Tuesday, Thursday, Saturday
                // Tuesday (2)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-002-tue-1", DoctorId = "doctor-002", DayOfWeek = 2, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-002-tue-2", DoctorId = "doctor-002", DayOfWeek = 2, StartTime = "13:00", EndTime = "17:00" }
                });

                // Thursday (4)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-002-thu-1", DoctorId = "doctor-002", DayOfWeek = 4, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-002-thu-2", DoctorId = "doctor-002", DayOfWeek = 4, StartTime = "13:00", EndTime = "17:00" }
                });

                // Saturday (6)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-002-sat-1", DoctorId = "doctor-002", DayOfWeek = 6, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-002-sat-2", DoctorId = "doctor-002", DayOfWeek = 6, StartTime = "13:00", EndTime = "17:00" }
                });

                // Doctor 3: Tuấn Lê (doctor-003) - Monday to Friday
                // Monday (1)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-003-mon-1", DoctorId = "doctor-003", DayOfWeek = 1, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-003-mon-2", DoctorId = "doctor-003", DayOfWeek = 1, StartTime = "13:00", EndTime = "17:00" }
                });

                // Tuesday (2)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-003-tue-1", DoctorId = "doctor-003", DayOfWeek = 2, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-003-tue-2", DoctorId = "doctor-003", DayOfWeek = 2, StartTime = "13:00", EndTime = "17:00" }
                });

                // Wednesday (3)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-003-wed-1", DoctorId = "doctor-003", DayOfWeek = 3, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-003-wed-2", DoctorId = "doctor-003", DayOfWeek = 3, StartTime = "13:00", EndTime = "17:00" }
                });

                // Thursday (4)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-003-thu-1", DoctorId = "doctor-003", DayOfWeek = 4, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-003-thu-2", DoctorId = "doctor-003", DayOfWeek = 4, StartTime = "13:00", EndTime = "17:00" }
                });

                // Friday (5)
                timeSlots.AddRange(new[]
                {
                    new TimeSlot { Id = "timeslot-003-fri-1", DoctorId = "doctor-003", DayOfWeek = 5, StartTime = "08:00", EndTime = "12:00" },
                    new TimeSlot { Id = "timeslot-003-fri-2", DoctorId = "doctor-003", DayOfWeek = 5, StartTime = "13:00", EndTime = "17:00" }
                });

                // Add all time slots to database
                await _context.TimeSlots.AddRangeAsync(timeSlots);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created {Count} time slots for doctors", timeSlots.Count);

                // Return summary
                var summary = timeSlots
                    .GroupBy(ts => ts.DoctorId)
                    .Select(g => new
                    {
                        DoctorId = g.Key,
                        TimeSlotCount = g.Count(),
                        WorkingDays = g.Select(ts => ts.DayOfWeek).Distinct().OrderBy(d => d).ToList()
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Message = $"Successfully created {timeSlots.Count} time slots for {summary.Count} doctors",
                    Data = summary
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating doctor time slots");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Error creating doctor time slots: " + ex.Message
                });
            }
        }

        [HttpGet("verify-timeslots")]
        public async Task<IActionResult> VerifyTimeSlots()
        {
            try
            {
                var timeSlots = await _context.TimeSlots
                    .OrderBy(ts => ts.DoctorId)
                    .ThenBy(ts => ts.DayOfWeek)
                    .ThenBy(ts => ts.StartTime)
                    .ToListAsync();

                var result = timeSlots.Select(ts => new
                {
                    ts.Id,
                    ts.DoctorId,
                    ts.DayOfWeek,
                    DayName = ts.DayOfWeek switch
                    {
                        1 => "Monday",
                        2 => "Tuesday",
                        3 => "Wednesday",
                        4 => "Thursday",
                        5 => "Friday",
                        6 => "Saturday",
                        0 => "Sunday",
                        _ => "Unknown"
                    },
                    ts.StartTime,
                    ts.EndTime
                }).ToList();

                return Ok(new
                {
                    Success = true,
                    Message = $"Found {result.Count} time slots",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying time slots");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Error verifying time slots: " + ex.Message
                });
            }
        }
    }
}
