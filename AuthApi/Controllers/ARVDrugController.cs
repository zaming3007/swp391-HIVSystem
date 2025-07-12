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
    public class ARVDrugController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ARVDrugController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ARVDrug
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ARVDrug>>> GetARVDrugs()
        {
            return await _context.ARVDrugs
                .Where(d => d.IsActive)
                .OrderBy(d => d.Name)
                .ToListAsync();
        }

        // GET: api/ARVDrug/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ARVDrug>> GetARVDrug(int id)
        {
            var drug = await _context.ARVDrugs.FindAsync(id);

            if (drug == null)
            {
                return NotFound();
            }

            return drug;
        }

        // GET: api/ARVDrug/class/{drugClass}
        [HttpGet("class/{drugClass}")]
        public async Task<ActionResult<IEnumerable<ARVDrug>>> GetDrugsByClass(string drugClass)
        {
            return await _context.ARVDrugs
                .Where(d => d.IsActive && d.DrugClass == drugClass)
                .OrderBy(d => d.Name)
                .ToListAsync();
        }

        // GET: api/ARVDrug/suitable-for-patient
        [HttpGet("suitable-for-patient")]
        public async Task<ActionResult<IEnumerable<ARVDrug>>> GetSuitableDrugs(
            [FromQuery] int age = 0,
            [FromQuery] decimal weight = 0,
            [FromQuery] bool isPregnant = false,
            [FromQuery] bool isPediatric = false)
        {
            var query = _context.ARVDrugs.Where(d => d.IsActive);

            if (age > 0)
            {
                query = query.Where(d => d.MinAge <= age);
            }

            if (weight > 0)
            {
                query = query.Where(d => d.MinWeight <= weight);
            }

            if (isPregnant)
            {
                query = query.Where(d => d.IsPregnancySafe);
            }

            if (isPediatric)
            {
                query = query.Where(d => d.IsPediatricSafe);
            }

            return await query.OrderBy(d => d.Name).ToListAsync();
        }

        // POST: api/ARVDrug
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ARVDrug>> PostARVDrug(ARVDrug drug)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            drug.CreatedBy = userId ?? "system";
            drug.UpdatedBy = userId ?? "system";
            drug.CreatedAt = DateTime.UtcNow;
            drug.UpdatedAt = DateTime.UtcNow;

            _context.ARVDrugs.Add(drug);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetARVDrug", new { id = drug.Id }, drug);
        }

        // PUT: api/ARVDrug/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PutARVDrug(int id, ARVDrug drug)
        {
            if (id != drug.Id)
            {
                return BadRequest();
            }

            var existingDrug = await _context.ARVDrugs.FindAsync(id);
            if (existingDrug == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Update properties
            existingDrug.Name = drug.Name;
            existingDrug.GenericName = drug.GenericName;
            existingDrug.BrandName = drug.BrandName;
            existingDrug.DrugClass = drug.DrugClass;
            existingDrug.Description = drug.Description;
            existingDrug.Dosage = drug.Dosage;
            existingDrug.Form = drug.Form;
            existingDrug.SideEffects = drug.SideEffects;
            existingDrug.Contraindications = drug.Contraindications;
            existingDrug.Instructions = drug.Instructions;
            existingDrug.IsActive = drug.IsActive;
            existingDrug.IsPregnancySafe = drug.IsPregnancySafe;
            existingDrug.IsPediatricSafe = drug.IsPediatricSafe;
            existingDrug.MinAge = drug.MinAge;
            existingDrug.MinWeight = drug.MinWeight;
            existingDrug.UpdatedBy = userId ?? "system";
            existingDrug.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ARVDrugExists(id))
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

        // DELETE: api/ARVDrug/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteARVDrug(int id)
        {
            var drug = await _context.ARVDrugs.FindAsync(id);
            if (drug == null)
            {
                return NotFound();
            }

            // Soft delete - just mark as inactive
            drug.IsActive = false;
            drug.UpdatedAt = DateTime.UtcNow;
            drug.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ARVDrug/classes
        [HttpGet("classes")]
        public async Task<ActionResult<IEnumerable<string>>> GetDrugClasses()
        {
            var classes = await _context.ARVDrugs
                .Where(d => d.IsActive)
                .Select(d => d.DrugClass)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return classes;
        }

        // GET: api/ARVDrug/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ARVDrug>>> SearchDrugs([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return await GetARVDrugs();
            }

            var drugs = await _context.ARVDrugs
                .Where(d => d.IsActive && 
                    (d.Name.Contains(query) || 
                     d.GenericName.Contains(query) || 
                     d.BrandName.Contains(query) ||
                     d.DrugClass.Contains(query)))
                .OrderBy(d => d.Name)
                .ToListAsync();

            return drugs;
        }

        private bool ARVDrugExists(int id)
        {
            return _context.ARVDrugs.Any(e => e.Id == id);
        }
    }
}
