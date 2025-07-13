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
    public class ARVRegimenController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ARVRegimenController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ARVRegimen
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetARVRegimens()
        {
            try
            {
                // Temporary fix: return empty list to avoid type mismatch
                // Use AppointmentApi for ARV regimens instead
                return Ok(new List<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving ARV regimens", error = ex.Message });
            }
        }

        // GET: api/ARVRegimen/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetARVRegimen(int id)
        {
            var regimen = await _context.ARVRegimens
                .Include(r => r.RegimenDrugs)
                    .ThenInclude(rd => rd.Drug)
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.RegimenType,
                    r.TargetPopulation,
                    r.Instructions,
                    r.Monitoring,
                    r.IsActive,
                    r.IsPregnancySafe,
                    r.IsPediatricSafe,
                    r.MinAge,
                    r.MinWeight,
                    r.CreatedAt,
                    r.UpdatedAt,
                    r.CreatedBy,
                    r.UpdatedBy,
                    Drugs = r.RegimenDrugs.OrderBy(rd => rd.SortOrder).Select(rd => new
                    {
                        rd.Id,
                        rd.DrugId,
                        DrugName = rd.Drug.Name,
                        DrugGenericName = rd.Drug.GenericName,
                        DrugBrandName = rd.Drug.BrandName,
                        DrugClass = rd.Drug.DrugClass,
                        DrugForm = rd.Drug.Form,
                        rd.Dosage,
                        rd.Frequency,
                        rd.Timing,
                        rd.SpecialInstructions,
                        rd.SortOrder
                    })
                })
                .FirstOrDefaultAsync();

            if (regimen == null)
            {
                return NotFound();
            }

            return Ok(regimen);
        }

        // GET: api/ARVRegimen/suitable-for-patient
        [HttpGet("suitable-for-patient")]
        public async Task<ActionResult<IEnumerable<object>>> GetSuitableRegimens(
            [FromQuery] int age = 0,
            [FromQuery] decimal weight = 0,
            [FromQuery] bool isPregnant = false,
            [FromQuery] bool isPediatric = false,
            [FromQuery] string regimenType = "")
        {
            var query = _context.ARVRegimens.Where(r => r.IsActive);

            if (age > 0)
            {
                query = query.Where(r => r.MinAge <= age);
            }

            if (weight > 0)
            {
                query = query.Where(r => r.MinWeight <= weight);
            }

            if (isPregnant)
            {
                query = query.Where(r => r.IsPregnancySafe);
            }

            if (isPediatric)
            {
                query = query.Where(r => r.IsPediatricSafe);
            }

            if (!string.IsNullOrEmpty(regimenType))
            {
                query = query.Where(r => r.RegimenType == regimenType);
            }

            var regimens = await query
                .Include(r => r.RegimenDrugs)
                    .ThenInclude(rd => rd.Drug)
                .OrderBy(r => r.Name)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.RegimenType,
                    r.TargetPopulation,
                    r.Instructions,
                    r.Monitoring,
                    r.IsPregnancySafe,
                    r.IsPediatricSafe,
                    r.MinAge,
                    r.MinWeight,
                    DrugCount = r.RegimenDrugs.Count,
                    DrugClasses = r.RegimenDrugs.Select(rd => rd.Drug.DrugClass).Distinct()
                })
                .ToListAsync();

            return Ok(regimens);
        }

        // POST: api/ARVRegimen
        [HttpPost]
        [Authorize(Roles = "admin,doctor")]
        public async Task<ActionResult<ARVRegimen>> PostARVRegimen(CreateRegimenRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var regimen = new ARVRegimen
            {
                Name = request.Name,
                Description = request.Description,
                RegimenType = request.RegimenType,
                TargetPopulation = request.TargetPopulation,
                Instructions = request.Instructions,
                Monitoring = request.Monitoring,
                IsActive = true,
                IsPregnancySafe = request.IsPregnancySafe,
                IsPediatricSafe = request.IsPediatricSafe,
                MinAge = request.MinAge,
                MinWeight = request.MinWeight,
                CreatedBy = userId ?? "system",
                UpdatedBy = userId ?? "system",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ARVRegimens.Add(regimen);
            await _context.SaveChangesAsync();

            // Add drugs to regimen
            if (request.Drugs != null && request.Drugs.Any())
            {
                foreach (var drugRequest in request.Drugs)
                {
                    var regimenDrug = new ARVRegimenDrug
                    {
                        RegimenId = regimen.Id,
                        DrugId = drugRequest.DrugId,
                        Dosage = drugRequest.Dosage,
                        Frequency = drugRequest.Frequency,
                        Timing = drugRequest.Timing,
                        SpecialInstructions = drugRequest.SpecialInstructions,
                        SortOrder = drugRequest.SortOrder,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.ARVRegimenDrugs.Add(regimenDrug);
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction("GetARVRegimen", new { id = regimen.Id }, regimen);
        }

        // PUT: api/ARVRegimen/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,doctor")]
        public async Task<IActionResult> PutARVRegimen(int id, UpdateRegimenRequest request)
        {
            var regimen = await _context.ARVRegimens
                .Include(r => r.RegimenDrugs)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (regimen == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Update regimen properties
            regimen.Name = request.Name;
            regimen.Description = request.Description;
            regimen.RegimenType = request.RegimenType;
            regimen.TargetPopulation = request.TargetPopulation;
            regimen.Instructions = request.Instructions;
            regimen.Monitoring = request.Monitoring;
            regimen.IsPregnancySafe = request.IsPregnancySafe;
            regimen.IsPediatricSafe = request.IsPediatricSafe;
            regimen.MinAge = request.MinAge;
            regimen.MinWeight = request.MinWeight;
            regimen.UpdatedBy = userId ?? "system";
            regimen.UpdatedAt = DateTime.UtcNow;

            // Update drugs
            if (request.Drugs != null)
            {
                // Remove existing drugs
                _context.ARVRegimenDrugs.RemoveRange(regimen.RegimenDrugs);

                // Add new drugs
                foreach (var drugRequest in request.Drugs)
                {
                    var regimenDrug = new ARVRegimenDrug
                    {
                        RegimenId = regimen.Id,
                        DrugId = drugRequest.DrugId,
                        Dosage = drugRequest.Dosage,
                        Frequency = drugRequest.Frequency,
                        Timing = drugRequest.Timing,
                        SpecialInstructions = drugRequest.SpecialInstructions,
                        SortOrder = drugRequest.SortOrder,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.ARVRegimenDrugs.Add(regimenDrug);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ARVRegimenExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ARVRegimen/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteARVRegimen(int id)
        {
            var regimen = await _context.ARVRegimens.FindAsync(id);
            if (regimen == null)
            {
                return NotFound();
            }

            // Soft delete - just mark as inactive
            regimen.IsActive = false;
            regimen.UpdatedAt = DateTime.UtcNow;
            regimen.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ARVRegimenExists(int id)
        {
            return _context.ARVRegimens.Any(e => e.Id == id);
        }
    }

    public class CreateRegimenRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RegimenType { get; set; } = string.Empty;
        public string TargetPopulation { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string Monitoring { get; set; } = string.Empty;
        public bool IsPregnancySafe { get; set; }
        public bool IsPediatricSafe { get; set; }
        public int MinAge { get; set; }
        public decimal MinWeight { get; set; }
        public List<RegimenDrugRequest>? Drugs { get; set; }
    }

    public class UpdateRegimenRequest : CreateRegimenRequest
    {
    }

    public class RegimenDrugRequest
    {
        public int DrugId { get; set; }
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Timing { get; set; } = string.Empty;
        public string SpecialInstructions { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }
}
