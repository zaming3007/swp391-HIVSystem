using HIVSystem.Core.Entities;
using HIVSystem.Core.DTOs;

namespace HIVSystem.Core.Interfaces
{
    public interface IDoctorRepository : IRepository<Doctor>
    {
        Task<IReadOnlyList<Doctor>> GetAvailableDoctorsAsync();
        Task<IReadOnlyList<Doctor>> GetDoctorsBySpecialtyAsync(string specialty);
        Task<Doctor?> GetDoctorWithDetailsAsync(int doctorId);
        Task<IReadOnlyList<DoctorSchedule>> GetDoctorSchedulesAsync(int doctorId);
        Task<IReadOnlyList<DoctorAvailability>> GetDoctorAvailabilityAsync(int doctorId, DateTime fromDate, DateTime toDate);
        Task<IReadOnlyList<Doctor>> GetDoctorsByFacilityAsync(int facilityId);
        Task<bool> IsDoctorVerifiedAsync(int doctorId);
    }
} 