using Microsoft.AspNetCore.Mvc;
using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DoctorSchedule/{doctorId}
        [HttpGet("{doctorId}")]
        public async Task<ActionResult<List<DoctorScheduleDto>>> GetDoctorSchedule(string doctorId)
        {
            try
            {
                // Get existing time slots for this doctor
                var timeSlots = await _context.TimeSlots
                    .Where(ts => ts.DoctorId == doctorId)
                    .ToListAsync();

                var result = new List<DoctorScheduleDto>();
                var dayNames = new[] { "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy" };

                // Create schedule for all days of week
                for (int i = 0; i <= 6; i++)
                {
                    var dayTimeSlots = timeSlots.Where(ts => ts.DayOfWeek == i).ToList();

                    var scheduleDto = new DoctorScheduleDto
                    {
                        Id = $"schedule-{doctorId}-{i}",
                        DoctorId = doctorId,
                        DayOfWeek = i,
                        DayName = dayNames[i],
                        IsWorking = dayTimeSlots.Any(),
                        TimeSlots = dayTimeSlots.Select(ts => new TimeSlotDto
                        {
                            Id = ts.Id,
                            StartTime = ts.StartTime,
                            EndTime = ts.EndTime,
                            IsAvailable = true // Assuming all slots are available by default
                        }).ToList()
                    };

                    // Add default time slots if none exist and it's a working day (Monday to Friday)
                    if (!scheduleDto.IsWorking && i >= 1 && i <= 5)
                    {
                        scheduleDto.IsWorking = true;
                        scheduleDto.TimeSlots = new List<TimeSlotDto>
                        {
                            new TimeSlotDto { Id = $"{doctorId}-{i}-1", StartTime = "08:00", EndTime = "12:00", IsAvailable = true },
                            new TimeSlotDto { Id = $"{doctorId}-{i}-2", StartTime = "13:00", EndTime = "17:00", IsAvailable = true }
                        };
                    }

                    result.Add(scheduleDto);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải lịch làm việc: " + ex.Message });
            }
        }

        // PUT: api/DoctorSchedule
        [HttpPut]
        public async Task<ActionResult> UpdateDoctorSchedule([FromBody] UpdateDoctorScheduleRequest request)
        {
            try
            {
                // Remove existing time slots for this doctor
                var existingTimeSlots = await _context.TimeSlots
                    .Where(ts => ts.DoctorId == request.DoctorId)
                    .ToListAsync();

                _context.TimeSlots.RemoveRange(existingTimeSlots);

                // Add new time slots for working days
                foreach (var scheduleDto in request.WorkingHours.Where(wh => wh.IsWorking))
                {
                    foreach (var slotDto in scheduleDto.TimeSlots)
                    {
                        var timeSlot = new TimeSlot
                        {
                            Id = slotDto.Id.StartsWith($"{request.DoctorId}-") ? slotDto.Id : $"{request.DoctorId}-{scheduleDto.DayOfWeek}-{Guid.NewGuid().ToString()[..8]}",
                            DoctorId = request.DoctorId,
                            DayOfWeek = scheduleDto.DayOfWeek,
                            StartTime = slotDto.StartTime,
                            EndTime = slotDto.EndTime
                        };

                        _context.TimeSlots.Add(timeSlot);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Cập nhật lịch làm việc thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật lịch làm việc: " + ex.Message });
            }
        }

        // GET: api/DoctorSchedule/{doctorId}/available-slots
        [HttpGet("{doctorId}/available-slots")]
        public async Task<ActionResult<List<object>>> GetAvailableSlots(string doctorId, [FromQuery] DateTime? date = null)
        {
            try
            {
                var targetDate = date ?? DateTime.Today;
                var dayOfWeek = (int)targetDate.DayOfWeek;

                var timeSlots = await _context.TimeSlots
                    .Where(ts => ts.DoctorId == doctorId && ts.DayOfWeek == dayOfWeek)
                    .ToListAsync();

                if (!timeSlots.Any())
                {
                    return Ok(new List<object>());
                }

                var availableSlots = timeSlots
                    .Select(ts => new
                    {
                        id = ts.Id,
                        startTime = ts.StartTime,
                        endTime = ts.EndTime,
                        displayTime = $"{ts.StartTime} - {ts.EndTime}"
                    })
                    .OrderBy(ts => ts.startTime)
                    .ToList();

                return Ok(availableSlots);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải khung giờ có sẵn: " + ex.Message });
            }
        }
    }
}
