using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctorAppointments(int doctorId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.DoctorID == doctorId)
                .OrderByDescending(a => a.AppointmentDate)
                .ThenBy(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentID,
                    a.PatientID,
                    PatientName = a.Patient.FullName,
                    a.DoctorID,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Purpose,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            return appointments;
        }

        // GET: api/Appointment/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetPatientAppointments(int patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientID == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .ThenBy(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentID,
                    a.PatientID,
                    a.DoctorID,
                    DoctorName = a.Doctor.FullName,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Purpose,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            return appointments;
        }

        // PUT: api/Appointment/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound();
                }

                appointment.Status = "Completed";
                appointment.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Appointment marked as completed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the appointment", error = ex.Message });
            }
        }

        // PUT: api/Appointment/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound();
                }

                appointment.Status = "Cancelled";
                appointment.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Appointment cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while cancelling the appointment", error = ex.Message });
            }
        }

        // POST: api/Appointment
        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            try
            {
                appointment.Status = "Scheduled";
                appointment.CreatedAt = DateTime.Now;
                appointment.UpdatedAt = DateTime.Now;

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDoctorAppointments), new { doctorId = appointment.DoctorID }, appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the appointment", error = ex.Message });
            }
        }
    }
} 