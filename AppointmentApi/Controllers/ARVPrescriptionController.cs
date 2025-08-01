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
    public partial class ARVPrescriptionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ARVPrescriptionController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // Test endpoint
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            try
            {
                // Test database connection
                var count = await _context.ARVDrugs.CountAsync();
                return Ok(new
                {
                    success = true,
                    message = "ARV API is working",
                    timestamp = DateTime.UtcNow,
                    drugCount = count
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "ARV API has issues",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        // Lấy danh sách phác đồ ARV
        [HttpGet("regimens")]
        // [Authorize(Roles = "doctor")] // Tạm thời bỏ để test
        public async Task<IActionResult> GetRegimens()
        {
            try
            {
                // Kiểm tra xem có phác đồ nào trong database không
                var regimenCount = await _context.ARVRegimens.CountAsync();
                if (regimenCount == 0)
                {
                    // Tạo dữ liệu mẫu nếu chưa có
                    await SeedARVRegimens();
                }

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

                // Debug: Log all PatientRegimens to see what's in database
                var allRegimens = await _context.PatientRegimens.ToListAsync();
                Console.WriteLine($"=== DOCTOR PAGE DEBUG ===");
                Console.WriteLine($"Total PatientRegimens in database: {allRegimens.Count}");
                Console.WriteLine($"Doctor ID: {doctorId}");

                // Show first few regimens
                foreach (var reg in allRegimens.Take(5))
                {
                    Console.WriteLine($"PatientRegimen: PatientId='{reg.PatientId}', RegimenId={reg.RegimenId}, Status={reg.Status}");
                }

                // Lấy danh sách bệnh nhân từ appointments
                var patients = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId && a.Status == AppointmentStatus.Confirmed) // Chỉ lấy appointments đã được xác nhận
                    .GroupBy(a => new { a.PatientId, a.PatientName })
                    .ToListAsync(); // Execute first to get patient list

                Console.WriteLine($"Found {patients.Count} patient groups from appointments");
                foreach (var p in patients.Take(3))
                {
                    Console.WriteLine($"Appointment Patient: PatientId='{p.Key.PatientId}', Name='{p.Key.PatientName}'");
                }

                // Then manually check for regimens
                var result = new List<object>();
                foreach (var g in patients)
                {
                    Console.WriteLine($"Checking patient: '{g.Key.PatientId}' - {g.Key.PatientName}");

                    // Try exact match first
                    var regimen = await _context.PatientRegimens
                        .Where(pr => pr.PatientId == g.Key.PatientId && pr.Status == "Active")
                        .FirstOrDefaultAsync();

                    // If no exact match, try partial matches
                    if (regimen == null)
                    {
                        regimen = allRegimens
                            .Where(pr => pr.Status == "Active")
                            .FirstOrDefault(pr =>
                                pr.PatientId.Contains(g.Key.PatientId) ||
                                g.Key.PatientId.Contains(pr.PatientId) ||
                                pr.PatientId.Equals(g.Key.PatientId, StringComparison.OrdinalIgnoreCase)
                            );
                    }

                    Console.WriteLine($"Found regimen for '{g.Key.PatientId}': {(regimen != null ? $"YES (ID: {regimen.Id})" : "NO")}");

                    // Get regimen name if found
                    string regimenName = "Chưa có phác đồ";
                    if (regimen != null)
                    {
                        var regimenDetails = await _context.ARVRegimens
                            .FirstOrDefaultAsync(r => r.Id == regimen.RegimenId.ToString());

                        if (regimenDetails == null)
                        {
                            var allARVRegimens = await _context.ARVRegimens.OrderBy(r => r.Id).ToListAsync();
                            if (regimen.RegimenId > 0 && regimen.RegimenId <= allARVRegimens.Count)
                            {
                                regimenDetails = allARVRegimens[regimen.RegimenId - 1];
                            }
                        }

                        regimenName = regimenDetails?.Name ?? "Phác đồ ARV";
                    }

                    result.Add(new
                    {
                        patientId = g.Key.PatientId,
                        patientName = g.Key.PatientName,
                        lastAppointment = g.Max(a => a.Date).ToString("yyyy-MM-dd"),
                        totalAppointments = g.Count(),
                        currentRegimen = regimen != null ? new
                        {
                            id = regimen.Id,
                            name = regimenName,
                            status = regimen.Status
                        } : null
                    });
                }

                return Ok(new { success = true, data = result, count = result.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi tải danh sách bệnh nhân", error = ex.Message });
            }
        }



        // Kê đơn phác đồ cho bệnh nhân - SIMPLIFIED VERSION
        [HttpPost("prescribe")]
        // [Authorize(Roles = "doctor")] // Tạm thời bỏ để test
        public async Task<IActionResult> PrescribeRegimen([FromBody] PrescribeRegimenRequest request)
        {
            try
            {
                Console.WriteLine($"PrescribeRegimen called with: PatientId={request.PatientId}, RegimenId={request.RegimenId}");

                // Use Entity Framework to create PatientRegimen
                var doctorId = "doctor-001"; // Use consistent doctor ID

                // Get regimen details using string ID
                var regimen = await _context.ARVRegimens
                    .FirstOrDefaultAsync(r => r.Id == request.RegimenId);

                if (regimen == null)
                {
                    return BadRequest(new { success = false, message = "Không tìm thấy phác đồ" });
                }

                // Convert string RegimenId to int for PatientRegimen table
                if (!int.TryParse(request.RegimenId, out int regimenIdInt))
                {
                    // If regimen ID is not numeric, try to find a mapping or use default
                    regimenIdInt = 1; // Default regimen ID
                }

                // Create new PatientRegimen using existing schema
                var patientRegimen = new PatientRegimen
                {
                    PatientId = request.PatientId,
                    RegimenId = regimenIdInt,
                    PrescribedBy = doctorId,
                    PrescribedDate = DateTime.UtcNow,
                    StartDate = request.StartDate ?? DateTime.UtcNow,
                    Status = "Active",
                    Notes = request.Notes ?? "",
                    DiscontinuationReason = "",
                    ReviewedBy = doctorId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.PatientRegimens.Add(patientRegimen);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Successfully prescribed regimen {request.RegimenId} to patient {request.PatientId}");

                return Ok(new
                {
                    success = true,
                    message = "Kê đơn phác đồ thành công",
                    data = new
                    {
                        id = patientRegimen.Id,
                        patientId = patientRegimen.PatientId,
                        regimenId = patientRegimen.RegimenId,
                        regimenName = regimen.Name,
                        prescribedBy = patientRegimen.PrescribedBy,
                        startDate = patientRegimen.StartDate,
                        status = patientRegimen.Status,
                        notes = patientRegimen.Notes
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PrescribeRegimen Error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
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
                    try
                    {
                        var currentRegimen = await _context.PatientRegimens
                            .Where(pr => pr.PatientId == patient.PatientId && pr.Status == "Active")
                            // Regimen navigation removed due to schema mismatch
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
                                name = "Phác đồ ARV", // Simplified since Regimen navigation removed
                                status = currentRegimen.Status
                            } : null
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing patient {patient.PatientId}: {ex.Message}");
                        // Thêm bệnh nhân mà không có thông tin phác đồ
                        patientsWithRegimens.Add(new
                        {
                            patientId = patient.PatientId,
                            patientName = patient.PatientName,
                            lastAppointment = patient.LastAppointment,
                            totalAppointments = patient.TotalAppointments,
                            currentRegimen = (object?)null
                        });
                    }
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
        // [Authorize(Roles = "doctor")] // Tạm thời bỏ để test
        public async Task<IActionResult> CreateRegimen([FromBody] CreateRegimenRequest request)
        {
            try
            {
                // Tạm thời sử dụng doctor mặc định để test
                var doctorId = "doctor@gmail.com";

                // var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                // if (string.IsNullOrEmpty(doctorId))
                // {
                //     return Unauthorized(new { success = false, message = "Không thể xác định doctor" });
                // }

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
                    var connection = _context.Database.GetDbConnection();
                    await connection.OpenAsync();

                    for (int i = 0; i < request.SelectedDrugs.Count; i++)
                    {
                        var drugId = request.SelectedDrugs[i];

                        // Lấy drug info bằng raw SQL
                        using var command = connection.CreateCommand();
                        command.CommandText = @"
                            SELECT ""Name"", ""GenericName"", ""Dosage"", ""Instructions"", ""SideEffects""
                            FROM ""ARVDrugs""
                            WHERE ""Id""::text = @drugId AND ""IsActive"" = true";

                        var parameter = command.CreateParameter();
                        parameter.ParameterName = "@drugId";
                        parameter.Value = drugId;
                        command.Parameters.Add(parameter);

                        using var reader = await command.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            var medication = new ARVMedication
                            {
                                Id = Guid.NewGuid().ToString(),
                                RegimenId = newRegimen.Id,
                                MedicationName = reader["Name"]?.ToString() ?? "",
                                ActiveIngredient = reader["GenericName"]?.ToString() ?? "",
                                Dosage = reader["Dosage"]?.ToString() ?? "",
                                Frequency = "1 lần/ngày", // Default frequency
                                Instructions = reader["Instructions"]?.ToString() ?? "Theo chỉ định bác sĩ",
                                SideEffects = reader["SideEffects"]?.ToString() ?? "",
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
        // [Authorize(Roles = "doctor")] // Tạm thời bỏ để test
        public async Task<IActionResult> GetARVDrugs()
        {
            try
            {
                // Kiểm tra xem có thuốc nào trong database không bằng raw SQL
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT COUNT(*) FROM ""ARVDrugs"" WHERE ""IsActive"" = true";

                var drugCount = Convert.ToInt32(await command.ExecuteScalarAsync());

                if (drugCount == 0)
                {
                    // Tạo dữ liệu mẫu nếu chưa có
                    await SeedARVDrugs();
                }

                // Lấy dữ liệu bằng raw SQL để tránh type casting issues
                command.CommandText = @"
                    SELECT ""Id"", ""Name"", ""GenericName"", ""Dosage"", ""DrugClass"", ""Instructions"", ""SideEffects""
                    FROM ""ARVDrugs""
                    WHERE ""IsActive"" = true
                    ORDER BY ""Name""";

                var drugs = new List<object>();
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    drugs.Add(new
                    {
                        id = reader["Id"]?.ToString() ?? "",
                        name = reader["Name"]?.ToString() ?? "",
                        genericName = reader["GenericName"]?.ToString() ?? "",
                        dosage = reader["Dosage"]?.ToString() ?? "",
                        category = reader["DrugClass"]?.ToString() ?? "",
                        instructions = reader["Instructions"]?.ToString() ?? "",
                        sideEffects = reader["SideEffects"]?.ToString() ?? ""
                    });
                }

                return Ok(new { success = true, data = drugs, count = drugs.Count });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetARVDrugs Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách thuốc", error = ex.Message });
            }
        }

        // Tạo dữ liệu mẫu cho thuốc ARV
        private async Task SeedARVDrugs()
        {
            var sampleDrugs = new List<ARVDrug>
            {
                new ARVDrug
                {
                    Id = "drug-1",
                    Name = "Tenofovir Disoproxil Fumarate",
                    GenericName = "TDF",
                    Dosage = "300mg",
                    Form = "Viên nén",
                    DrugClass = "NRTI",
                    Instructions = "Uống 1 viên/ngày, cùng với thức ăn",
                    SideEffects = "Buồn nôn, đau đầu, mệt mỏi",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVDrug
                {
                    Id = "drug-2",
                    Name = "Emtricitabine",
                    GenericName = "FTC",
                    Dosage = "200mg",
                    Form = "Viên nang",
                    DrugClass = "NRTI",
                    Instructions = "Uống 1 viên/ngày",
                    SideEffects = "Đau đầu, tiêu chảy, buồn nôn",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVDrug
                {
                    Id = "drug-3",
                    Name = "Efavirenz",
                    GenericName = "EFV",
                    Dosage = "600mg",
                    Form = "Viên nén",
                    DrugClass = "NNRTI",
                    Instructions = "Uống 1 viên/ngày trước khi đi ngủ",
                    SideEffects = "Chóng mặt, mơ mộng bất thường, rối loạn giấc ngủ",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVDrug
                {
                    Id = "drug-4",
                    Name = "Dolutegravir",
                    GenericName = "DTG",
                    Dosage = "50mg",
                    Form = "Viên nén",
                    DrugClass = "INSTI",
                    Instructions = "Uống 1 viên/ngày",
                    SideEffects = "Đau đầu, buồn nôn, mất ngủ",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVDrug
                {
                    Id = "drug-5",
                    Name = "Rilpivirine",
                    GenericName = "RPV",
                    Dosage = "25mg",
                    Form = "Viên nén",
                    DrugClass = "NNRTI",
                    Instructions = "Uống 1 viên/ngày cùng với thức ăn",
                    SideEffects = "Buồn nôn, đau đầu, mệt mỏi",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.ARVDrugs.AddRange(sampleDrugs);
            await _context.SaveChangesAsync();
        }

        // Tạo dữ liệu mẫu cho phác đồ ARV
        private async Task SeedARVRegimens()
        {
            var sampleRegimens = new List<ARVRegimen>
            {
                new ARVRegimen
                {
                    Id = "regimen-1",
                    Name = "TDF/3TC/EFV",
                    Description = "Phác đồ điều trị hàng đầu cho người lớn và thanh thiếu niên",
                    Category = "First-line",
                    LineOfTreatment = "Hàng 1",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVRegimen
                {
                    Id = "regimen-2",
                    Name = "TDF/3TC/DTG",
                    Description = "Phác đồ điều trị hàng đầu với Dolutegravir",
                    Category = "First-line",
                    LineOfTreatment = "Hàng 1",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVRegimen
                {
                    Id = "regimen-3",
                    Name = "ABC/3TC/DTG",
                    Description = "Phác đồ thay thế cho bệnh nhân không dung nạp TDF",
                    Category = "Alternative",
                    LineOfTreatment = "Hàng 1",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVRegimen
                {
                    Id = "regimen-4",
                    Name = "TDF/3TC/RPV",
                    Description = "Phác đồ cho bệnh nhân có tải lượng virus thấp",
                    Category = "Alternative",
                    LineOfTreatment = "Hàng 1",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ARVRegimen
                {
                    Id = "regimen-5",
                    Name = "AZT/3TC/LPV/r",
                    Description = "Phác đồ điều trị hàng hai",
                    Category = "Second-line",
                    LineOfTreatment = "Hàng 2",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.ARVRegimens.AddRange(sampleRegimens);
            await _context.SaveChangesAsync();

            // Tạo medications cho từng regimen
            var medications = new List<ARVMedication>
            {
                // TDF/3TC/EFV
                new ARVMedication
                {
                    Id = "med-1-1",
                    RegimenId = "regimen-1",
                    MedicationName = "Tenofovir/Emtricitabine/Efavirenz",
                    ActiveIngredient = "TDF 300mg + 3TC 200mg + EFV 600mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống vào buổi tối trước khi đi ngủ",
                    SideEffects = "Chóng mặt, mơ mộng bất thường",
                    SortOrder = 1
                },
                // TDF/3TC/DTG
                new ARVMedication
                {
                    Id = "med-2-1",
                    RegimenId = "regimen-2",
                    MedicationName = "Tenofovir/Emtricitabine",
                    ActiveIngredient = "TDF 300mg + 3TC 200mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống cùng với thức ăn",
                    SideEffects = "Buồn nôn, đau đầu",
                    SortOrder = 1
                },
                new ARVMedication
                {
                    Id = "med-2-2",
                    RegimenId = "regimen-2",
                    MedicationName = "Dolutegravir",
                    ActiveIngredient = "DTG 50mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Có thể uống với hoặc không có thức ăn",
                    SideEffects = "Đau đầu, mất ngủ",
                    SortOrder = 2
                }
            };

            _context.ARVMedications.AddRange(medications);
            await _context.SaveChangesAsync();
        }

        // Helper method để lấy tên phác đồ
        private string GetRegimenNameById(int regimenId)
        {
            try
            {
                // Query by integer ID from ARVRegimenDrugs table to get regimen info
                var regimenDrug = _context.ARVRegimenDrugs.FirstOrDefault(rd => rd.RegimenId == regimenId);
                if (regimenDrug != null)
                {
                    return $"Phác đồ ID {regimenId}";
                }
                return "Phác đồ không xác định";
            }
            catch
            {
                return "Phác đồ không xác định";
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
                    // Regimen navigation removed due to schema mismatch
                    // Navigation properties removed due to schema mismatch
                    .OrderByDescending(pr => pr.CreatedAt)
                    .Select(pr => new
                    {
                        pr.Id,
                        PatientName = pr.PatientId, // Use PatientId as name for now
                        DoctorName = pr.PrescribedBy, // Use PrescribedBy instead of DoctorName
                        Regimen = new
                        {
                            Id = pr.RegimenId, // Use RegimenId directly
                            Name = "Phác đồ ARV", // Simplified for now
                            Description = "Phác đồ điều trị ARV",
                            LineOfTreatment = "Tuyến 1",
                            Medications = new List<object>() // Empty for now
                        },
                        pr.StartDate,
                        pr.EndDate,
                        pr.Status,
                        pr.Notes,
                        Reason = pr.Notes, // Use Notes instead of Reason
                        pr.CreatedAt,
                        AdherenceCount = 0, // Simplified since navigation properties removed
                        SideEffectCount = 0, // Simplified since navigation properties removed
                        LatestAdherence = 0 // Simplified since navigation properties removed
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
                // Convert string ID to int
                if (!int.TryParse(patientRegimenId, out int regimenIdInt))
                {
                    return BadRequest(new { success = false, message = "Invalid regimen ID" });
                }

                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == regimenIdInt);

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

                // Convert string ID to int
                if (!int.TryParse(request.PatientRegimenId, out int regimenIdInt))
                {
                    return BadRequest(new { success = false, message = "Invalid regimen ID" });
                }

                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == regimenIdInt);

                if (patientRegimen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy phác đồ" });
                }

                var adherenceRecord = new AdherenceRecord
                {
                    PatientRegimenId = int.Parse(request.PatientRegimenId),
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
                // Get patient regimen IDs as integers
                var patientRegimenIds = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .Select(pr => pr.Id)
                    .ToListAsync();

                var adherenceData = await _context.AdherenceRecords
                    .Where(pa => patientRegimenIds.Contains(pa.PatientRegimenId))
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
                    PatientRegimenId = int.Parse(request.PatientRegimenId),
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
                    .Where(ar => ar.PatientRegimenId == int.Parse(patientRegimenId))
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
                    .Where(se => se.PatientRegimenId == int.Parse(patientRegimenId))
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

    // Reset ARV Data endpoint
    public partial class ARVPrescriptionController
    {
        [HttpPost("reset")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> ResetARVData()
        {
            try
            {
                // Clear existing data
                var existingMedications = await _context.ARVMedications.ToListAsync();
                var existingRegimens = await _context.ARVRegimens.ToListAsync();
                var existingDrugs = await _context.ARVDrugs.ToListAsync();

                _context.ARVMedications.RemoveRange(existingMedications);
                _context.ARVRegimens.RemoveRange(existingRegimens);
                _context.ARVDrugs.RemoveRange(existingDrugs);
                await _context.SaveChangesAsync();

                // Reseed data
                await SeedARVDrugs();
                await SeedARVRegimens();

                return Ok(new { success = true, message = "ARV data reset successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error resetting ARV data", error = ex.Message });
            }
        }

        [HttpGet("debug/schema")]
        public async Task<IActionResult> CheckSchema()
        {
            try
            {
                // Check if ARV tables exist and their structure
                var result = new
                {
                    success = true,
                    message = "Schema check completed",
                    tables = new
                    {
                        arvDrugs = await CheckTableExists("ARVDrugs"),
                        arvRegimens = await CheckTableExists("ARVRegimens"),
                        arvMedications = await CheckTableExists("ARVMedications")
                    }
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Schema check failed", error = ex.Message });
            }
        }

        private async Task<object> CheckTableExists(string tableName)
        {
            try
            {
                var sql = $@"
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_name = '{tableName}'
                    ORDER BY ordinal_position";

                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandText = sql;

                var columns = new List<object>();
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    columns.Add(new
                    {
                        name = reader["column_name"]?.ToString() ?? "",
                        type = reader["data_type"]?.ToString() ?? ""
                    });
                }

                return new { exists = columns.Any(), columns = columns };
            }
            catch (Exception ex)
            {
                return new { exists = false, error = ex.Message };
            }
        }

        [HttpPost("test-prescribe")]
        public async Task<IActionResult> TestPrescribe([FromBody] dynamic request)
        {
            try
            {
                // Simple test to insert into PatientRegimens table
                var patientId = request?.patientId?.ToString() ?? "test-patient";
                var regimenId = 1; // Default regimen ID
                var doctorId = "doctor@gmail.com";

                var sql = @"
                    INSERT INTO ""PatientRegimens""
                    (""PatientId"", ""RegimenId"", ""PrescribedBy"", ""PrescribedDate"", ""StartDate"", ""Status"", ""Notes"", ""DiscontinuationReason"", ""ReviewedBy"", ""CreatedAt"", ""UpdatedAt"")
                    VALUES (@PatientId, @RegimenId, @PrescribedBy, @PrescribedDate, @StartDate, @Status, @Notes, @DiscontinuationReason, @ReviewedBy, @CreatedAt, @UpdatedAt)";

                await _context.Database.ExecuteSqlRawAsync(sql,
                    new Npgsql.NpgsqlParameter("@PatientId", patientId),
                    new Npgsql.NpgsqlParameter("@RegimenId", regimenId),
                    new Npgsql.NpgsqlParameter("@PrescribedBy", doctorId),
                    new Npgsql.NpgsqlParameter("@PrescribedDate", DateTime.UtcNow),
                    new Npgsql.NpgsqlParameter("@StartDate", DateTime.UtcNow),
                    new Npgsql.NpgsqlParameter("@Status", "Active"),
                    new Npgsql.NpgsqlParameter("@Notes", "Test prescription"),
                    new Npgsql.NpgsqlParameter("@DiscontinuationReason", ""),
                    new Npgsql.NpgsqlParameter("@ReviewedBy", doctorId),
                    new Npgsql.NpgsqlParameter("@CreatedAt", DateTime.UtcNow),
                    new Npgsql.NpgsqlParameter("@UpdatedAt", DateTime.UtcNow)
                );

                return Ok(new
                {
                    success = true,
                    message = "Test prescription successful",
                    data = new
                    {
                        patientId = patientId,
                        regimenId = regimenId,
                        prescribedBy = doctorId,
                        timestamp = DateTime.UtcNow
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Test prescription failed", error = ex.Message });
            }
        }

        [HttpGet("patient/{patientId}/regimens")]
        public async Task<IActionResult> GetPatientRegimens(string patientId)
        {
            try
            {
                Console.WriteLine($"GetPatientRegimens called for patientId: {patientId}");

                // Debug: Show all PatientRegimens in database
                var allRegimens = await _context.PatientRegimens.ToListAsync();
                Console.WriteLine($"Total PatientRegimens in database: {allRegimens.Count}");
                foreach (var reg in allRegimens.Take(5)) // Show first 5
                {
                    Console.WriteLine($"DB PatientRegimen: Id={reg.Id}, PatientId='{reg.PatientId}', Status={reg.Status}");
                }

                // Try exact match first
                var regimens = await _context.PatientRegimens
                    .Where(pr => pr.PatientId == patientId)
                    .OrderByDescending(pr => pr.PrescribedDate)
                    .ToListAsync();

                Console.WriteLine($"Exact match found {regimens.Count} regimens for patient '{patientId}'");

                if (regimens.Count == 0)
                {
                    Console.WriteLine($"No exact match. Checking partial matches...");
                    var partialMatches = allRegimens.Where(r =>
                        r.PatientId.Contains(patientId) ||
                        patientId.Contains(r.PatientId) ||
                        r.PatientId.Equals(patientId, StringComparison.OrdinalIgnoreCase)
                    ).ToList();

                    Console.WriteLine($"Partial matches found: {partialMatches.Count}");
                    foreach (var match in partialMatches.Take(3))
                    {
                        Console.WriteLine($"  Match: '{match.PatientId}' vs '{patientId}'");
                    }

                    // Use partial matches if found
                    if (partialMatches.Any())
                    {
                        regimens = partialMatches.OrderByDescending(r => r.PrescribedDate).ToList();
                        Console.WriteLine($"Using {regimens.Count} partial matches");
                    }
                }

                var result = new List<object>();
                foreach (var regimen in regimens)
                {
                    // Get regimen details - try multiple mapping strategies
                    var regimenDetails = await _context.ARVRegimens
                        .FirstOrDefaultAsync(r => r.Id == regimen.RegimenId.ToString());

                    // If not found by string conversion, try to find by index (1-based)
                    if (regimenDetails == null)
                    {
                        var allARVRegimens = await _context.ARVRegimens.OrderBy(r => r.Id).ToListAsync();
                        if (regimen.RegimenId > 0 && regimen.RegimenId <= allARVRegimens.Count)
                        {
                            regimenDetails = allARVRegimens[regimen.RegimenId - 1]; // 1-based index
                        }
                    }

                    Console.WriteLine($"Regimen lookup: RegimenId={regimen.RegimenId} -> Found: {regimenDetails?.Name ?? "NULL"}");

                    // Get medications for this regimen - simplified query
                    var medications = new List<object>(); // Temporarily empty until we fix schema

                    // TODO: Fix ARVMedications schema mismatch
                    // var medications = await _context.ARVMedications
                    //     .Where(m => m.RegimenId == regimen.RegimenId.ToString())
                    //     .ToListAsync();

                    result.Add(new
                    {
                        id = regimen.Id,
                        patientId = regimen.PatientId,
                        regimenId = regimen.RegimenId,
                        regimenName = regimenDetails?.Name ?? "Unknown Regimen",
                        regimenDescription = regimenDetails?.Description ?? "",
                        prescribedBy = regimen.PrescribedBy,
                        prescribedDate = regimen.PrescribedDate,
                        startDate = regimen.StartDate,
                        endDate = regimen.EndDate,
                        status = regimen.Status,
                        notes = regimen.Notes,
                        medications = new List<object>
                        {
                            // Mock medication data until schema is fixed
                            new
                            {
                                id = "med-1",
                                medicationName = "Tenofovir/Emtricitabine",
                                activeIngredient = "Tenofovir 300mg + Emtricitabine 200mg",
                                dosage = "1 viên",
                                frequency = "1 lần/ngày",
                                instructions = "Uống cùng hoặc không cùng thức ăn",
                                sideEffects = "Buồn nôn, đau đầu nhẹ"
                            }
                        }
                    });
                }

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPatientRegimens: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi server khi lấy thông tin phác đồ" });
            }
        }

        [HttpGet("debug/patient-regimens")]
        public async Task<IActionResult> DebugPatientRegimens()
        {
            try
            {
                var allRegimens = await _context.PatientRegimens.ToListAsync();
                Console.WriteLine($"=== DEBUG: All PatientRegimens ===");
                Console.WriteLine($"Total count: {allRegimens.Count}");

                foreach (var reg in allRegimens)
                {
                    Console.WriteLine($"ID: {reg.Id}, PatientId: '{reg.PatientId}', RegimenId: {reg.RegimenId}, Status: {reg.Status}");
                }

                return Ok(new
                {
                    success = true,
                    count = allRegimens.Count,
                    regimens = allRegimens.Select(r => new
                    {
                        id = r.Id,
                        patientId = r.PatientId,
                        regimenId = r.RegimenId,
                        status = r.Status,
                        prescribedDate = r.PrescribedDate
                    })
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Debug error: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("regimen/{regimenId}")]
        public async Task<IActionResult> DeleteRegimen(string regimenId)
        {
            try
            {
                Console.WriteLine($"DeleteRegimen called for regimenId: {regimenId}");

                var regimen = await _context.ARVRegimens
                    .FirstOrDefaultAsync(r => r.Id == regimenId);

                if (regimen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy phác đồ" });
                }

                // Check if regimen is being used by any patients
                var isInUse = await _context.PatientRegimens
                    .AnyAsync(pr => pr.RegimenId.ToString() == regimenId && pr.Status == "Active");

                if (isInUse)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không thể xóa phác đồ đang được sử dụng bởi bệnh nhân"
                    });
                }

                _context.ARVRegimens.Remove(regimen);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Successfully deleted regimen: {regimen.Name}");

                return Ok(new
                {
                    success = true,
                    message = "Đã xóa phác đồ thành công",
                    deletedRegimen = new
                    {
                        id = regimen.Id,
                        name = regimen.Name
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteRegimen: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi server khi xóa phác đồ" });
            }
        }

        [HttpDelete("patient-regimen/{patientRegimenId}")]
        public async Task<IActionResult> DeletePatientRegimen(int patientRegimenId)
        {
            try
            {
                Console.WriteLine($"DeletePatientRegimen called for patientRegimenId: {patientRegimenId}");

                var patientRegimen = await _context.PatientRegimens
                    .FirstOrDefaultAsync(pr => pr.Id == patientRegimenId);

                if (patientRegimen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy đơn kê phác đồ" });
                }

                // Instead of deleting, mark as discontinued
                patientRegimen.Status = "Discontinued";
                patientRegimen.EndDate = DateTime.UtcNow;
                patientRegimen.DiscontinuationReason = "Bác sĩ hủy đơn kê phác đồ";
                patientRegimen.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                Console.WriteLine($"Successfully discontinued patient regimen: {patientRegimen.Id}");

                return Ok(new
                {
                    success = true,
                    message = "Đã hủy đơn kê phác đồ thành công",
                    discontinuedRegimen = new
                    {
                        id = patientRegimen.Id,
                        patientId = patientRegimen.PatientId,
                        status = patientRegimen.Status
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeletePatientRegimen: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi server khi hủy đơn kê phác đồ" });
            }
        }
    }

}
