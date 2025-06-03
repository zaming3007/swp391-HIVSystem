using HIVSystem.Core.DTOs;
using HIVSystem.Core.Entities;
using HIVSystem.Core.Interfaces;

namespace HIVSystem.Infrastructure.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IDoctorRepository _doctorRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IDoctorRepository doctorRepository)
        {
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto createAppointmentDto, int createdBy)
        {
            // Validate doctor availability
            var isAvailable = await ValidateAppointmentTimeAsync(
                createAppointmentDto.DoctorID, 
                createAppointmentDto.AppointmentDate, 
                createAppointmentDto.AppointmentTime);

            if (!isAvailable)
            {
                throw new InvalidOperationException("Doctor is not available at the requested time.");
            }

            // Validate doctor is verified
            var isDoctorVerified = await _doctorRepository.IsDoctorVerifiedAsync(createAppointmentDto.DoctorID);
            if (!isDoctorVerified)
            {
                throw new InvalidOperationException("Doctor is not verified to accept appointments.");
            }

            // Calculate end time (default 30 minutes)
            var endTime = createAppointmentDto.AppointmentTime.Add(TimeSpan.FromMinutes(30));

            var appointment = new Appointment
            {
                PatientID = createAppointmentDto.PatientID,
                DoctorID = createAppointmentDto.DoctorID,
                FacilityID = createAppointmentDto.FacilityID,
                AppointmentDate = createAppointmentDto.AppointmentDate.Date,
                AppointmentTime = createAppointmentDto.AppointmentTime,
                EndTime = endTime,
                AppointmentType = createAppointmentDto.AppointmentType ?? "Regular",
                Purpose = createAppointmentDto.Purpose,
                Notes = createAppointmentDto.Notes,
                IsAnonymous = createAppointmentDto.IsAnonymous,
                Status = "Scheduled",
                CreatedBy = createdBy,
                CreatedDate = DateTime.Now
            };

            var createdAppointment = await _appointmentRepository.AddAsync(appointment);
            return await MapToAppointmentDto(createdAppointment);
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId)
        {
            var appointment = await _appointmentRepository.GetAppointmentWithDetailsAsync(appointmentId);
            if (appointment == null)
            {
                throw new KeyNotFoundException($"Appointment with ID {appointmentId} not found.");
            }

            return await MapToAppointmentDto(appointment);
        }

        public async Task<IReadOnlyList<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
            return await MapToAppointmentDtos(appointments);
        }

        public async Task<IReadOnlyList<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
            return await MapToAppointmentDtos(appointments);
        }

        public async Task<AppointmentDto> UpdateAppointmentAsync(int appointmentId, UpdateAppointmentDto updateAppointmentDto)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (appointment == null)
            {
                throw new KeyNotFoundException($"Appointment with ID {appointmentId} not found.");
            }

            // If updating date/time, validate availability
            if (updateAppointmentDto.AppointmentDate.HasValue || updateAppointmentDto.AppointmentTime.HasValue)
            {
                var newDate = updateAppointmentDto.AppointmentDate ?? appointment.AppointmentDate;
                var newTime = updateAppointmentDto.AppointmentTime ?? appointment.AppointmentTime;

                if (appointment.DoctorID.HasValue)
                {
                    var isAvailable = await ValidateAppointmentTimeAsync(appointment.DoctorID.Value, newDate, newTime);
                    if (!isAvailable)
                    {
                        throw new InvalidOperationException("Doctor is not available at the requested time.");
                    }
                }
            }

            // Update appointment properties
            if (updateAppointmentDto.AppointmentDate.HasValue)
                appointment.AppointmentDate = updateAppointmentDto.AppointmentDate.Value.Date;

            if (updateAppointmentDto.AppointmentTime.HasValue)
            {
                appointment.AppointmentTime = updateAppointmentDto.AppointmentTime.Value;
                appointment.EndTime = updateAppointmentDto.AppointmentTime.Value.Add(TimeSpan.FromMinutes(30));
            }

            if (!string.IsNullOrEmpty(updateAppointmentDto.AppointmentType))
                appointment.AppointmentType = updateAppointmentDto.AppointmentType;

            if (!string.IsNullOrEmpty(updateAppointmentDto.Purpose))
                appointment.Purpose = updateAppointmentDto.Purpose;

            if (!string.IsNullOrEmpty(updateAppointmentDto.Status))
                appointment.Status = updateAppointmentDto.Status;

            if (!string.IsNullOrEmpty(updateAppointmentDto.Notes))
                appointment.Notes = updateAppointmentDto.Notes;

            appointment.ModifiedDate = DateTime.Now;

            await _appointmentRepository.UpdateAsync(appointment);
            return await MapToAppointmentDto(appointment);
        }

        public async Task<bool> CancelAppointmentAsync(int appointmentId, string reason)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (appointment == null)
            {
                return false;
            }

            appointment.Status = "Cancelled";
            appointment.Notes = string.IsNullOrEmpty(appointment.Notes) 
                ? $"Cancelled: {reason}" 
                : $"{appointment.Notes}\nCancelled: {reason}";
            appointment.ModifiedDate = DateTime.Now;

            await _appointmentRepository.UpdateAsync(appointment);
            return true;
        }

        public async Task<IReadOnlyList<AppointmentDto>> SearchAppointmentsAsync(AppointmentSearchDto searchDto)
        {
            var appointments = await _appointmentRepository.SearchAppointmentsAsync(searchDto);
            return await MapToAppointmentDtos(appointments);
        }

        public async Task<IReadOnlyList<DoctorAvailabilityDto>> GetDoctorAvailabilityAsync(int doctorId, DateTime fromDate, DateTime toDate)
        {
            var doctor = await _doctorRepository.GetDoctorWithDetailsAsync(doctorId);
            if (doctor == null)
            {
                throw new KeyNotFoundException($"Doctor with ID {doctorId} not found.");
            }

            var schedules = await _doctorRepository.GetDoctorSchedulesAsync(doctorId);
            var availabilities = await _doctorRepository.GetDoctorAvailabilityAsync(doctorId, fromDate, toDate);
            var existingAppointments = await _appointmentRepository.GetAppointmentsByDateRangeAsync(fromDate, toDate);
            var doctorAppointments = existingAppointments.Where(a => a.DoctorID == doctorId && a.Status != "Cancelled" && a.Status != "No-show").ToList();

            var result = new List<DoctorAvailabilityDto>();

            for (var date = fromDate.Date; date <= toDate.Date; date = date.AddDays(1))
            {
                var dayOfWeek = (int)date.DayOfWeek;
                if (dayOfWeek == 0) dayOfWeek = 7; // Convert Sunday from 0 to 7

                var daySchedule = schedules.FirstOrDefault(s => s.DayOfWeek == dayOfWeek && s.IsAvailable);
                if (daySchedule == null) continue;

                var dayAvailability = availabilities.FirstOrDefault(a => a.AvailabilityDate == date);
                var dayAppointments = doctorAppointments.Where(a => a.AppointmentDate == date).ToList();

                var availabilityDto = new DoctorAvailabilityDto
                {
                    DoctorID = doctorId,
                    DoctorName = doctor.User?.FullName,
                    Date = date,
                    AvailableSlots = GenerateTimeSlots(daySchedule, dayAvailability, dayAppointments)
                };

                result.Add(availabilityDto);
            }

            return result;
        }

        public async Task<IReadOnlyList<DoctorDto>> GetAvailableDoctorsAsync(string? specialty = null)
        {
            var doctors = string.IsNullOrEmpty(specialty) 
                ? await _doctorRepository.GetAvailableDoctorsAsync()
                : await _doctorRepository.GetDoctorsBySpecialtyAsync(specialty);

            return doctors.Select(d => new DoctorDto
            {
                DoctorID = d.DoctorID,
                UserID = d.UserID,
                FullName = d.User?.FullName,
                Specialty = d.Specialty,
                Qualification = d.Qualification,
                Biography = d.Biography,
                YearsOfExperience = d.YearsOfExperience,
                IsAvailable = d.IsAvailable,
                ConsultationFee = d.ConsultationFee,
                VerificationStatus = d.VerificationStatus,
                ProfileImage = d.User?.ProfileImage
            }).ToList();
        }

        public async Task<bool> ValidateAppointmentTimeAsync(int doctorId, DateTime appointmentDate, TimeSpan appointmentTime)
        {
            // Check if the appointment is in the past
            var appointmentDateTime = appointmentDate.Date.Add(appointmentTime);
            if (appointmentDateTime <= DateTime.Now)
            {
                return false;
            }

            // Check doctor's general availability
            var isAvailable = await _appointmentRepository.IsDoctorAvailableAsync(doctorId, appointmentDate, appointmentTime);
            if (!isAvailable)
            {
                return false;
            }

            // Check doctor's schedule for the day
            var dayOfWeek = (int)appointmentDate.DayOfWeek;
            if (dayOfWeek == 0) dayOfWeek = 7; // Convert Sunday from 0 to 7

            var schedules = await _doctorRepository.GetDoctorSchedulesAsync(doctorId);
            var daySchedule = schedules.FirstOrDefault(s => s.DayOfWeek == dayOfWeek && s.IsAvailable);
            
            if (daySchedule == null || 
                appointmentTime < daySchedule.StartTime || 
                appointmentTime >= daySchedule.EndTime)
            {
                return false;
            }

            // Check specific availability overrides
            var availabilities = await _doctorRepository.GetDoctorAvailabilityAsync(doctorId, appointmentDate, appointmentDate);
            var dayAvailability = availabilities.FirstOrDefault(a => a.AvailabilityDate == appointmentDate);
            
            if (dayAvailability != null && !dayAvailability.IsAvailable)
            {
                return false;
            }

            if (dayAvailability != null && dayAvailability.IsAvailable &&
                (appointmentTime < dayAvailability.StartTime || appointmentTime >= dayAvailability.EndTime))
            {
                return false;
            }

            return true;
        }

        private List<TimeSlotDto> GenerateTimeSlots(DoctorSchedule schedule, DoctorAvailability? availability, List<Appointment> appointments)
        {
            var slots = new List<TimeSlotDto>();
            
            var startTime = availability?.StartTime ?? schedule.StartTime ?? TimeSpan.Zero;
            var endTime = availability?.EndTime ?? schedule.EndTime ?? TimeSpan.Zero;
            var slotDuration = TimeSpan.FromMinutes(schedule.SlotDuration);

            for (var time = startTime; time < endTime; time = time.Add(slotDuration))
            {
                var isBooked = appointments.Any(a => a.AppointmentTime == time);
                var isAvailable = availability?.IsAvailable ?? true;

                slots.Add(new TimeSlotDto
                {
                    StartTime = time,
                    EndTime = time.Add(slotDuration),
                    IsAvailable = isAvailable && !isBooked,
                    Reason = isBooked ? "Booked" : (!isAvailable ? availability?.Reason : null)
                });
            }

            return slots;
        }

        private async Task<AppointmentDto> MapToAppointmentDto(Appointment appointment)
        {
            return new AppointmentDto
            {
                AppointmentID = appointment.AppointmentID,
                PatientID = appointment.PatientID,
                DoctorID = appointment.DoctorID,
                FacilityID = appointment.FacilityID,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime,
                EndTime = appointment.EndTime,
                AppointmentType = appointment.AppointmentType,
                Purpose = appointment.Purpose,
                Status = appointment.Status,
                Notes = appointment.Notes,
                IsAnonymous = appointment.IsAnonymous,
                ReminderSent = appointment.ReminderSent,
                CreatedDate = appointment.CreatedDate,
                PatientName = appointment.Patient?.User?.FullName,
                DoctorName = appointment.Doctor?.User?.FullName,
                FacilityName = appointment.Facility?.FacilityName
            };
        }

        private async Task<IReadOnlyList<AppointmentDto>> MapToAppointmentDtos(IReadOnlyList<Appointment> appointments)
        {
            var result = new List<AppointmentDto>();
            foreach (var appointment in appointments)
            {
                result.Add(await MapToAppointmentDto(appointment));
            }
            return result;
        }
    }
} 