using Microsoft.AspNetCore.Mvc;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DatabaseController> _logger;

        public DatabaseController(ApplicationDbContext context, ILogger<DatabaseController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("initialize")]
        public async Task<ActionResult> InitializeDatabase()
        {
            try
            {
                var results = new List<string>();

                // Kiểm tra và tạo bảng Facilities
                var facilitiesExists = await CheckTableExists("Facilities");
                if (!facilitiesExists)
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        CREATE TABLE [Facilities] (
                            [FacilityID] int NOT NULL IDENTITY(1,1),
                            [FacilityName] nvarchar(100) NOT NULL,
                            [Address] nvarchar(255) NULL,
                            [City] nvarchar(50) NULL,
                            [State] nvarchar(50) NULL,
                            [ZipCode] nvarchar(20) NULL,
                            [PhoneNumber] nvarchar(15) NULL,
                            [Email] nvarchar(100) NULL,
                            [Website] nvarchar(255) NULL,
                            [OpeningHours] nvarchar(255) NULL,
                            [Description] ntext NULL,
                            [IsActive] bit NOT NULL DEFAULT 1,
                            CONSTRAINT [PK_Facilities] PRIMARY KEY ([FacilityID])
                        );
                    ");
                    results.Add("✅ Đã tạo bảng Facilities");
                }
                else
                {
                    results.Add("ℹ️ Bảng Facilities đã tồn tại");
                }

                // Kiểm tra và thêm các cột thiếu vào bảng Appointments
                var appointmentColumns = await GetTableColumns("Appointments");
                
                if (!appointmentColumns.Contains("FacilityID"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [FacilityID] int NULL"
                    );
                    results.Add("✅ Đã thêm cột FacilityID vào Appointments");
                }

                if (!appointmentColumns.Contains("EndTime"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [EndTime] time NULL"
                    );
                    results.Add("✅ Đã thêm cột EndTime vào Appointments");
                }

                if (!appointmentColumns.Contains("AppointmentType"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [AppointmentType] nvarchar(50) NULL"
                    );
                    results.Add("✅ Đã thêm cột AppointmentType vào Appointments");
                }

                if (!appointmentColumns.Contains("Purpose"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [Purpose] nvarchar(255) NULL"
                    );
                    results.Add("✅ Đã thêm cột Purpose vào Appointments");
                }

                if (!appointmentColumns.Contains("ReminderSent"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [ReminderSent] bit NOT NULL DEFAULT 0"
                    );
                    results.Add("✅ Đã thêm cột ReminderSent vào Appointments");
                }

                if (!appointmentColumns.Contains("CreatedBy"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [CreatedBy] int NULL"
                    );
                    results.Add("✅ Đã thêm cột CreatedBy vào Appointments");
                }

                if (!appointmentColumns.Contains("ConsultationFee"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [ConsultationFee] decimal(10,2) NULL"
                    );
                    results.Add("✅ Đã thêm cột ConsultationFee vào Appointments");
                }

                if (!appointmentColumns.Contains("PatientName"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [PatientName] nvarchar(255) NULL"
                    );
                    results.Add("✅ Đã thêm cột PatientName vào Appointments");
                }

                if (!appointmentColumns.Contains("PatientPhone"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [PatientPhone] nvarchar(20) NULL"
                    );
                    results.Add("✅ Đã thêm cột PatientPhone vào Appointments");
                }

                if (!appointmentColumns.Contains("PatientEmail"))
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [Appointments] ADD [PatientEmail] nvarchar(255) NULL"
                    );
                    results.Add("✅ Đã thêm cột PatientEmail vào Appointments");
                }

                // Tạo cơ sở y tế mặc định nếu chưa có
                var facilityCount = 0;
                try
                {
                    facilityCount = await _context.Facilities.CountAsync();
                }
                catch
                {
                    // Nếu không thể đếm, có thể bảng chưa được nhận diện bởi EF
                    facilityCount = 0;
                }

                if (facilityCount == 0)
                {
                    // Thêm facility trực tiếp bằng SQL để tránh lỗi EF
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT INTO [Facilities] ([FacilityName], [Address], [City], [PhoneNumber], [Email], [OpeningHours], [Description], [IsActive])
                        VALUES (N'Trung tâm Điều trị HIV/AIDS', N'123 Đường ABC, Quận 1', N'TP. Hồ Chí Minh', '028-1234-5678', 'info@hivcenter.vn', N'8:00 - 17:30 (Thứ 2 - Thứ 6)', N'Trung tâm chuyên khoa điều trị HIV/AIDS', 1)
                    ");
                    results.Add("✅ Đã tạo cơ sở y tế mặc định");
                }

                // Thêm ràng buộc khóa ngoại nếu chưa có
                try
                {
                    var constraintExists = await _context.Database.SqlQueryRaw<int>(
                        "SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_Appointments_Facilities_FacilityID'"
                    ).FirstOrDefaultAsync();

                    if (constraintExists == 0)
                    {
                        await _context.Database.ExecuteSqlRawAsync(@"
                            ALTER TABLE [Appointments] 
                            ADD CONSTRAINT [FK_Appointments_Facilities_FacilityID] 
                            FOREIGN KEY ([FacilityID]) REFERENCES [Facilities] ([FacilityID]) ON DELETE SET NULL
                        ");
                        results.Add("✅ Đã thêm ràng buộc khóa ngoại");
                    }
                }
                catch (Exception ex)
                {
                    results.Add($"⚠️ Không thể thêm ràng buộc khóa ngoại: {ex.Message}");
                }

                return Ok(new { 
                    success = true, 
                    message = "Khởi tạo database thành công!",
                    results = results,
                    facilitiesCount = await GetFacilitiesCount()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi khởi tạo database");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi khởi tạo database: " + ex.Message 
                });
            }
        }

        [HttpGet("check-schema")]
        public async Task<ActionResult> CheckSchema()
        {
            try
            {
                var appointmentColumns = await GetTableColumns("Appointments");
                var facilityColumns = await GetTableColumns("Facilities");
                var facilitiesCount = await GetFacilitiesCount();

                var missingColumns = new List<string>();
                var requiredColumns = new[] { "FacilityID", "EndTime", "AppointmentType", "Purpose", "ReminderSent", "CreatedBy", "ConsultationFee", "PatientName", "PatientPhone", "PatientEmail" };
                
                foreach (var column in requiredColumns)
                {
                    if (!appointmentColumns.Contains(column))
                    {
                        missingColumns.Add(column);
                    }
                }

                return Ok(new {
                    appointmentColumns = appointmentColumns,
                    facilityColumns = facilityColumns,
                    facilitiesCount = facilitiesCount,
                    missingColumns = missingColumns,
                    isSchemaComplete = missingColumns.Count == 0 && facilityColumns.Count > 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi kiểm tra schema");
                return StatusCode(500, new { message = "Lỗi khi kiểm tra schema: " + ex.Message });
            }
        }

        [HttpPost("fix-appointment-error")]
        public async Task<ActionResult> FixAppointmentError()
        {
            try
            {
                var fixes = new List<string>();

                // Kiểm tra và sửa lỗi Status column
                try
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        UPDATE [Appointments] 
                        SET [Status] = 'Scheduled' 
                        WHERE [Status] IS NULL OR [Status] = ''
                    ");
                    fixes.Add("✅ Đã cập nhật giá trị Status");
                }
                catch (Exception ex)
                {
                    fixes.Add($"⚠️ Lỗi cập nhật Status: {ex.Message}");
                }

                // Đảm bảo có ít nhất 1 facility
                var facilityCount = await GetFacilitiesCount();
                if (facilityCount == 0)
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT INTO [Facilities] ([FacilityName], [Address], [City], [PhoneNumber], [Email], [OpeningHours], [Description], [IsActive])
                        VALUES (N'Trung tâm Điều trị HIV/AIDS', N'123 Đường ABC, Quận 1', N'TP. Hồ Chí Minh', '028-1234-5678', 'info@hivcenter.vn', N'8:00 - 17:30 (Thứ 2 - Thứ 6)', N'Trung tâm chuyên khoa điều trị HIV/AIDS', 1)
                    ");
                    fixes.Add("✅ Đã tạo facility mặc định");
                }

                return Ok(new {
                    success = true,
                    message = "Đã khắc phục lỗi appointment",
                    fixes = fixes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi khắc phục appointment error");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi khắc phục: " + ex.Message 
                });
            }
        }

        [HttpPost("execute-sql-fix")]
        public async Task<ActionResult> ExecuteSqlFix()
        {
            try
            {
                var fixes = new List<string>();

                // Đọc và thực thi script SQL
                var sqlScript = @"
                    -- Thêm các cột còn thiếu vào bảng Appointments
                    
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'ConsultationFee')
                    BEGIN
                        ALTER TABLE [Appointments] ADD [ConsultationFee] decimal(10,2) NULL;
                    END
                    
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientName')
                    BEGIN
                        ALTER TABLE [Appointments] ADD [PatientName] nvarchar(255) NULL;
                    END
                    
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientPhone')
                    BEGIN
                        ALTER TABLE [Appointments] ADD [PatientPhone] nvarchar(20) NULL;
                    END
                    
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientEmail')
                    BEGIN
                        ALTER TABLE [Appointments] ADD [PatientEmail] nvarchar(255) NULL;
                    END
                ";

                await _context.Database.ExecuteSqlRawAsync(sqlScript);
                fixes.Add("✅ Đã thêm các cột còn thiếu vào bảng Appointments");

                return Ok(new {
                    success = true,
                    message = "Đã thực thi SQL fix thành công",
                    fixes = fixes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thực thi SQL fix");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi thực thi SQL: " + ex.Message 
                });
            }
        }

        [HttpPost("fix-foreign-key")]
        public async Task<ActionResult> FixForeignKey()
        {
            try
            {
                var fixes = new List<string>();

                // Xóa Foreign Key constraint có vấn đề với bảng Patients
                try
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        -- Tìm và xóa Foreign Key constraint đến bảng Patients
                        DECLARE @ConstraintName NVARCHAR(200)
                        SELECT @ConstraintName = name 
                        FROM sys.foreign_keys 
                        WHERE parent_object_id = OBJECT_ID('Appointments') 
                        AND referenced_object_id = OBJECT_ID('Patients')
                        
                        IF @ConstraintName IS NOT NULL
                        BEGIN
                            DECLARE @SQL NVARCHAR(MAX) = 'ALTER TABLE [Appointments] DROP CONSTRAINT [' + @ConstraintName + ']'
                            EXEC sp_executesql @SQL
                        END
                    ");
                    fixes.Add("✅ Đã xóa Foreign Key constraint đến bảng Patients");
                }
                catch (Exception ex)
                {
                    fixes.Add($"⚠️ Lỗi xóa Foreign Key: {ex.Message}");
                }

                // Set tất cả PatientID hiện tại thành NULL
                try
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        UPDATE [Appointments] SET [PatientID] = NULL WHERE [PatientID] IS NOT NULL
                    ");
                    fixes.Add("✅ Đã set tất cả PatientID thành NULL");
                }
                catch (Exception ex)
                {
                    fixes.Add($"⚠️ Lỗi update PatientID: {ex.Message}");
                }

                return Ok(new {
                    success = true,
                    message = "Đã khắc phục Foreign Key constraint",
                    fixes = fixes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi khắc phục Foreign Key");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi khắc phục Foreign Key: " + ex.Message 
                });
            }
        }

        [HttpGet("test-profile")]
        public async Task<ActionResult> TestProfile()
        {
            try
            {
                var result = new
                {
                    sessionData = new
                    {
                        hasUserId = HttpContext.Session.Keys.Contains("UserId"),
                        hasUsername = HttpContext.Session.Keys.Contains("Username"),
                        hasFullName = HttpContext.Session.Keys.Contains("FullName"),
                        userId = HttpContext.Session.GetString("UserId"),
                        username = HttpContext.Session.GetString("Username"),
                        fullName = HttpContext.Session.GetString("FullName")
                    },
                    appointmentCounts = new
                    {
                        totalAppointments = await _context.Appointments.CountAsync(),
                        recentAppointments = await _context.Appointments
                            .OrderByDescending(a => a.CreatedDate)
                            .Take(5)
                            .Select(a => new
                            {
                                a.AppointmentID,
                                a.PatientName,
                                a.CreatedBy,
                                a.PatientID,
                                a.CreatedDate
                            })
                            .ToListAsync()
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi test profile");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi test profile: " + ex.Message 
                });
            }
        }

        [HttpPost("update-profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var username = HttpContext.Session.GetString("Username");
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized(new { success = false, message = "Vui lòng đăng nhập" });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy người dùng" });
                }

                // Update user information
                user.FullName = request.FullName ?? user.FullName;
                user.PhoneNumber = request.PhoneNumber;
                user.DateOfBirth = request.DateOfBirth;
                user.Gender = request.Gender;
                user.Address = request.Address;
                user.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                // Update session
                HttpContext.Session.SetString("FullName", user.FullName);

                return Ok(new {
                    success = true,
                    message = "Cập nhật thông tin thành công!",
                    user = new
                    {
                        user.UserID,
                        user.Username,
                        user.FullName,
                        user.Email,
                        user.PhoneNumber,
                        user.DateOfBirth,
                        user.Gender,
                        user.Address
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật profile");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi khi cập nhật: " + ex.Message 
                });
            }
        }

        [HttpGet("auth-status")]
        public async Task<ActionResult> GetAuthStatus()
        {
            try
            {
                var username = HttpContext.Session.GetString("Username");
                var userId = HttpContext.Session.GetString("UserId");
                var fullName = HttpContext.Session.GetString("FullName");

                if (string.IsNullOrEmpty(username))
                {
                    return Ok(new { 
                        isAuthenticated = false 
                    });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user == null)
                {
                    HttpContext.Session.Clear();
                    return Ok(new { 
                        isAuthenticated = false 
                    });
                }

                return Ok(new {
                    isAuthenticated = true,
                    user = new
                    {
                        user.UserID,
                        user.Username,
                        user.FullName,
                        user.Email,
                        user.PhoneNumber,
                        user.DateOfBirth,
                        user.Gender,
                        user.Address
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi kiểm tra auth status");
                return StatusCode(500, new { 
                    isAuthenticated = false,
                    message = "Lỗi server: " + ex.Message 
                });
            }
        }

        // Helper methods
        private async Task<bool> CheckTableExists(string tableName)
        {
            try
            {
                var count = await _context.Database.SqlQueryRaw<int>(
                    $"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{tableName}'"
                ).FirstOrDefaultAsync();
                return count > 0;
            }
            catch
            {
                return false;
            }
        }

        private async Task<List<string>> GetTableColumns(string tableName)
        {
            try
            {
                return await _context.Database.SqlQueryRaw<string>(
                    $"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{tableName}'"
                ).ToListAsync();
            }
            catch
            {
                return new List<string>();
            }
        }

        private async Task<int> GetFacilitiesCount()
        {
            try
            {
                // Use direct SQL to avoid EF Core SqlQueryRaw issues
                var countParameter = new SqlParameter("@count", System.Data.SqlDbType.Int)
                {
                    Direction = System.Data.ParameterDirection.Output
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "DECLARE @tempCount INT; SELECT @tempCount = COUNT(*) FROM [Facilities]; SET @count = @tempCount;",
                    countParameter
                );

                return (int)countParameter.Value;
            }
            catch
            {
                // Fallback: try to use EF context directly
                try
                {
                    return await _context.Facilities.CountAsync();
                }
                catch
                {
                    return 0;
                }
            }
        }
    }
}

public class UpdateProfileRequest
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
} 