using HIVSystem.Core.Entities;
using HIVSystem.Core.DTOs;

namespace HIVSystem.Core.Interfaces
{
    public interface IAppointmentRepository : IRepository<Appointment>
    {
        Task<IReadOnlyList<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
        Task<IReadOnlyList<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<IReadOnlyList<Appointment>> GetAppointmentsByDateRangeAsync(DateTime fromDate, DateTime toDate);
        Task<IReadOnlyList<Appointment>> GetAppointmentsByStatusAsync(string status);
        Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime appointmentDate, TimeSpan appointmentTime);
        Task<IReadOnlyList<Appointment>> SearchAppointmentsAsync(AppointmentSearchDto searchDto);
        Task<int> GetAppointmentCountByDoctorAndDateAsync(int doctorId, DateTime date);
        Task<IReadOnlyList<Appointment>> GetConflictingAppointmentsAsync(int doctorId, DateTime appointmentDate, TimeSpan startTime, TimeSpan endTime);
        Task<Appointment?> GetAppointmentWithDetailsAsync(int appointmentId);
    }
} 