using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(string id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.WorkingHours)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // GET: api/Doctors/specialization/{specialization}
        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsBySpecialization(string specialization)
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .Where(d => d.Specialization == specialization)
                .ToListAsync();
        }

        // GET: api/Doctors/service/{serviceId}
        [HttpGet("service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsByServiceId(string serviceId)
        {
            var doctorIds = await _context.DoctorServices
                .Where(ds => ds.ServiceId == serviceId)
                .Select(ds => ds.DoctorId)
                .ToListAsync();

            var doctors = await _context.Doctors
                .Include(d => d.WorkingHours)
                .Where(d => doctorIds.Contains(d.Id))
                .ToListAsync();

            return doctors;
        }

        // GET: api/Doctors/{doctorId}/schedule
        [HttpGet("{doctorId}/schedule")]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetDoctorSchedule(string doctorId)
        {
            var workingHours = await _context.TimeSlots
                .Where(t => t.DoctorId == doctorId)
                .ToListAsync();

            if (workingHours == null || !workingHours.Any())
            {
                return NotFound();
            }

            return workingHours;
        }
    }
} 