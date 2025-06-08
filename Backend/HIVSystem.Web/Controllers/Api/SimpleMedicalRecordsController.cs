using Microsoft.AspNetCore.Mvc;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class SimpleMedicalRecordsController : ControllerBase
    {
        [HttpGet("my-records")]
        public IActionResult GetMyMedicalRecords()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                var username = HttpContext.Session.GetString("Username");
                var fullName = HttpContext.Session.GetString("FullName");
                
                // Debug logging
                Console.WriteLine($"[DEBUG] SimpleMedicalRecords - UserId: {userId}");
                Console.WriteLine($"[DEBUG] SimpleMedicalRecords - Username: {username}");
                Console.WriteLine($"[DEBUG] SimpleMedicalRecords - FullName: {fullName}");
                Console.WriteLine($"[DEBUG] SimpleMedicalRecords - Session Keys: {string.Join(", ", HttpContext.Session.Keys)}");
                
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username))
                {
                    return Ok(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập để xem kết quả xét nghiệm",
                        debug = new
                        {
                            userId = userId,
                            username = username,
                            sessionKeys = HttpContext.Session.Keys.ToList(),
                            isLoggedIn = false
                        }
                    });
                }

                // Check if this is our test user
                if (username == "medicaltest")
                {
                    Console.WriteLine("[DEBUG] SimpleMedicalRecords - Returning test user data");
                    var records = GetTestUserMedicalData();
                    return Ok(new
                    {
                        success = true,
                        data = records,
                        debug = new
                        {
                            username = username,
                            message = "Test user data loaded successfully"
                        }
                    });
                }
                else
                {
                    // For other users, return empty data with helpful message
                    Console.WriteLine($"[DEBUG] SimpleMedicalRecords - User '{username}' is not test user");
                    return Ok(new
                    {
                        success = false,
                        message = $"Chưa có dữ liệu medical records cho user '{username}'. Thử login với 'medicaltest' để xem demo data.",
                        debug = new
                        {
                            currentUser = username,
                            expectedUser = "medicaltest",
                            suggestion = "Login with username: medicaltest, password: test123"
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] SimpleMedicalRecords Exception: {ex}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải dữ liệu xét nghiệm: " + ex.Message,
                    debug = ex.ToString()
                });
            }
        }

        [HttpGet("medical-history")]
        public IActionResult GetMedicalHistory()
        {
            try
            {
                var userId = HttpContext.Session.GetString("UserId");
                var username = HttpContext.Session.GetString("Username");
                
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Vui lòng đăng nhập" 
                    });
                }

                if (username == "medicaltest")
                {
                    var history = GetTestUserMedicalHistory();
                    return Ok(new
                    {
                        success = true,
                        data = history
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        message = $"Chưa có dữ liệu medical history cho user '{username}'. Thử login với 'medicaltest' để xem demo data."
                    });
                }
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

        private object GetTestUserMedicalData()
        {
            // Simulate data from SIMPLE_TEST_USER_V2.sql
            var cd4Results = new[]
            {
                new { Date = DateTime.Now.AddDays(-7), Value = 380, Status = "Tốt" },
                new { Date = DateTime.Now.AddDays(-37), Value = 350, Status = "Ổn định" },
                new { Date = DateTime.Now.AddDays(-67), Value = 320, Status = "Ổn định" },
                new { Date = DateTime.Now.AddDays(-97), Value = 280, Status = "Ổn định" },
                new { Date = DateTime.Now.AddDays(-127), Value = 250, Status = "Cần theo dõi" },
                new { Date = DateTime.Now.AddDays(-157), Value = 200, Status = "Cần theo dõi" }
            };

            var viralLoadResults = new[]
            {
                new { Date = DateTime.Now.AddDays(-7), Value = 45, Status = "Không phát hiện" },
                new { Date = DateTime.Now.AddDays(-37), Value = 85, Status = "Thấp" },
                new { Date = DateTime.Now.AddDays(-67), Value = 120, Status = "Thấp" },
                new { Date = DateTime.Now.AddDays(-97), Value = 200, Status = "Cần điều chỉnh" },
                new { Date = DateTime.Now.AddDays(-127), Value = 350, Status = "Cần điều chỉnh" },
                new { Date = DateTime.Now.AddDays(-157), Value = 500, Status = "Cần điều chỉnh" }
            };

            var arvRegimen = new
            {
                CurrentMedications = "TDF + 3TC + EFV",
                StartDate = DateTime.Now.AddDays(-97),
                AdherenceRate = 95,
                NextReviewDate = DateTime.Now.AddDays(30),
                Instructions = "Uống 1 viên mỗi tối sau ăn",
                SideEffects = "Không có tác dụng phụ nghiêm trọng"
            };

            return new
            {
                CD4Results = cd4Results,
                ViralLoadResults = viralLoadResults,
                ARVRegimen = arvRegimen,
                PatientInfo = new
                {
                    PatientCode = "PT0001",
                    LastUpdated = DateTime.Now.AddDays(-7)
                }
            };
        }

        private object[] GetTestUserMedicalHistory()
        {
            return new[]
            {
                new {
                    Date = DateTime.Now.AddDays(-7),
                    Time = "09:00",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Tái khám định kỳ và xét nghiệm CD4",
                    Diagnosis = "Tình trạng ổn định",
                    Treatment = "Tiếp tục phác đồ ARV",
                    TestResults = "CD4: 380, VL: 45",
                    Notes = "Kết quả xét nghiệm tốt: CD4=380, VL=45. Tiếp tục ARV hiện tại"
                },
                new {
                    Date = DateTime.Now.AddDays(-37),
                    Time = "14:30",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Khám sức khỏe định kỳ",
                    Diagnosis = "Tình trạng ổn định",
                    Treatment = "TDF + 3TC + EFV",
                    TestResults = "CD4: 350, VL: 85",
                    Notes = "CD4=350, VL=85. Tình trạng ổn định, không có tác dụng phụ"
                },
                new {
                    Date = DateTime.Now.AddDays(-67),
                    Time = "10:15",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Tư vấn điều trị và theo dõi",
                    Diagnosis = "Tình trạng cải thiện",
                    Treatment = "Điều trị theo phác đồ",
                    TestResults = "CD4: 320, VL: 120",
                    Notes = "CD4=320, VL=120. Điều chỉnh liều thuốc, hẹn tái khám"
                },
                new {
                    Date = DateTime.Now.AddDays(-97),
                    Time = "11:00",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Khám ban đầu và lập phác đồ điều trị",
                    Diagnosis = "HIV dương tính",
                    Treatment = "TDF + 3TC + EFV",
                    TestResults = "CD4: 280, VL: 200",
                    Notes = "CD4=280, VL=200. Bắt đầu phác đồ ARV: TDF + 3TC + EFV"
                },
                new {
                    Date = DateTime.Now.AddDays(-127),
                    Time = "15:45",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Tư vấn và hướng dẫn điều trị",
                    Diagnosis = "HIV dương tính",
                    Treatment = "Theo dõi và tư vấn",
                    TestResults = "CD4: 250, VL: 350",
                    Notes = "CD4=250, VL=350. Giải thích về HIV và phương pháp điều trị"
                },
                new {
                    Date = DateTime.Now.AddDays(-157),
                    Time = "08:30",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Khám chẩn đoán ban đầu",
                    Diagnosis = "HIV dương tính",
                    Treatment = "Theo dõi và tư vấn",
                    TestResults = "CD4: 200, VL: 500",
                    Notes = "CD4=200, VL=500. Xác nhận chẩn đoán HIV, lập kế hoạch điều trị"
                },
                new {
                    Date = DateTime.Now.AddDays(-187),
                    Time = "13:20",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Tư vấn tiền điều trị",
                    Diagnosis = "Theo dõi định kỳ",
                    Treatment = "Theo dõi và tư vấn",
                    TestResults = "N/A",
                    Notes = "Tư vấn chuẩn bị tâm lý và thông tin về HIV"
                },
                new {
                    Date = DateTime.Now.AddDays(-217),
                    Time = "16:00",
                    DoctorName = "BS. Nguyễn Thị Doctor",
                    Purpose = "Xét nghiệm xác nhận",
                    Diagnosis = "Theo dõi định kỳ",
                    Treatment = "Theo dõi và tư vấn",
                    TestResults = "N/A",
                    Notes = "Xét nghiệm xác nhận HIV dương tính"
                }
            };
        }
    }
} 