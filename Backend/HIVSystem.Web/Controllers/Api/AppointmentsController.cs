using Microsoft.AspNetCore.Mvc;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(ApplicationDbContext context, ILogger<AppointmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get available time slots for a specific date (improved version)
        /// </summary>
        [HttpGet("timeslots")]
        public async Task<ActionResult> GetAvailableTimeSlots([FromQuery] string? date = null)
        {
            try
            {
                DateTime targetDate;
                if (string.IsNullOrEmpty(date) || !DateTime.TryParse(date, out targetDate))
                {
                    targetDate = DateTime.Today;
                }

                // Check if the date is in the past
                if (targetDate.Date < DateTime.Today)
                {
                    return Ok(new { timeSlots = new object[0], message = "Không thể đặt lịch cho ngày trong quá khứ" });
                }

                // Check if it's weekend (Saturday = 6, Sunday = 0)
                var dayOfWeek = (int)targetDate.DayOfWeek;
                if (dayOfWeek == 0 || dayOfWeek == 6) // Sunday or Saturday
                {
                    return Ok(new { timeSlots = new object[0], message = "Phòng khám không làm việc vào cuối tuần" });
                }

                // Generate time slots for weekdays only
                var morningSlots = new[] { "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30" };
                var afternoonSlots = new[] { "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30" };

                var timeSlots = new
                {
                    morning = morningSlots.Select(time => new
                    {
                        time = time,
                        isAvailable = true,
                        period = "morning"
                    }).ToList(),
                    afternoon = afternoonSlots.Select(time => new
                    {
                        time = time,
                        isAvailable = true,
                        period = "afternoon"
                    }).ToList()
                };

                _logger.LogInformation($"Generated time slots for {targetDate:yyyy-MM-dd}");
                return Ok(new { 
                    timeSlots = timeSlots,
                    date = targetDate.ToString("yyyy-MM-dd"),
                    dayOfWeek = targetDate.ToString("dddd", new System.Globalization.CultureInfo("vi-VN"))
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available time slots");
                return StatusCode(500, new { message = "Lỗi khi tải lịch trống: " + ex.Message });
            }
        }

        /// <summary>
        /// Get available doctors for a specific date and time
        /// </summary>
        [HttpGet("doctors/available")]
        public async Task<ActionResult> GetAvailableDoctors([FromQuery] string? date = null, [FromQuery] string? time = null, [FromQuery] string? specialty = null)
        {
            try
            {
                // Parse date and time for availability checking
                DateTime? appointmentDate = null;
                TimeSpan? appointmentTime = null;

                if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out DateTime parsedDate))
                {
                    appointmentDate = parsedDate;
                }

                if (!string.IsNullOrEmpty(time) && TimeSpan.TryParse(time, out TimeSpan parsedTime))
                {
                    appointmentTime = parsedTime;
                }

                // Get all doctors from Doctors table with their User information
                var doctorsQuery = _context.Doctors
                    .Include(d => d.User)
                    .Where(d => d.IsAvailable && d.User.IsActive);

                if (!string.IsNullOrEmpty(specialty))
                {
                    doctorsQuery = doctorsQuery.Where(d => d.Specialty.ToLower().Contains(specialty.ToLower()) || d.User.FullName.ToLower().Contains(specialty.ToLower()));
                }

                var allDoctors = await doctorsQuery.ToListAsync();

                var availableDoctors = new List<object>();

                foreach (var doctorInfo in allDoctors)
                {
                    var doctor = doctorInfo.User; // Get the associated User
                    bool isAvailable = true;
                    string availabilityReason = "";

                    // If specific date and time are provided, check availability
                    if (appointmentDate.HasValue && appointmentTime.HasValue)
                    {
                        // Check if doctor already has an appointment at this exact time
                        var existingAppointment = await _context.Appointments
                            .Where(a => a.DoctorID == doctorInfo.DoctorID 
                                    && a.AppointmentDate.Date == appointmentDate.Value.Date
                                    && a.AppointmentTime == appointmentTime.Value
                                    && a.Status != "Cancelled")
                            .FirstOrDefaultAsync();

                        if (existingAppointment != null)
                        {
                            isAvailable = false;
                            availabilityReason = "Đã có lịch khám";
                        }

                        // Check if the appointment time conflicts with any existing appointments (30-minute buffer)
                        if (isAvailable)
                        {
                            var conflictingAppointments = await _context.Appointments
                                .Where(a => a.DoctorID == doctorInfo.DoctorID 
                                        && a.AppointmentDate.Date == appointmentDate.Value.Date
                                        && a.Status != "Cancelled")
                                .ToListAsync();

                            foreach (var appointment in conflictingAppointments)
                            {
                                var existingStart = appointment.AppointmentTime;
                                var existingEnd = appointment.EndTime ?? appointment.AppointmentTime.Add(TimeSpan.FromMinutes(30));
                                var newStart = appointmentTime.Value;
                                var newEnd = appointmentTime.Value.Add(TimeSpan.FromMinutes(30));

                                // Check for time overlap
                                if ((newStart < existingEnd && newEnd > existingStart))
                                {
                                    isAvailable = false;
                                    availabilityReason = "Trùng giờ với lịch khám khác";
                                    break;
                                }
                            }
                        }

                        // Check doctor's working hours and schedule
                        if (isAvailable)
                        {
                            var dayOfWeek = (int)appointmentDate.Value.DayOfWeek;
                            
                            // Check if it's weekend
                            if (dayOfWeek == 0 || dayOfWeek == 6)
                            {
                                isAvailable = false;
                                availabilityReason = "Không làm việc cuối tuần";
                            }
                            
                            // Check working hours (8:00-11:30 and 14:00-17:30)
                            else if (!IsWithinWorkingHours(appointmentTime.Value))
                            {
                                isAvailable = false;
                                availabilityReason = "Ngoài giờ làm việc";
                            }
                        }
                    }

                    // Only include available doctors (unless no date/time specified, then show all)
                    if (isAvailable || (!appointmentDate.HasValue || !appointmentTime.HasValue))
                    {
                        var doctorResponse = new
                        {
                            doctorID = doctorInfo.DoctorID, // Use the actual DoctorID from Doctors table
                            userID = doctor.UserID,
                            fullName = doctor.FullName,
                            specialty = doctorInfo.Specialty ?? ExtractSpecialty(doctor.FullName),
                            qualification = doctorInfo.Qualification ?? "MD",
                            biography = doctorInfo.Biography ?? $"Bác sĩ chuyên khoa {doctorInfo.Specialty ?? ExtractSpecialty(doctor.FullName)} với nhiều năm kinh nghiệm trong điều trị HIV/AIDS",
                            yearsOfExperience = doctorInfo.YearsOfExperience ?? GetRandomExperience(),
                            isAvailable = isAvailable,
                            availabilityReason = availabilityReason,
                            consultationFee = doctorInfo.ConsultationFee ?? GetConsultationFee(doctor.FullName),
                            verificationStatus = doctorInfo.VerificationStatus ?? "Verified",
                            profileImage = doctor.ProfileImage ?? "/images/default-doctor.png",
                            email = doctor.Email,
                            phoneNumber = doctor.PhoneNumber,
                            rating = GetRandomRating(),
                            reviewCount = GetRandomReviewCount(),
                            nextAvailableSlot = time ?? "08:00",
                            availableToday = isAvailable
                        };

                        availableDoctors.Add(doctorResponse);
                    }
                }

                _logger.LogInformation($"Found {availableDoctors.Count} available doctors for {date} at {time} (from {allDoctors.Count} total doctors)");
                
                return Ok(new { 
                    doctors = availableDoctors,
                    totalCount = availableDoctors.Count,
                    totalDoctors = allDoctors.Count,
                    searchCriteria = new { date, time, specialty },
                    message = availableDoctors.Count == 0 ? "Không có bác sĩ nào khả dụng trong thời gian này" : $"Có {availableDoctors.Count} bác sĩ khả dụng"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available doctors");
                return StatusCode(500, new { message = "Lỗi khi tải danh sách bác sĩ: " + ex.Message });
            }
        }

        /// <summary>
        /// Check if the time is within working hours
        /// </summary>
        private bool IsWithinWorkingHours(TimeSpan time)
        {
            var workingHours = new[]
            {
                "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
            };

            return workingHours.Any(wh => TimeSpan.Parse(wh) == time);
        }

        /// <summary>
        /// Get doctor availability for a specific date (legacy support)
        /// </summary>
        [HttpGet("doctors/{doctorId}/availability")]
        public async Task<ActionResult> GetDoctorAvailability(int doctorId, [FromQuery] string? date = null)
        {
            try
            {
                DateTime targetDate;
                if (string.IsNullOrEmpty(date) || !DateTime.TryParse(date, out targetDate))
                {
                    targetDate = DateTime.Today;
                }

                // Check if doctor exists
                var doctor = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserID == doctorId && u.IsActive && (u.RoleID == 2 || u.Username.StartsWith("dr.")));

                if (doctor == null)
                {
                    return NotFound(new { message = "Không tìm thấy bác sĩ." });
                }

                // Check if the date is in the past
                if (targetDate.Date < DateTime.Today)
                {
                    return Ok(new { timeSlots = new object[0], message = "Không có lịch trống cho ngày trong quá khứ" });
                }

                // Check if it's weekend
                var dayOfWeek = (int)targetDate.DayOfWeek;
                if (dayOfWeek == 0 || dayOfWeek == 6)
                {
                    return Ok(new { timeSlots = new object[0], message = "Bác sĩ không làm việc vào cuối tuần" });
                }

                // Generate time slots for weekdays only
                var timeSlots = new[]
                {
                    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
                    "16:00", "16:30", "17:00", "17:30"
                }.Select(time => new
                {
                    time = time,
                    isAvailable = true,
                    period = time.CompareTo("12:00") < 0 ? "morning" : "afternoon"
                }).ToList();

                _logger.LogInformation($"Generated {timeSlots.Count} time slots for doctor {doctorId} on {targetDate:yyyy-MM-dd}");
                return Ok(new { 
                    timeSlots,
                    doctor = new { doctor.UserID, doctor.FullName },
                    date = targetDate.ToString("yyyy-MM-dd")
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctor availability for doctor {DoctorId}", doctorId);
                return StatusCode(500, new { message = "Lỗi khi tải lịch trống của bác sĩ: " + ex.Message });
            }
        }

        /// <summary>
        /// Create a new appointment (enhanced version with smart duplicate validation)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            try
            {
                // Validate the request
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });
                }

                // Validate doctor exists (check both Doctors table and Users table)
                var doctorInfo = await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.DoctorID == request.DoctorId && d.IsAvailable && d.User.IsActive);

                if (doctorInfo == null)
                {
                    return BadRequest(new { success = false, message = "Bác sĩ không tồn tại hoặc không khả dụng" });
                }

                var doctor = doctorInfo.User; // Get the associated User for backward compatibility

                // Validate appointment date and time
                if (!DateTime.TryParse(request.AppointmentDate, out DateTime appointmentDate))
                {
                    return BadRequest(new { success = false, message = "Ngày khám không hợp lệ" });
                }

                if (appointmentDate.Date < DateTime.Today)
                {
                    return BadRequest(new { success = false, message = "Không thể đặt lịch cho ngày trong quá khứ" });
                }

                // Parse appointment time
                if (!TimeSpan.TryParse(request.AppointmentTime, out TimeSpan appointmentTime))
                {
                    return BadRequest(new { success = false, message = "Giờ khám không hợp lệ" });
                }

                // Check if it's weekend
                var dayOfWeek = (int)appointmentDate.DayOfWeek;
                if (dayOfWeek == 0 || dayOfWeek == 6)
                {
                    return BadRequest(new { success = false, message = "Phòng khám không làm việc vào cuối tuần" });
                }

                // Get current user from session
                var currentUserId = HttpContext.Session.GetString("UserId");
                var currentUsername = HttpContext.Session.GetString("Username");
                var currentUserFullName = HttpContext.Session.GetString("FullName");

                _logger.LogInformation($"Session info - UserId: {currentUserId}, Username: {currentUsername}, FullName: {currentUserFullName}");

                // Validate current user exists if CreatedBy is set
                int? validatedCreatedBy = null;
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var parsedUserId = int.Parse(currentUserId);
                    var userExists = await _context.Users.AnyAsync(u => u.UserID == parsedUserId && u.IsActive);
                    if (userExists)
                    {
                        validatedCreatedBy = parsedUserId;
                        _logger.LogInformation($"Validated CreatedBy user ID: {validatedCreatedBy}");
                    }
                    else
                    {
                        _logger.LogWarning($"User ID {parsedUserId} from session does not exist in database, setting CreatedBy to null");
                    }
                }
                else
                {
                    _logger.LogInformation("No UserId in session, creating anonymous appointment");
                }

                // **SMART DUPLICATE VALIDATION**
                var duplicateChecks = await CheckForDuplicatesAsync(request, validatedCreatedBy?.ToString(), appointmentDate, appointmentTime);
                
                if (duplicateChecks.HasCriticalDuplicates)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = duplicateChecks.ErrorMessage,
                        duplicateType = duplicateChecks.DuplicateType,
                        suggestions = duplicateChecks.Suggestions
                    });
                }

                // Get default facility (first active facility or create one if none exists)
                var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.IsActive);
                if (facility == null)
                {
                    // Create a default facility if none exists
                    facility = new Facility
                    {
                        FacilityName = "Trung tâm Điều trị HIV/AIDS",
                        Address = "123 Đường ABC, Quận 1",
                        City = "TP. Hồ Chí Minh",
                        PhoneNumber = "028-1234-5678",
                        Email = "info@hivcenter.vn",
                        OpeningHours = "8:00 - 17:30 (Thứ 2 - Thứ 6)",
                        Description = "Trung tâm chuyên khoa điều trị HIV/AIDS",
                        IsActive = true
                    };
                    _context.Facilities.Add(facility);
                    await _context.SaveChangesAsync();
                }

                // Create appointment record
                var appointment = new Appointment
                {
                    DoctorID = request.DoctorId,
                    PatientID = null, // Luôn set null để tránh lỗi Foreign Key constraint với bảng Patients
                    FacilityID = facility.FacilityID,
                    AppointmentDate = appointmentDate,
                    AppointmentTime = appointmentTime,
                    AppointmentType = "Regular",
                    Purpose = request.PatientInfo?.Purpose ?? "Khám tổng quát",
                    Status = "Scheduled",
                    Notes = request.PatientInfo?.Purpose ?? "Khám tổng quát",
                    CreatedDate = DateTime.Now,
                    CreatedBy = validatedCreatedBy,
                    IsAnonymous = request.PatientInfo?.IsAnonymous ?? false,
                    PatientName = request.PatientInfo?.FullName ?? currentUserFullName ?? "Bệnh nhân ẩn danh",
                    PatientPhone = request.PatientInfo?.PhoneNumber ?? "",
                    PatientEmail = request.PatientInfo?.Email ?? "",
                    ConsultationFee = GetConsultationFee(doctor.FullName)
                };

                try
                {
                    // Add to database
                    _context.Appointments.Add(appointment);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation($"Created appointment ID {appointment.AppointmentID} for user {currentUsername ?? "anonymous"}");
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Database error when saving appointment. Attempting to fix...");
                    
                    // If foreign key constraint error, try setting CreatedBy to null
                    if (dbEx.Message.Contains("FOREIGN KEY") || dbEx.Message.Contains("constraint"))
                    {
                        _logger.LogWarning("Foreign key constraint detected, retrying with CreatedBy = null");
                        appointment.CreatedBy = null;
                        
                        try
                        {
                            _context.Appointments.Update(appointment);
                            await _context.SaveChangesAsync();
                            _logger.LogInformation($"Successfully created appointment ID {appointment.AppointmentID} with CreatedBy = null");
                        }
                        catch (Exception retryEx)
                        {
                            _logger.LogError(retryEx, "Failed to save appointment even with CreatedBy = null");
                            throw;
                        }
                    }
                    else
                    {
                        throw;
                    }
                }

                // Prepare success response with warnings if any
                var response = new { 
                    success = true, 
                    appointmentId = appointment.AppointmentID,
                    message = "Đặt lịch khám thành công!",
                    warnings = duplicateChecks.Warnings,
                    appointment = new
                    {
                        appointmentID = appointment.AppointmentID,
                        doctorName = doctor.FullName,
                        facilityName = facility.FacilityName,
                        appointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                        appointmentTime = appointment.AppointmentTime.ToString(@"hh\:mm"),
                        patientName = appointment.PatientName,
                        status = appointment.Status,
                        createdDate = appointment.CreatedDate,
                        consultationFee = appointment.ConsultationFee,
                        notes = !string.IsNullOrEmpty(currentUserId) 
                            ? "Lịch khám đã được lưu vào hồ sơ của bạn. Vui lòng đến trước 15 phút để làm thủ tục."
                            : "Vui lòng đến trước 15 phút để làm thủ tục. Lưu ý: Đây là lịch khám ẩn danh."
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                return StatusCode(500, new { success = false, message = "Lỗi khi đặt lịch khám: " + ex.Message });
            }
        }

        /// <summary>
        /// Smart duplicate validation - allows multiple appointments but warns about potential issues
        /// </summary>
        private async Task<DuplicateCheckResult> CheckForDuplicatesAsync(CreateAppointmentRequest request, string? currentUserId, DateTime appointmentDate, TimeSpan appointmentTime)
        {
            var result = new DuplicateCheckResult();
            var warnings = new List<string>();
            var suggestions = new List<string>();

            try
            {
                // 1. Check for EXACT duplicate (same user, same doctor, same date/time, same day)
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var exactDuplicate = await _context.Appointments
                        .Where(a => a.CreatedBy == int.Parse(currentUserId) &&
                                   a.DoctorID == request.DoctorId &&
                                   a.AppointmentDate.Date == appointmentDate.Date &&
                                   a.AppointmentTime == appointmentTime &&
                                   a.Status != "Cancelled")
                        .FirstOrDefaultAsync();

                    if (exactDuplicate != null)
                    {
                        result.HasCriticalDuplicates = true;
                        result.DuplicateType = "EXACT_DUPLICATE";
                        result.ErrorMessage = $"Bạn đã có lịch khám với bác sĩ {await GetDoctorNameAsync(request.DoctorId)} vào {appointmentDate:dd/MM/yyyy} lúc {appointmentTime:hh\\:mm}. " +
                                            "Không thể đặt trùng lịch hoàn toàn.";
                        suggestions.Add("Hãy chọn thời gian khác hoặc hủy lịch cũ trước khi đặt lại");
                        suggestions.Add($"Xem lại lịch đã đặt trong mục 'Lịch đã đặt' để kiểm tra");
                        result.Suggestions = suggestions;
                        return result;
                    }
                }

                // 2. Check for SAME DAY multiple appointments with same doctor
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var sameDayCount = await _context.Appointments
                        .CountAsync(a => a.CreatedBy == int.Parse(currentUserId) &&
                                        a.DoctorID == request.DoctorId &&
                                        a.AppointmentDate.Date == appointmentDate.Date &&
                                        a.Status != "Cancelled");

                    if (sameDayCount >= 1)
                    {
                        warnings.Add($"⚠️ Bạn đã có {sameDayCount} lịch khám với bác sĩ này trong ngày {appointmentDate:dd/MM/yyyy}");
                        suggestions.Add("Lịch khám trong cùng ngày có thể gây xung đột thời gian");
                    }
                }

                // 3. Check for overlapping time slots (30 minutes before/after)
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var timeBuffer = TimeSpan.FromMinutes(30);
                    var startCheck = appointmentTime - timeBuffer;
                    var endCheck = appointmentTime + timeBuffer;

                    var overlappingAppointments = await _context.Appointments
                        .Where(a => a.CreatedBy == int.Parse(currentUserId) &&
                                   a.AppointmentDate.Date == appointmentDate.Date &&
                                   a.AppointmentTime >= startCheck &&
                                   a.AppointmentTime <= endCheck &&
                                   a.Status != "Cancelled")
                        .ToListAsync();

                    if (overlappingAppointments.Any())
                    {
                        foreach (var overlap in overlappingAppointments)
                        {
                            var doctorName = await GetDoctorNameByIdAsync(overlap.DoctorID);
                            warnings.Add($"⚠️ Có lịch khám gần với bác sĩ {doctorName} lúc {overlap.AppointmentTime:hh\\:mm} (cách {Math.Abs((appointmentTime - overlap.AppointmentTime).TotalMinutes):0} phút)");
                        }
                        suggestions.Add("Đảm bảo bạn có đủ thời gian di chuyển giữa các cuộc hẹn");
                    }
                }

                // 4. Check for doctor availability (basic check - không strict)
                var doctorAppointmentCount = await _context.Appointments
                    .CountAsync(a => a.DoctorID == request.DoctorId &&
                                    a.AppointmentDate.Date == appointmentDate.Date &&
                                    a.AppointmentTime == appointmentTime &&
                                    a.Status != "Cancelled");

                if (doctorAppointmentCount >= 3) // Allow up to 3 patients per time slot
                {
                    warnings.Add($"⚠️ Bác sĩ đã có {doctorAppointmentCount} lịch khám vào thời gian này, có thể bị chờ đợi");
                    suggestions.Add("Hãy cân nhắc chọn khung giờ khác để tránh chờ đợi lâu");
                }

                // 5. Check for frequent booking (same patient, multiple appointments in short time)
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var recentAppointments = await _context.Appointments
                        .CountAsync(a => a.CreatedBy == int.Parse(currentUserId) &&
                                        a.AppointmentDate >= DateTime.Today &&
                                        a.AppointmentDate <= DateTime.Today.AddDays(7) &&
                                        a.Status != "Cancelled");

                    if (recentAppointments >= 3)
                    {
                        warnings.Add($"⚠️ Bạn đã đặt {recentAppointments} lịch khám trong tuần này");
                        suggestions.Add("Nhiều lịch khám trong thời gian ngắn có thể ảnh hưởng đến lịch trình");
                    }
                }

                result.Warnings = warnings;
                result.Suggestions = suggestions;
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking for duplicates");
                // If check fails, allow booking but add warning
                result.Warnings = new List<string> { "⚠️ Không thể kiểm tra trùng lịch, vui lòng tự kiểm tra lịch đã đặt" };
                return result;
            }
        }

        /// <summary>
        /// Get doctor name by ID (from Doctors table)
        /// </summary>
        private async Task<string> GetDoctorNameAsync(int doctorId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Where(d => d.DoctorID == doctorId)
                .Select(d => d.User.FullName)
                .FirstOrDefaultAsync();
            return doctor ?? "Không xác định";
        }

        /// <summary>
        /// Get doctor name by DoctorID (helper method)
        /// </summary>
        private async Task<string> GetDoctorNameByIdAsync(int doctorId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Where(d => d.DoctorID == doctorId)
                .Select(d => d.User.FullName)
                .FirstOrDefaultAsync();
            return doctor ?? "Không xác định";
        }

        /// <summary>
        /// Validate appointment time slot
        /// </summary>
        [HttpPost("validate")]
        public ActionResult ValidateAppointmentTime([FromBody] ValidateTimeRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { isValid = false, message = "Dữ liệu không hợp lệ" });
                }

                // Parse date
                if (!DateTime.TryParse(request.Date, out DateTime appointmentDate))
                {
                    return Ok(new { isValid = false, message = "Ngày không hợp lệ" });
                }

                // Check if date is in the past
                if (appointmentDate.Date < DateTime.Today)
                {
                    return Ok(new { isValid = false, message = "Không thể đặt lịch cho ngày trong quá khứ" });
                }

                // Check if it's weekend
                var dayOfWeek = (int)appointmentDate.DayOfWeek;
                if (dayOfWeek == 0 || dayOfWeek == 6)
                {
                    return Ok(new { isValid = false, message = "Phòng khám không làm việc vào cuối tuần" });
                }

                // Validate time format
                if (!TimeSpan.TryParse(request.Time, out TimeSpan appointmentTime))
                {
                    return Ok(new { isValid = false, message = "Giờ khám không hợp lệ" });
                }

                // Check if time is within working hours
                var workingHours = new[]
                {
                    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
                };

                if (!workingHours.Contains(request.Time))
                {
                    return Ok(new { isValid = false, message = "Giờ khám không nằm trong khung giờ làm việc" });
                }

                return Ok(new { isValid = true, message = "Thời gian khám hợp lệ" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating appointment time");
                return StatusCode(500, new { isValid = false, message = "Lỗi khi kiểm tra thời gian: " + ex.Message });
            }
        }

        /// <summary>
        /// Get appointments for current user
        /// </summary>
        [HttpGet("my-appointments")]
        public async Task<ActionResult> GetMyAppointments()
        {
            try
            {
                var currentUserId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Vui lòng đăng nhập để xem lịch khám" });
                }

                var userId = int.Parse(currentUserId);
                var appointmentsQuery = await _context.Appointments
                    .Where(a => a.CreatedBy == userId || a.PatientID == userId)
                    .Include(a => a.Facility)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ThenByDescending(a => a.AppointmentTime)
                    .ToListAsync();

                var appointments = new List<object>();
                foreach (var a in appointmentsQuery)
                {
                    var doctorName = await GetDoctorNameByIdAsync(a.DoctorID);
                    appointments.Add(new
                    {
                        appointmentID = a.AppointmentID,
                        doctorName = doctorName,
                        facilityName = a.Facility?.FacilityName ?? "Trung tâm Điều trị HIV/AIDS",
                        facilityAddress = a.Facility?.Address ?? "123 Đường ABC, Quận 1",
                        appointmentDate = a.AppointmentDate,
                        appointmentTime = a.AppointmentTime,
                        appointmentType = a.AppointmentType,
                        purpose = a.Purpose,
                        status = a.Status,
                        notes = a.Notes,
                        consultationFee = a.ConsultationFee,
                        createdDate = a.CreatedDate,
                        patientName = a.PatientName,
                        patientPhone = a.PatientPhone,
                        patientEmail = a.PatientEmail,
                        isAnonymous = a.IsAnonymous
                    });
                }

                return Ok(new { 
                    appointments = appointments,
                    totalCount = appointments.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user appointments");
                return StatusCode(500, new { message = "Lỗi khi tải danh sách lịch khám: " + ex.Message });
            }
        }

        /// <summary>
        /// Debug endpoint to check session state
        /// </summary>
        [HttpGet("debug/session")]
        public IActionResult DebugSession()
        {
            var userId = HttpContext.Session.GetString("UserId");
            var username = HttpContext.Session.GetString("Username");
            var fullName = HttpContext.Session.GetString("FullName");
            
            return Ok(new
            {
                sessionInfo = new
                {
                    userId = userId,
                    username = username,
                    fullName = fullName,
                    sessionId = HttpContext.Session.Id,
                    hasSession = !string.IsNullOrEmpty(userId)
                },
                debugTime = DateTime.Now
            });
        }

        // Helper methods
        private static string ExtractSpecialty(string fullName)
        {
            if (string.IsNullOrEmpty(fullName))
                return "Bác sĩ đa khoa";
                
            var lowerName = fullName.ToLower();
            if (lowerName.Contains("hiv") || lowerName.Contains("aids"))
                return "Chuyên khoa HIV/AIDS";
            else if (lowerName.Contains("infectious") || lowerName.Contains("nhiễm"))
                return "Bệnh nhiễm trùng";
            else if (lowerName.Contains("immunology") || lowerName.Contains("miễn dịch"))
                return "Miễn dịch học";
            else if (lowerName.Contains("general") || lowerName.Contains("đa khoa"))
                return "Bác sĩ đa khoa";
            else if (lowerName.Contains("cardio") || lowerName.Contains("tim"))
                return "Tim mạch";
            else if (lowerName.Contains("neuro") || lowerName.Contains("thần kinh"))
                return "Thần kinh";
            else
                return "Bác sĩ đa khoa";
        }

        private static int GetRandomExperience()
        {
            var random = new Random();
            return random.Next(5, 25); // 5-25 years experience
        }

        private static decimal GetConsultationFee(string fullName)
        {
            var specialty = ExtractSpecialty(fullName);
            return specialty switch
            {
                "Chuyên khoa HIV/AIDS" => 500000,
                "Bệnh nhiễm trùng" => 450000,
                "Miễn dịch học" => 480000,
                "Tim mạch" => 600000,
                "Thần kinh" => 550000,
                _ => 400000
            };
        }

        private static double GetRandomRating()
        {
            var random = new Random();
            return Math.Round(random.NextDouble() * 2 + 3, 1); // 3.0 - 5.0 rating
        }

        private static int GetRandomReviewCount()
        {
            var random = new Random();
            return random.Next(10, 200); // 10-200 reviews
        }
    }

    // Request models
    public class CreateAppointmentRequest
    {
        public int DoctorId { get; set; }
        public string AppointmentDate { get; set; } = "";
        public string AppointmentTime { get; set; } = "";
        public PatientInfoRequest? PatientInfo { get; set; }
    }

    public class PatientInfoRequest
    {
        public string FullName { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Email { get; set; } = "";
        public string Purpose { get; set; } = "";
        public bool IsAnonymous { get; set; }
    }

    public class ValidateTimeRequest
    {
        public string Date { get; set; } = "";
        public string Time { get; set; } = "";
        public int? DoctorId { get; set; }
    }

    public class DuplicateCheckResult
    {
        public bool HasCriticalDuplicates { get; set; } = false;
        public string DuplicateType { get; set; } = "";
        public string ErrorMessage { get; set; } = "";
        public List<string> Warnings { get; set; } = new List<string>();
        public List<string> Suggestions { get; set; } = new List<string>();
    }
} 