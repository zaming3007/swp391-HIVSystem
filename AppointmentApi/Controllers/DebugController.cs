using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using AppointmentApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IDoctorService _doctorService;

        public DebugController(ApplicationDbContext context, IDoctorService doctorService)
        {
            _context = context;
            _doctorService = doctorService;
        }

        [HttpGet("doctors")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetAllDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            return Ok(new { 
                count = doctors.Count,
                doctors = doctors.Select(d => new {
                    id = d.Id,
                    name = d.FullName,
                    specialization = d.Specialization,
                    available = d.Available
                })
            });
        }

        [HttpGet("timeslots")]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetAllTimeSlots()
        {
            var timeSlots = await _context.TimeSlots.ToListAsync();
            return Ok(new { 
                count = timeSlots.Count,
                timeSlots = timeSlots.Select(ts => new {
                    id = ts.Id,
                    doctorId = ts.DoctorId,
                    dayOfWeek = ts.DayOfWeek,
                    startTime = ts.StartTime,
                    endTime = ts.EndTime
                })
            });
        }

        [HttpGet("appointments")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAllAppointments()
        {
            try
            {
                // Sử dụng SQL thuần để tránh lỗi mapping
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                var appointments = new List<object>();
                
                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT id, patient_id, patient_name, doctor_id, doctor_name, 
                                   service_id, service_name, date, start_time, end_time, 
                                   status, notes, created_at, updated_at
                            FROM ""Appointments""";
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                appointments.Add(new
                                {
                                    id = reader["id"].ToString(),
                                    doctorId = reader["doctor_id"].ToString(),
                                    doctorName = reader["doctor_name"].ToString(),
                                    patientId = reader["patient_id"].ToString(),
                                    patientName = reader["patient_name"].ToString(),
                                    date = reader["date"],
                                    startTime = reader["start_time"].ToString(),
                                    endTime = reader["end_time"].ToString(),
                                    status = reader["status"],
                                    notes = reader["notes"].ToString()
                                });
                            }
                        }
                    }
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }
                
                return Ok(new { 
                    count = appointments.Count,
                    appointments = appointments
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("available-slots/{doctorId}")]
        public async Task<ActionResult> GetAvailableSlots(string doctorId, [FromQuery] DateTime date)
        {
            try
            {
                if (date == default)
                {
                    date = DateTime.Today.AddDays(1); // Mặc định là ngày mai
                }

                var debugInfo = new Dictionary<string, object>();
                
                // Kiểm tra bác sĩ
                var doctor = await _context.Doctors.FindAsync(doctorId);
                debugInfo["doctorFound"] = doctor != null;
                if (doctor != null)
                {
                    debugInfo["doctorName"] = doctor.FullName;
                    debugInfo["doctorAvailable"] = doctor.Available;
                }
                
                // Kiểm tra lịch làm việc
                var dayOfWeek = (int)date.DayOfWeek;
                var workingHours = await _context.TimeSlots
                    .Where(ts => ts.DoctorId == doctorId && ts.DayOfWeek == dayOfWeek)
                    .ToListAsync();
                
                debugInfo["dayOfWeek"] = dayOfWeek;
                debugInfo["workingHoursCount"] = workingHours.Count;
                debugInfo["workingHours"] = workingHours.Select(wh => new {
                    id = wh.Id,
                    startTime = wh.StartTime,
                    endTime = wh.EndTime
                }).ToList();
                
                // Kiểm tra các cuộc hẹn
                var utcDate = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
                
                // Sử dụng SQL thuần để tránh lỗi mapping
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                var appointments = new List<object>();
                
                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT id, start_time, end_time, status
                            FROM ""Appointments"" 
                            WHERE doctor_id = @doctorId
                            AND date_trunc('day', date) = date_trunc('day', @date)";
                        
                        var doctorIdParam = command.CreateParameter();
                        doctorIdParam.ParameterName = "doctorId";
                        doctorIdParam.Value = doctorId;
                        command.Parameters.Add(doctorIdParam);
                        
                        var dateParam = command.CreateParameter();
                        dateParam.ParameterName = "date";
                        dateParam.Value = utcDate;
                        command.Parameters.Add(dateParam);
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                appointments.Add(new
                                {
                                    id = reader["id"].ToString(),
                                    startTime = reader["start_time"].ToString(),
                                    endTime = reader["end_time"].ToString(),
                                    status = reader["status"].ToString()
                                });
                            }
                        }
                    }
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }
                
                debugInfo["appointmentsCount"] = appointments.Count;
                debugInfo["appointments"] = appointments;
                
                // Lấy các khung giờ trống
                var availableSlots = await _doctorService.GetAvailableSlotsAsync(doctorId, date);
                debugInfo["availableSlotsCount"] = availableSlots.Count;
                if (availableSlots.Count > 0)
                {
                    debugInfo["availableTimes"] = availableSlots[0].AvailableTimes;
                }
                
                // Trả về thông tin debug
                return Ok(new {
                    doctorId,
                    date = date.ToString("yyyy-MM-dd"),
                    debug = debugInfo,
                    availableSlots
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("database-info")]
        public async Task<ActionResult> GetDatabaseInfo()
        {
            try
            {
                var tables = new List<string> { "Doctors", "TimeSlots", "Appointments", "Services", "DoctorServices" };
                var tableInfo = new Dictionary<string, object>();
                
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                try
                {
                    foreach (var table in tables)
                    {
                        try
                        {
                            // Get row count
                            using (var command = connection.CreateCommand())
                            {
                                command.CommandText = $"SELECT COUNT(*) FROM \"{table}\"";
                                var count = await command.ExecuteScalarAsync();
                                
                                // Get column info
                                var columns = new List<object>();
                                command.CommandText = $@"
                                    SELECT column_name, data_type, is_nullable
                                    FROM information_schema.columns
                                    WHERE table_name = '{table.ToLower()}'
                                    ORDER BY ordinal_position";
                                
                                using (var reader = await command.ExecuteReaderAsync())
                                {
                                    while (await reader.ReadAsync())
                                    {
                                        columns.Add(new
                                        {
                                            name = reader["column_name"].ToString(),
                                            type = reader["data_type"].ToString(),
                                            nullable = reader["is_nullable"].ToString() == "YES"
                                        });
                                    }
                                }
                                
                                tableInfo[table] = new
                                {
                                    rowCount = count,
                                    columns = columns
                                };
                            }
                        }
                        catch (Exception ex)
                        {
                            tableInfo[table] = $"Error: {ex.Message}";
                        }
                    }
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }
                
                var connectionString = _context.Database.GetConnectionString();
                // Che giấu mật khẩu
                if (connectionString != null && connectionString.Contains("Password="))
                {
                    var parts = connectionString.Split(';');
                    for (int i = 0; i < parts.Length; i++)
                    {
                        if (parts[i].StartsWith("Password="))
                        {
                            parts[i] = "Password=*****";
                        }
                    }
                    connectionString = string.Join(";", parts);
                }
                
                return Ok(new {
                    databaseProvider = _context.Database.ProviderName,
                    connectionString,
                    tables = tableInfo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpPost("debug-appointment-create")]
        public async Task<ActionResult> DebugAppointmentCreate([FromBody] AppointmentCreateDto appointmentDto)
        {
            try
            {
                // Log thông tin nhận được
                var requestInfo = new Dictionary<string, object>
                {
                    { "appointmentDto", appointmentDto },
                    { "rawJson", JsonSerializer.Serialize(appointmentDto) }
                };

                // Tạo đối tượng Appointment từ DTO
                var appointment = new Appointment
                {
                    Id = Guid.NewGuid().ToString(),
                    DoctorId = appointmentDto.DoctorId,
                    ServiceId = appointmentDto.ServiceId,
                    Date = appointmentDto.Date,
                    StartTime = appointmentDto.StartTime,
                    EndTime = CalculateEndTime(appointmentDto.StartTime, 30), // Giả sử cuộc hẹn kéo dài 30 phút
                    AppointmentType = appointmentDto.AppointmentType,
                    Notes = appointmentDto.Notes,
                    Status = AppointmentStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                // Lấy thông tin bác sĩ
                var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
                if (doctor != null)
                {
                    appointment.DoctorName = doctor.FullName;
                }

                // Lấy thông tin dịch vụ
                var service = await _context.Services.FindAsync(appointmentDto.ServiceId);
                if (service != null)
                {
                    appointment.ServiceName = service.Name;
                }

                // Lấy thông tin về claim từ token
                var userId = User.FindFirst("sub")?.Value ?? "anonymous";
                var userName = User.FindFirst("name")?.Value ?? "Anonymous User";
                
                // Thêm thông tin bệnh nhân
                appointment.PatientId = userId;
                appointment.PatientName = userName;

                // Kiểm tra cấu trúc của đối tượng đã tạo
                var dbModel = new Dictionary<string, object>
                {
                    { "appointment", new {
                        id = appointment.Id,
                        doctorId = appointment.DoctorId,
                        doctorName = appointment.DoctorName,
                        patientId = appointment.PatientId,
                        patientName = appointment.PatientName,
                        serviceId = appointment.ServiceId,
                        serviceName = appointment.ServiceName,
                        date = appointment.Date,
                        startTime = appointment.StartTime,
                        endTime = appointment.EndTime,
                        status = appointment.Status,
                        statusValue = (int)appointment.Status,
                        appointmentType = appointment.AppointmentType,
                        appointmentTypeValue = (int)appointment.AppointmentType,
                        notes = appointment.Notes,
                        createdAt = appointment.CreatedAt
                    }},
                    { "sqlScript", GenerateInsertScript(appointment) }
                };

                // Kiểm tra schema của bảng
                var tableSchema = new List<object>();
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = @"
                        SELECT column_name, data_type, column_default, is_nullable
                        FROM information_schema.columns
                        WHERE table_name = 'appointments'
                        ORDER BY ordinal_position";
                        
                    if (_context.Database.GetDbConnection().State != System.Data.ConnectionState.Open)
                        await _context.Database.GetDbConnection().OpenAsync();
                        
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tableSchema.Add(new
                            {
                                name = reader["column_name"].ToString(),
                                type = reader["data_type"].ToString(),
                                defaultValue = reader["column_default"]?.ToString(),
                                nullable = reader["is_nullable"].ToString() == "YES"
                            });
                        }
                    }
                }

                return Ok(new
                {
                    request = requestInfo,
                    modelForDb = dbModel,
                    tableSchema,
                    userInfo = new { userId, userName },
                    token = new { 
                        isAuthenticated = User.Identity?.IsAuthenticated ?? false,
                        claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        private string CalculateEndTime(string startTime, int durationMinutes)
        {
            if (!TimeSpan.TryParse(startTime, out var timeSpan))
            {
                return startTime;
            }
            
            var endTimeSpan = timeSpan.Add(TimeSpan.FromMinutes(durationMinutes));
            return $"{endTimeSpan.Hours:D2}:{endTimeSpan.Minutes:D2}";
        }

        private string GenerateInsertScript(Appointment appointment)
        {
            var columns = new List<string> {
                "id", "doctor_id", "doctor_name", "patient_id", "patient_name", 
                "service_id", "service_name", "date", "start_time", "end_time", 
                "status", "appointment_type", "notes", "created_at"
            };

            var values = new List<string> {
                $"'{appointment.Id}'",
                $"'{appointment.DoctorId}'",
                $"'{EscapeSql(appointment.DoctorName)}'",
                $"'{appointment.PatientId}'",
                $"'{EscapeSql(appointment.PatientName)}'",
                $"'{appointment.ServiceId}'",
                $"'{EscapeSql(appointment.ServiceName)}'",
                $"'{appointment.Date:yyyy-MM-dd}'",
                $"'{appointment.StartTime}'",
                $"'{appointment.EndTime}'",
                $"{(int)appointment.Status}",
                $"{(int)appointment.AppointmentType}",
                $"'{EscapeSql(appointment.Notes)}'",
                $"'{appointment.CreatedAt:yyyy-MM-dd HH:mm:ss}'"
            };

            return $"INSERT INTO \"Appointments\" ({string.Join(", ", columns.Select(c => $"\"{c}\""))}) " +
                   $"VALUES ({string.Join(", ", values)});";
        }

        private string EscapeSql(string input)
        {
            return input?.Replace("'", "''") ?? "";
        }

        [HttpGet("check-database-connection")]
        public async Task<ActionResult> CheckDatabaseConnection()
        {
            try
            {
                var result = new Dictionary<string, object>();
                
                // Lấy connection string
                var configuration = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                result.Add("connectionString", connectionString ?? "Not found");
                
                // Kiểm tra kết nối
                bool canConnect = false;
                string message = "Not checked";
                
                try 
                {
                    await _context.Database.OpenConnectionAsync();
                    canConnect = true;
                    message = "Connection successful";
                }
                catch (Exception ex)
                {
                    message = $"Connection failed: {ex.Message}";
                }
                finally
                {
                    await _context.Database.CloseConnectionAsync();
                }
                
                result.Add("canConnect", canConnect);
                result.Add("message", message);
                
                // Kiểm tra các bảng
                var tables = new List<string>();
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = @"
                        SELECT table_name 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public'
                        ORDER BY table_name";
                        
                    if (_context.Database.GetDbConnection().State != System.Data.ConnectionState.Open)
                        await _context.Database.GetDbConnection().OpenAsync();
                        
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tables.Add(reader.GetString(0));
                        }
                    }
                }
                
                result.Add("tables", tables);
                
                // Kiểm tra dữ liệu mẫu
                var stats = new Dictionary<string, int>();
                
                stats.Add("doctors", await _context.Doctors.CountAsync());
                stats.Add("services", await _context.Services.CountAsync());
                stats.Add("timeSlots", await _context.TimeSlots.CountAsync());
                stats.Add("appointments", await _context.Appointments.CountAsync());
                stats.Add("doctorServices", await _context.DoctorServices.CountAsync());
                
                result.Add("tableStats", stats);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("test-create-appointment")]
        public async Task<ActionResult> TestCreateAppointment()
        {
            try
            {
                // Dữ liệu mẫu
                var testAppointmentDto = new AppointmentCreateDto
                {
                    DoctorId = "2", // Đổi sang bác sĩ ID: 2 (Hoa Trần)
                    ServiceId = "2",
                    Date = new DateTime(2025, 7, 5), // Đổi sang ngày khác
                    StartTime = "16:00", // Đổi sang giờ khác
                    Notes = "Cuộc hẹn test từ debug controller",
                    AppointmentType = AppointmentType.Offline
                };
                
                var patientId = "126567f5-7cf3-441a-8524-69341cb9bac3"; // ID user thực trong DB
                var patientName = "Test Patient";
                
                var result = new Dictionary<string, object>();
                result.Add("testData", testAppointmentDto);
                
                try 
                {
                    // Lấy reference đến AppointmentService
                    var appointmentService = HttpContext.RequestServices.GetRequiredService<IAppointmentService>();
                    
                    // Tạo trực tiếp cuộc hẹn
                    var appointment = await appointmentService.CreateAsync(patientId, patientName, testAppointmentDto);
                    result.Add("success", true);
                    result.Add("appointment", appointment);
                    result.Add("createdAppointmentId", appointment.Id);
                }
                catch (Exception ex)
                {
                    result.Add("success", false);
                    result.Add("error", ex.Message);
                    result.Add("stackTrace", ex.StackTrace);
                    
                    // Chi tiết hơn nếu là exception từ PostgreSQL
                    if (ex.InnerException != null && ex.InnerException.GetType().Name.Contains("Postgres"))
                    {
                        result.Add("postgresError", ex.InnerException.Message);
                    }
                }
                
                // Kiểm tra cuộc hẹn có được lưu vào DB không
                var appointmentsCount = await _context.Appointments.CountAsync();
                result.Add("appointmentsCountAfter", appointmentsCount);
                
                // Thử lấy appointment từ DB nếu đã tạo thành công
                if (result.ContainsKey("createdAppointmentId"))
                {
                    var savedAppointment = await _context.Appointments.FindAsync(result["createdAppointmentId"]);
                    result.Add("savedInDatabase", savedAppointment != null);
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("alter-table")]
        public async Task<ActionResult> AlterTable()
        {
            try
            {
                // Thêm cột appointment_type và meeting_link
                string alterTableSql = @"
                    DO $$
                    BEGIN
                        -- Kiểm tra xem cột đã tồn tại chưa
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                      WHERE table_name='Appointments' AND column_name='appointment_type') THEN
                            ALTER TABLE ""Appointments"" ADD COLUMN appointment_type integer NOT NULL DEFAULT 0;
                        END IF;
                        
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                      WHERE table_name='Appointments' AND column_name='meeting_link') THEN
                            ALTER TABLE ""Appointments"" ADD COLUMN meeting_link text;
                        END IF;
                    END $$;
                ";
                
                await _context.Database.ExecuteSqlRawAsync(alterTableSql);
                
                // Kiểm tra cấu trúc bảng sau khi thay đổi
                var tableInfo = new List<object>();
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = @"
                        SELECT column_name, data_type, is_nullable, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'appointments'
                        ORDER BY ordinal_position";
                        
                    if (_context.Database.GetDbConnection().State != System.Data.ConnectionState.Open)
                        await _context.Database.GetDbConnection().OpenAsync();
                        
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tableInfo.Add(new
                            {
                                ColumnName = reader["column_name"].ToString(),
                                DataType = reader["data_type"].ToString(),
                                IsNullable = reader["is_nullable"].ToString(),
                                DefaultValue = reader["column_default"]?.ToString()
                            });
                        }
                    }
                }
                
                return Ok(new { 
                    Message = "Bảng đã được cập nhật thành công", 
                    TableStructure = tableInfo 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    Error = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerException = ex.InnerException?.Message
                });
            }
        }
    }
} 