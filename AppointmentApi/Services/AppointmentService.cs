using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AppointmentApi.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IDoctorService _doctorService;
        private readonly INotificationService _notificationService;

        public AppointmentService(ApplicationDbContext context, IDoctorService doctorService, INotificationService notificationService)
        {
            _context = context;
            _doctorService = doctorService;
            _notificationService = notificationService;
        }

        public async Task<List<Appointment>> GetAllAsync()
        {
            return await _context.Appointments
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.StartTime)
                .ToListAsync();
        }

        public async Task<Appointment?> GetByIdAsync(string id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<List<Appointment>> GetByDoctorIdAsync(string doctorId)
        {
            return await _context.Appointments
                .FromSqlRaw(@"
                    SELECT * FROM ""Appointments"" 
                    WHERE doctor_id = {0}
                    ORDER BY date DESC, start_time ASC
                ", doctorId)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByPatientIdAsync(string patientId)
        {
            try
            {
                return await _context.Appointments
                    .FromSqlRaw(@"
                        SELECT * FROM ""Appointments"" 
                        WHERE patient_id = {0}
                        ORDER BY date DESC, start_time ASC
                    ", patientId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByPatientIdAsync: {ex.Message}");
                return new List<Appointment>();
            }
        }

        public async Task<Appointment> CreateAsync(string patientId, string patientName, AppointmentCreateDto appointmentDto)
        {
            try
            {
                Console.WriteLine($"Starting CreateAsync with patientId={patientId}, doctorId={appointmentDto.DoctorId}, serviceId={appointmentDto.ServiceId}");

                var doctor = await _context.Doctors
                    .FromSqlRaw("SELECT * FROM \"Doctors\" WHERE id = {0}", appointmentDto.DoctorId)
                    .FirstOrDefaultAsync();

                if (doctor == null)
                {
                    Console.WriteLine($"Doctor with ID {appointmentDto.DoctorId} not found");
                    throw new ArgumentException("Bác sĩ không tồn tại");
                }

                Console.WriteLine($"Found doctor: {doctor.FirstName} {doctor.LastName}");

                if (!doctor.Available)
                {
                    Console.WriteLine($"Doctor with ID {appointmentDto.DoctorId} is not available");
                    throw new ArgumentException("Bác sĩ hiện không còn làm việc");
                }

                var service = await _context.Services
                    .FromSqlRaw("SELECT * FROM \"Services\" WHERE id = {0}", appointmentDto.ServiceId)
                    .FirstOrDefaultAsync();

                if (service == null)
                {
                    Console.WriteLine($"Service with ID {appointmentDto.ServiceId} not found");
                    throw new ArgumentException("Dịch vụ không tồn tại");
                }

                Console.WriteLine($"Found service: {service.Name}, duration: {service.Duration} minutes");

                if (appointmentDto.Date.Date < DateTime.Now.Date)
                {
                    Console.WriteLine($"Invalid date: {appointmentDto.Date.Date} is in the past");
                    throw new ArgumentException("Không thể đặt lịch cho ngày đã qua");
                }

                var startTime = appointmentDto.StartTime;
                var duration = service.Duration;

                if (!TimeSpan.TryParse(startTime, out var timeSpan))
                {
                    Console.WriteLine($"Invalid start time format: {startTime}");
                    throw new ArgumentException("Định dạng thời gian không hợp lệ");
                }

                var endTimeSpan = timeSpan.Add(TimeSpan.FromMinutes(duration));
                var endTime = $"{endTimeSpan.Hours:D2}:{endTimeSpan.Minutes:D2}";
                Console.WriteLine($"Calculated end time: {endTime} for start time: {startTime}");

                Console.WriteLine($"Checking if time slot is available for doctor {appointmentDto.DoctorId} on {appointmentDto.Date:yyyy-MM-dd} at {startTime}");
                bool isAvailable = await _doctorService.IsAvailableAsync(
                    appointmentDto.DoctorId,
                    appointmentDto.Date,
                    appointmentDto.StartTime,
                    duration
                );

                if (!isAvailable)
                {
                    Console.WriteLine($"Time slot is not available");
                    throw new InvalidOperationException("Bác sĩ không có lịch trống trong khung giờ này");
                }

                Console.WriteLine("Time slot is available, creating appointment object");
                var appointment = new Appointment
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = patientId,
                    PatientName = patientName,
                    DoctorId = appointmentDto.DoctorId,
                    DoctorName = $"{doctor.FirstName} {doctor.LastName}",
                    ServiceId = appointmentDto.ServiceId,
                    ServiceName = service.Name,
                    Date = DateTime.SpecifyKind(appointmentDto.Date, DateTimeKind.Utc),
                    StartTime = appointmentDto.StartTime,
                    EndTime = endTime,
                    Status = AppointmentStatus.Pending,
                    Notes = appointmentDto.Notes,
                    AppointmentType = appointmentDto.AppointmentType,
                    MeetingLink = appointmentDto.AppointmentType == AppointmentType.Online
                        ? "https://meet.google.com/abc-def-ghi"
                        : null,
                    CreatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"Executing SQL to save appointment with ID: {appointment.Id}");

                // Sử dụng raw SQL để chắc chắn
                try
                {
                    // Ngày giờ phải ở dạng UTC
                    var dateUtc = DateTime.SpecifyKind(appointment.Date, DateTimeKind.Utc);
                    var createdAtUtc = DateTime.SpecifyKind(appointment.CreatedAt, DateTimeKind.Utc);

                    var sql = @"
                        INSERT INTO ""Appointments"" (
                            ""id"", ""patient_id"", ""patient_name"", ""doctor_id"", ""doctor_name"", 
                            ""service_id"", ""service_name"", ""date"", ""start_time"", ""end_time"", 
                            ""status"", ""appointment_type"", ""meeting_link"", ""notes"", ""created_at""
                        ) VALUES (
                            @id, @patientId, @patientName, @doctorId, @doctorName,
                            @serviceId, @serviceName, @date, @startTime, @endTime,
                            @status, @appointmentType, @meetingLink, @notes, @createdAt
                        )
                    ";

                    Console.WriteLine($"SQL query: {sql}");

                    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                    {
                        cmd.CommandText = sql;

                        // Tạo và thêm các tham số
                        var paramId = cmd.CreateParameter();
                        paramId.ParameterName = "id";
                        paramId.Value = appointment.Id;
                        cmd.Parameters.Add(paramId);

                        var paramPatientId = cmd.CreateParameter();
                        paramPatientId.ParameterName = "patientId";
                        paramPatientId.Value = appointment.PatientId;
                        cmd.Parameters.Add(paramPatientId);

                        var paramPatientName = cmd.CreateParameter();
                        paramPatientName.ParameterName = "patientName";
                        paramPatientName.Value = appointment.PatientName;
                        cmd.Parameters.Add(paramPatientName);

                        var paramDoctorId = cmd.CreateParameter();
                        paramDoctorId.ParameterName = "doctorId";
                        paramDoctorId.Value = appointment.DoctorId;
                        cmd.Parameters.Add(paramDoctorId);

                        var paramDoctorName = cmd.CreateParameter();
                        paramDoctorName.ParameterName = "doctorName";
                        paramDoctorName.Value = appointment.DoctorName;
                        cmd.Parameters.Add(paramDoctorName);

                        var paramServiceId = cmd.CreateParameter();
                        paramServiceId.ParameterName = "serviceId";
                        paramServiceId.Value = appointment.ServiceId;
                        cmd.Parameters.Add(paramServiceId);

                        var paramServiceName = cmd.CreateParameter();
                        paramServiceName.ParameterName = "serviceName";
                        paramServiceName.Value = appointment.ServiceName;
                        cmd.Parameters.Add(paramServiceName);

                        var paramDate = cmd.CreateParameter();
                        paramDate.ParameterName = "date";
                        paramDate.Value = dateUtc;
                        cmd.Parameters.Add(paramDate);

                        var paramStartTime = cmd.CreateParameter();
                        paramStartTime.ParameterName = "startTime";
                        paramStartTime.Value = appointment.StartTime;
                        cmd.Parameters.Add(paramStartTime);

                        var paramEndTime = cmd.CreateParameter();
                        paramEndTime.ParameterName = "endTime";
                        paramEndTime.Value = appointment.EndTime;
                        cmd.Parameters.Add(paramEndTime);

                        var paramStatus = cmd.CreateParameter();
                        paramStatus.ParameterName = "status";
                        paramStatus.Value = (int)appointment.Status;
                        cmd.Parameters.Add(paramStatus);

                        var paramAppointmentType = cmd.CreateParameter();
                        paramAppointmentType.ParameterName = "appointmentType";
                        paramAppointmentType.Value = (int)appointment.AppointmentType;
                        cmd.Parameters.Add(paramAppointmentType);

                        var paramMeetingLink = cmd.CreateParameter();
                        paramMeetingLink.ParameterName = "meetingLink";
                        paramMeetingLink.Value = appointment.MeetingLink ?? (object)DBNull.Value;
                        cmd.Parameters.Add(paramMeetingLink);

                        var paramNotes = cmd.CreateParameter();
                        paramNotes.ParameterName = "notes";
                        paramNotes.Value = appointment.Notes ?? (object)DBNull.Value;
                        cmd.Parameters.Add(paramNotes);

                        var paramCreatedAt = cmd.CreateParameter();
                        paramCreatedAt.ParameterName = "createdAt";
                        paramCreatedAt.Value = createdAtUtc;
                        cmd.Parameters.Add(paramCreatedAt);

                        if (cmd.Connection.State != System.Data.ConnectionState.Open)
                        {
                            await cmd.Connection.OpenAsync();
                        }

                        int result = await cmd.ExecuteNonQueryAsync();
                        Console.WriteLine($"SQL execution result: {result} rows affected");
                    }

                    Console.WriteLine("Appointment created successfully");

                    // Send notification after successful creation
                    try
                    {
                        await _notificationService.NotifyAppointmentCreatedAsync(appointment.Id);
                        Console.WriteLine("Appointment creation notification sent successfully");
                    }
                    catch (Exception notifEx)
                    {
                        Console.WriteLine($"Error sending appointment notification: {notifEx.Message}");
                        // Don't throw here - appointment was created successfully
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error using SQL: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                    throw new InvalidOperationException($"Không thể tạo lịch hẹn: {ex.Message}", ex);
                }

                return appointment;
            }
            catch (Exception ex) when (!(ex is ArgumentException || ex is InvalidOperationException))
            {
                Console.WriteLine($"Error in CreateAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw new InvalidOperationException($"Không thể tạo lịch hẹn: {ex.Message}");
            }
        }

        public async Task<Appointment?> UpdateAsync(string id, AppointmentUpdateDto appointmentDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return null;
            }

            var oldStatus = appointment.Status;
            var oldDate = appointment.Date;
            var oldTime = appointment.StartTime;

            if (appointmentDto.Status.HasValue)
            {
                appointment.Status = appointmentDto.Status.Value;
            }

            if (!string.IsNullOrEmpty(appointmentDto.Notes))
            {
                appointment.Notes = appointmentDto.Notes;
            }

            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send notifications based on status changes
            try
            {
                if (appointmentDto.Status.HasValue && oldStatus != appointmentDto.Status.Value)
                {
                    switch (appointmentDto.Status.Value)
                    {
                        case AppointmentStatus.Confirmed:
                            await _notificationService.NotifyAppointmentConfirmedAsync(id);
                            break;
                        case AppointmentStatus.Cancelled:
                            await _notificationService.NotifyAppointmentCancelledAsync(id, "system");
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending update notification: {ex.Message}");
                // Don't throw - update was successful
            }

            return appointment;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return false;
            }

            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send cancellation notification
            try
            {
                await _notificationService.NotifyAppointmentCancelledAsync(id, "system");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending cancellation notification: {ex.Message}");
                // Don't throw - deletion was successful
            }

            return true;
        }
    }
}