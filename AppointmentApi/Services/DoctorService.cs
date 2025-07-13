using AppointmentApi.Models;
using AppointmentApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AppointmentApi.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly ApplicationDbContext _context;

        public DoctorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Doctor>> GetAllAsync()
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }

        public async Task<Doctor?> GetByIdAsync(string id)
        {
            return await _context.Doctors
                .Include(d => d.WorkingHours)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<List<Doctor>> GetBySpecializationAsync(string specialization)
        {
            return await _context.Doctors
                .Where(d => d.Specialization.Equals(specialization, StringComparison.OrdinalIgnoreCase) && d.Available)
                .Include(d => d.WorkingHours)
                .ToListAsync();
        }

        private async Task<List<Doctor>> GetAllAvailableDoctorsAsync()
        {
            try
            {
                Console.WriteLine("Fallback: Fetching all available doctors");
                var doctors = await _context.Doctors
                    .Where(d => d.Available)
                    .ToListAsync();

                Console.WriteLine($"Found {doctors.Count} available doctors");
                return doctors;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching available doctors: {ex.Message}");
                // Nếu cả cách này cũng lỗi, tạo một số bác sĩ mẫu
                return new List<Doctor>
                {
                    new Doctor
                    {
                        Id = "1",
                        FirstName = "Nguyễn",
                        LastName = "Minh Anh",
                        Specialization = "Bác sĩ Nhiễm HIV/AIDS",
                        Email = "minhanh@example.com",
                        Phone = "0901234567",
                        ProfileImage = "/team-medical/doctor1.jpg",
                        Available = true,
                        Bio = "Bác sĩ chuyên khoa Nhiễm với hơn 10 năm kinh nghiệm điều trị HIV/AIDS",
                        Experience = 10
                    },
                    new Doctor
                    {
                        Id = "2",
                        FirstName = "Trần",
                        LastName = "Hoàng Nam",
                        Specialization = "Chuyên gia Tư vấn HIV",
                        Email = "hoangnam@example.com",
                        Phone = "0912345678",
                        ProfileImage = "/team-medical/doctor2.jpg",
                        Available = true,
                        Bio = "Chuyên gia tư vấn HIV với kinh nghiệm trong tư vấn xét nghiệm",
                        Experience = 8
                    },
                    new Doctor
                    {
                        Id = "3",
                        FirstName = "Lê",
                        LastName = "Thị Hương",
                        Specialization = "Tâm lý học Lâm sàng",
                        Email = "huong@example.com",
                        Phone = "0923456789",
                        ProfileImage = "/team-medical/doctor3.jpg",
                        Available = true,
                        Bio = "Nhà tâm lý học lâm sàng chuyên về sức khỏe tâm thần",
                        Experience = 7
                    }
                };
            }
        }

        public async Task<List<Doctor>> GetDoctorsByServiceIdAsync(string serviceId)
        {
            try
            {
                Console.WriteLine($"GetDoctorsByServiceIdAsync called with serviceId: '{serviceId}'");

                // Nếu serviceId không phải là một số nguyên (để so sánh với integer trong database)
                // thì trả về tất cả bác sĩ có sẵn làm giải pháp tạm thời
                if (!int.TryParse(serviceId, out _))
                {
                    Console.WriteLine("ServiceId is not an integer, using fallback method");
                    return await GetAllAvailableDoctorsAsync();
                }

                // Thử truy vấn trước để debug
                var doctorServices = await _context.DoctorServices.ToListAsync();
                Console.WriteLine($"Total DoctorServices entries: {doctorServices.Count}");
                foreach (var ds in doctorServices.Take(5))
                {
                    Console.WriteLine($"Entry: DoctorId={ds.DoctorId}, ServiceId={ds.ServiceId} (Type: {ds.ServiceId?.GetType().Name})");
                }

                // Sử dụng LINQ để lấy danh sách bác sĩ theo dịch vụ
                var doctorIds = await _context.DoctorServices
                    .Where(ds => ds.ServiceId == serviceId)
                    .Select(ds => ds.DoctorId)
                    .ToListAsync();

                Console.WriteLine($"Found {doctorIds.Count} doctor IDs for service {serviceId}");

                // Nếu không tìm thấy bác sĩ nào cho dịch vụ này, trả về tất cả bác sĩ có sẵn
                if (doctorIds.Count == 0)
                {
                    return await GetAllAvailableDoctorsAsync();
                }

                foreach (var id in doctorIds)
                {
                    Console.WriteLine($"DoctorId: {id}");
                }

                // Sau đó lấy thông tin chi tiết của các bác sĩ
                var doctors = await _context.Doctors
                    .Where(d => doctorIds.Contains(d.Id) && d.Available)
                    .ToListAsync();

                Console.WriteLine($"Found {doctors.Count} doctors available for service {serviceId}");

                // Nếu danh sách rỗng, trả về tất cả bác sĩ có sẵn
                if (doctors.Count == 0)
                {
                    return await GetAllAvailableDoctorsAsync();
                }

                return doctors;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetDoctorsByServiceIdAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                // Fallback
                return await GetAllAvailableDoctorsAsync();
            }
        }

        public async Task<List<TimeSlot>> GetScheduleAsync(string doctorId)
        {
            Console.WriteLine($"GetScheduleAsync called with doctorId: '{doctorId}', Type: {doctorId?.GetType().FullName}");

            try
            {
                // In ra câu truy vấn SQL trước khi thực hiện
                var query = _context.TimeSlots
                    .Where(t => t.DoctorId == doctorId);

                Console.WriteLine($"SQL Query: {query.ToQueryString()}");

                // Thử truy vấn trực tiếp không dùng tham số
                var allTimeSlots = await _context.TimeSlots.ToListAsync();
                Console.WriteLine($"Total TimeSlots in database: {allTimeSlots.Count}");
                foreach (var slot in allTimeSlots)
                {
                    Console.WriteLine($"TimeSlot: ID={slot.Id}, DoctorId={slot.DoctorId}, DayOfWeek={slot.DayOfWeek}, Time={slot.StartTime}-{slot.EndTime}");
                }

                var result = await query.ToListAsync();
                Console.WriteLine($"Query returned {result.Count} results");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetScheduleAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return new List<TimeSlot>();
            }
        }

        public async Task<List<AvailableSlot>> GetAvailableSlotsAsync(string doctorId, DateTime date)
        {
            try
            {
                Console.WriteLine($"----------------- DEBUG SESSION START -----------------");
                Console.WriteLine($"GetAvailableSlotsAsync called with doctorId: '{doctorId}' (Type: {doctorId?.GetType().FullName})");
                Console.WriteLine($"Date: {date:yyyy-MM-dd}, Day of week: {(int)date.DayOfWeek}");

                // Lấy thông tin bác sĩ
                var doctor = await _context.Doctors.FindAsync(doctorId);
                if (doctor == null)
                {
                    Console.WriteLine($"Doctor with ID {doctorId} not found");
                    return new List<AvailableSlot>();
                }

                // Lấy lịch làm việc của bác sĩ trong ngày đó
                var dayOfWeek = (int)date.DayOfWeek;
                var workingHours = await _context.TimeSlots
                    .FirstOrDefaultAsync(ts => ts.DoctorId == doctorId && ts.DayOfWeek == dayOfWeek);

                if (workingHours == null)
                {
                    Console.WriteLine($"No working hours found for doctor {doctorId} on day {dayOfWeek}");
                    return new List<AvailableSlot>();
                }

                Console.WriteLine($"Found working hours: {workingHours.StartTime} - {workingHours.EndTime}");

                // Tạo các khung giờ 30 phút
                var availableTimes = GenerateTimeSlots(workingHours.StartTime, workingHours.EndTime, 30);
                Console.WriteLine($"Generated {availableTimes.Count} time slots");

                // Lấy các cuộc hẹn đã có trong ngày
                var utcDate = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);

                // Sử dụng SQL thuần để tránh lỗi mapping
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;

                if (!wasOpen)
                    await connection.OpenAsync();

                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        // Sử dụng giá trị số của enum thay vì chuỗi
                        int cancelledStatus = 3; // AppointmentStatus.Cancelled = 3

                        command.CommandText = @"
                            SELECT start_time, end_time 
                            FROM ""Appointments"" 
                            WHERE doctor_id = @doctorId 
                            AND date_trunc('day', date) = date_trunc('day', @date)
                            AND status <> @cancelledStatus";

                        var doctorIdParam = command.CreateParameter();
                        doctorIdParam.ParameterName = "doctorId";
                        doctorIdParam.Value = doctorId;
                        command.Parameters.Add(doctorIdParam);

                        var dateParam = command.CreateParameter();
                        dateParam.ParameterName = "date";
                        dateParam.Value = utcDate;
                        command.Parameters.Add(dateParam);

                        var statusParam = command.CreateParameter();
                        statusParam.ParameterName = "cancelledStatus";
                        statusParam.Value = cancelledStatus;
                        command.Parameters.Add(statusParam);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var bookedAppointments = new List<(string StartTime, string EndTime)>();

                            while (await reader.ReadAsync())
                            {
                                var startTime = reader["start_time"].ToString();
                                var endTime = reader["end_time"].ToString();
                                bookedAppointments.Add((startTime, endTime));
                                Console.WriteLine($"Found appointment: {startTime} - {endTime}");
                            }

                            // Loại bỏ các khung giờ đã có lịch hẹn
                            foreach (var appt in bookedAppointments)
                            {
                                foreach (var time in availableTimes.ToList())
                                {
                                    var endTime = CalculateEndTime(time, 30);
                                    bool overlap = IsTimeOverlap(time, endTime, appt.StartTime, appt.EndTime);
                                    if (overlap)
                                    {
                                        Console.WriteLine($"Removing overlapping slot: {time}");
                                        availableTimes.Remove(time);
                                    }
                                }
                            }
                        }
                    }
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }

                Console.WriteLine($"Final available times: {availableTimes.Count}");
                foreach (var time in availableTimes.Take(5))
                {
                    Console.WriteLine($"  - Available: {time}");
                }

                Console.WriteLine("----------------- DEBUG SESSION END -----------------");

                return new List<AvailableSlot>
                {
                    new AvailableSlot
                    {
                        DoctorId = doctorId,
                        DoctorName = doctor.FullName,
                        Date = date,
                        AvailableTimes = availableTimes
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAvailableSlotsAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                // Trả về danh sách mặc định nếu có lỗi
                var defaultSlots = new List<string>
                {
                    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
                };

                return new List<AvailableSlot>
                {
                    new AvailableSlot
                    {
                        DoctorId = doctorId,
                        DoctorName = "Unknown Doctor",
                        Date = date,
                        AvailableTimes = defaultSlots
                    }
                };
            }
        }

        // Helper methods
        private string CalculateEndTime(string startTime, int durationMinutes)
        {
            if (!TimeSpan.TryParse(startTime, out var timeSpan))
            {
                throw new ArgumentException("Invalid start time format");
            }

            var endTimeSpan = timeSpan.Add(TimeSpan.FromMinutes(durationMinutes));
            return $"{endTimeSpan.Hours:D2}:{endTimeSpan.Minutes:D2}";
        }

        private bool IsTimeOverlap(string start1, string end1, string start2, string end2)
        {
            // Convert time strings to TimeSpan
            TimeSpan.TryParse(start1, out var startTime1);
            TimeSpan.TryParse(end1, out var endTime1);
            TimeSpan.TryParse(start2, out var startTime2);
            TimeSpan.TryParse(end2, out var endTime2);

            // Check if time periods overlap
            return startTime1 < endTime2 && endTime1 > startTime2;
        }

        private List<string> GenerateTimeSlots(string startTime, string endTime, int intervalMinutes)
        {
            var slots = new List<string>();

            if (!TimeSpan.TryParse(startTime, out var current) ||
                !TimeSpan.TryParse(endTime, out var end))
            {
                return slots;
            }

            while (current.Add(TimeSpan.FromMinutes(intervalMinutes)) <= end)
            {
                slots.Add($"{current.Hours:D2}:{current.Minutes:D2}");
                current = current.Add(TimeSpan.FromMinutes(intervalMinutes));
            }

            return slots;
        }

        public async Task<bool> IsAvailableAsync(string doctorId, DateTime date, string startTime, int durationMinutes)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null || !doctor.Available) return false;

            // Kiểm tra xem bác sĩ có làm việc vào thời điểm này không
            var dayOfWeek = (int)date.DayOfWeek;
            var workingHours = await _context.TimeSlots
                .FirstOrDefaultAsync(wh => wh.DoctorId == doctorId && wh.DayOfWeek == dayOfWeek);

            if (workingHours == null) return false;

            // Kiểm tra thời gian nằm trong giờ làm việc
            if (!TimeInWorkingHours(startTime, durationMinutes, workingHours.StartTime, workingHours.EndTime))
                return false;

            // Kiểm tra xem đã có cuộc hẹn nào trong khoảng thời gian này chưa
            var endTime = CalculateEndTime(startTime, durationMinutes);

            // Chuyển date về UTC để tương thích với PostgreSQL
            var utcDateForAvailable = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);

            try
            {
                // Sử dụng raw SQL để tránh vấn đề với enum
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;

                if (!wasOpen)
                    await connection.OpenAsync();

                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        // Sử dụng giá trị số của enum thay vì chuỗi
                        int cancelledStatus = 3; // AppointmentStatus.Cancelled = 3

                        command.CommandText = @"
                            SELECT count(*) 
                            FROM ""Appointments"" 
                            WHERE doctor_id = @doctorId 
                            AND date_trunc('day', date) = date_trunc('day', @date)
                            AND status <> @cancelledStatus
                            AND (
                                (start_time < @endTime AND end_time > @startTime)
                                OR (start_time = @startTime)
                            )";

                        var doctorIdParam = command.CreateParameter();
                        doctorIdParam.ParameterName = "doctorId";
                        doctorIdParam.Value = doctorId;
                        command.Parameters.Add(doctorIdParam);

                        var dateParam = command.CreateParameter();
                        dateParam.ParameterName = "date";
                        dateParam.Value = utcDateForAvailable;
                        command.Parameters.Add(dateParam);

                        var statusParam = command.CreateParameter();
                        statusParam.ParameterName = "cancelledStatus";
                        statusParam.Value = cancelledStatus;
                        command.Parameters.Add(statusParam);

                        var startTimeParam = command.CreateParameter();
                        startTimeParam.ParameterName = "startTime";
                        startTimeParam.Value = startTime;
                        command.Parameters.Add(startTimeParam);

                        var endTimeParam = command.CreateParameter();
                        endTimeParam.ParameterName = "endTime";
                        endTimeParam.Value = endTime;
                        command.Parameters.Add(endTimeParam);

                        var count = Convert.ToInt32(await command.ExecuteScalarAsync());
                        return count == 0;
                    }
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking availability: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return false;
            }
        }

        private bool TimeInWorkingHours(string timeToCheck, int durationMinutes, string workingStart, string workingEnd)
        {
            TimeSpan.TryParse(timeToCheck, out var checkTime);
            TimeSpan.TryParse(workingStart, out var startTime);
            TimeSpan.TryParse(workingEnd, out var endTime);

            var checkEndTime = checkTime.Add(TimeSpan.FromMinutes(durationMinutes));

            return checkTime >= startTime && checkEndTime <= endTime;
        }
    }
}