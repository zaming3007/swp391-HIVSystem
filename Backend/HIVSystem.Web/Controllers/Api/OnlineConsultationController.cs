using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnlineConsultationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OnlineConsultationController> _logger;

        public OnlineConsultationController(ApplicationDbContext context, ILogger<OnlineConsultationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get available doctors for online consultation
        /// </summary>
        [HttpGet("doctors/available")]
        public async Task<ActionResult> GetAvailableDoctorsForOnline([FromQuery] string? date = null, [FromQuery] string? time = null)
        {
            try
            {
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

                var doctorsQuery = _context.Doctors
                    .Include(d => d.User)
                    .Where(d => d.IsAvailable && d.User.IsActive);

                var allDoctors = await doctorsQuery.ToListAsync();
                var availableDoctors = new List<object>();

                foreach (var doctorInfo in allDoctors)
                {
                    var doctor = doctorInfo.User;
                    bool isAvailable = true;
                    string availabilityReason = "";

                    if (appointmentDate.HasValue && appointmentTime.HasValue)
                    {
                        var existingAppointment = await _context.Appointments
                            .Where(a => a.DoctorID == doctorInfo.DoctorID 
                                    && a.AppointmentDate.Date == appointmentDate.Value.Date
                                    && a.AppointmentTime == appointmentTime.Value
                                    && a.Status != "Cancelled")
                            .FirstOrDefaultAsync();

                        if (existingAppointment != null)
                        {
                            isAvailable = false;
                            availabilityReason = "Đã có lịch hẹn";
                        }

                        if (isAvailable)
                        {
                            var dayOfWeek = (int)appointmentDate.Value.DayOfWeek;
                            if (dayOfWeek == 0 || dayOfWeek == 6)
                            {
                                isAvailable = false;
                                availabilityReason = "Không làm việc cuối tuần";
                            }
                            else if (!IsWithinWorkingHours(appointmentTime.Value))
                            {
                                isAvailable = false;
                                availabilityReason = "Ngoài giờ làm việc";
                            }
                        }
                    }

                    if (isAvailable || (!appointmentDate.HasValue || !appointmentTime.HasValue))
                    {
                        var doctorResponse = new
                        {
                            doctorID = doctorInfo.DoctorID,
                            userID = doctor.UserID,
                            fullName = doctor.FullName,
                            specialty = doctorInfo.Specialty ?? "Bác sĩ đa khoa",
                            qualification = doctorInfo.Qualification ?? "MD",
                            biography = doctorInfo.Biography ?? $"Bác sĩ chuyên khoa {doctorInfo.Specialty}",
                            yearsOfExperience = doctorInfo.YearsOfExperience ?? 5,
                            isAvailable = isAvailable,
                            consultationFee = doctorInfo.ConsultationFee ?? 300000,
                            profileImage = doctor.ProfileImage ?? "/images/default-doctor.png",
                            email = doctor.Email,
                            phoneNumber = doctor.PhoneNumber,
                            onlineConsultationAvailable = true
                        };

                        availableDoctors.Add(doctorResponse);
                    }
                }

                return Ok(new { 
                    doctors = availableDoctors,
                    totalCount = availableDoctors.Count,
                    message = availableDoctors.Count == 0 ? "Không có bác sĩ nào khả dụng" : $"Có {availableDoctors.Count} bác sĩ khả dụng"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctors for online consultation");
                return StatusCode(500, new { message = "Lỗi khi tải danh sách bác sĩ: " + ex.Message });
            }
        }

        /// <summary>
        /// Book online consultation appointment
        /// </summary>
        [HttpPost("book")]
        public async Task<ActionResult> BookOnlineConsultation([FromBody] OnlineConsultationRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });
                }

                var doctorInfo = await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.DoctorID == request.DoctorId && d.IsAvailable && d.User.IsActive);

                if (doctorInfo == null)
                {
                    return BadRequest(new { success = false, message = "Bác sĩ không tồn tại hoặc không khả dụng" });
                }

                if (!DateTime.TryParse(request.AppointmentDate, out DateTime appointmentDate))
                {
                    return BadRequest(new { success = false, message = "Ngày hẹn không hợp lệ" });
                }

                if (!TimeSpan.TryParse(request.AppointmentTime, out TimeSpan appointmentTime))
                {
                    return BadRequest(new { success = false, message = "Giờ hẹn không hợp lệ" });
                }

                if (appointmentDate.Date < DateTime.Today)
                {
                    return BadRequest(new { success = false, message = "Không thể đặt lịch cho ngày trong quá khứ" });
                }

                var currentUserId = HttpContext.Session.GetString("UserId");
                var currentUserFullName = HttpContext.Session.GetString("FullName");

                var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.IsActive);
                if (facility == null)
                {
                    facility = new Facility
                    {
                        FacilityName = "Tư vấn trực tuyến",
                        Address = "Online",
                        City = "TP. Hồ Chí Minh",
                        PhoneNumber = "028-1234-5678",
                        Email = "online@hivcenter.vn",
                        OpeningHours = "24/7",
                        Description = "Dịch vụ tư vấn trực tuyến",
                        IsActive = true
                    };
                    _context.Facilities.Add(facility);
                    await _context.SaveChangesAsync();
                }

                var videoCallLink = GenerateVideoCallLink(appointmentDate, appointmentTime, doctorInfo.DoctorID);

                var appointment = new Appointment
                {
                    DoctorID = request.DoctorId,
                    PatientID = null,
                    FacilityID = facility.FacilityID,
                    AppointmentDate = appointmentDate,
                    AppointmentTime = appointmentTime,
                    AppointmentType = "Online_Consultation",
                    Purpose = request.Purpose ?? "Tư vấn trực tuyến",
                    Status = "Scheduled",
                    Notes = $"TƯ VẤN TRỰC TUYẾN - Link video call: {videoCallLink}",
                    CreatedDate = DateTime.Now,
                    CreatedBy = !string.IsNullOrEmpty(currentUserId) ? int.Parse(currentUserId) : null,
                    IsAnonymous = request.IsAnonymous,
                    PatientName = request.IsAnonymous ? request.AnonymousInfo.FullName : (currentUserFullName ?? request.AnonymousInfo.FullName),
                    PatientPhone = request.IsAnonymous ? request.AnonymousInfo.PhoneNumber : "",
                    PatientEmail = request.IsAnonymous ? request.AnonymousInfo.Email : "",
                    ConsultationFee = doctorInfo.ConsultationFee ?? 300000
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created online consultation appointment ID {appointment.AppointmentID}");

                var response = new 
                { 
                    success = true, 
                    appointmentId = appointment.AppointmentID,
                    message = "Đặt lịch tư vấn trực tuyến thành công!",
                    appointment = new
                    {
                        appointmentID = appointment.AppointmentID,
                        doctorName = doctorInfo.User.FullName,
                        specialty = doctorInfo.Specialty,
                        appointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                        appointmentTime = appointment.AppointmentTime.ToString(@"hh\:mm"),
                        patientName = appointment.PatientName,
                        videoCallLink = videoCallLink,
                        status = appointment.Status,
                        consultationFee = appointment.ConsultationFee,
                        isAnonymous = appointment.IsAnonymous
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error booking online consultation");
                return StatusCode(500, new { success = false, message = "Lỗi khi đặt lịch tư vấn: " + ex.Message });
            }
        }

        /// <summary>
        /// Search appointments by contact info (phone or email)
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult> SearchAppointments([FromQuery] string contact)
        {
            try
            {
                if (string.IsNullOrEmpty(contact))
                {
                    return BadRequest(new { success = false, message = "Vui lòng nhập email hoặc số điện thoại" });
                }

                var appointments = await _context.Appointments
                    .Where(a => a.PatientPhone == contact || a.PatientEmail == contact)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ThenByDescending(a => a.AppointmentTime)
                    .ToListAsync();

                var result = new List<object>();

                foreach (var apt in appointments)
                {
                    var doctorName = await GetDoctorNameByIdAsync(apt.DoctorID);
                    var facilityName = "Không xác định";
                    
                    if (apt.FacilityID.HasValue)
                    {
                        var facility = await _context.Facilities
                            .Where(f => f.FacilityID == apt.FacilityID.Value)
                            .Select(f => f.FacilityName)
                            .FirstOrDefaultAsync();
                        facilityName = facility ?? "Không xác định";
                    }

                    string videoCallLink = null;
                    if (apt.AppointmentType == "Online_Consultation" && !string.IsNullOrEmpty(apt.Notes))
                    {
                        var linkStart = apt.Notes.IndexOf("Link video call: ");
                        if (linkStart >= 0)
                        {
                            videoCallLink = apt.Notes.Substring(linkStart + 17).Split(' ')[0];
                        }
                    }

                    result.Add(new
                    {
                        appointmentID = apt.AppointmentID,
                        type = apt.AppointmentType == "Online_Consultation" ? "Tư vấn trực tuyến" : "Khám tại phòng khám",
                        doctorName = doctorName,
                        facilityName = facilityName,
                        appointmentDate = apt.AppointmentDate.ToString("dd/MM/yyyy"),
                        appointmentTime = apt.AppointmentTime.ToString(@"hh\:mm"),
                        status = GetStatusText(apt.Status),
                        patientName = apt.PatientName,
                        purpose = apt.Purpose,
                        consultationFee = apt.ConsultationFee,
                        videoCallLink = videoCallLink,
                        canJoinCall = apt.AppointmentType == "Online_Consultation" && 
                                     apt.Status == "Scheduled" && 
                                     apt.AppointmentDate.Date >= DateTime.Today,
                        isOnline = apt.AppointmentType == "Online_Consultation"
                    });
                }

                return Ok(new 
                { 
                    success = true,
                    totalAppointments = result.Count,
                    appointments = result,
                    message = result.Count == 0 ? "Không tìm thấy lịch hẹn nào" : $"Tìm thấy {result.Count} lịch hẹn"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching appointments");
                return StatusCode(500, new { success = false, message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // Helper methods
        private bool IsWithinWorkingHours(TimeSpan time)
        {
            var workingHours = new[]
            {
                "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
            };
            return workingHours.Any(wh => TimeSpan.Parse(wh) == time);
        }

        private string GenerateVideoCallLink(DateTime date, TimeSpan time, int doctorId)
        {
            var meetingId = $"hiv-consult-{date:yyyyMMdd}-{time:hhmm}-dr{doctorId}";
            return $"https://meet.google.com/{meetingId}";
        }

        private async Task<string> GetDoctorNameByIdAsync(int doctorId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Where(d => d.DoctorID == doctorId)
                .Select(d => d.User.FullName)
                .FirstOrDefaultAsync();
            return doctor ?? "Không xác định";
        }

        private string GetStatusText(string status)
        {
            return status switch
            {
                "Scheduled" => "Đã hẹn",
                "Completed" => "Hoàn thành",
                "Cancelled" => "Đã hủy",
                "No-show" => "Không đến",
                _ => "Không xác định"
            };
        }
    }

    // Request models
    public class OnlineConsultationRequest
    {
        public int DoctorId { get; set; }
        public string AppointmentDate { get; set; } = "";
        public string AppointmentTime { get; set; } = "";
        public string? Purpose { get; set; }
        public bool IsAnonymous { get; set; }
        public AnonymousPatientInfo AnonymousInfo { get; set; } = new();
    }

    public class AnonymousPatientInfo
    {
        public string FullName { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Email { get; set; } = "";
        public string Purpose { get; set; } = "";
    }
} 