using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public partial class PatientARVController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientARVController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy phác đồ hiện tại của bệnh nhân
        [HttpGet("current-regimen")]
        public async Task<IActionResult> GetCurrentRegimen()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var currentRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị")
                    .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.Medications)
                    .Select(pr => new
                    {
                        pr.Id,
                        pr.DoctorName,
                        pr.StartDate,
                        pr.Status,
                        pr.Notes,
                        pr.Reason,
                        Regimen = new
                        {
                            pr.Regimen.Id,
                            pr.Regimen.Name,
                            pr.Regimen.Description,
                            pr.Regimen.LineOfTreatment,
                            Medications = pr.Regimen.Medications.OrderBy(m => m.SortOrder).Select(m => new
                            {
                                m.Id,
                                m.MedicationName,
                                m.ActiveIngredient,
                                m.Dosage,
                                m.Frequency,
                                m.Instructions,
                                m.SideEffects
                            })
                        },
                        DaysOnTreatment = (DateTime.UtcNow - pr.StartDate).Days
                    })
                    .FirstOrDefaultAsync();

                if (currentRegimen == null)
                {
                    return Ok(new { success = true, data = (object?)null, message = "Bạn chưa được kê đơn phác đồ điều trị nào" });
                }

                return Ok(new { success = true, data = currentRegimen });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải thông tin phác đồ", error = ex.Message });
            }
        }

        // Lấy lịch sử phác đồ của bệnh nhân
        [HttpGet("regimen-history")]
        public async Task<IActionResult> GetRegimenHistory()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var history = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .Include(pr => pr.Regimen)
                    .OrderByDescending(pr => pr.CreatedAt)
                    .Select(pr => new
                    {
                        pr.Id,
                        pr.DoctorName,
                        pr.StartDate,
                        pr.EndDate,
                        pr.Status,
                        pr.Notes,
                        pr.Reason,
                        RegimenName = pr.Regimen.Name,
                        RegimenDescription = pr.Regimen.Description,
                        LineOfTreatment = pr.Regimen.LineOfTreatment,
                        DurationDays = pr.EndDate.HasValue
                            ? (pr.EndDate.Value - pr.StartDate).Days
                            : (DateTime.UtcNow - pr.StartDate).Days
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = history });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải lịch sử điều trị", error = ex.Message });
            }
        }

        // Ghi nhận việc uống thuốc (tuân thủ điều trị)
        [HttpPost("record-medication")]
        public async Task<IActionResult> RecordMedicationTaken([FromBody] MedicationRecordRequest request)
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var patientName = User.FindFirst(ClaimTypes.Name)?.Value;

                // Kiểm tra phác đồ có thuộc về bệnh nhân này không
                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == request.PatientRegimenId && pr.PatientId == patientId);

                if (patientRegimen == null)
                {
                    return BadRequest(new { success = false, message = "Phác đồ không hợp lệ" });
                }

                // Kiểm tra đã ghi nhận cho ngày này chưa
                var existingRecord = await _context.AdherenceRecords
                    .FirstOrDefaultAsync(ar => ar.PatientRegimenId == request.PatientRegimenId
                                             && ar.RecordDate.Date == request.RecordDate.Date);

                if (existingRecord != null)
                {
                    // Cập nhật record hiện có
                    existingRecord.TakenDoses = request.TakenDoses;
                    existingRecord.AdherencePercentage = Math.Round((decimal)request.TakenDoses / request.TotalDoses * 100, 2);
                    existingRecord.Notes = request.Notes;
                }
                else
                {
                    // Tạo record mới
                    var adherenceRecord = new AdherenceRecord
                    {
                        PatientRegimenId = request.PatientRegimenId,
                        RecordDate = request.RecordDate,
                        TotalDoses = request.TotalDoses,
                        TakenDoses = request.TakenDoses,
                        AdherencePercentage = Math.Round((decimal)request.TakenDoses / request.TotalDoses * 100, 2),
                        Period = "Daily",
                        Notes = request.Notes ?? "",
                        Challenges = "",
                        RecordedBy = patientName ?? "Unknown"
                    };

                    _context.AdherenceRecords.Add(adherenceRecord);
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã ghi nhận việc uống thuốc thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi ghi nhận uống thuốc", error = ex.Message });
            }
        }

        // Báo cáo tác dụng phụ
        [HttpPost("report-side-effect")]
        public async Task<IActionResult> ReportSideEffect([FromBody] PatientSideEffectRequest request)
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var patientName = User.FindFirst(ClaimTypes.Name)?.Value;

                // Kiểm tra phác đồ có thuộc về bệnh nhân này không
                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == request.PatientRegimenId && pr.PatientId == patientId);

                if (patientRegimen == null)
                {
                    return BadRequest(new { success = false, message = "Phác đồ không hợp lệ" });
                }

                var sideEffectRecord = new SideEffectRecord
                {
                    PatientRegimenId = request.PatientRegimenId,
                    SideEffect = request.SideEffect,
                    Severity = request.Severity,
                    OnsetDate = request.OnsetDate,
                    Description = request.Description,
                    Treatment = "Đang theo dõi", // Required field
                    Status = "Đang theo dõi",
                    ReportedBy = patientName ?? "Unknown"
                };

                _context.SideEffectRecords.Add(sideEffectRecord);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã báo cáo tác dụng phụ thành công. Bác sĩ sẽ theo dõi và tư vấn cho bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi báo cáo tác dụng phụ", error = ex.Message });
            }
        }

        // Lấy lịch sử tuân thủ điều trị
        [HttpGet("adherence-history")]
        public async Task<IActionResult> GetAdherenceHistory()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var adherenceHistory = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimen.PatientId == patientId)
                    .Include(ar => ar.PatientRegimen)
                    .ThenInclude(pr => pr.Regimen)
                    .OrderByDescending(ar => ar.RecordDate)
                    .Select(ar => new
                    {
                        ar.Id,
                        ar.RecordDate,
                        ar.TotalDoses,
                        ar.TakenDoses,
                        ar.AdherencePercentage,
                        ar.Notes,
                        RegimenName = ar.PatientRegimen.Regimen.Name
                    })
                    .Take(30) // Lấy 30 ngày gần nhất
                    .ToListAsync();

                return Ok(new { success = true, data = adherenceHistory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải lịch sử tuân thủ", error = ex.Message });
            }
        }

        // Lấy lịch sử tác dụng phụ
        [HttpGet("side-effects-history")]
        public async Task<IActionResult> GetSideEffectsHistory()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var sideEffectsHistory = await _context.SideEffectRecords
                    .Where(se => se.PatientRegimen.PatientId == patientId)
                    .Include(se => se.PatientRegimen)
                    .ThenInclude(pr => pr.Regimen)
                    .OrderByDescending(se => se.OnsetDate)
                    .Select(se => new
                    {
                        se.Id,
                        se.SideEffect,
                        se.Severity,
                        se.OnsetDate,
                        se.ResolvedDate,
                        se.Description,
                        se.Treatment,
                        se.Status,
                        RegimenName = se.PatientRegimen.Regimen.Name
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = sideEffectsHistory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải lịch sử tác dụng phụ", error = ex.Message });
            }
        }

        // Lấy thống kê tuân thủ điều trị
        [HttpGet("adherence-statistics")]
        public async Task<IActionResult> GetAdherenceStatistics()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var currentRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị");

                if (currentRegimen == null)
                {
                    return Ok(new { success = true, data = (object?)null, message = "Không có phác đồ đang điều trị" });
                }

                var adherenceRecords = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimenId == currentRegimen.Id)
                    .OrderByDescending(ar => ar.RecordDate)
                    .Take(30)
                    .ToListAsync();

                var statistics = new
                {
                    TotalRecords = adherenceRecords.Count,
                    AverageAdherence = adherenceRecords.Any() ? Math.Round(adherenceRecords.Average(ar => ar.AdherencePercentage), 2) : 0,
                    Last7DaysAdherence = adherenceRecords.Where(ar => ar.RecordDate >= DateTime.UtcNow.AddDays(-7)).Any()
                        ? Math.Round(adherenceRecords.Where(ar => ar.RecordDate >= DateTime.UtcNow.AddDays(-7)).Average(ar => ar.AdherencePercentage), 2)
                        : 0,
                    Last30DaysAdherence = Math.Round(adherenceRecords.Average(ar => ar.AdherencePercentage), 2),
                    ConsecutiveDays = CalculateConsecutiveDays(adherenceRecords),
                    RecentRecords = adherenceRecords.Take(7).Select(ar => new
                    {
                        ar.RecordDate,
                        ar.AdherencePercentage,
                        ar.TakenDoses,
                        ar.TotalDoses
                    })
                };

                return Ok(new { success = true, data = statistics });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải thống kê tuân thủ", error = ex.Message });
            }
        }

        private int CalculateConsecutiveDays(List<AdherenceRecord> records)
        {
            if (!records.Any()) return 0;

            var sortedRecords = records.OrderByDescending(r => r.RecordDate).ToList();
            int consecutiveDays = 0;

            foreach (var record in sortedRecords)
            {
                if (record.AdherencePercentage >= 80) // Coi như tuân thủ nếu >= 80%
                {
                    consecutiveDays++;
                }
                else
                {
                    break;
                }
            }

            return consecutiveDays;
        }

        // Additional endpoints for doctor access to patient data
        // GET: api/PatientARV/patient/{patientId}/summary - For doctors to view patient summary
        [HttpGet("patient/{patientId}/summary")]
        public async Task<ActionResult> GetPatientARVSummaryForDoctor(string patientId)
        {
            try
            {
                // Get current regimen
                var currentRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị")
                    .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.Medications)
                    .OrderByDescending(pr => pr.StartDate)
                    .FirstOrDefaultAsync();

                // Get regimen count
                var totalRegimens = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .CountAsync();

                // Get latest adherence
                var latestAdherence = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimen!.PatientId == patientId)
                    .OrderByDescending(ar => ar.RecordDate)
                    .FirstOrDefaultAsync();

                // Get average adherence
                var averageAdherence = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimen!.PatientId == patientId)
                    .AverageAsync(ar => (double?)ar.AdherencePercentage) ?? 0;

                var summary = new
                {
                    PatientId = patientId,
                    CurrentRegimen = currentRegimen != null ? new
                    {
                        Id = currentRegimen.Id,
                        RegimenName = currentRegimen.Regimen?.Name,
                        StartDate = currentRegimen.StartDate,
                        Duration = (DateTime.UtcNow - currentRegimen.StartDate).Days,
                        Status = currentRegimen.Status,
                        MedicationCount = currentRegimen.Regimen?.Medications?.Count ?? 0,
                        DoctorName = currentRegimen.DoctorName
                    } : null,
                    TotalRegimens = totalRegimens,
                    LatestAdherence = latestAdherence != null ? new
                    {
                        RecordDate = latestAdherence.RecordDate,
                        AdherencePercentage = latestAdherence.AdherencePercentage,
                        TakenDoses = latestAdherence.TakenDoses,
                        TotalDoses = latestAdherence.TotalDoses
                    } : null,
                    AverageAdherence = Math.Round(averageAdherence, 2)
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving ARV summary", error = ex.Message });
            }
        }
    }

    // DTOs for Patient
    public class MedicationRecordRequest
    {
        public required string PatientRegimenId { get; set; }
        public DateTime RecordDate { get; set; }
        public int TotalDoses { get; set; }
        public int TakenDoses { get; set; }
        public string? Notes { get; set; }
    }

    public class PatientSideEffectRequest
    {
        public required string PatientRegimenId { get; set; }
        public required string SideEffect { get; set; }
        public required string Severity { get; set; }
        public DateTime OnsetDate { get; set; }
        public required string Description { get; set; }
    }
}
