using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;
using System.Security.Claims;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientRegimenController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientRegimenController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PatientRegimen/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        [Authorize(Roles = "doctor,admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetPatientRegimensByDoctor(string doctorId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Doctors can only see their own patients, admins can see all
            if (userRole == "doctor" && currentUserId != doctorId)
            {
                return Forbid();
            }

            var patientRegimens = await _context.PatientRegimens
                .Include(pr => pr.Patient)
                .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.RegimenDrugs)
                        .ThenInclude(rd => rd.Drug)
                .Include(pr => pr.Doctor)
                .Where(pr => pr.PrescribedBy == doctorId)
                .OrderByDescending(pr => pr.PrescribedDate)
                .Select(pr => new
                {
                    pr.Id,
                    pr.PatientId,
                    PatientName = $"{pr.Patient.FirstName} {pr.Patient.LastName}",
                    PatientEmail = pr.Patient.Email,
                    pr.RegimenId,
                    RegimenName = pr.Regimen.Name,
                    RegimenType = pr.Regimen.RegimenType,
                    pr.PrescribedDate,
                    pr.StartDate,
                    pr.EndDate,
                    pr.Status,
                    pr.Notes,
                    pr.LastReviewDate,
                    pr.NextReviewDate,
                    DoctorName = $"{pr.Doctor.FirstName} {pr.Doctor.LastName}",
                    DrugCount = pr.Regimen.RegimenDrugs.Count
                })
                .ToListAsync();

            return Ok(patientRegimens);
        }

        // GET: api/PatientRegimen/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetPatientRegimens(string patientId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Patients can only see their own regimens, doctors/admins can see assigned patients
            if (userRole == "customer" && currentUserId != patientId)
            {
                return Forbid();
            }

            var patientRegimens = await _context.PatientRegimens
                .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.RegimenDrugs)
                        .ThenInclude(rd => rd.Drug)
                .Include(pr => pr.Doctor)
                .Where(pr => pr.PatientId == patientId)
                .OrderByDescending(pr => pr.PrescribedDate)
                .Select(pr => new
                {
                    pr.Id,
                    pr.RegimenId,
                    RegimenName = pr.Regimen.Name,
                    RegimenDescription = pr.Regimen.Description,
                    RegimenType = pr.Regimen.RegimenType,
                    pr.PrescribedDate,
                    pr.StartDate,
                    pr.EndDate,
                    pr.Status,
                    pr.Notes,
                    pr.LastReviewDate,
                    pr.NextReviewDate,
                    DoctorName = $"{pr.Doctor.FirstName} {pr.Doctor.LastName}",
                    Instructions = pr.Regimen.Instructions,
                    Monitoring = pr.Regimen.Monitoring,
                    Drugs = pr.Regimen.RegimenDrugs.OrderBy(rd => rd.SortOrder).Select(rd => new
                    {
                        DrugName = rd.Drug.Name,
                        DrugClass = rd.Drug.DrugClass,
                        rd.Dosage,
                        rd.Frequency,
                        rd.Timing,
                        rd.SpecialInstructions,
                        SideEffects = rd.Drug.SideEffects,
                        Instructions = rd.Drug.Instructions
                    })
                })
                .ToListAsync();

            return Ok(patientRegimens);
        }

        // GET: api/PatientRegimen/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPatientRegimen(int id)
        {
            var patientRegimen = await _context.PatientRegimens
                .Include(pr => pr.Patient)
                .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.RegimenDrugs)
                        .ThenInclude(rd => rd.Drug)
                .Include(pr => pr.Doctor)
                .Include(pr => pr.History)
                    .ThenInclude(h => h.PerformedByUser)
                .Include(pr => pr.AdherenceRecords)
                .Where(pr => pr.Id == id)
                .FirstOrDefaultAsync();

            if (patientRegimen == null)
            {
                return NotFound();
            }

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Check permissions
            if (userRole == "customer" && currentUserId != patientRegimen.PatientId)
            {
                return Forbid();
            }
            if (userRole == "doctor" && currentUserId != patientRegimen.PrescribedBy)
            {
                return Forbid();
            }

            var result = new
            {
                patientRegimen.Id,
                patientRegimen.PatientId,
                PatientName = $"{patientRegimen.Patient.FirstName} {patientRegimen.Patient.LastName}",
                PatientEmail = patientRegimen.Patient.Email,
                PatientAge = CalculateAge(patientRegimen.Patient.DateOfBirth),
                patientRegimen.RegimenId,
                RegimenName = patientRegimen.Regimen.Name,
                RegimenDescription = patientRegimen.Regimen.Description,
                RegimenType = patientRegimen.Regimen.RegimenType,
                patientRegimen.PrescribedDate,
                patientRegimen.StartDate,
                patientRegimen.EndDate,
                patientRegimen.Status,
                patientRegimen.Notes,
                patientRegimen.DiscontinuationReason,
                patientRegimen.LastReviewDate,
                patientRegimen.NextReviewDate,
                DoctorName = $"{patientRegimen.Doctor.FirstName} {patientRegimen.Doctor.LastName}",
                Instructions = patientRegimen.Regimen.Instructions,
                Monitoring = patientRegimen.Regimen.Monitoring,
                Drugs = patientRegimen.Regimen.RegimenDrugs.OrderBy(rd => rd.SortOrder).Select(rd => new
                {
                    rd.Drug.Id,
                    DrugName = rd.Drug.Name,
                    DrugGenericName = rd.Drug.GenericName,
                    DrugBrandName = rd.Drug.BrandName,
                    DrugClass = rd.Drug.DrugClass,
                    DrugForm = rd.Drug.Form,
                    rd.Dosage,
                    rd.Frequency,
                    rd.Timing,
                    rd.SpecialInstructions,
                    SideEffects = rd.Drug.SideEffects,
                    Contraindications = rd.Drug.Contraindications,
                    Instructions = rd.Drug.Instructions
                }),
                History = patientRegimen.History.OrderByDescending(h => h.PerformedAt).Select(h => new
                {
                    h.Id,
                    h.Action,
                    h.Details,
                    h.Reason,
                    h.Notes,
                    h.PerformedAt,
                    PerformedBy = $"{h.PerformedByUser.FirstName} {h.PerformedByUser.LastName}"
                }),
                AdherenceRecords = patientRegimen.AdherenceRecords.OrderByDescending(a => a.RecordDate).Take(10).Select(a => new
                {
                    a.Id,
                    a.RecordDate,
                    a.AdherencePercentage,
                    a.Period,
                    a.Notes,
                    a.Challenges
                })
            };

            return Ok(result);
        }

        // POST: api/PatientRegimen
        [HttpPost]
        [Authorize(Roles = "doctor,admin")]
        public async Task<ActionResult<PatientRegimen>> PostPatientRegimen(CreatePatientRegimenRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Verify patient exists
            var patient = await _context.Users.FindAsync(request.PatientId);
            if (patient == null || patient.Role != "customer")
            {
                return BadRequest("Invalid patient ID");
            }

            // Verify regimen exists
            var regimen = await _context.ARVRegimens.FindAsync(request.RegimenId);
            if (regimen == null || !regimen.IsActive)
            {
                return BadRequest("Invalid regimen ID");
            }

            var patientRegimen = new PatientRegimen
            {
                PatientId = request.PatientId,
                RegimenId = request.RegimenId,
                PrescribedBy = userId ?? "system",
                PrescribedDate = DateTime.UtcNow,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = "Active",
                Notes = request.Notes,
                NextReviewDate = request.NextReviewDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PatientRegimens.Add(patientRegimen);
            await _context.SaveChangesAsync();

            // Add history record
            var history = new PatientRegimenHistory
            {
                PatientRegimenId = patientRegimen.Id,
                Action = "Started",
                Details = $"Started regimen: {regimen.Name}",
                Reason = "New prescription",
                PerformedBy = userId ?? "system",
                PerformedAt = DateTime.UtcNow,
                Notes = request.Notes
            };

            _context.PatientRegimenHistories.Add(history);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatientRegimen", new { id = patientRegimen.Id }, patientRegimen);
        }

        // PUT: api/PatientRegimen/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "doctor,admin")]
        public async Task<IActionResult> UpdatePatientRegimenStatus(int id, UpdateStatusRequest request)
        {
            var patientRegimen = await _context.PatientRegimens
                .Include(pr => pr.Regimen)
                .FirstOrDefaultAsync(pr => pr.Id == id);

            if (patientRegimen == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Check permissions
            if (userRole == "doctor" && userId != patientRegimen.PrescribedBy)
            {
                return Forbid();
            }

            var oldStatus = patientRegimen.Status;
            patientRegimen.Status = request.Status;
            patientRegimen.Notes = request.Notes;
            patientRegimen.DiscontinuationReason = request.DiscontinuationReason;
            patientRegimen.LastReviewDate = DateTime.UtcNow;
            patientRegimen.NextReviewDate = request.NextReviewDate;
            patientRegimen.UpdatedAt = DateTime.UtcNow;

            if (request.Status == "Completed" || request.Status == "Discontinued")
            {
                patientRegimen.EndDate = DateTime.UtcNow;
            }

            // Add history record
            var history = new PatientRegimenHistory
            {
                PatientRegimenId = patientRegimen.Id,
                Action = "Status Changed",
                Details = $"Status changed from {oldStatus} to {request.Status}",
                Reason = request.DiscontinuationReason ?? "Status update",
                PerformedBy = userId ?? "system",
                PerformedAt = DateTime.UtcNow,
                Notes = request.Notes
            };

            _context.PatientRegimenHistories.Add(history);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int CalculateAge(string dateOfBirth)
        {
            if (DateTime.TryParse(dateOfBirth, out DateTime dob))
            {
                var today = DateTime.Today;
                var age = today.Year - dob.Year;
                if (dob.Date > today.AddYears(-age)) age--;
                return age;
            }
            return 0;
        }
    }

    public class CreatePatientRegimenRequest
    {
        public string PatientId { get; set; } = string.Empty;
        public int RegimenId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime? NextReviewDate { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string DiscontinuationReason { get; set; } = string.Empty;
        public DateTime? NextReviewDate { get; set; }
    }
}
