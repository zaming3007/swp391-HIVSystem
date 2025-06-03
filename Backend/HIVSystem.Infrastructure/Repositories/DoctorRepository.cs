using Microsoft.EntityFrameworkCore;
using HIVSystem.Core.Entities;
using HIVSystem.Core.Interfaces;
using HIVSystem.Core.DTOs;
using HIVSystem.Infrastructure.Data;

namespace HIVSystem.Infrastructure.Repositories
{
    public class DoctorRepository : Repository<Doctor>, IDoctorRepository
    {
        public DoctorRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IReadOnlyList<Doctor>> GetAvailableDoctorsAsync()
        {
            return await _dbSet
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .Include(d => d.FacilityDoctors)
                    .ThenInclude(fd => fd.Facility)
                .Where(d => d.IsAvailable && d.VerificationStatus == "Verified" && d.User != null && d.User.IsActive)
                .OrderBy(d => d.User.FullName)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Doctor>> GetDoctorsBySpecialtyAsync(string specialty)
        {
            return await _dbSet
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .Include(d => d.FacilityDoctors)
                    .ThenInclude(fd => fd.Facility)
                .Where(d => d.IsAvailable 
                    && d.VerificationStatus == "Verified" 
                    && d.User != null 
                    && d.User.IsActive
                    && d.Specialty != null 
                    && d.Specialty.ToLower().Contains(specialty.ToLower()))
                .OrderBy(d => d.User.FullName)
                .ToListAsync();
        }

        public async Task<Doctor?> GetDoctorWithDetailsAsync(int doctorId)
        {
            return await _dbSet
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .Include(d => d.Availabilities)
                .Include(d => d.FacilityDoctors)
                    .ThenInclude(fd => fd.Facility)
                .Include(d => d.Educations)
                .Include(d => d.Certifications)
                .FirstOrDefaultAsync(d => d.DoctorID == doctorId);
        }

        public async Task<IReadOnlyList<DoctorSchedule>> GetDoctorSchedulesAsync(int doctorId)
        {
            return await _context.DoctorSchedules
                .Include(ds => ds.Doctor)
                    .ThenInclude(d => d.User)
                .Where(ds => ds.DoctorID == doctorId && ds.IsAvailable)
                .OrderBy(ds => ds.DayOfWeek)
                .ThenBy(ds => ds.StartTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<DoctorAvailability>> GetDoctorAvailabilityAsync(int doctorId, DateTime fromDate, DateTime toDate)
        {
            return await _context.DoctorAvailabilities
                .Include(da => da.Doctor)
                    .ThenInclude(d => d.User)
                .Where(da => da.DoctorID == doctorId 
                    && da.AvailabilityDate >= fromDate.Date 
                    && da.AvailabilityDate <= toDate.Date)
                .OrderBy(da => da.AvailabilityDate)
                .ThenBy(da => da.StartTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Doctor>> GetDoctorsByFacilityAsync(int facilityId)
        {
            return await _dbSet
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .Include(d => d.FacilityDoctors)
                    .ThenInclude(fd => fd.Facility)
                .Where(d => d.IsAvailable 
                    && d.VerificationStatus == "Verified" 
                    && d.User != null 
                    && d.User.IsActive
                    && d.FacilityDoctors.Any(fd => fd.FacilityID == facilityId && fd.IsActive))
                .OrderBy(d => d.User.FullName)
                .ToListAsync();
        }

        public async Task<bool> IsDoctorVerifiedAsync(int doctorId)
        {
            var doctor = await _dbSet
                .FirstOrDefaultAsync(d => d.DoctorID == doctorId);
            
            return doctor != null && doctor.VerificationStatus == "Verified";
        }
    }
} 