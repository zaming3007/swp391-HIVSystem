using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;

        public AppointmentService(ApplicationDbContext context)
        {
            _context = context;
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
            return await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Appointment>> GetByDoctorIdAsync(string doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.StartTime)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByPatientIdAsync(string patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.StartTime)
                .ToListAsync();
        }

        public async Task<Appointment> CreateAsync(string patientId, string patientName, AppointmentCreateDto appointmentDto)
        {
            // Tìm bác sĩ từ ID
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            if (doctor == null)
            {
                throw new Exception("Không tìm thấy bác sĩ");
            }

            // Tìm dịch vụ từ ID
            var service = await _context.Services.FindAsync(appointmentDto.ServiceId);
            if (service == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }

            // Tính giờ kết thúc dựa trên thời gian bắt đầu và thời lượng dịch vụ
            var startTimeParts = appointmentDto.StartTime.Split(':');
            var startHour = int.Parse(startTimeParts[0]);
            var startMinute = int.Parse(startTimeParts[1]);
            
            var endTime = new DateTime(
                appointmentDto.Date.Year, 
                appointmentDto.Date.Month, 
                appointmentDto.Date.Day, 
                startHour, 
                startMinute, 
                0
            ).AddMinutes(service.Duration);

            var endTimeStr = $"{endTime.Hour:D2}:{endTime.Minute:D2}";

            // Tạo cuộc hẹn mới
            var appointment = new Appointment
            {
                PatientId = patientId,
                PatientName = patientName,
                DoctorId = doctor.Id,
                DoctorName = doctor.FullName,
                ServiceId = service.Id,
                ServiceName = service.Name,
                Date = appointmentDto.Date,
                StartTime = appointmentDto.StartTime,
                EndTime = endTimeStr,
                Notes = appointmentDto.Notes,
                Status = AppointmentStatus.Pending
            };

            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            
            return appointment;
        }

        public async Task<Appointment?> UpdateAsync(string id, AppointmentUpdateDto updateDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return null;

            if (updateDto.Date.HasValue)
            {
                appointment.Date = updateDto.Date.Value;
            }

            if (!string.IsNullOrEmpty(updateDto.StartTime))
            {
                appointment.StartTime = updateDto.StartTime;
                
                // Tính lại giờ kết thúc nếu cần
                var service = await _context.Services.FindAsync(appointment.ServiceId);
                if (service != null)
                {
                    var startTimeParts = updateDto.StartTime.Split(':');
                    var startHour = int.Parse(startTimeParts[0]);
                    var startMinute = int.Parse(startTimeParts[1]);
                    
                    var endTime = new DateTime(
                        appointment.Date.Year, 
                        appointment.Date.Month, 
                        appointment.Date.Day, 
                        startHour, 
                        startMinute, 
                        0
                    ).AddMinutes(service.Duration);

                    appointment.EndTime = $"{endTime.Hour:D2}:{endTime.Minute:D2}";
                }
            }

            if (updateDto.Status.HasValue)
            {
                appointment.Status = updateDto.Status.Value;
            }

            if (!string.IsNullOrEmpty(updateDto.Notes))
            {
                appointment.Notes = updateDto.Notes;
            }

            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 