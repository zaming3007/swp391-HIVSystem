using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TestResultsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestResultsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TestResults/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<TestResultDto>>> GetPatientTestResults(string patientId)
        {
            try
            {
                var testResults = await _context.TestResults
                    .Where(t => t.PatientId == patientId)
                    .OrderByDescending(t => t.TestDate)
                    .Select(t => new TestResultDto
                    {
                        Id = t.Id,
                        PatientId = t.PatientId,
                        DoctorId = t.DoctorId,
                        TestType = t.TestType,
                        TestName = t.TestName,
                        Result = t.Result,
                        Unit = t.Unit,
                        ReferenceRange = t.ReferenceRange,
                        Status = t.Status,
                        TestDate = t.TestDate,
                        LabName = t.LabName,
                        Notes = t.Notes,
                        CreatedAt = t.CreatedAt,
                        UpdatedAt = t.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = testResults });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving test results", error = ex.Message });
            }
        }

        // GET: api/TestResults/patient/{patientId}/summary
        [HttpGet("patient/{patientId}/summary")]
        public async Task<ActionResult<PatientTestSummaryDto>> GetPatientTestSummary(string patientId)
        {
            try
            {
                var allTests = await _context.TestResults
                    .Where(t => t.PatientId == patientId)
                    .OrderByDescending(t => t.TestDate)
                    .ToListAsync();

                var latestCD4 = allTests
                    .Where(t => t.TestType == "CD4")
                    .FirstOrDefault();

                var latestViralLoad = allTests
                    .Where(t => t.TestType == "ViralLoad")
                    .FirstOrDefault();

                var recentTests = allTests
                    .Take(10)
                    .Select(t => new TestResultDto
                    {
                        Id = t.Id,
                        PatientId = t.PatientId,
                        DoctorId = t.DoctorId,
                        TestType = t.TestType,
                        TestName = t.TestName,
                        Result = t.Result,
                        Unit = t.Unit,
                        ReferenceRange = t.ReferenceRange,
                        Status = t.Status,
                        TestDate = t.TestDate,
                        LabName = t.LabName,
                        Notes = t.Notes,
                        CreatedAt = t.CreatedAt,
                        UpdatedAt = t.UpdatedAt
                    })
                    .ToList();

                var summary = new PatientTestSummaryDto
                {
                    PatientId = patientId,
                    LatestCD4 = latestCD4 != null ? new TestResultDto
                    {
                        Id = latestCD4.Id,
                        PatientId = latestCD4.PatientId,
                        DoctorId = latestCD4.DoctorId,
                        TestType = latestCD4.TestType,
                        TestName = latestCD4.TestName,
                        Result = latestCD4.Result,
                        Unit = latestCD4.Unit,
                        ReferenceRange = latestCD4.ReferenceRange,
                        Status = latestCD4.Status,
                        TestDate = latestCD4.TestDate,
                        LabName = latestCD4.LabName,
                        Notes = latestCD4.Notes,
                        CreatedAt = latestCD4.CreatedAt,
                        UpdatedAt = latestCD4.UpdatedAt
                    } : null,
                    LatestViralLoad = latestViralLoad != null ? new TestResultDto
                    {
                        Id = latestViralLoad.Id,
                        PatientId = latestViralLoad.PatientId,
                        DoctorId = latestViralLoad.DoctorId,
                        TestType = latestViralLoad.TestType,
                        TestName = latestViralLoad.TestName,
                        Result = latestViralLoad.Result,
                        Unit = latestViralLoad.Unit,
                        ReferenceRange = latestViralLoad.ReferenceRange,
                        Status = latestViralLoad.Status,
                        TestDate = latestViralLoad.TestDate,
                        LabName = latestViralLoad.LabName,
                        Notes = latestViralLoad.Notes,
                        CreatedAt = latestViralLoad.CreatedAt,
                        UpdatedAt = latestViralLoad.UpdatedAt
                    } : null,
                    RecentTests = recentTests,
                    TotalTestsCount = allTests.Count
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving test summary", error = ex.Message });
            }
        }

        // GET: api/TestResults/patient/{patientId}/type/{testType}
        [HttpGet("patient/{patientId}/type/{testType}")]
        public async Task<ActionResult<IEnumerable<TestResultDto>>> GetPatientTestResultsByType(string patientId, string testType)
        {
            try
            {
                var testResults = await _context.TestResults
                    .Where(t => t.PatientId == patientId && t.TestType == testType)
                    .OrderByDescending(t => t.TestDate)
                    .Select(t => new TestResultDto
                    {
                        Id = t.Id,
                        PatientId = t.PatientId,
                        DoctorId = t.DoctorId,
                        TestType = t.TestType,
                        TestName = t.TestName,
                        Result = t.Result,
                        Unit = t.Unit,
                        ReferenceRange = t.ReferenceRange,
                        Status = t.Status,
                        TestDate = t.TestDate,
                        LabName = t.LabName,
                        Notes = t.Notes,
                        CreatedAt = t.CreatedAt,
                        UpdatedAt = t.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = testResults });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving test results by type", error = ex.Message });
            }
        }

        // POST: api/TestResults
        [HttpPost]
        public async Task<ActionResult<TestResultDto>> CreateTestResult(CreateTestResultDto createDto)
        {
            try
            {
                var testResult = new TestResult
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = createDto.PatientId,
                    DoctorId = createDto.DoctorId,
                    TestType = createDto.TestType,
                    TestName = createDto.TestName,
                    Result = createDto.Result,
                    Unit = createDto.Unit,
                    ReferenceRange = createDto.ReferenceRange,
                    Status = createDto.Status,
                    TestDate = createDto.TestDate,
                    LabName = createDto.LabName,
                    Notes = createDto.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.TestResults.Add(testResult);
                await _context.SaveChangesAsync();

                var resultDto = new TestResultDto
                {
                    Id = testResult.Id,
                    PatientId = testResult.PatientId,
                    DoctorId = testResult.DoctorId,
                    TestType = testResult.TestType,
                    TestName = testResult.TestName,
                    Result = testResult.Result,
                    Unit = testResult.Unit,
                    ReferenceRange = testResult.ReferenceRange,
                    Status = testResult.Status,
                    TestDate = testResult.TestDate,
                    LabName = testResult.LabName,
                    Notes = testResult.Notes,
                    CreatedAt = testResult.CreatedAt,
                    UpdatedAt = testResult.UpdatedAt
                };

                return CreatedAtAction(nameof(GetTestResult), new { id = testResult.Id }, new { success = true, data = resultDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating test result", error = ex.Message });
            }
        }

        // GET: api/TestResults/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TestResultDto>> GetTestResult(string id)
        {
            try
            {
                var testResult = await _context.TestResults.FindAsync(id);

                if (testResult == null)
                {
                    return NotFound(new { success = false, message = "Test result not found" });
                }

                var resultDto = new TestResultDto
                {
                    Id = testResult.Id,
                    PatientId = testResult.PatientId,
                    DoctorId = testResult.DoctorId,
                    TestType = testResult.TestType,
                    TestName = testResult.TestName,
                    Result = testResult.Result,
                    Unit = testResult.Unit,
                    ReferenceRange = testResult.ReferenceRange,
                    Status = testResult.Status,
                    TestDate = testResult.TestDate,
                    LabName = testResult.LabName,
                    Notes = testResult.Notes,
                    CreatedAt = testResult.CreatedAt,
                    UpdatedAt = testResult.UpdatedAt
                };

                return Ok(new { success = true, data = resultDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving test result", error = ex.Message });
            }
        }

        // PUT: api/TestResults/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestResult(string id, UpdateTestResultDto updateDto)
        {
            try
            {
                var testResult = await _context.TestResults.FindAsync(id);

                if (testResult == null)
                {
                    return NotFound(new { success = false, message = "Test result not found" });
                }

                // Update only provided fields
                if (!string.IsNullOrEmpty(updateDto.Result))
                    testResult.Result = updateDto.Result;
                if (!string.IsNullOrEmpty(updateDto.Unit))
                    testResult.Unit = updateDto.Unit;
                if (!string.IsNullOrEmpty(updateDto.ReferenceRange))
                    testResult.ReferenceRange = updateDto.ReferenceRange;
                if (!string.IsNullOrEmpty(updateDto.Status))
                    testResult.Status = updateDto.Status;
                if (updateDto.TestDate.HasValue)
                    testResult.TestDate = updateDto.TestDate.Value;
                if (!string.IsNullOrEmpty(updateDto.LabName))
                    testResult.LabName = updateDto.LabName;
                if (!string.IsNullOrEmpty(updateDto.Notes))
                    testResult.Notes = updateDto.Notes;

                testResult.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Test result updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error updating test result", error = ex.Message });
            }
        }

        // DELETE: api/TestResults/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestResult(string id)
        {
            try
            {
                var testResult = await _context.TestResults.FindAsync(id);

                if (testResult == null)
                {
                    return NotFound(new { success = false, message = "Test result not found" });
                }

                _context.TestResults.Remove(testResult);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Test result deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error deleting test result", error = ex.Message });
            }
        }
    }
}
