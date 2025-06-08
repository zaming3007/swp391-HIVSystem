using Microsoft.AspNetCore.Mvc;
using HIVSystem.Web.Services;

namespace HIVSystem.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalRecordsController : ControllerBase
    {
        [HttpGet("my-records")]
        public IActionResult GetMyMedicalRecords()
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
                var records = MockMedicalDataService.GetUserMedicalRecords(userIdInt);

                return Ok(new
                {
                    success = true,
                    data = records
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
        public IActionResult GetTestHistory()
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
                var records = MockMedicalDataService.GetUserMedicalRecords(userIdInt);

                // Combine CD4 and Viral Load for timeline
                var timelineData = new
                {
                    cd4Timeline = records.CD4Results.Select(r => new
                    {
                        date = r.Date.ToString("yyyy-MM-dd"),
                        value = r.Value,
                        status = r.Status
                    }).ToList(),
                    viralLoadTimeline = records.ViralLoadResults.Select(r => new
                    {
                        date = r.Date.ToString("yyyy-MM-dd"),
                        value = r.Value,
                        status = r.Status
                    }).ToList()
                };

                return Ok(new
                {
                    success = true,
                    data = timelineData
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
        public IActionResult GetMedicalHistory()
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
                var history = MockMedicalDataService.GetUserMedicalHistory(userIdInt);

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

        [HttpGet("arv-regimen")]
        public IActionResult GetARVRegimen()
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
                var records = MockMedicalDataService.GetUserMedicalRecords(userIdInt);

                return Ok(new
                {
                    success = true,
                    data = records.ARVRegimen
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải thông tin phác đồ ARV: " + ex.Message
                });
            }
        }
    }
} 