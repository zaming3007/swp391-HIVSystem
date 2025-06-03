using Microsoft.EntityFrameworkCore;
using HIVSystem.Core.Entities;
using HIVSystem.Core.Interfaces;
using HIVSystem.Core.DTOs;
using HIVSystem.Infrastructure.Data;

namespace HIVSystem.Infrastructure.Repositories
{
    public class AppointmentRepository : Repository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            return await _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.PatientID == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            return await _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.DoctorID == doctorId)
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByDateRangeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.AppointmentDate >= fromDate.Date && a.AppointmentDate <= toDate.Date)
                .OrderBy(a => a.AppointmentDate)
                .ThenBy(a => a.AppointmentTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByStatusAsync(string status)
        {
            return await _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.Status == status)
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .ToListAsync();
        }

        public async Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime appointmentDate, TimeSpan appointmentTime)
        {
            // Check if doctor has any conflicting appointments
            var conflictingAppointments = await _dbSet
                .Where(a => a.DoctorID == doctorId 
                    && a.AppointmentDate == appointmentDate.Date
                    && a.Status != "Cancelled"
                    && a.Status != "No-show"
                    && a.AppointmentTime == appointmentTime)
                .CountAsync();

            return conflictingAppointments == 0;
        }

        public async Task<IReadOnlyList<Appointment>> SearchAppointmentsAsync(AppointmentSearchDto searchDto)
        {
            var query = _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .AsQueryable();

            if (searchDto.PatientID.HasValue)
                query = query.Where(a => a.PatientID == searchDto.PatientID.Value);

            if (searchDto.DoctorID.HasValue)
                query = query.Where(a => a.DoctorID == searchDto.DoctorID.Value);

            if (searchDto.FacilityID.HasValue)
                query = query.Where(a => a.FacilityID == searchDto.FacilityID.Value);

            if (searchDto.FromDate.HasValue)
                query = query.Where(a => a.AppointmentDate >= searchDto.FromDate.Value.Date);

            if (searchDto.ToDate.HasValue)
                query = query.Where(a => a.AppointmentDate <= searchDto.ToDate.Value.Date);

            if (!string.IsNullOrEmpty(searchDto.Status))
                query = query.Where(a => a.Status == searchDto.Status);

            if (searchDto.IsAnonymous.HasValue)
                query = query.Where(a => a.IsAnonymous == searchDto.IsAnonymous.Value);

            return await query
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();
        }

        public async Task<int> GetAppointmentCountByDoctorAndDateAsync(int doctorId, DateTime date)
        {
            return await _dbSet
                .Where(a => a.DoctorID == doctorId 
                    && a.AppointmentDate == date.Date
                    && a.Status != "Cancelled"
                    && a.Status != "No-show")
                .CountAsync();
        }

        public async Task<IReadOnlyList<Appointment>> GetConflictingAppointmentsAsync(int doctorId, DateTime appointmentDate, TimeSpan startTime, TimeSpan endTime)
        {
            return await _dbSet
                .Where(a => a.DoctorID == doctorId 
                    && a.AppointmentDate == appointmentDate.Date
                    && a.Status != "Cancelled"
                    && a.Status != "No-show"
                    && ((a.AppointmentTime >= startTime && a.AppointmentTime < endTime) ||
                        (a.EndTime.HasValue && a.EndTime.Value > startTime && a.AppointmentTime < endTime)))
                .ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentWithDetailsAsync(int appointmentId)
        {
            return await _dbSet
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Facility)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.CreatedByUser)
                .Include(a => a.Reminders)
                .FirstOrDefaultAsync(a => a.AppointmentID == appointmentId);
        }
    }
} 