using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Service)
                .ToListAsync();
        }

        // GET: api/Appointments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(string id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound();
            }

            // Check if user is authorized to view this appointment
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("admin") && appointment.PatientId != userId)
            {
                return Forbid();
            }

            return appointment;
        }

        // GET: api/Appointments/patient
        [HttpGet("patient")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Service)
                .Where(a => a.PatientId == userId)
                .ToListAsync();
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] AppointmentCreateDto appointmentDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            if (doctor == null)
            {
                return BadRequest("Doctor not found");
            }

            var service = await _context.Services.FindAsync(appointmentDto.ServiceId);
            if (service == null)
            {
                return BadRequest("Service not found");
            }

            // Calculate end time based on service duration
            DateTime appointmentDate = appointmentDto.Date;
            TimeSpan startTimeSpan = TimeSpan.Parse(appointmentDto.StartTime);
            DateTime startDateTime = appointmentDate.Add(startTimeSpan);
            DateTime endDateTime = startDateTime.AddMinutes(service.Duration);
            string endTime = endDateTime.ToString("HH:mm");

            var appointment = new Appointment
            {
                PatientId = userId,
                PatientName = $"{user.FirstName} {user.LastName}",
                DoctorId = appointmentDto.DoctorId,
                DoctorName = $"{doctor.FirstName} {doctor.LastName}",
                ServiceId = appointmentDto.ServiceId,
                ServiceName = service.Name,
                Date = appointmentDto.Date,
                StartTime = appointmentDto.StartTime,
                EndTime = endTime,
                Notes = appointmentDto.Notes,
                Status = AppointmentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        // PUT: api/Appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(string id, [FromBody] AppointmentUpdateDto appointmentDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            // Check if user is authorized to update this appointment
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("admin") && appointment.PatientId != userId)
            {
                return Forbid();
            }

            // Update appointment fields
            if (appointmentDto.Date != null)
            {
                appointment.Date = appointmentDto.Date.Value;
            }

            if (!string.IsNullOrEmpty(appointmentDto.StartTime))
            {
                appointment.StartTime = appointmentDto.StartTime;
                
                // Recalculate end time if needed
                var service = await _context.Services.FindAsync(appointment.ServiceId);
                if (service != null)
                {
                    TimeSpan startTimeSpan = TimeSpan.Parse(appointmentDto.StartTime);
                    DateTime startDateTime = appointment.Date.Add(startTimeSpan);
                    DateTime endDateTime = startDateTime.AddMinutes(service.Duration);
                    appointment.EndTime = endDateTime.ToString("HH:mm");
                }
            }

            if (appointmentDto.Status.HasValue)
            {
                appointment.Status = appointmentDto.Status.Value;
            }

            if (!string.IsNullOrEmpty(appointmentDto.Notes))
            {
                appointment.Notes = appointmentDto.Notes;
            }

            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Appointments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelAppointment(string id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            // Check if user is authorized to cancel this appointment
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("admin") && appointment.PatientId != userId)
            {
                return Forbid();
            }

            // Cancel appointment instead of deleting
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Appointments/available-slots
        [HttpGet("available-slots")]
        public async Task<ActionResult<IEnumerable<string>>> GetAvailableSlots(
            [FromQuery] string doctorId, 
            [FromQuery] DateTime date, 
            [FromQuery] string serviceId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.WorkingHours)
                .FirstOrDefaultAsync(d => d.Id == doctorId);
                
            if (doctor == null)
            {
                return BadRequest("Doctor not found");
            }

            var service = await _context.Services.FindAsync(serviceId);
            if (service == null)
            {
                return BadRequest("Service not found");
            }

            // Find the doctor's working hours for the specified day
            int dayOfWeek = (int)date.DayOfWeek;
            var workingHours = doctor.WorkingHours.FirstOrDefault(w => w.DayOfWeek == dayOfWeek);
            
            if (workingHours == null)
            {
                return new List<string>(); // Doctor doesn't work on this day
            }

            // Parse working hours
            TimeSpan startWorkHour = TimeSpan.Parse(workingHours.StartTime);
            TimeSpan endWorkHour = TimeSpan.Parse(workingHours.EndTime);
            
            // Get all existing appointments for the doctor on that day
            var existingAppointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && 
                       a.Date.Date == date.Date && 
                       a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();

            // Generate all possible time slots
            List<string> allSlots = new List<string>();
            for (TimeSpan time = startWorkHour; time < endWorkHour; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                string timeSlot = $"{time.Hours:D2}:{time.Minutes:D2}";
                
                // Check if this time slot overlaps with any existing appointments
                bool isAvailable = true;
                foreach (var appointment in existingAppointments)
                {
                    TimeSpan appointmentStart = TimeSpan.Parse(appointment.StartTime);
                    TimeSpan appointmentEnd = TimeSpan.Parse(appointment.EndTime);
                    
                    // Check for overlap
                    if (time >= appointmentStart && time < appointmentEnd)
                    {
                        isAvailable = false;
                        break;
                    }
                    
                    // Check if service duration would overlap with existing appointments
                    TimeSpan potentialEnd = time.Add(TimeSpan.FromMinutes(service.Duration));
                    if (time < appointmentEnd && potentialEnd > appointmentStart)
                    {
                        isAvailable = false;
                        break;
                    }
                }
                
                // Check if service duration fits within working hours
                TimeSpan serviceEnd = time.Add(TimeSpan.FromMinutes(service.Duration));
                if (serviceEnd > endWorkHour)
                {
                    isAvailable = false;
                }
                
                if (isAvailable)
                {
                    allSlots.Add(timeSlot);
                }
            }

            return allSlots;
        }

        private bool AppointmentExists(string id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }

    public class AppointmentCreateDto
    {
        public string DoctorId { get; set; }
        public string ServiceId { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string Notes { get; set; }
        public string AppointmentType { get; set; } = "offline";
    }

    public class AppointmentUpdateDto
    {
        public DateTime? Date { get; set; }
        public string StartTime { get; set; }
        public AppointmentStatus? Status { get; set; }
        public string Notes { get; set; }
    }
} 