using HIVSystem.Core.DTOs;

namespace HIVSystem.Core.Interfaces
{
    public interface IAppointmentService
    {
        Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto createAppointmentDto, int createdBy);
        Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId);
        Task<IReadOnlyList<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId);
        Task<IReadOnlyList<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<AppointmentDto> UpdateAppointmentAsync(int appointmentId, UpdateAppointmentDto updateAppointmentDto);
        Task<bool> CancelAppointmentAsync(int appointmentId, string reason);
        Task<IReadOnlyList<AppointmentDto>> SearchAppointmentsAsync(AppointmentSearchDto searchDto);
        Task<IReadOnlyList<DoctorAvailabilityDto>> GetDoctorAvailabilityAsync(int doctorId, DateTime fromDate, DateTime toDate);
        Task<IReadOnlyList<DoctorDto>> GetAvailableDoctorsAsync(string? specialty = null);
        Task<bool> ValidateAppointmentTimeAsync(int doctorId, DateTime appointmentDate, TimeSpan appointmentTime);
    }
} 