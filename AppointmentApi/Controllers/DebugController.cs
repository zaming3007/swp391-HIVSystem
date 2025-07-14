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
            return Ok(new
            {
                count = doctors.Count,
                doctors = doctors.Select(d => new
                {
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
            return Ok(new
            {
                count = timeSlots.Count,
                timeSlots = timeSlots.Select(ts => new
                {
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

                return Ok(new
                {
                    count = appointments.Count,
                    appointments = appointments
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
                debugInfo["workingHours"] = workingHours.Select(wh => new
                {
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
                return Ok(new
                {
                    doctorId,
                    date = date.ToString("yyyy-MM-dd"),
                    debug = debugInfo,
                    availableSlots
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

                return Ok(new
                {
                    databaseProvider = _context.Database.ProviderName,
                    connectionString,
                    tables = tableInfo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
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
                    token = new
                    {
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

                return Ok(new
                {
                    Message = "Bảng đã được cập nhật thành công",
                    TableStructure = tableInfo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Error = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerException = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("create-arv-tables")]
        public async Task<IActionResult> CreateARVTables()
        {
            try
            {
                var sqlScript = await System.IO.File.ReadAllTextAsync("Scripts/CreateARVTablesSimple.sql");

                // Split script by semicolons and execute each statement
                var statements = sqlScript.Split(';', StringSplitOptions.RemoveEmptyEntries);

                foreach (var statement in statements)
                {
                    var trimmedStatement = statement.Trim();
                    if (!string.IsNullOrEmpty(trimmedStatement) && !trimmedStatement.StartsWith("--"))
                    {
                        try
                        {
                            await _context.Database.ExecuteSqlRawAsync(trimmedStatement);
                        }
                        catch (Exception statementEx)
                        {
                            return StatusCode(500, new { success = false, message = $"Error executing statement: {trimmedStatement}", error = statementEx.Message });
                        }
                    }
                }

                return Ok(new { success = true, message = "ARV tables created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARV tables", error = ex.Message });
            }
        }

        [HttpPost("create-arv-regimens-table")]
        public async Task<IActionResult> CreateARVRegimensTable()
        {
            try
            {
                var sql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVRegimens"" (
                        ""Id"" text NOT NULL,
                        ""Name"" character varying(200) NOT NULL,
                        ""Description"" character varying(1000),
                        ""Category"" character varying(100) NOT NULL,
                        ""LineOfTreatment"" character varying(50) NOT NULL,
                        ""IsActive"" boolean NOT NULL DEFAULT true,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_ARVRegimens"" PRIMARY KEY (""Id"")
                    )";

                await _context.Database.ExecuteSqlRawAsync(sql);

                return Ok(new { success = true, message = "ARVRegimens table created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARVRegimens table", error = ex.Message });
            }
        }

        [HttpPost("insert-sample-regimens")]
        public async Task<IActionResult> InsertSampleRegimens()
        {
            try
            {
                var regimens = new[]
                {
                    new ARVRegimen
                    {
                        Id = "regimen-1",
                        Name = "TDF/3TC/EFV",
                        Description = "Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz",
                        Category = "Điều trị ban đầu",
                        LineOfTreatment = "Tuyến 1",
                        IsActive = true
                    },
                    new ARVRegimen
                    {
                        Id = "regimen-2",
                        Name = "AZT/3TC/NVP",
                        Description = "Phác đồ điều trị với Zidovudine + Lamivudine + Nevirapine",
                        Category = "Điều trị ban đầu",
                        LineOfTreatment = "Tuyến 1",
                        IsActive = true
                    }
                };

                _context.ARVRegimens.AddRange(regimens);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Sample regimens inserted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error inserting sample regimens", error = ex.Message });
            }
        }

        [HttpPost("create-all-arv-tables")]
        public async Task<IActionResult> CreateAllARVTables()
        {
            try
            {
                // Create ARVRegimens table
                var createRegimensSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVRegimens"" (
                        ""Id"" text NOT NULL,
                        ""Name"" character varying(200) NOT NULL,
                        ""Description"" character varying(1000),
                        ""Category"" character varying(100) NOT NULL,
                        ""LineOfTreatment"" character varying(50) NOT NULL,
                        ""IsActive"" boolean NOT NULL DEFAULT true,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_ARVRegimens"" PRIMARY KEY (""Id"")
                    )";

                await _context.Database.ExecuteSqlRawAsync(createRegimensSql);

                // Create ARVMedications table
                var createMedicationsSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVMedications"" (
                        ""Id"" text NOT NULL,
                        ""RegimenId"" text NOT NULL,
                        ""MedicationName"" character varying(200) NOT NULL,
                        ""ActiveIngredient"" character varying(100) NOT NULL,
                        ""Dosage"" character varying(100) NOT NULL,
                        ""Frequency"" character varying(100) NOT NULL,
                        ""Instructions"" character varying(200),
                        ""SideEffects"" character varying(500),
                        ""SortOrder"" integer NOT NULL DEFAULT 0,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT ""PK_ARVMedications"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_ARVMedications_ARVRegimens_RegimenId"" FOREIGN KEY (""RegimenId"") REFERENCES ""ARVRegimens"" (""Id"") ON DELETE CASCADE
                    )";

                await _context.Database.ExecuteSqlRawAsync(createMedicationsSql);

                // Create PatientRegimens table
                var createPatientRegimensSql = @"
                    CREATE TABLE IF NOT EXISTS ""PatientRegimens"" (
                        ""Id"" text NOT NULL,
                        ""PatientId"" text NOT NULL,
                        ""PatientName"" text NOT NULL,
                        ""DoctorId"" text NOT NULL,
                        ""DoctorName"" text NOT NULL,
                        ""RegimenId"" text NOT NULL,
                        ""StartDate"" timestamp with time zone NOT NULL,
                        ""EndDate"" timestamp with time zone,
                        ""Status"" character varying(50) NOT NULL DEFAULT 'Đang điều trị',
                        ""Notes"" character varying(1000),
                        ""Reason"" character varying(1000),
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_PatientRegimens"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_PatientRegimens_ARVRegimens_RegimenId"" FOREIGN KEY (""RegimenId"") REFERENCES ""ARVRegimens"" (""Id"") ON DELETE CASCADE
                    )";

                await _context.Database.ExecuteSqlRawAsync(createPatientRegimensSql);

                // Create AdherenceRecords table
                var createAdherenceSql = @"
                    CREATE TABLE IF NOT EXISTS ""AdherenceRecords"" (
                        ""Id"" text NOT NULL,
                        ""PatientRegimenId"" text NOT NULL,
                        ""RecordDate"" timestamp with time zone NOT NULL,
                        ""TotalDoses"" integer NOT NULL,
                        ""TakenDoses"" integer NOT NULL,
                        ""AdherencePercentage"" numeric(5,2) NOT NULL,
                        ""Notes"" character varying(500),
                        ""RecordedBy"" character varying(200),
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT ""PK_AdherenceRecords"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_AdherenceRecords_PatientRegimens_PatientRegimenId"" FOREIGN KEY (""PatientRegimenId"") REFERENCES ""PatientRegimens"" (""Id"") ON DELETE CASCADE
                    )";

                await _context.Database.ExecuteSqlRawAsync(createAdherenceSql);

                // Create SideEffectRecords table
                var createSideEffectsSql = @"
                    CREATE TABLE IF NOT EXISTS ""SideEffectRecords"" (
                        ""Id"" text NOT NULL,
                        ""PatientRegimenId"" text NOT NULL,
                        ""SideEffect"" character varying(200) NOT NULL,
                        ""Severity"" character varying(50) NOT NULL,
                        ""OnsetDate"" timestamp with time zone NOT NULL,
                        ""ResolvedDate"" timestamp with time zone,
                        ""Description"" character varying(1000),
                        ""Treatment"" character varying(500),
                        ""Status"" character varying(50) NOT NULL DEFAULT 'Đang theo dõi',
                        ""ReportedBy"" character varying(200),
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_SideEffectRecords"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_SideEffectRecords_PatientRegimens_PatientRegimenId"" FOREIGN KEY (""PatientRegimenId"") REFERENCES ""PatientRegimens"" (""Id"") ON DELETE CASCADE
                    )";

                await _context.Database.ExecuteSqlRawAsync(createSideEffectsSql);

                return Ok(new { success = true, message = "All ARV tables created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARV tables", error = ex.Message });
            }
        }

        [HttpPost("insert-arv-sample-data")]
        public async Task<IActionResult> InsertARVSampleData()
        {
            try
            {
                // Insert sample regimens
                var insertRegimensSql = @"
                    INSERT INTO ""ARVRegimens"" (""Id"", ""Name"", ""Description"", ""Category"", ""LineOfTreatment"", ""IsActive"", ""CreatedAt"")
                    VALUES
                    ('regimen-1', 'TDF/3TC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
                    ('regimen-2', 'AZT/3TC/NVP', 'Phác đồ điều trị với Zidovudine + Lamivudine + Nevirapine', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
                    ('regimen-3', 'ABC/3TC/DTG', 'Phác đồ điều trị với Abacavir + Lamivudine + Dolutegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP),
                    ('regimen-4', 'TAF/FTC/BIC', 'Phác đồ điều trị với Tenofovir Alafenamide + Emtricitabine + Bictegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP)
                    ON CONFLICT (""Id"") DO NOTHING";

                await _context.Database.ExecuteSqlRawAsync(insertRegimensSql);

                // Insert sample medications
                var insertMedicationsSql = @"
                    INSERT INTO ""ARVMedications"" (""Id"", ""RegimenId"", ""MedicationName"", ""ActiveIngredient"", ""Dosage"", ""Frequency"", ""Instructions"", ""SideEffects"", ""SortOrder"", ""CreatedAt"")
                    VALUES
                    -- Phác đồ TDF/3TC/EFV
                    ('med-1-1', 'regimen-1', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1, CURRENT_TIMESTAMP),
                    ('med-1-2', 'regimen-1', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-1-3', 'regimen-1', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ, tránh thức ăn nhiều chất béo', 'Chóng mặt, mơ mộng bất thường, mất ngủ', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ AZT/3TC/NVP
                    ('med-2-1', 'regimen-2', 'Zidovudine', 'Zidovudine', '300mg', '2 lần/ngày', 'Uống cùng bữa ăn', 'Thiếu máu, buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
                    ('med-2-2', 'regimen-2', 'Lamivudine', 'Lamivudine', '150mg', '2 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-2-3', 'regimen-2', 'Nevirapine', 'Nevirapine', '200mg', '2 lần/ngày', 'Bắt đầu với 1 lần/ngày trong 2 tuần đầu', 'Phát ban da, sốt, đau gan', 3, CURRENT_TIMESTAMP)
                    ON CONFLICT (""Id"") DO NOTHING";

                await _context.Database.ExecuteSqlRawAsync(insertMedicationsSql);

                return Ok(new { success = true, message = "ARV sample data inserted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error inserting ARV sample data", error = ex.Message });
            }
        }

        [HttpGet("test-arv-regimens")]
        public async Task<IActionResult> TestARVRegimens()
        {
            try
            {
                // Test if ARVRegimens table exists and get data
                var regimensSql = @"
                    SELECT ""Id"", ""Name"", ""Description"", ""Category"", ""LineOfTreatment"", ""IsActive""
                    FROM ""ARVRegimens""
                    WHERE ""IsActive"" = true
                    ORDER BY ""LineOfTreatment"", ""Name""";

                var regimens = await _context.Database.SqlQueryRaw<dynamic>(regimensSql).ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "ARV regimens retrieved successfully!",
                    data = regimens,
                    count = regimens.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error testing ARV regimens", error = ex.Message });
            }
        }

        [HttpPost("fix-arv-regimens-table")]
        public async Task<IActionResult> FixARVRegimensTable()
        {
            try
            {
                // Drop and recreate ARVRegimens table with correct structure
                var dropTableSql = @"DROP TABLE IF EXISTS ""ARVRegimens"" CASCADE";
                await _context.Database.ExecuteSqlRawAsync(dropTableSql);

                var createTableSql = @"
                    CREATE TABLE ""ARVRegimens"" (
                        ""Id"" text NOT NULL,
                        ""Name"" character varying(200) NOT NULL,
                        ""Description"" character varying(1000),
                        ""Category"" character varying(100) NOT NULL,
                        ""LineOfTreatment"" character varying(50) NOT NULL,
                        ""IsActive"" boolean NOT NULL DEFAULT true,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_ARVRegimens"" PRIMARY KEY (""Id"")
                    )";

                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Insert sample data
                var insertDataSql = @"
                    INSERT INTO ""ARVRegimens"" (""Id"", ""Name"", ""Description"", ""Category"", ""LineOfTreatment"", ""IsActive"", ""CreatedAt"")
                    VALUES
                    ('regimen-1', 'TDF/3TC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
                    ('regimen-2', 'AZT/3TC/NVP', 'Phác đồ điều trị với Zidovudine + Lamivudine + Nevirapine', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
                    ('regimen-3', 'ABC/3TC/DTG', 'Phác đồ điều trị với Abacavir + Lamivudine + Dolutegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP),
                    ('regimen-4', 'TAF/FTC/BIC', 'Phác đồ điều trị với Tenofovir Alafenamide + Emtricitabine + Bictegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP)";

                await _context.Database.ExecuteSqlRawAsync(insertDataSql);

                return Ok(new { success = true, message = "ARVRegimens table fixed and sample data inserted!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error fixing ARVRegimens table", error = ex.Message });
            }
        }

        [HttpPost("create-arv-medications-table")]
        public async Task<IActionResult> CreateARVMedicationsTable()
        {
            try
            {
                var createTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVMedications"" (
                        ""Id"" text NOT NULL,
                        ""RegimenId"" text NOT NULL,
                        ""MedicationName"" character varying(200) NOT NULL,
                        ""ActiveIngredient"" character varying(100) NOT NULL,
                        ""Dosage"" character varying(100) NOT NULL,
                        ""Frequency"" character varying(100) NOT NULL,
                        ""Instructions"" character varying(200),
                        ""SideEffects"" character varying(500),
                        ""SortOrder"" integer NOT NULL DEFAULT 0,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT ""PK_ARVMedications"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_ARVMedications_ARVRegimens_RegimenId"" FOREIGN KEY (""RegimenId"") REFERENCES ""ARVRegimens"" (""Id"") ON DELETE CASCADE
                    )";

                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Insert sample medications
                var insertDataSql = @"
                    INSERT INTO ""ARVMedications"" (""Id"", ""RegimenId"", ""MedicationName"", ""ActiveIngredient"", ""Dosage"", ""Frequency"", ""Instructions"", ""SideEffects"", ""SortOrder"", ""CreatedAt"")
                    VALUES
                    -- Phác đồ TDF/3TC/EFV
                    ('med-1-1', 'regimen-1', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1, CURRENT_TIMESTAMP),
                    ('med-1-2', 'regimen-1', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-1-3', 'regimen-1', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ, tránh thức ăn nhiều chất béo', 'Chóng mặt, mơ mộng bất thường, mất ngủ', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ AZT/3TC/NVP
                    ('med-2-1', 'regimen-2', 'Zidovudine', 'Zidovudine', '300mg', '2 lần/ngày', 'Uống cùng bữa ăn', 'Thiếu máu, buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
                    ('med-2-2', 'regimen-2', 'Lamivudine', 'Lamivudine', '150mg', '2 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-2-3', 'regimen-2', 'Nevirapine', 'Nevirapine', '200mg', '2 lần/ngày', 'Bắt đầu với 1 lần/ngày trong 2 tuần đầu', 'Phát ban da, sốt, đau gan', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ ABC/3TC/DTG
                    ('med-3-1', 'regimen-3', 'Abacavir', 'Abacavir', '600mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Phản ứng dị ứng, buồn nôn, mệt mỏi', 1, CURRENT_TIMESTAMP),
                    ('med-3-2', 'regimen-3', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-3-3', 'regimen-3', 'Dolutegravir', 'Dolutegravir', '50mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, mất ngủ, tăng cân', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ TAF/FTC/BIC
                    ('med-4-1', 'regimen-4', 'Tenofovir AF', 'Tenofovir Alafenamide', '25mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
                    ('med-4-2', 'regimen-4', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, tiêu chảy, phát ban', 2, CURRENT_TIMESTAMP),
                    ('med-4-3', 'regimen-4', 'Bictegravir', 'Bictegravir', '50mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Đau đầu, buồn nôn, mệt mỏi', 3, CURRENT_TIMESTAMP)
                    ON CONFLICT (""Id"") DO NOTHING";

                await _context.Database.ExecuteSqlRawAsync(insertDataSql);

                return Ok(new { success = true, message = "ARVMedications table created and sample data inserted!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARVMedications table", error = ex.Message });
            }
        }

        [HttpGet("test-arv-api")]
        public async Task<IActionResult> TestARVAPI()
        {
            try
            {
                // Test if we can access ARVRegimens through DbContext
                var regimens = await _context.ARVRegimens
                    .Where(r => r.IsActive)
                    .OrderBy(r => r.LineOfTreatment)
                    .ThenBy(r => r.Name)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "ARV API test successful!",
                    data = regimens.Select(r => new
                    {
                        r.Id,
                        r.Name,
                        r.Description,
                        r.Category,
                        r.LineOfTreatment,
                        r.IsActive
                    }),
                    count = regimens.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error testing ARV API", error = ex.Message });
            }
        }

        [HttpPost("create-doctor-schedule-tables")]
        public async Task<IActionResult> CreateDoctorScheduleTables()
        {
            try
            {
                // Create DoctorSchedules table
                var createScheduleTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""DoctorSchedules"" (
                        ""Id"" text NOT NULL,
                        ""DoctorId"" text NOT NULL,
                        ""DayOfWeek"" integer NOT NULL,
                        ""IsWorking"" boolean NOT NULL,
                        ""CreatedAt"" timestamp with time zone NOT NULL,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_DoctorSchedules"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createScheduleTableSql);

                // Create DoctorTimeSlots table
                var createTimeSlotsTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""DoctorTimeSlots"" (
                        ""Id"" text NOT NULL,
                        ""DoctorScheduleId"" text NOT NULL,
                        ""StartTime"" interval NOT NULL,
                        ""EndTime"" interval NOT NULL,
                        ""IsAvailable"" boolean NOT NULL,
                        ""CreatedAt"" timestamp with time zone NOT NULL,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_DoctorTimeSlots"" PRIMARY KEY (""Id""),
                        CONSTRAINT ""FK_DoctorTimeSlots_DoctorSchedules_DoctorScheduleId"" FOREIGN KEY (""DoctorScheduleId"") REFERENCES ""DoctorSchedules"" (""Id"") ON DELETE CASCADE
                    );";

                await _context.Database.ExecuteSqlRawAsync(createTimeSlotsTableSql);

                return Ok(new { success = true, message = "Doctor schedule tables created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating doctor schedule tables", error = ex.Message });
            }
        }

        [HttpPost("insert-arv-medications")]
        public async Task<IActionResult> InsertARVMedications()
        {
            try
            {
                var insertMedicationsSql = @"
                    INSERT INTO ""ARVMedications"" (""Id"", ""RegimenId"", ""MedicationName"", ""ActiveIngredient"", ""Dosage"", ""Frequency"", ""Instructions"", ""SideEffects"", ""SortOrder"", ""CreatedAt"")
                    VALUES
                    -- Phác đồ TDF/3TC/EFV
                    ('med-1-1', 'regimen-1', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1, CURRENT_TIMESTAMP),
                    ('med-1-2', 'regimen-1', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-1-3', 'regimen-1', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ, tránh thức ăn nhiều chất béo', 'Chóng mặt, mơ mộng bất thường, mất ngủ', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ AZT/3TC/NVP
                    ('med-2-1', 'regimen-2', 'Zidovudine', 'Zidovudine', '300mg', '2 lần/ngày', 'Uống cùng bữa ăn', 'Thiếu máu, buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
                    ('med-2-2', 'regimen-2', 'Lamivudine', 'Lamivudine', '150mg', '2 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-2-3', 'regimen-2', 'Nevirapine', 'Nevirapine', '200mg', '2 lần/ngày', 'Bắt đầu với 1 lần/ngày trong 2 tuần đầu', 'Phát ban da, sốt, đau gan', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ ABC/3TC/DTG
                    ('med-3-1', 'regimen-3', 'Abacavir', 'Abacavir', '600mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Phản ứng dị ứng, buồn nôn, mệt mỏi', 1, CURRENT_TIMESTAMP),
                    ('med-3-2', 'regimen-3', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
                    ('med-3-3', 'regimen-3', 'Dolutegravir', 'Dolutegravir', '50mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, mất ngủ, tăng cân', 3, CURRENT_TIMESTAMP),

                    -- Phác đồ TAF/FTC/BIC
                    ('med-4-1', 'regimen-4', 'Tenofovir AF', 'Tenofovir Alafenamide', '25mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
                    ('med-4-2', 'regimen-4', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, tiêu chảy, phát ban', 2, CURRENT_TIMESTAMP),
                    ('med-4-3', 'regimen-4', 'Bictegravir', 'Bictegravir', '50mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Đau đầu, buồn nôn, mệt mỏi', 3, CURRENT_TIMESTAMP)
                    ON CONFLICT (""Id"") DO NOTHING";

                await _context.Database.ExecuteSqlRawAsync(insertMedicationsSql);

                return Ok(new { success = true, message = "ARV medications inserted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error inserting ARV medications", error = ex.Message });
            }
        }

        [HttpPost("create-test-results-tables")]
        public async Task<IActionResult> CreateTestResultsTables()
        {
            try
            {
                // Read and execute the SQL script
                var scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "CreateTestResultsTables.sql");
                if (!System.IO.File.Exists(scriptPath))
                {
                    return BadRequest(new { success = false, message = "SQL script file not found" });
                }

                var sqlScript = await System.IO.File.ReadAllTextAsync(scriptPath);

                // Split script into individual commands
                var commands = sqlScript.Split(new[] { ";\r\n", ";\n" }, StringSplitOptions.RemoveEmptyEntries);

                var results = new List<string>();

                foreach (var command in commands)
                {
                    var trimmedCommand = command.Trim();
                    if (string.IsNullOrEmpty(trimmedCommand) || trimmedCommand.StartsWith("--"))
                        continue;

                    try
                    {
                        await _context.Database.ExecuteSqlRawAsync(trimmedCommand);
                        results.Add($"✅ Executed: {trimmedCommand.Substring(0, Math.Min(50, trimmedCommand.Length))}...");
                    }
                    catch (Exception ex)
                    {
                        results.Add($"❌ Failed: {trimmedCommand.Substring(0, Math.Min(50, trimmedCommand.Length))}... Error: {ex.Message}");
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Test Results tables creation completed!",
                    results = results
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating Test Results tables", error = ex.Message });
            }
        }

        [HttpGet("test-test-results")]
        public async Task<IActionResult> TestTestResults()
        {
            try
            {
                // Test if TestResults table exists and get data
                var testResultsSql = @"
                    SELECT ""Id"", ""PatientId"", ""TestType"", ""TestName"", ""Result"", ""Status"", ""TestDate""
                    FROM ""TestResults""
                    ORDER BY ""TestDate"" DESC
                    LIMIT 10";

                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;

                if (!wasOpen)
                    await connection.OpenAsync();

                try
                {
                    using var command = connection.CreateCommand();
                    command.CommandText = testResultsSql;

                    var results = new List<object>();
                    using var reader = await command.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        results.Add(new
                        {
                            Id = reader["Id"].ToString(),
                            PatientId = reader["PatientId"].ToString(),
                            TestType = reader["TestType"].ToString(),
                            TestName = reader["TestName"].ToString(),
                            Result = reader["Result"].ToString(),
                            Status = reader["Status"].ToString(),
                            TestDate = reader["TestDate"].ToString()
                        });
                    }

                    return Ok(new
                    {
                        success = true,
                        message = "Test Results retrieved successfully!",
                        data = results,
                        count = results.Count
                    });
                }
                finally
                {
                    if (!wasOpen)
                        await connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error testing Test Results", error = ex.Message });
            }
        }

        [HttpPost("create-test-results-simple")]
        public async Task<IActionResult> CreateTestResultsSimple()
        {
            try
            {
                var sql = @"
                    CREATE TABLE IF NOT EXISTS ""TestResults"" (
                        ""Id"" text NOT NULL,
                        ""PatientId"" text NOT NULL,
                        ""DoctorId"" text NOT NULL,
                        ""TestType"" character varying(50) NOT NULL,
                        ""TestName"" character varying(200) NOT NULL,
                        ""Result"" character varying(500) NOT NULL,
                        ""Unit"" character varying(50),
                        ""ReferenceRange"" character varying(200),
                        ""Status"" character varying(50) NOT NULL,
                        ""TestDate"" timestamp with time zone NOT NULL,
                        ""LabName"" character varying(200),
                        ""Notes"" character varying(1000),
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_TestResults"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(sql);

                return Ok(new { success = true, message = "TestResults table created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating TestResults table", error = ex.Message });
            }
        }

        [HttpPost("insert-test-results-sample")]
        public async Task<IActionResult> InsertTestResultsSample()
        {
            try
            {
                // First create the table
                var createTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""TestResults"" (
                        ""Id"" text NOT NULL,
                        ""PatientId"" text NOT NULL,
                        ""DoctorId"" text NOT NULL,
                        ""TestType"" character varying(50) NOT NULL,
                        ""TestName"" character varying(200) NOT NULL,
                        ""Result"" character varying(500) NOT NULL,
                        ""Unit"" character varying(50),
                        ""ReferenceRange"" character varying(200),
                        ""Status"" character varying(50) NOT NULL,
                        ""TestDate"" timestamp with time zone NOT NULL,
                        ""LabName"" character varying(200),
                        ""Notes"" character varying(1000),
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_TestResults"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Then insert sample data
                var insertSql = @"
                    INSERT INTO ""TestResults"" (""Id"", ""PatientId"", ""DoctorId"", ""TestType"", ""TestName"", ""Result"", ""Unit"", ""ReferenceRange"", ""Status"", ""TestDate"", ""LabName"", ""Notes"", ""CreatedAt"") VALUES
                    ('test-001', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '450', 'cells/μL', '500-1600', 'Abnormal', '2025-07-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Cần theo dõi và điều chỉnh phác đồ điều trị', CURRENT_TIMESTAMP),
                    ('test-002', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '520', 'cells/μL', '500-1600', 'Normal', '2025-06-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả tốt, tiếp tục điều trị hiện tại', CURRENT_TIMESTAMP),
                    ('test-004', 'customer-001', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', 'Undetectable', 'copies/mL', '<50', 'Normal', '2025-07-10 09:30:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả rất tốt, virus không phát hiện được', CURRENT_TIMESTAMP),
                    ('test-007', 'customer-001', 'doctor-001', 'Other', 'Hemoglobin', '12.5', 'g/dL', '12.0-15.5', 'Normal', '2025-07-10 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Chỉ số bình thường', CURRENT_TIMESTAMP)
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertSql);

                return Ok(new { success = true, message = "TestResults table created and sample data inserted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating table and inserting sample data", error = ex.Message });
            }
        }

        // Temporarily disabled due to model conflicts
        /*
        [HttpPost("create-arv-sample-data")]
        public async Task<IActionResult> CreateARVSampleData()
        {
            try
            {
                // 1. Create ARV Drugs
                var drugs = new List<ARVDrug>
                {
                    new ARVDrug
                    {
                        Id = "drug-001",
                        Name = "Tenofovir Disoproxil Fumarate",
                        ActiveIngredient = "Tenofovir DF",
                        DrugClass = "NRTI",
                        Manufacturer = "Gilead Sciences",
                        Dosage = "300mg",
                        SideEffects = "Buồn nôn, đau đầu, mệt mỏi",
                        Contraindications = "Suy thận nặng",
                        IsActive = true
                    },
                    new ARVDrug
                    {
                        Id = "drug-002",
                        Name = "Lamivudine",
                        ActiveIngredient = "3TC",
                        DrugClass = "NRTI",
                        Manufacturer = "ViiV Healthcare",
                        Dosage = "300mg",
                        SideEffects = "Buồn nôn, đau bụng, mệt mỏi",
                        Contraindications = "Dị ứng với lamivudine",
                        IsActive = true
                    },
                    new ARVDrug
                    {
                        Id = "drug-003",
                        Name = "Efavirenz",
                        ActiveIngredient = "EFV",
                        DrugClass = "NNRTI",
                        Manufacturer = "Bristol-Myers Squibb",
                        Dosage = "600mg",
                        SideEffects = "Chóng mặt, mơ mộng bất thường, rối loạn giấc ngủ",
                        Contraindications = "Thai kỳ (trimester đầu)",
                        IsActive = true
                    }
                };

                foreach (var drug in drugs)
                {
                    var existingDrug = await _context.ARVDrugs.FindAsync(drug.Id);
                    if (existingDrug == null)
                    {
                        _context.ARVDrugs.Add(drug);
                    }
                }

                await _context.SaveChangesAsync();

                // 2. Create ARV Regimens
                var regimens = new List<ARVRegimen>
                {
                    new ARVRegimen
                    {
                        Id = "regimen-001",
                        Name = "TDF/3TC/EFV",
                        Description = "Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz",
                        Category = "Điều trị ban đầu",
                        LineOfTreatment = "Tuyến 1",
                        IsActive = true
                    }
                };

                foreach (var regimen in regimens)
                {
                    var existingRegimen = await _context.ARVRegimens.FindAsync(regimen.Id);
                    if (existingRegimen == null)
                    {
                        _context.ARVRegimens.Add(regimen);
                    }
                }

                await _context.SaveChangesAsync();

                // 3. Create ARV Medications (link drugs to regimens)
                var medications = new List<ARVMedication>
                {
                    new ARVMedication
                    {
                        Id = "med-001",
                        RegimenId = "regimen-001",
                        DrugId = "drug-001",
                        Dosage = "300mg",
                        Frequency = "1 lần/ngày",
                        Instructions = "Uống sau bữa ăn",
                        TimingInstructions = "Buổi tối"
                    },
                    new ARVMedication
                    {
                        Id = "med-002",
                        RegimenId = "regimen-001",
                        DrugId = "drug-002",
                        Dosage = "300mg",
                        Frequency = "1 lần/ngày",
                        Instructions = "Uống cùng với Tenofovir",
                        TimingInstructions = "Buổi tối"
                    },
                    new ARVMedication
                    {
                        Id = "med-003",
                        RegimenId = "regimen-001",
                        DrugId = "drug-003",
                        Dosage = "600mg",
                        Frequency = "1 lần/ngày",
                        Instructions = "Uống trước khi đi ngủ",
                        TimingInstructions = "Buổi tối"
                    }
                };

                foreach (var medication in medications)
                {
                    var existingMed = await _context.ARVMedications.FindAsync(medication.Id);
                    if (existingMed == null)
                    {
                        _context.ARVMedications.Add(medication);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "ARV sample data created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARV sample data", error = ex.Message });
            }
        }

        [HttpPost("create-patient-regimens")]
        public async Task<IActionResult> CreatePatientRegimens()
        {
            try
            {
                // Create patient regimens
                var patientRegimens = new List<PatientRegimen>
                {
                    new PatientRegimen
                    {
                        Id = "patient-regimen-001",
                        PatientId = "customer-001",
                        RegimenId = "regimen-001",
                        DoctorId = "doctor-001",
                        DoctorName = "BS. Nguyễn Văn A",
                        StartDate = DateTime.UtcNow.AddDays(-180),
                        Status = "Đang điều trị",
                        Notes = "Bệnh nhân tuân thủ điều trị tốt",
                        Reason = "Điều trị ban đầu cho bệnh nhân mới chẩn đoán HIV"
                    }
                };

                foreach (var patientRegimen in patientRegimens)
                {
                    var existing = await _context.PatientRegimens.FindAsync(patientRegimen.Id);
                    if (existing == null)
                    {
                        _context.PatientRegimens.Add(patientRegimen);
                    }
                }

                await _context.SaveChangesAsync();

                // Create adherence records
                var adherenceRecords = new List<AdherenceRecord>
                {
                    new AdherenceRecord
                    {
                        Id = "adherence-001",
                        PatientRegimenId = "patient-regimen-001",
                        RecordDate = DateTime.UtcNow.AddDays(-30),
                        TotalDoses = 30,
                        TakenDoses = 28,
                        AdherencePercentage = 93.33m,
                        Notes = "Quên uống 2 lần trong tháng"
                    },
                    new AdherenceRecord
                    {
                        Id = "adherence-002",
                        PatientRegimenId = "patient-regimen-001",
                        RecordDate = DateTime.UtcNow.AddDays(-60),
                        TotalDoses = 30,
                        TakenDoses = 30,
                        AdherencePercentage = 100.00m,
                        Notes = "Tuân thủ hoàn toàn"
                    }
                };

                foreach (var record in adherenceRecords)
                {
                    var existing = await _context.AdherenceRecords.FindAsync(record.Id);
                    if (existing == null)
                    {
                        _context.AdherenceRecords.Add(record);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Patient regimens and adherence records created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating patient regimens", error = ex.Message });
            }
            */

        [HttpPost("create-notification-sample")]
        public async Task<IActionResult> CreateNotificationSample()
        {
            try
            {
                // Create notifications table
                var createTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""Notifications"" (
                        ""Id"" text NOT NULL,
                        ""UserId"" character varying(50) NOT NULL,
                        ""Title"" character varying(100) NOT NULL,
                        ""Message"" character varying(500) NOT NULL,
                        ""Type"" character varying(50) NOT NULL,
                        ""Priority"" character varying(50) DEFAULT 'normal',
                        ""ActionUrl"" character varying(200),
                        ""ActionText"" character varying(100),
                        ""RelatedEntityId"" character varying(50),
                        ""RelatedEntityType"" character varying(50),
                        ""IsRead"" boolean NOT NULL DEFAULT false,
                        ""IsDeleted"" boolean NOT NULL DEFAULT false,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""ReadAt"" timestamp with time zone,
                        ""DeletedAt"" timestamp with time zone,
                        ""CreatedBy"" character varying(50),
                        ""Metadata"" character varying(1000),
                        CONSTRAINT ""PK_Notifications"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Insert sample notifications
                var insertSql = @"
                    INSERT INTO ""Notifications"" (""Id"", ""UserId"", ""Title"", ""Message"", ""Type"", ""Priority"", ""ActionUrl"", ""ActionText"", ""RelatedEntityId"", ""RelatedEntityType"", ""IsRead"", ""CreatedAt"", ""CreatedBy"") VALUES
                    ('notif-001', 'customer-001', 'Lịch hẹn mới', 'Lịch hẹn với BS. Nguyễn Văn A vào 15/07/2025 lúc 09:00 đã được xác nhận.', 'appointment', 'normal', '/app/appointments/apt-001', 'Xem chi tiết', 'apt-001', 'appointment', false, CURRENT_TIMESTAMP, 'system'),
                    ('notif-002', 'customer-001', 'Kết quả xét nghiệm mới', 'Kết quả xét nghiệm CD4 Count đã có. Trạng thái: Normal', 'test_result', 'normal', '/app/test-results', 'Xem kết quả', 'test-001', 'test_result', false, CURRENT_TIMESTAMP, 'system'),
                    ('notif-003', 'customer-001', 'Nhắc nhở uống thuốc ARV', 'Đã đến giờ uống thuốc ARV. Hãy tuân thủ đúng liều lượng và thời gian.', 'arv', 'urgent', '/app/arv-management', 'Ghi nhận đã uống', 'regimen-001', 'arv_regimen', true, CURRENT_TIMESTAMP - INTERVAL ''1 hour'', 'system'),
                    ('notif-004', 'doctor-001', 'Lịch hẹn mới', 'Bệnh nhân customer-001 đã đặt lịch hẹn vào 15/07/2025 lúc 09:00.', 'appointment', 'normal', '/doctor/appointments/apt-001', 'Xem chi tiết', 'apt-001', 'appointment', false, CURRENT_TIMESTAMP, 'system'),
                    ('notif-005', 'doctor-001', 'Cảnh báo tuân thủ ARV thấp', 'Bệnh nhân có mức độ tuân thủ ARV thấp (75%). Cần can thiệp.', 'arv', 'urgent', '/doctor/patients/customer-001/arv', 'Xem chi tiết', 'customer-001', 'patient', false, CURRENT_TIMESTAMP, 'system')
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertSql);

                return Ok(new { success = true, message = "Notification sample data created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating notification sample data", error = ex.Message });
            }
        }

        [HttpGet("test-notification")]
        public async Task<IActionResult> TestNotification()
        {
            try
            {
                // Simple test to check if notifications table exists
                var checkTableSql = @"
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables
                        WHERE table_schema = 'public'
                        AND table_name = 'Notifications'
                    );";

                var tableExists = await _context.Database.SqlQueryRaw<bool>(checkTableSql).FirstOrDefaultAsync();

                if (!tableExists)
                {
                    // Create table if it doesn't exist
                    var createTableSql = @"
                        CREATE TABLE ""Notifications"" (
                            ""Id"" text NOT NULL,
                            ""UserId"" character varying(50) NOT NULL,
                            ""Title"" character varying(100) NOT NULL,
                            ""Message"" character varying(500) NOT NULL,
                            ""Type"" character varying(50) NOT NULL,
                            ""Priority"" character varying(50) DEFAULT 'normal',
                            ""ActionUrl"" character varying(200),
                            ""ActionText"" character varying(100),
                            ""RelatedEntityId"" character varying(50),
                            ""RelatedEntityType"" character varying(50),
                            ""IsRead"" boolean NOT NULL DEFAULT false,
                            ""IsDeleted"" boolean NOT NULL DEFAULT false,
                            ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            ""ReadAt"" timestamp with time zone,
                            ""DeletedAt"" timestamp with time zone,
                            ""CreatedBy"" character varying(50),
                            ""Metadata"" character varying(1000),
                            CONSTRAINT ""PK_Notifications"" PRIMARY KEY (""Id"")
                        );";

                    await _context.Database.ExecuteSqlRawAsync(createTableSql);
                }

                // Insert a test notification
                var testNotificationSql = @"
                    INSERT INTO ""Notifications"" (""Id"", ""UserId"", ""Title"", ""Message"", ""Type"", ""Priority"", ""ActionUrl"", ""ActionText"", ""IsRead"", ""CreatedAt"", ""CreatedBy"")
                    VALUES (@id, @userId, @title, @message, @type, @priority, @actionUrl, @actionText, @isRead, @createdAt, @createdBy)
                    ON CONFLICT (""Id"") DO NOTHING;";

                var parameters = new[]
                {
                    new Npgsql.NpgsqlParameter("@id", "test-notif-" + DateTime.Now.Ticks),
                    new Npgsql.NpgsqlParameter("@userId", "customer@gmail.com"),
                    new Npgsql.NpgsqlParameter("@title", "Test Notification"),
                    new Npgsql.NpgsqlParameter("@message", "This is a test notification created at " + DateTime.Now.ToString("HH:mm:ss")),
                    new Npgsql.NpgsqlParameter("@type", "system"),
                    new Npgsql.NpgsqlParameter("@priority", "normal"),
                    new Npgsql.NpgsqlParameter("@actionUrl", "/notifications"),
                    new Npgsql.NpgsqlParameter("@actionText", "View Details"),
                    new Npgsql.NpgsqlParameter("@isRead", false),
                    new Npgsql.NpgsqlParameter("@createdAt", DateTime.UtcNow),
                    new Npgsql.NpgsqlParameter("@createdBy", "system")
                };

                await _context.Database.ExecuteSqlRawAsync(testNotificationSql, parameters);

                return Ok(new
                {
                    success = true,
                    message = "Test notification created successfully!",
                    tableExists = tableExists,
                    timestamp = DateTime.Now.ToString("HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating test notification", error = ex.Message });
            }
        }

        [HttpGet("create-notifications-table")]
        public async Task<IActionResult> CreateNotificationsTable()
        {
            try
            {
                var createTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""Notifications"" (
                        ""Id"" text NOT NULL DEFAULT gen_random_uuid()::text,
                        ""UserId"" character varying(50) NOT NULL,
                        ""Title"" character varying(100) NOT NULL,
                        ""Message"" character varying(500) NOT NULL,
                        ""Type"" character varying(50) NOT NULL,
                        ""Priority"" character varying(50) DEFAULT 'normal',
                        ""ActionUrl"" character varying(200),
                        ""ActionText"" character varying(100),
                        ""RelatedEntityId"" character varying(50),
                        ""RelatedEntityType"" character varying(50),
                        ""IsRead"" boolean NOT NULL DEFAULT false,
                        ""IsDeleted"" boolean NOT NULL DEFAULT false,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""ReadAt"" timestamp with time zone,
                        ""DeletedAt"" timestamp with time zone,
                        ""CreatedBy"" character varying(50),
                        ""Metadata"" character varying(1000),
                        CONSTRAINT ""PK_Notifications"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Insert some sample data
                var insertSampleSql = @"
                    INSERT INTO ""Notifications"" (""UserId"", ""Title"", ""Message"", ""Type"", ""Priority"", ""ActionUrl"", ""ActionText"", ""IsRead"", ""CreatedBy"") VALUES
                    ('customer@gmail.com', 'Welcome to HIV System', 'Welcome to our HIV healthcare management system. Your health is our priority.', 'system', 'normal', '/notifications', 'View Details', false, 'system'),
                    ('customer@gmail.com', 'Appointment Reminder', 'You have an appointment with Dr. Smith tomorrow at 10:00 AM.', 'appointment', 'high', '/appointment', 'View Appointment', false, 'system'),
                    ('customer@gmail.com', 'Test Results Available', 'Your latest CD4 count results are now available.', 'test_result', 'normal', '/app/test-results', 'View Results', true, 'system'),
                    ('doctor@gmail.com', 'New Patient Appointment', 'A new patient has booked an appointment with you.', 'appointment', 'normal', '/doctor/appointments', 'View Details', false, 'system'),
                    ('doctor@gmail.com', 'Patient ARV Adherence Alert', 'Patient compliance with ARV medication is below 80%.', 'arv', 'urgent', '/doctor/patients', 'Review Patient', false, 'system')
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertSampleSql);

                return Ok(new
                {
                    success = true,
                    message = "Notifications table created and sample data inserted successfully!",
                    timestamp = DateTime.Now.ToString("HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating notifications table", error = ex.Message });
            }
        }

        [HttpGet("create-arv-sample-data")]
        public async Task<IActionResult> CreateARVSampleData()
        {
            try
            {
                // Create ARV Drugs table if not exists
                var createDrugsTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVDrugs"" (
                        ""Id"" text NOT NULL DEFAULT gen_random_uuid()::text,
                        ""Name"" character varying(100) NOT NULL,
                        ""ActiveIngredient"" character varying(200) NOT NULL,
                        ""DrugClass"" character varying(50) NOT NULL,
                        ""SideEffects"" character varying(1000),
                        ""Contraindications"" character varying(1000),
                        ""IsActive"" boolean NOT NULL DEFAULT true,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_ARVDrugs"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createDrugsTableSql);

                // Create ARV Regimens table if not exists
                var createRegimensTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVRegimens"" (
                        ""Id"" text NOT NULL DEFAULT gen_random_uuid()::text,
                        ""Name"" character varying(100) NOT NULL,
                        ""Description"" character varying(500),
                        ""Category"" character varying(100),
                        ""LineOfTreatment"" character varying(50),
                        ""IsActive"" boolean NOT NULL DEFAULT true,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ""UpdatedAt"" timestamp with time zone,
                        CONSTRAINT ""PK_ARVRegimens"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createRegimensTableSql);

                // Create ARV Medications table if not exists
                var createMedicationsTableSql = @"
                    CREATE TABLE IF NOT EXISTS ""ARVMedications"" (
                        ""Id"" text NOT NULL DEFAULT gen_random_uuid()::text,
                        ""RegimenId"" text NOT NULL,
                        ""MedicationName"" character varying(100) NOT NULL,
                        ""ActiveIngredient"" character varying(200) NOT NULL,
                        ""Dosage"" character varying(50) NOT NULL,
                        ""Frequency"" character varying(50) NOT NULL,
                        ""Instructions"" character varying(500),
                        ""SideEffects"" character varying(1000),
                        ""SortOrder"" integer DEFAULT 0,
                        ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT ""PK_ARVMedications"" PRIMARY KEY (""Id"")
                    );";

                await _context.Database.ExecuteSqlRawAsync(createMedicationsTableSql);

                // Insert sample ARV drugs
                var insertDrugsSql = @"
                    INSERT INTO ""ARVDrugs"" (""Id"", ""Name"", ""GenericName"", ""DrugClass"", ""Dosage"", ""Form"", ""SideEffects"", ""Contraindications"") VALUES
                    ('drug-001', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', 'NRTI', '300mg', 'Viên nén', 'Buồn nôn, đau đầu, mệt mỏi, giảm mật độ xương', 'Suy thận nặng, bệnh gan nặng'),
                    ('drug-002', 'Emtricitabine', 'Emtricitabine', 'NRTI', '200mg', 'Viên nang', 'Đau đầu, tiêu chảy, buồn nôn, phát ban', 'Dị ứng với thành phần thuốc'),
                    ('drug-003', 'Efavirenz', 'Efavirenz', 'NNRTI', '600mg', 'Viên nén', 'Chóng mặt, mất ngủ, ác mông, trầm cảm', 'Thai kỳ, bệnh gan nặng'),
                    ('drug-004', 'Rilpivirine', 'Rilpivirine', 'NNRTI', '25mg', 'Viên nén', 'Đau đầu, mất ngủ, trầm cảm', 'Đang dùng thuốc ức chế acid'),
                    ('drug-005', 'Dolutegravir', 'Dolutegravir', 'INSTI', '50mg', 'Viên nén', 'Tăng cân, mất ngủ, đau đầu', 'Dị ứng với thành phần thuốc'),
                    ('drug-006', 'Raltegravir', 'Raltegravir', 'INSTI', '400mg', 'Viên nén', 'Buồn nôn, đau đầu, mệt mỏi', 'Dị ứng với thành phần thuốc'),
                    ('drug-007', 'Atazanavir', 'Atazanavir', 'PI', '300mg', 'Viên nang', 'Vàng da, sỏi thận, buồn nôn', 'Bệnh gan nặng, đang dùng thuốc ức chế acid'),
                    ('drug-008', 'Darunavir', 'Darunavir', 'PI', '800mg', 'Viên nén', 'Tiêu chảy, buồn nôn, đau đầu', 'Dị ứng sulfonamide'),
                    ('drug-009', 'Ritonavir', 'Ritonavir', 'PI', '100mg', 'Viên nén', 'Buồn nôn, tiêu chảy, vị kim loại', 'Bệnh gan nặng'),
                    ('drug-010', 'Lamivudine', 'Lamivudine', 'NRTI', '300mg', 'Viên nén', 'Đau đầu, mệt mỏi, buồn nôn', 'Dị ứng với thành phần thuốc')
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertDrugsSql);

                // Insert sample ARV regimens
                var insertRegimensSql = @"
                    INSERT INTO ""ARVRegimens"" (""Id"", ""Name"", ""Description"", ""Category"", ""LineOfTreatment"", ""IsActive"", ""CreatedAt"") VALUES
                    ('regimen-001', 'TDF/3TC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1', true, NOW()),
                    ('regimen-002', 'AZT/3TC/NVP', 'Phác đồ điều trị tuyến đầu với Zidovudine + Lamivudine + Nevirapine', 'Điều trị ban đầu', 'Tuyến 1', true, NOW()),
                    ('regimen-003', 'ABC/3TC/DTG', 'Phác đồ điều trị với Abacavir + Lamivudine + Dolutegravir', 'Điều trị thay thế', 'Tuyến 1', true, NOW()),
                    ('regimen-004', 'TAF/FTC/BIC', 'Phác đồ điều trị với Tenofovir Alafenamide + Emtricitabine + Bictegravir', 'Điều trị thay thế', 'Tuyến 1', true, NOW())
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertRegimensSql);

                // Insert sample ARV medications (linking regimens to drugs)
                var insertMedicationsSql = @"
                    INSERT INTO ""ARVMedications"" (""Id"", ""RegimenId"", ""MedicationName"", ""ActiveIngredient"", ""Dosage"", ""Frequency"", ""Instructions"", ""SideEffects"", ""SortOrder"") VALUES
                    ('med-001', 'regimen-001', 'Tenofovir/Lamivudine', 'Tenofovir DF 300mg + Lamivudine 300mg', '1 viên', '1 lần/ngày', 'Uống cùng hoặc không cùng thức ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1),
                    ('med-002', 'regimen-001', 'Efavirenz', 'Efavirenz 600mg', '1 viên', '1 lần/ngày', 'Uống trước khi ngủ, tránh thức ăn', 'Chóng mặt, mơ mộng bất thường', 2),
                    ('med-003', 'regimen-002', 'Zidovudine/Lamivudine', 'Zidovudine 300mg + Lamivudine 150mg', '1 viên', '2 lần/ngày', 'Uống cùng thức ăn', 'Thiếu máu, buồn nôn', 1),
                    ('med-004', 'regimen-002', 'Nevirapine', 'Nevirapine 200mg', '1 viên', '2 lần/ngày', 'Uống cùng hoặc không cùng thức ăn', 'Phát ban, tăng men gan', 2),
                    ('med-005', 'regimen-003', 'Abacavir/Lamivudine', 'Abacavir 600mg + Lamivudine 300mg', '1 viên', '1 lần/ngày', 'Uống cùng hoặc không cùng thức ăn', 'Phản ứng dị ứng, buồn nôn', 1),
                    ('med-006', 'regimen-003', 'Dolutegravir', 'Dolutegravir 50mg', '1 viên', '1 lần/ngày', 'Uống cùng hoặc không cùng thức ăn', 'Đau đầu, buồn nôn nhẹ', 2),
                    ('med-007', 'regimen-004', 'TAF/FTC', 'Tenofovir Alafenamide 25mg + Emtricitabine 200mg', '1 viên', '1 lần/ngày', 'Uống cùng thức ăn', 'Buồn nôn, đau đầu', 1),
                    ('med-008', 'regimen-004', 'Bictegravir', 'Bictegravir 50mg', '1 viên', '1 lần/ngày', 'Uống cùng hoặc không cùng thức ăn', 'Đau đầu, tiêu chảy', 2)
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertMedicationsSql);

                return Ok(new
                {
                    success = true,
                    message = "Complete ARV sample data created successfully!",
                    data = new
                    {
                        drugs = 10,
                        regimens = 4,
                        medications = 8
                    },
                    timestamp = DateTime.Now.ToString("HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARV sample data", error = ex.Message });
            }
        }

        [HttpPost("test-arv-workflow")]
        public async Task<IActionResult> TestARVWorkflow()
        {
            try
            {
                var testResults = new List<object>();

                // 1. Test getting regimens
                var regimens = await _context.ARVRegimens.Take(2).ToListAsync();
                testResults.Add(new { step = "1. Get Regimens", success = regimens.Any(), count = regimens.Count });

                // 2. Test getting drugs
                var drugs = await _context.ARVDrugs.Take(3).ToListAsync();
                testResults.Add(new { step = "2. Get Drugs", success = drugs.Any(), count = drugs.Count });

                // 3. Test creating patient regimen (mock prescription)
                var testPatientId = "customer-001";
                var testRegimenId = regimens.FirstOrDefault()?.Id ?? "regimen-1";

                // Convert string to int for RegimenId comparison
                if (!int.TryParse(testRegimenId, out int regimenIdInt))
                {
                    regimenIdInt = 1; // Default regimen ID
                }

                var existingPrescription = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.PatientId == testPatientId && pr.RegimenId == regimenIdInt);

                if (existingPrescription == null)
                {
                    var newPrescription = new PatientRegimen
                    {
                        PatientId = testPatientId,
                        RegimenId = regimenIdInt,
                        PrescribedBy = "doctor@gmail.com",
                        PrescribedDate = DateTime.UtcNow,
                        StartDate = DateTime.Today,
                        Status = "Active",
                        Notes = "Test prescription for ARV workflow",
                        DiscontinuationReason = "",
                        ReviewedBy = "doctor@gmail.com",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.PatientRegimens.Add(newPrescription);
                    await _context.SaveChangesAsync();
                    testResults.Add(new { step = "3. Create Patient Prescription", success = true, prescriptionId = newPrescription.Id });
                }
                else
                {
                    testResults.Add(new { step = "3. Patient Prescription", success = true, status = "already_exists", prescriptionId = existingPrescription.Id });
                }

                // 4. Test getting patient's current regimen
                var patientRegimens = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == testPatientId && pr.Status == "Đang điều trị")
                    // Regimen navigation removed due to schema mismatch
                    .ToListAsync();

                testResults.Add(new { step = "4. Get Patient Regimens", success = patientRegimens.Any(), count = patientRegimens.Count });

                // 5. Test getting regimen medications
                var regimenMedications = await _context.ARVMedications
                    .Where(m => m.RegimenId == testRegimenId)
                    .OrderBy(m => m.SortOrder)
                    .ToListAsync();

                testResults.Add(new { step = "5. Get Regimen Medications", success = regimenMedications.Any(), count = regimenMedications.Count });

                // 6. Test creating test results
                var testResult = new TestResult
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = testPatientId,
                    TestType = "CD4",
                    Result = "450 cells/μL",
                    ReferenceRange = "500-1200 cells/μL",
                    Status = "completed",
                    TestDate = DateTime.Today.AddDays(-7),
                    CreatedAt = DateTime.UtcNow,
                    Notes = "Test result for ARV workflow"
                };

                var existingTestResult = await _context.TestResults
                    .FirstOrDefaultAsync(tr => tr.PatientId == testPatientId && tr.TestType == "CD4" && tr.TestDate.Date == testResult.TestDate.Date);

                if (existingTestResult == null)
                {
                    _context.TestResults.Add(testResult);
                    await _context.SaveChangesAsync();
                    testResults.Add(new { step = "6. Create Test Result", success = true, testResultId = testResult.Id });
                }
                else
                {
                    testResults.Add(new { step = "6. Test Result", success = true, status = "already_exists", testResultId = existingTestResult.Id });
                }

                return Ok(new
                {
                    success = true,
                    message = "ARV workflow test completed successfully!",
                    testResults = testResults,
                    summary = new
                    {
                        totalSteps = testResults.Count,
                        successfulSteps = testResults.Count(r => r.GetType().GetProperty("success")?.GetValue(r)?.ToString() == "True"),
                        testPatient = testPatientId,
                        testRegimen = regimens.FirstOrDefault()?.Name,
                        timestamp = DateTime.Now.ToString("HH:mm:ss")
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error testing ARV workflow", error = ex.Message });
            }
        }

        [HttpGet("create-arv-regimens")]
        public async Task<IActionResult> CreateARVRegimens()
        {
            try
            {
                // Insert sample ARV regimens
                var insertRegimensSql = @"
                    INSERT INTO ""ARVRegimens"" (""Id"", ""Name"", ""Description"", ""Category"", ""LineOfTreatment"") VALUES
                    ('regimen-001', 'TDF/FTC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Emtricitabine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1'),
                    ('regimen-002', 'TDF/FTC/RPV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Emtricitabine + Rilpivirine', 'Điều trị ban đầu', 'Tuyến 1'),
                    ('regimen-003', 'TDF/FTC/DTG', 'Phác đồ điều trị tuyến đầu với Tenofovir + Emtricitabine + Dolutegravir', 'Điều trị ban đầu', 'Tuyến 1'),
                    ('regimen-004', 'TDF/3TC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1'),
                    ('regimen-005', 'ATV/r + TDF/FTC', 'Phác đồ điều trị tuyến hai với Atazanavir/ritonavir + Tenofovir/Emtricitabine', 'Điều trị tuyến hai', 'Tuyến 2'),
                    ('regimen-006', 'DRV/r + TDF/FTC', 'Phác đồ điều trị tuyến hai với Darunavir/ritonavir + Tenofovir/Emtricitabine', 'Điều trị tuyến hai', 'Tuyến 2'),
                    ('regimen-007', 'RAL + TDF/FTC', 'Phác đồ điều trị với Raltegravir + Tenofovir/Emtricitabine', 'Điều trị thay thế', 'Tuyến 1'),
                    ('regimen-008', 'DTG + TDF/3TC', 'Phác đồ điều trị với Dolutegravir + Tenofovir/Lamivudine', 'Điều trị thay thế', 'Tuyến 1')
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertRegimensSql);

                // Insert medications for each regimen
                var insertMedicationsSql = @"
                    INSERT INTO ""ARVMedications"" (""Id"", ""RegimenId"", ""MedicationName"", ""ActiveIngredient"", ""Dosage"", ""Frequency"", ""Instructions"", ""SideEffects"", ""SortOrder"") VALUES
                    -- TDF/FTC/EFV regimen
                    ('med-001-1', 'regimen-001', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống sau bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1),
                    ('med-001-2', 'regimen-001', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Uống cùng với Tenofovir', 'Đau đầu, tiêu chảy, buồn nôn', 2),
                    ('med-001-3', 'regimen-001', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ', 'Chóng mặt, mất ngủ, ác mông', 3),

                    -- TDF/FTC/RPV regimen
                    ('med-002-1', 'regimen-002', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống sau bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1),
                    ('med-002-2', 'regimen-002', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Uống cùng với Tenofovir', 'Đau đầu, tiêu chảy, buồn nôn', 2),
                    ('med-002-3', 'regimen-002', 'Rilpivirine', 'Rilpivirine', '25mg', '1 lần/ngày', 'Uống sau bữa ăn', 'Đau đầu, mất ngủ, trầm cảm', 3),

                    -- TDF/FTC/DTG regimen
                    ('med-003-1', 'regimen-003', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống sau bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1),
                    ('med-003-2', 'regimen-003', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Uống cùng với Tenofovir', 'Đau đầu, tiêu chảy, buồn nôn', 2),
                    ('med-003-3', 'regimen-003', 'Dolutegravir', 'Dolutegravir', '50mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Tăng cân, mất ngủ, đau đầu', 3),

                    -- TDF/3TC/EFV regimen
                    ('med-004-1', 'regimen-004', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống sau bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1),
                    ('med-004-2', 'regimen-004', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Uống cùng với Tenofovir', 'Đau đầu, mệt mỏi, buồn nôn', 2),
                    ('med-004-3', 'regimen-004', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ', 'Chóng mặt, mất ngủ, ác mông', 3)
                    ON CONFLICT (""Id"") DO NOTHING;";

                await _context.Database.ExecuteSqlRawAsync(insertMedicationsSql);

                return Ok(new
                {
                    success = true,
                    message = "ARV regimens and medications created successfully!",
                    timestamp = DateTime.Now.ToString("HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating ARV regimens", error = ex.Message });
            }
        }

        // GET: api/Debug/reset-arv-tables
        [HttpGet("reset-arv-tables")]
        public async Task<IActionResult> ResetARVTables()
        {
            try
            {
                // Drop existing tables
                await _context.Database.ExecuteSqlRawAsync(@"DROP TABLE IF EXISTS ""ARVMedications"" CASCADE;");
                await _context.Database.ExecuteSqlRawAsync(@"DROP TABLE IF EXISTS ""ARVRegimens"" CASCADE;");
                await _context.Database.ExecuteSqlRawAsync(@"DROP TABLE IF EXISTS ""ARVDrugs"" CASCADE;");

                // Recreate tables with correct schema
                await CreateARVSampleData();

                return Ok(new { success = true, message = "ARV tables reset successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error resetting ARV tables", error = ex.Message });
            }
        }
    }
}