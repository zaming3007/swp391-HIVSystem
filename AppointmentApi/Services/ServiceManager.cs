using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly ApplicationDbContext _context;

        public ServiceManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Service>> GetAllAsync()
        {
            try
            {
                // Use standard EF Core query instead of raw SQL
                return await _context.Services.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllAsync: {ex.Message}");
                return new List<Service>();
            }
        }

        public async Task<Service?> GetByIdAsync(string id)
        {
            return await _context.Services.FindAsync(id);
        }

        public async Task<List<Service>> GetByDoctorIdAsync(string doctorId)
        {
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == doctorId);
            if (!doctorExists) return new List<Service>();

            // Get services associated with the doctor through DoctorServices table
            var serviceIds = await _context.DoctorServices
                .Where(ds => ds.DoctorId == doctorId)
                .Select(ds => ds.ServiceId)
                .ToListAsync();

            return await _context.Services
                .Where(s => serviceIds.Contains(s.Id))
                .ToListAsync();
        }

        public async Task<List<Service>> GetByCategoryAsync(string category)
        {
            return await _context.Services
                .Where(s => s.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
    }
} 