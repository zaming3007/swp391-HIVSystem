using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace AppointmentApi.Controllers
{
    // Temporarily disabled due to model conflicts
    /*
    [ApiController]
    [Route("api/[controller]")]
    public class ARVController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ARVController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ARV/regimens - Get all active ARV regimens
        [HttpGet("regimens")]
        public async Task<ActionResult> GetARVRegimens()
        {
            try
            {
                var regimens = await _context.ARVRegimens
                    .Where(r => r.IsActive)
                    .Include(r => r.Medications)
                    .ThenInclude(m => m.Drug)
                    .OrderBy(r => r.LineOfTreatment)
                    .ThenBy(r => r.Name)
                    .ToListAsync();

                var result = regimens.Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.Category,
                    r.LineOfTreatment,
                    r.IsActive,
                    Medications = r.Medications.Select(m => new
                    {
                        m.Id,
                        m.Dosage,
                        m.Frequency,
                        m.Instructions,
                        // m.TimingInstructions, // Comment out if not available
                        // Drug = new
                        // {
                        //     m.Drug?.Id,
                        //     m.Drug?.Name,
                        //     m.Drug?.ActiveIngredient,
                        //     m.Drug?.DrugClass,
                        //     m.Drug?.SideEffects
                        // }
                    }).ToList()
                }).ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving ARV regimens", error = ex.Message });
            }
        }

        // GET: api/ARV/patient/{patientId}/current-regimen - Get patient's current regimen
        [HttpGet("patient/{patientId}/current-regimen")]
        public async Task<ActionResult> GetPatientCurrentRegimen(string patientId)
        {
            try
            {
                var currentRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị")
                    .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.Medications)
                    .ThenInclude(m => m.Drug)
                    .OrderByDescending(pr => pr.StartDate)
                    .FirstOrDefaultAsync();

                if (currentRegimen == null)
                {
                    return Ok(new { success = true, data = null, message = "No active regimen found" });
                }

                var result = new
                {
                    currentRegimen.Id,
                    RegimenName = currentRegimen.Regimen?.Name,
                    RegimenDescription = currentRegimen.Regimen?.Description,
                    Category = currentRegimen.Regimen?.Category,
                    LineOfTreatment = currentRegimen.Regimen?.LineOfTreatment,
                    currentRegimen.StartDate,
                    Duration = (DateTime.UtcNow - currentRegimen.StartDate).Days,
                    currentRegimen.Status,
                    currentRegimen.Notes,
                    DoctorName = currentRegimen.DoctorName,
                    Medications = currentRegimen.Regimen?.Medications?.Select(m => new
                    {
                        DrugId = m.Drug?.Id,
                        DrugName = m.Drug?.Name,
                        m.Dosage,
                        m.Frequency,
                        m.Instructions,
                        m.TimingInstructions
                    }).ToList()
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving current regimen", error = ex.Message });
            }
        }

        // GET: api/ARV/patient/{patientId}/regimen-history - Get patient's regimen history
        [HttpGet("patient/{patientId}/regimen-history")]
        public async Task<ActionResult> GetPatientRegimenHistory(string patientId)
        {
            try
            {
                var history = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.Medications)
                    .ThenInclude(m => m.Drug)
                    .OrderByDescending(pr => pr.StartDate)
                    .ToListAsync();

                var result = history.Select(pr => new
                {
                    pr.Id,
                    RegimenName = pr.Regimen?.Name,
                    RegimenDescription = pr.Regimen?.Description,
                    Category = pr.Regimen?.Category,
                    LineOfTreatment = pr.Regimen?.LineOfTreatment,
                    pr.StartDate,
                    pr.EndDate,
                    Duration = pr.EndDate.HasValue
                        ? (pr.EndDate.Value - pr.StartDate).Days
                        : (DateTime.UtcNow - pr.StartDate).Days,
                    pr.Status,
                    pr.Notes,
                    DoctorName = pr.DoctorName,
                    Medications = pr.Regimen?.Medications?.Select(m => new
                    {
                        DrugId = m.Drug?.Id,
                        DrugName = m.Drug?.Name,
                        m.Dosage,
                        m.Frequency,
                        m.Instructions
                    }).ToList()
                }).ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving regimen history", error = ex.Message });
            }
        }

        // GET: api/ARV/patient/{patientId}/adherence - Get patient's adherence records
        [HttpGet("patient/{patientId}/adherence")]
        public async Task<ActionResult> GetPatientAdherence(string patientId)
        {
            try
            {
                var adherenceRecords = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimen!.PatientId == patientId)
                    .Include(ar => ar.PatientRegimen)
                    .ThenInclude(pr => pr.Regimen)
                    .OrderByDescending(ar => ar.RecordDate)
                    .ToListAsync();

                var records = adherenceRecords.Select(ar => new
                {
                    ar.Id,
                    RegimenName = ar.PatientRegimen?.Regimen?.Name,
                    ar.RecordDate,
                    ar.TotalDoses,
                    ar.TakenDoses,
                    ar.AdherencePercentage,
                    ar.Notes,
                    ar.Challenges
                }).ToList();

                var averageAdherence = adherenceRecords.Any()
                    ? adherenceRecords.Average(ar => (double)ar.AdherencePercentage)
                    : 0;

                var result = new
                {
                    Records = records,
                    AverageAdherence = Math.Round(averageAdherence, 2),
                    TotalRecords = records.Count
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving adherence records", error = ex.Message });
            }
        }

        // POST: api/ARV/patient/{patientId}/adherence - Record patient adherence
        [HttpPost("patient/{patientId}/adherence")]
        public async Task<ActionResult> RecordPatientAdherence(string patientId, [FromBody] ARVAdherenceRequest request)
        {
            try
            {
                // Get current active regimen
                var currentRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị")
                    .FirstOrDefaultAsync();

                if (currentRegimen == null)
                {
                    return BadRequest(new { success = false, message = "No active regimen found for patient" });
                }

                var adherenceRecord = new AdherenceRecord
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientRegimenId = currentRegimen.Id,
                    RecordDate = request.RecordDate,
                    TotalDoses = request.TotalDoses,
                    TakenDoses = request.TakenDoses,
                    AdherencePercentage = Math.Round((decimal)request.TakenDoses / request.TotalDoses * 100, 2),
                    Notes = request.Notes ?? "",
                    Challenges = request.Challenges ?? "",
                    RecordedBy = "patient" // Required field
                };

                _context.AdherenceRecords.Add(adherenceRecord);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Adherence recorded successfully", data = adherenceRecord });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error recording adherence", error = ex.Message });
            }
        }

        // GET: api/ARV/patient/{patientId}/summary - Get patient ARV summary
        [HttpGet("patient/{patientId}/summary")]
        public async Task<ActionResult> GetPatientARVSummary(string patientId)
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
                        currentRegimen.Id,
                        RegimenName = currentRegimen.Regimen?.Name,
                        currentRegimen.StartDate,
                        Duration = (DateTime.UtcNow - currentRegimen.StartDate).Days,
                        currentRegimen.Status,
                        MedicationCount = currentRegimen.Regimen?.Medications?.Count ?? 0,
                        DoctorName = currentRegimen.DoctorName
                    } : null,
                    TotalRegimens = totalRegimens,
                    LatestAdherence = latestAdherence != null ? new
                    {
                        latestAdherence.RecordDate,
                        latestAdherence.AdherencePercentage,
                        latestAdherence.TakenDoses,
                        latestAdherence.TotalDoses
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

        // POST: api/ARV/patient/{patientId}/prescribe - Doctor prescribes ARV regimen
        [HttpPost("patient/{patientId}/prescribe")]
        public async Task<ActionResult> PrescribeARVRegimen(string patientId, [FromBody] ARVPrescribeRequest request)
        {
            try
            {
                // End current regimen if exists
                var currentRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId && pr.Status == "Đang điều trị")
                    .FirstOrDefaultAsync();

                if (currentRegimen != null)
                {
                    currentRegimen.Status = "Hoàn thành";
                    currentRegimen.EndDate = DateTime.UtcNow;
                    currentRegimen.UpdatedAt = DateTime.UtcNow;
                }

                // Create new patient regimen
                var newPatientRegimen = new PatientRegimen
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = patientId,
                    PatientName = "Bệnh nhân " + patientId, // Required field
                    RegimenId = request.RegimenId,
                    DoctorId = request.DoctorId,
                    DoctorName = request.DoctorName,
                    StartDate = request.StartDate,
                    Status = "Đang điều trị",
                    Notes = request.Notes ?? "",
                    Reason = request.Reason ?? ""
                };

                _context.PatientRegimens.Add(newPatientRegimen);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "ARV regimen prescribed successfully", data = newPatientRegimen });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error prescribing ARV regimen", error = ex.Message });
            }
        }

        // GET: api/ARV/doctor/{doctorId}/patients - Get doctor's patients with ARV info
        [HttpGet("doctor/{doctorId}/patients")]
        public async Task<ActionResult> GetDoctorPatients(string doctorId)
        {
            try
            {
                var patients = await _context.PatientRegimens
                    .Where(pr => pr.DoctorId == doctorId)
                    .Include(pr => pr.Regimen)
                    .GroupBy(pr => pr.PatientId)
                    .Select(g => new
                    {
                        PatientId = g.Key,
                        PatientName = "Bệnh nhân " + g.Key, // In real app, join with Users table
                        CurrentRegimen = g.Where(pr => pr.Status == "Đang điều trị")
                                         .OrderByDescending(pr => pr.StartDate)
                                         .Select(pr => new
                                         {
                                             pr.Id,
                                             RegimenName = pr.Regimen!.Name,
                                             pr.StartDate,
                                             pr.Status
                                         }).FirstOrDefault(),
                        TotalRegimens = g.Count(),
                        LastPrescribed = g.Max(pr => pr.StartDate)
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = patients });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving doctor's patients", error = ex.Message });
            }
        }
    }

    // Request DTOs for ARVController
    public class ARVAdherenceRequest
    {
        public DateTime RecordDate { get; set; }
        public int TotalDoses { get; set; }
        public int TakenDoses { get; set; }
        public string? Notes { get; set; }
        public string? Challenges { get; set; }
    }

    public class ARVPrescribeRequest
    {
        public string RegimenId { get; set; } = string.Empty;
        public string DoctorId { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string? Notes { get; set; }
        public string? Reason { get; set; }
    }
    */
}
