using Microsoft.AspNetCore.Mvc;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TestDataController> _logger;

        public TestDataController(ApplicationDbContext context, ILogger<TestDataController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("create-test-appointments")]
        public async Task<ActionResult> CreateTestAppointments()
        {
            try
            {
                // Xóa dữ liệu test cũ nếu có
                var existingTestData = _context.Appointments
                    .Where(a => a.PatientPhone != null && (
                        a.PatientPhone == "0901234567" ||
                        a.PatientPhone == "0987654321" ||
                        a.PatientPhone == "0909999888" ||
                        a.PatientPhone == "0988777666"
                    ))
                    .ToList();

                if (existingTestData.Any())
                {
                    _context.Appointments.RemoveRange(existingTestData);
                    await _context.SaveChangesAsync();
                }

                // Tạo dữ liệu test mới
                var testAppointments = new List<Appointment>
                {
                    // Lịch online với số điện thoại 0901234567
                    new Appointment
                    {
                        PatientID = null,
                        DoctorID = 1,
                        FacilityID = 1,
                        AppointmentDate = DateTime.Now.AddDays(5),
                        AppointmentTime = new TimeSpan(9, 0, 0),
                        AppointmentType = "Online_Consultation",
                        Purpose = "Tư vấn online - HIV consultation",
                        Status = "Scheduled",
                        Notes = "Lịch khám trực tuyến - Link tham gia: https://meet.google.com/demo-hiv-online",
                        IsAnonymous = true,
                        PatientName = "Nguyễn Văn Test",
                        PatientPhone = "0901234567",
                        PatientEmail = "nguyentest@gmail.com",
                        ConsultationFee = 300000,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now
                    },

                    // Lịch online với email test123@gmail.com
                    new Appointment
                    {
                        PatientID = null,
                        DoctorID = 1,
                        FacilityID = 1,
                        AppointmentDate = DateTime.Now.AddDays(6),
                        AppointmentTime = new TimeSpan(14, 0, 0),
                        AppointmentType = "Regular",
                        Purpose = "Consultation trực tuyến - tái khám",
                        Status = "Confirmed",
                        Notes = "Lịch khám trực tuyến - Link tham gia: https://meet.google.com/demo-hiv-recheck",
                        IsAnonymous = true,
                        PatientName = "Trần Thị Online",
                        PatientPhone = "0987654321",
                        PatientEmail = "test123@gmail.com",
                        ConsultationFee = 250000,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now
                    },

                    // Lịch offline với số điện thoại 0901234567 (cùng người)
                    new Appointment
                    {
                        PatientID = null,
                        DoctorID = 1,
                        FacilityID = 1,
                        AppointmentDate = DateTime.Now.AddDays(10),
                        AppointmentTime = new TimeSpan(10, 30, 0),
                        AppointmentType = "Regular",
                        Purpose = "Khám tại phòng khám - xét nghiệm máu",
                        Status = "Scheduled",
                        Notes = "Lịch khám tại phòng khám - Vui lòng đến đúng giờ",
                        IsAnonymous = true,
                        PatientName = "Nguyễn Văn Test",
                        PatientPhone = "0901234567",
                        PatientEmail = "nguyentest@gmail.com",
                        ConsultationFee = 200000,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now
                    },

                    // Lịch online với số điện thoại 0909999888
                    new Appointment
                    {
                        PatientID = null,
                        DoctorID = 1,
                        FacilityID = 1,
                        AppointmentDate = DateTime.Now.AddDays(7),
                        AppointmentTime = new TimeSpan(16, 0, 0),
                        AppointmentType = "Regular",
                        Purpose = "Video call consultation - HIV care",
                        Status = "Scheduled",
                        Notes = "Lịch khám trực tuyến - Link tham gia: https://meet.google.com/demo-hiv-care",
                        IsAnonymous = true,
                        PatientName = "Lê Văn Video",
                        PatientPhone = "0909999888",
                        PatientEmail = "levideo@yahoo.com",
                        ConsultationFee = 350000,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now
                    },

                    // Lịch offline với email testoffline@gmail.com
                    new Appointment
                    {
                        PatientID = null,
                        DoctorID = 1,
                        FacilityID = 1,
                        AppointmentDate = DateTime.Now.AddDays(11),
                        AppointmentTime = new TimeSpan(8, 0, 0),
                        AppointmentType = "Emergency",
                        Purpose = "Khám offline - emergency care",
                        Status = "Confirmed",
                        Notes = "Lịch khám tại phòng khám - Cấp cứu, vui lòng đến ngay",
                        IsAnonymous = true,
                        PatientName = "Phạm Thị Offline",
                        PatientPhone = "0988777666",
                        PatientEmail = "testoffline@gmail.com",
                        ConsultationFee = 150000,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now
                    }
                };

                _context.Appointments.AddRange(testAppointments);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = "Tạo dữ liệu test thành công!",
                    appointmentsCreated = testAppointments.Count,
                    testContacts = new
                    {
                        phones = new[] { "0901234567", "0987654321", "0909999888", "0988777666" },
                        emails = new[] { "nguyentest@gmail.com", "test123@gmail.com", "levideo@yahoo.com", "testoffline@gmail.com" }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating test appointments");
                return StatusCode(500, new { success = false, message = "Lỗi khi tạo dữ liệu test: " + ex.Message });
            }
        }

        [HttpGet("test-appointments")]
        public async Task<ActionResult> GetTestAppointments()
        {
            try
            {
                var testAppointments = _context.Appointments
                    .Where(a => a.PatientPhone != null && (
                        a.PatientPhone == "0901234567" ||
                        a.PatientPhone == "0987654321" ||
                        a.PatientPhone == "0909999888" ||
                        a.PatientPhone == "0988777666"
                    ))
                    .Select(a => new
                    {
                        appointmentID = a.AppointmentID,
                        patientName = a.PatientName,
                        patientPhone = a.PatientPhone,
                        patientEmail = a.PatientEmail,
                        appointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                        appointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                        purpose = a.Purpose,
                        appointmentType = a.AppointmentType,
                        status = a.Status,
                        notes = a.Notes,
                        isOnline = a.AppointmentType == "Online_Consultation" ||
                                  (a.Purpose != null && (a.Purpose.ToLower().Contains("online") || 
                                                        a.Purpose.ToLower().Contains("trực tuyến") ||
                                                        a.Purpose.ToLower().Contains("video call")))
                    })
                    .OrderBy(a => a.appointmentDate)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    totalAppointments = testAppointments.Count,
                    appointments = testAppointments
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting test appointments");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy dữ liệu test: " + ex.Message });
            }
        }
    }
} 