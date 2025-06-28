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
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(string id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // GET: api/Services/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByCategory(string category)
        {
            return await _context.Services
                .Where(s => s.Category == category)
                .ToListAsync();
        }

        // GET: api/Services/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByDoctorId(string doctorId)
        {
            var serviceIds = await _context.DoctorServices
                .Where(ds => ds.DoctorId == doctorId)
                .Select(ds => ds.ServiceId)
                .ToListAsync();

            var services = await _context.Services
                .Where(s => serviceIds.Contains(s.Id))
                .ToListAsync();

            return services;
        }
    }
} 