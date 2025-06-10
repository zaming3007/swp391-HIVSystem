using Microsoft.AspNetCore.Mvc;
using HIVSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class RealMedicalRecordsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RealMedicalRecordsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-records")]
        public async Task<IActionResult> GetMyMedicalRecords()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập để xem kết quả xét nghiệm" 
                    });
                }

                var userIdInt = int.Parse(userId);
                
                // Get patient info
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserID == userIdInt);
                
                if (patient == null)
                {
                    return NotFound(new { 
                        success = false, 
                        message = "Không tìm thấy thông tin bệnh nhân" 
                    });
                }

                // Get appointments (which contain medical data in Notes)
                var appointments = await _context.Appointments
                    .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                    .Where(a => a.PatientID == patient.PatientID && a.Status == "Completed")
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                // Parse medical data from appointment notes
                var cd4Results = new List<object>();
                var viralLoadResults = new List<object>();
                var medicalHistory = new List<object>();

                foreach (var apt in appointments)
                {
                    // Extract CD4 and VL from notes (format: "CD4=380, VL=45")
                    if (!string.IsNullOrEmpty(apt.Notes))
                    {
                        var cd4Match = System.Text.RegularExpressions.Regex.Match(apt.Notes, @"CD4=(\d+)");
                        var vlMatch = System.Text.RegularExpressions.Regex.Match(apt.Notes, @"VL=(\d+)");
                        
                        if (cd4Match.Success)
                        {
                            cd4Results.Add(new
                            {
                                Date = apt.AppointmentDate,
                                Value = int.Parse(cd4Match.Groups[1].Value),
                                Status = GetStatusFromValue(int.Parse(cd4Match.Groups[1].Value), "CD4"),
                                Notes = apt.Notes
                            });
                        }
                        
                        if (vlMatch.Success)
                        {
                            viralLoadResults.Add(new
                            {
                                Date = apt.AppointmentDate,
                                Value = int.Parse(vlMatch.Groups[1].Value),
                                Status = GetStatusFromValue(int.Parse(vlMatch.Groups[1].Value), "VL"),
                                Notes = apt.Notes
                            });
                        }

                        // Add to medical history
                        medicalHistory.Add(new
                        {
                            Date = apt.AppointmentDate,
                            DoctorName = apt.Doctor?.User?.FullName ?? "N/A",
                            Purpose = apt.Purpose,
                            Diagnosis = ExtractDiagnosis(apt.Notes),
                            Treatment = ExtractTreatment(apt.Notes),
                            Notes = apt.Notes
                        });
                    }
                }

                // Mock ARV regimen (since we don't have separate treatment table)
                var arvRegimen = new
                {
                    CurrentMedications = "TDF + 3TC + EFV",
                    StartDate = appointments.LastOrDefault()?.AppointmentDate ?? DateTime.Now.AddMonths(-6),
                    AdherenceRate = 95,
                    NextReviewDate = DateTime.Now.AddMonths(1),
                    Instructions = "Uống 1 viên mỗi tối sau ăn",
                    SideEffects = "Không có tác dụng phụ nghiêm trọng"
                };

                var result = new
                {
                    CD4Results = cd4Results,
                    ViralLoadResults = viralLoadResults,
                    ARVRegimen = arvRegimen,
                    MedicalHistory = medicalHistory,
                    PatientInfo = new
                    {
                        PatientCode = patient.PatientCode,
                        LastUpdated = appointments.FirstOrDefault()?.AppointmentDate ?? DateTime.Now
                    }
                };

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải dữ liệu xét nghiệm: " + ex.Message
                });
            }
        }

        [HttpGet("test-history")]
        public async Task<IActionResult> GetTestHistory()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập" 
                    });
                }

                var userIdInt = int.Parse(userId);
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserID == userIdInt);
                
                if (patient == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy thông tin bệnh nhân" });
                }

                var appointments = await _context.Appointments
                    .Where(a => a.PatientID == patient.PatientID && a.Status == "Completed")
                    .OrderBy(a => a.AppointmentDate)
                    .ToListAsync();

                var cd4Timeline = new List<object>();
                var viralLoadTimeline = new List<object>();

                foreach (var apt in appointments)
                {
                    if (!string.IsNullOrEmpty(apt.Notes))
                    {
                        var cd4Match = System.Text.RegularExpressions.Regex.Match(apt.Notes, @"CD4=(\d+)");
                        var vlMatch = System.Text.RegularExpressions.Regex.Match(apt.Notes, @"VL=(\d+)");
                        
                        if (cd4Match.Success)
                        {
                            cd4Timeline.Add(new
                            {
                                date = apt.AppointmentDate.ToString("yyyy-MM-dd"),
                                value = int.Parse(cd4Match.Groups[1].Value),
                                status = GetStatusFromValue(int.Parse(cd4Match.Groups[1].Value), "CD4")
                            });
                        }
                        
                        if (vlMatch.Success)
                        {
                            viralLoadTimeline.Add(new
                            {
                                date = apt.AppointmentDate.ToString("yyyy-MM-dd"),
                                value = int.Parse(vlMatch.Groups[1].Value),
                                status = GetStatusFromValue(int.Parse(vlMatch.Groups[1].Value), "VL")
                            });
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        cd4Timeline,
                        viralLoadTimeline
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải lịch sử xét nghiệm: " + ex.Message
                });
            }
        }

        [HttpGet("medical-history")]
        public async Task<IActionResult> GetMedicalHistory()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "Vui lòng đăng nhập" });
                }

                var userIdInt = int.Parse(userId);
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserID == userIdInt);
                
                if (patient == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy thông tin bệnh nhân" });
                }

                var appointments = await _context.Appointments
                    .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                    .Where(a => a.PatientID == patient.PatientID && a.Status == "Completed")
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                var history = appointments.Select(apt => new
                {
                    Date = apt.AppointmentDate,
                    Time = apt.AppointmentTime.ToString(@"hh\:mm"),
                    DoctorName = apt.Doctor?.User?.FullName ?? "N/A",
                    Purpose = apt.Purpose,
                    Diagnosis = ExtractDiagnosis(apt.Notes),
                    Treatment = ExtractTreatment(apt.Notes),
                    TestResults = ExtractTestResults(apt.Notes),
                    Notes = apt.Notes
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = history
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải lịch sử khám bệnh: " + ex.Message
                });
            }
        }

        private string GetStatusFromValue(int value, string type)
        {
            if (type == "CD4")
            {
                if (value >= 350) return "Tốt";
                if (value >= 200) return "Ổn định";
                return "Cần theo dõi";
            }
            else if (type == "VL")
            {
                if (value < 50) return "Không phát hiện";
                if (value < 200) return "Thấp";
                return "Cần điều chỉnh";
            }
            return "N/A";
        }

        private string ExtractDiagnosis(string notes)
        {
            if (notes.Contains("HIV infection")) return "HIV infection - stable";
            if (notes.Contains("ổn định")) return "Tình trạng ổn định";
            if (notes.Contains("cải thiện")) return "Tình trạng cải thiện";
            if (notes.Contains("chẩn đoán")) return "HIV dương tính";
            return "Theo dõi định kỳ";
        }

        private string ExtractTreatment(string notes)
        {
            if (notes.Contains("ARV")) return "Tiếp tục phác đồ ARV";
            if (notes.Contains("TDF")) return "TDF + 3TC + EFV";
            if (notes.Contains("điều trị")) return "Điều trị theo phác đồ";
            return "Theo dõi và tư vấn";
        }

        private string ExtractTestResults(string notes)
        {
            var cd4Match = System.Text.RegularExpressions.Regex.Match(notes, @"CD4=(\d+)");
            var vlMatch = System.Text.RegularExpressions.Regex.Match(notes, @"VL=(\d+)");
            
            var results = new List<string>();
            if (cd4Match.Success) results.Add($"CD4: {cd4Match.Groups[1].Value}");
            if (vlMatch.Success) results.Add($"VL: {vlMatch.Groups[1].Value}");
            
            return results.Count > 0 ? string.Join(", ", results) : "N/A";
        }
    }
} 