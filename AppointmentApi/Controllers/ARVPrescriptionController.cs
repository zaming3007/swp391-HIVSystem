using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentApi.Data;
using AppointmentApi.Models;
using AppointmentApi.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AppointmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ARVPrescriptionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ARVPrescriptionController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }



        // Lấy danh sách phác đồ ARV
        [HttpGet("regimens")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetRegimens()
        {
            try
            {
                var regimens = await _context.ARVRegimens
                    .Where(r => r.IsActive)
                    .OrderBy(r => r.LineOfTreatment)
                    .ThenBy(r => r.Name)
                    .Select(r => new
                    {
                        r.Id,
                        r.Name,
                        r.Description,
                        r.Category,
                        r.LineOfTreatment,
                        r.IsActive,
                        medications = _context.ARVMedications
                            .Where(m => m.RegimenId == r.Id)
                            .OrderBy(m => m.SortOrder)
                            .Select(m => new
                            {
                                m.Id,
                                m.MedicationName,
                                m.ActiveIngredient,
                                m.Dosage,
                                m.Frequency,
                                m.Instructions,
                                m.SideEffects
                            })
                            .ToList()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = regimens,
                    count = regimens.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving regimens", error = ex.Message });
            }
        }

        // Lấy chi tiết phác đồ ARV
        [HttpGet("regimens/{id}")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetRegimen(string id)
        {
            try
            {
                var regimen = await _context.ARVRegimens
                    .Where(r => r.Id == id && r.IsActive)
                    .Select(r => new
                    {
                        r.Id,
                        r.Name,
                        r.Description,
                        r.Category,
                        r.LineOfTreatment,
                        r.IsActive,
                        medications = _context.ARVMedications
                            .Where(m => m.RegimenId == r.Id)
                            .OrderBy(m => m.SortOrder)
                            .Select(m => new
                            {
                                m.Id,
                                m.MedicationName,
                                m.ActiveIngredient,
                                m.Dosage,
                                m.Frequency,
                                m.Instructions,
                                m.SideEffects,
                                m.SortOrder
                            })
                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                if (regimen == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy phác đồ ARV"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = regimen
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy chi tiết phác đồ ARV",
                    error = ex.Message
                });
            }
        }

        // Lấy danh sách bệnh nhân cho bác sĩ
        [HttpGet("all-patients")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetPatients()
        {
            try
            {
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"GetPatients - DoctorId from JWT: '{doctorId}'");

                if (string.IsNullOrEmpty(doctorId))
                {
                    return BadRequest(new { success = false, message = "Doctor ID not found in token" });
                }

                // Lấy danh sách bệnh nhân từ appointments
                var patients = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId && a.Status == AppointmentStatus.Confirmed) // Chỉ lấy appointments đã được xác nhận
                    .GroupBy(a => new { a.PatientId, a.PatientName })
                    .Select(g => new
                    {
                        patientId = g.Key.PatientId,
                        patientName = g.Key.PatientName,
                        lastAppointment = g.Max(a => a.Date).ToString("yyyy-MM-dd"),
                        totalAppointments = g.Count(),
                        currentRegimen = _context.PatientRegimens
                            .Where(pr => pr.PatientId == g.Key.PatientId && pr.Status == "Đang điều trị")
                            .Select(pr => new
                            {
                                id = pr.Id,
                                name = _context.ARVRegimens.Where(r => r.Id == pr.RegimenId).Select(r => r.Name).FirstOrDefault(),
                                status = pr.Status
                            })
                            .FirstOrDefault()
                    })
                    .OrderByDescending(p => p.lastAppointment)
                    .ToListAsync();

                return Ok(new { success = true, data = patients, count = patients.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải danh sách bệnh nhân", error = ex.Message });
            }
        }



        // Kê đơn phác đồ cho bệnh nhân
        [HttpPost("prescribe")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> PrescribeRegimen([FromBody] PrescribeRegimenRequest request)
        {
            try
            {
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var doctorName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown Doctor";

                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new { success = false, message = "Không thể xác định doctor" });
                }

                // Kiểm tra xem bệnh nhân đã có phác đồ đang hoạt động chưa
                var existingActiveRegimen = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == request.PatientId && pr.Status == "Đang điều trị")
                    .FirstOrDefaultAsync();

                if (existingActiveRegimen != null)
                {
                    return BadRequest(new { success = false, message = "Bệnh nhân đã có phác đồ đang hoạt động" });
                }

                var patientRegimen = new PatientRegimen
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = request.PatientId,
                    PatientName = request.PatientName,
                    DoctorId = doctorId,
                    DoctorName = doctorName,
                    RegimenId = request.RegimenId,
                    StartDate = request.StartDate ?? DateTime.UtcNow,
                    Status = "Đang điều trị",
                    Notes = request.Notes ?? "",
                    Reason = request.Reason ?? "",
                    CreatedAt = DateTime.UtcNow
                };

                _context.PatientRegimens.Add(patientRegimen);
                await _context.SaveChangesAsync();

                // Send notification to patient about new ARV prescription
                try
                {
                    var regimenName = GetRegimenNameById(request.RegimenId);
                    await _notificationService.NotifyMedicationReminderAsync(
                        request.PatientId,
                        regimenName,
                        "Theo chỉ định bác sĩ",
                        "Hàng ngày"
                    );
                    Console.WriteLine($"ARV prescription notification sent to patient {request.PatientId}");
                }
                catch (Exception notifEx)
                {
                    Console.WriteLine($"Error sending ARV prescription notification: {notifEx.Message}");
                    // Don't fail the prescription creation
                }

                return Ok(new { success = true, message = "Đã kê đơn phác đồ thành công", data = patientRegimen });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PrescribeRegimen Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi khi kê đơn phác đồ", error = ex.Message });
            }
        }



        // Lấy danh sách bệnh nhân của doctor
        [HttpGet("doctor-patients")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetDoctorPatients()
        {
            try
            {
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new { success = false, message = "Không thể xác định doctor" });
                }

                // Lấy danh sách bệnh nhân từ appointments
                var patients = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId)
                    .GroupBy(a => a.PatientId)
                    .Select(g => new
                    {
                        PatientId = g.Key,
                        PatientName = g.First().PatientName,
                        LastAppointment = g.Max(a => a.Date).ToString("yyyy-MM-dd"),
                        TotalAppointments = g.Count()
                    })
                    .ToListAsync();

                // Lấy thông tin phác đồ hiện tại cho mỗi bệnh nhân
                var patientsWithRegimens = new List<object>();
                foreach (var patient in patients)
                {
                    var currentRegimen = await _context.PatientRegimens
                        .Where(pr => pr.PatientId == patient.PatientId && pr.Status == "Đang điều trị")
                        .Include(pr => pr.Regimen)
                        .FirstOrDefaultAsync();

                    patientsWithRegimens.Add(new
                    {
                        patientId = patient.PatientId,
                        patientName = patient.PatientName,
                        lastAppointment = patient.LastAppointment,
                        totalAppointments = patient.TotalAppointments,
                        currentRegimen = currentRegimen != null ? new
                        {
                            id = currentRegimen.Id,
                            name = currentRegimen.Regimen?.Name ?? "Không xác định",
                            status = currentRegimen.Status
                        } : null
                    });
                }

                return Ok(new { success = true, data = patientsWithRegimens });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetDoctorPatients Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách bệnh nhân", error = ex.Message });
            }
        }

        // Tạo phác đồ ARV mới
        [HttpPost("regimens")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> CreateRegimen([FromBody] CreateRegimenRequest request)
        {
            try
            {
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorId))
                {
                    return Unauthorized(new { success = false, message = "Không thể xác định doctor" });
                }

                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Description))
                {
                    return BadRequest(new { success = false, message = "Tên và mô tả phác đồ không được để trống" });
                }

                // Tạo regimen mới
                var newRegimen = new ARVRegimen
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    LineOfTreatment = request.LineOfTreatment,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ARVRegimens.Add(newRegimen);

                // Tạo medications cho regimen
                if (request.SelectedDrugs != null && request.SelectedDrugs.Any())
                {
                    for (int i = 0; i < request.SelectedDrugs.Count; i++)
                    {
                        var drugId = request.SelectedDrugs[i];
                        var drug = await _context.ARVDrugs.FindAsync(drugId);

                        if (drug != null)
                        {
                            var medication = new ARVMedication
                            {
                                Id = Guid.NewGuid().ToString(),
                                RegimenId = newRegimen.Id,
                                MedicationName = drug.Name,
                                ActiveIngredient = drug.GenericName,
                                Dosage = drug.Dosage,
                                Frequency = "1 lần/ngày", // Default frequency
                                Instructions = drug.Instructions ?? "Theo chỉ định bác sĩ",
                                SideEffects = drug.SideEffects ?? "",
                                SortOrder = i + 1
                            };

                            _context.ARVMedications.Add(medication);
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Tạo phác đồ thành công", data = newRegimen });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CreateRegimen Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi khi tạo phác đồ", error = ex.Message });
            }
        }

        // Lấy danh sách thuốc ARV
        [HttpGet("drugs")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetARVDrugs()
        {
            try
            {
                var drugs = await _context.ARVDrugs
                    .Where(d => d.IsActive)
                    .Select(d => new
                    {
                        id = d.Id,
                        name = d.Name,
                        genericName = d.GenericName,
                        dosage = d.Dosage,
                        category = d.DrugClass,
                        instructions = d.Instructions,
                        sideEffects = d.SideEffects
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = drugs });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetARVDrugs Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách thuốc", error = ex.Message });
            }
        }

        // Helper method để lấy tên phác đồ
        private string GetRegimenNameById(string regimenId)
        {
            try
            {
                var regimen = _context.ARVRegimens.FirstOrDefault(r => r.Id == regimenId);
                return regimen?.Name ?? "Phác đồ không xác định";
            }
            catch
            {
                return regimenId switch
                {
                    "regimen-001" => "TDF/3TC/EFV",
                    "regimen-002" => "AZT/3TC/NVP",
                    "regimen-003" => "ABC/3TC/DTG",
                    "regimen-004" => "TAF/FTC/BIC",
                    _ => "Phác đồ không xác định"
                };
            }
        }

        // Lấy lịch sử phác đồ của bệnh nhân
        [HttpGet("patient/{patientId}/history")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetPatientRegimenHistory(string patientId)
        {
            try
            {
                var history = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .Include(pr => pr.Regimen)
                    .ThenInclude(r => r.Medications)
                    .Include(pr => pr.AdherenceRecords)
                    .Include(pr => pr.SideEffectRecords)
                    .OrderByDescending(pr => pr.CreatedAt)
                    .Select(pr => new
                    {
                        pr.Id,
                        pr.PatientName,
                        pr.DoctorName,
                        Regimen = new
                        {
                            pr.Regimen.Id,
                            pr.Regimen.Name,
                            pr.Regimen.Description,
                            pr.Regimen.LineOfTreatment,
                            Medications = pr.Regimen.Medications.OrderBy(m => m.SortOrder)
                        },
                        pr.StartDate,
                        pr.EndDate,
                        pr.Status,
                        pr.Notes,
                        pr.Reason,
                        pr.CreatedAt,
                        AdherenceCount = pr.AdherenceRecords.Count,
                        SideEffectCount = pr.SideEffectRecords.Count(se => se.Status == "Đang theo dõi"),
                        LatestAdherence = pr.AdherenceRecords
                            .OrderByDescending(ar => ar.RecordDate)
                            .Select(ar => ar.AdherencePercentage)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = history });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải lịch sử phác đồ", error = ex.Message });
            }
        }

        // Cập nhật phác đồ
        [HttpPut("{patientRegimenId}")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> UpdateRegimen(string patientRegimenId, [FromBody] UpdateRegimenRequest request)
        {
            try
            {
                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == patientRegimenId);

                if (patientRegimen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy phác đồ" });
                }

                patientRegimen.Status = request.Status;
                patientRegimen.Notes = request.Notes;
                patientRegimen.UpdatedAt = DateTime.UtcNow;

                if (request.Status == "Ngừng điều trị" || request.Status == "Hoàn thành")
                {
                    patientRegimen.EndDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã cập nhật phác đồ thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật phác đồ", error = ex.Message });
            }
        }

        // Ghi nhận tuân thủ điều trị
        [HttpPost("adherence")]
        [Authorize(Roles = "doctor,customer")]
        public async Task<IActionResult> RecordAdherence([FromBody] RecordAdherenceRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;

                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == request.PatientRegimenId);

                if (patientRegimen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy phác đồ" });
                }

                var adherenceRecord = new AdherenceRecord
                {
                    PatientRegimenId = request.PatientRegimenId,
                    RecordDate = request.RecordDate,
                    TotalDoses = 1, // Default value
                    TakenDoses = 1, // Default value
                    AdherencePercentage = request.AdherencePercentage,
                    Period = request.Period ?? "Daily",
                    Notes = request.Notes ?? "",
                    Challenges = request.Challenges ?? "",
                    RecordedBy = userName
                };

                _context.AdherenceRecords.Add(adherenceRecord);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã ghi nhận tuân thủ điều trị thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi ghi nhận tuân thủ", error = ex.Message });
            }
        }

        // Lấy thống kê tuân thủ điều trị của bệnh nhân
        [HttpGet("adherence/{patientId}")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetPatientAdherence(string patientId)
        {
            try
            {
                var adherenceData = await _context.AdherenceRecords
                    .Where(pa => _context.PatientRegimens
                        .Where(pr => pr.PatientId == patientId)
                        .Select(pr => pr.Id)
                        .Contains(pa.PatientRegimenId.ToString()))
                    .OrderByDescending(pa => pa.RecordDate)
                    .Take(30) // Lấy 30 bản ghi gần nhất
                    .Select(pa => new
                    {
                        pa.Id,
                        pa.RecordDate,
                        pa.AdherencePercentage,
                        pa.Period,
                        pa.Notes,
                        pa.Challenges,
                        pa.RecordedBy
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = adherenceData });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy dữ liệu tuân thủ", error = ex.Message });
            }
        }

        // Báo cáo tác dụng phụ
        [HttpPost("side-effects")]
        [Authorize(Roles = "doctor,customer")]
        public async Task<IActionResult> ReportSideEffect([FromBody] SideEffectRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;

                var sideEffectRecord = new SideEffectRecord
                {
                    PatientRegimenId = request.PatientRegimenId,
                    SideEffect = request.SideEffect,
                    Severity = request.Severity,
                    OnsetDate = request.OnsetDate,
                    Description = request.Description,
                    Treatment = "Đang theo dõi", // Required field
                    Status = "Đang theo dõi",
                    ReportedBy = userName ?? "Unknown"
                };

                _context.SideEffectRecords.Add(sideEffectRecord);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã báo cáo tác dụng phụ thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi báo cáo tác dụng phụ", error = ex.Message });
            }
        }

        // Lấy báo cáo tuân thủ
        [HttpGet("adherence/regimen/{patientRegimenId}")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetAdherenceReports(string patientRegimenId)
        {
            try
            {
                var reports = await _context.AdherenceRecords
                    .Where(ar => ar.PatientRegimenId == patientRegimenId)
                    .OrderByDescending(ar => ar.RecordDate)
                    .ToListAsync();

                return Ok(new { success = true, data = reports });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải báo cáo tuân thủ", error = ex.Message });
            }
        }

        // Lấy báo cáo tác dụng phụ
        [HttpGet("side-effects/{patientRegimenId}")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetSideEffectReports(string patientRegimenId)
        {
            try
            {
                var reports = await _context.SideEffectRecords
                    .Where(se => se.PatientRegimenId == patientRegimenId)
                    .OrderByDescending(se => se.OnsetDate)
                    .ToListAsync();

                return Ok(new { success = true, data = reports });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải báo cáo tác dụng phụ", error = ex.Message });
            }
        }




    }

    // DTOs
    public class PrescribeRegimenRequest
    {
        public required string PatientId { get; set; }
        public required string PatientName { get; set; }
        public required string RegimenId { get; set; }
        public DateTime? StartDate { get; set; }
        public string? Notes { get; set; }
        public string? Reason { get; set; }
    }

    public class UpdateRegimenRequest
    {
        public required string Status { get; set; }
        public required string Notes { get; set; }
    }

    public class AdherenceRequest
    {
        public required string PatientRegimenId { get; set; }
        public DateTime RecordDate { get; set; }
        public int TotalDoses { get; set; }
        public int TakenDoses { get; set; }
        public required string Notes { get; set; }
    }

    public class SideEffectRequest
    {
        public required string PatientRegimenId { get; set; }
        public required string SideEffect { get; set; }
        public required string Severity { get; set; }
        public DateTime OnsetDate { get; set; }
        public required string Description { get; set; }
    }

    public class RecordAdherenceRequest
    {
        public required string PatientRegimenId { get; set; }
        public DateTime RecordDate { get; set; }
        public decimal AdherencePercentage { get; set; }
        public string? Period { get; set; }
        public string? Notes { get; set; }
        public string? Challenges { get; set; }
    }

    // Request models for creating regimens
    public class CreateRegimenRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string LineOfTreatment { get; set; } = string.Empty;
        public List<string> SelectedDrugs { get; set; } = new List<string>();
    }

    public class CreateMedicationRequest
    {
        public string MedicationName { get; set; } = string.Empty;
        public string ActiveIngredient { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string SideEffects { get; set; } = string.Empty;
    }

}
