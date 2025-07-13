using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConsultationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/consultations/patient/{userId}
        [Authorize]
        [HttpGet("patient/{userId}")]
        public async Task<IActionResult> GetConsultationsByPatient(string userId)
        {
            try
            {
                var consultations = await _context.Consultations
                    .Where(c => c.PatientId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                // Lấy danh sách các câu trả lời cho các câu hỏi
                var consultationIds = consultations.Select(c => c.Id).ToList();
                var answers = await _context.Answers
                    .Where(a => consultationIds.Contains(a.ConsultationId))
                    .ToListAsync();

                // Map dữ liệu sang DTO
                var result = consultations.Select(c =>
                {
                    var latestAnswer = answers
                        .Where(a => a.ConsultationId == c.Id)
                        .OrderByDescending(a => a.CreatedAt)
                        .FirstOrDefault();

                    return new ConsultationDto
                    {
                        Id = c.Id,
                        PatientId = c.PatientId,
                        Title = c.Title,
                        Question = c.Question,
                        Category = c.Category,
                        Topic = c.Category, // Sử dụng Category như Topic để tương thích với frontend
                        Status = c.Status,
                        CreatedAt = c.CreatedAt.ToString("o"),
                        Response = latestAnswer?.Content,
                        ResponderId = latestAnswer?.ResponderId,
                        ResponderName = latestAnswer?.ResponderName,
                        AnsweredAt = latestAnswer?.CreatedAt.ToString("o")
                    };
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách câu hỏi: {ex.Message}" });
            }
        }

        // GET: api/consultations/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetConsultation(string id)
        {
            try
            {
                var consultation = await _context.Consultations
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (consultation == null)
                {
                    return NotFound(new { message = "Không tìm thấy câu hỏi" });
                }

                var answer = await _context.Answers
                    .Where(a => a.ConsultationId == id)
                    .OrderByDescending(a => a.CreatedAt)
                    .FirstOrDefaultAsync();

                var result = new ConsultationDto
                {
                    Id = consultation.Id,
                    PatientId = consultation.PatientId,
                    Title = consultation.Title,
                    Question = consultation.Question,
                    Category = consultation.Category,
                    Topic = consultation.Category, // Sử dụng Category như Topic để tương thích với frontend
                    Status = consultation.Status,
                    CreatedAt = consultation.CreatedAt.ToString("o"),
                    Response = answer?.Content,
                    ResponderId = answer?.ResponderId,
                    ResponderName = answer?.ResponderName,
                    AnsweredAt = answer?.CreatedAt.ToString("o")
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy chi tiết câu hỏi: {ex.Message}" });
            }
        }

        // POST: api/consultations
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateConsultation(CreateConsultationRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrWhiteSpace(request.PatientId) ||
                    string.IsNullOrWhiteSpace(request.Question) ||
                    string.IsNullOrWhiteSpace(request.Title))
                {
                    return BadRequest(new { message = "Thiếu thông tin bắt buộc" });
                }

                // Kiểm tra người dùng có tồn tại không
                var patient = await _context.Users.FindAsync(request.PatientId);
                if (patient == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                // Tạo câu hỏi mới
                var newConsultation = new Consultation
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = request.PatientId,
                    Title = request.Title,
                    Question = request.Question,
                    Category = request.Category ?? "Khác",
                    Status = "pending",
                    CreatedAt = DateTime.UtcNow
                };

                try
                {
                    _context.Consultations.Add(newConsultation);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving consultation: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    }
                    throw;
                }

                // Trả về thông tin câu hỏi đã tạo
                var result = new ConsultationDto
                {
                    Id = newConsultation.Id,
                    PatientId = newConsultation.PatientId,
                    Title = newConsultation.Title,
                    Question = newConsultation.Question,
                    Category = newConsultation.Category,
                    Topic = newConsultation.Category,
                    Status = newConsultation.Status,
                    CreatedAt = newConsultation.CreatedAt.ToString("o")
                };

                return CreatedAtAction(nameof(GetConsultation), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CreateConsultation error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = $"Lỗi khi tạo câu hỏi: {ex.Message}" });
            }
        }

        // GET: api/consultations/pending
        [Authorize(Roles = "admin,doctor,staff")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingConsultations()
        {
            try
            {
                var consultations = await _context.Consultations
                    .Where(c => c.Status == "pending")
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var patientIds = consultations.Select(c => c.PatientId).Distinct().ToList();
                var patients = await _context.Users
                    .Where(u => patientIds.Contains(u.Id))
                    .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}");

                var result = consultations.Select(c => new ConsultationDto
                {
                    Id = c.Id,
                    PatientId = c.PatientId,
                    PatientName = patients.ContainsKey(c.PatientId) ? patients[c.PatientId] : "Bệnh nhân",
                    Title = c.Title,
                    Question = c.Question,
                    Category = c.Category,
                    Topic = c.Category,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt.ToString("o")
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách câu hỏi đang chờ: {ex.Message}" });
            }
        }

        // GET: api/consultations/answered
        [Authorize(Roles = "admin,doctor,staff")]
        [HttpGet("answered")]
        public async Task<IActionResult> GetAnsweredConsultations()
        {
            try
            {
                var consultations = await _context.Consultations
                    .Where(c => c.Status == "answered")
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var consultationIds = consultations.Select(c => c.Id).ToList();

                var answers = await _context.Answers
                    .Where(a => consultationIds.Contains(a.ConsultationId))
                    .ToListAsync();

                var patientIds = consultations.Select(c => c.PatientId).Distinct().ToList();
                var patients = await _context.Users
                    .Where(u => patientIds.Contains(u.Id))
                    .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}");

                var result = consultations.Select(c =>
                {
                    var latestAnswer = answers
                        .Where(a => a.ConsultationId == c.Id)
                        .OrderByDescending(a => a.CreatedAt)
                        .FirstOrDefault();

                    return new ConsultationDto
                    {
                        Id = c.Id,
                        PatientId = c.PatientId,
                        PatientName = patients.ContainsKey(c.PatientId) ? patients[c.PatientId] : "Bệnh nhân",
                        Title = c.Title,
                        Question = c.Question,
                        Category = c.Category,
                        Topic = c.Category,
                        Status = c.Status,
                        CreatedAt = c.CreatedAt.ToString("o"),
                        Response = latestAnswer?.Content,
                        ResponderId = latestAnswer?.ResponderId,
                        ResponderName = latestAnswer?.ResponderName,
                        AnsweredAt = latestAnswer?.CreatedAt.ToString("o")
                    };
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách câu hỏi đã trả lời: {ex.Message}" });
            }
        }

        // GET: api/consultations/doctor
        [Authorize(Roles = "doctor")]
        [HttpGet("doctor")]
        public async Task<IActionResult> GetConsultationsForDoctor()
        {
            try
            {
                var consultations = await _context.Consultations
                    .Where(c => c.Status == "pending")
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var patientIds = consultations.Select(c => c.PatientId).Distinct().ToList();
                var patients = await _context.Users
                    .Where(u => patientIds.Contains(u.Id))
                    .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}");

                var result = consultations.Select(c => new
                {
                    id = c.Id,
                    patientId = c.PatientId,
                    patientName = patients.ContainsKey(c.PatientId) ? patients[c.PatientId] : "Bệnh nhân",
                    title = c.Title,
                    question = c.Question,
                    category = c.Category,
                    status = c.Status,
                    createdAt = c.CreatedAt.ToString("o"),
                    priority = "medium" // Default priority
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách tư vấn cho bác sĩ: {ex.Message}" });
            }
        }

        // GET: api/consultations/topics
        [HttpGet("topics")]
        public async Task<IActionResult> GetConsultationTopics()
        {
            try
            {
                var topics = await _context.ConsultationTopics
                    .OrderBy(t => t.Name)
                    .Select(t => new { id = t.Id, name = t.Name, description = t.Description })
                    .ToListAsync();

                return Ok(topics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách chủ đề: {ex.Message}" });
            }
        }

        // POST: api/consultations/{id}/answer
        [Authorize(Roles = "admin,doctor,staff")]
        [HttpPost("{id}/answer")]
        public async Task<IActionResult> AnswerConsultation(string id, AnswerConsultationRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrWhiteSpace(request.Content) || string.IsNullOrWhiteSpace(request.ResponderId))
                {
                    return BadRequest(new { message = "Thiếu thông tin bắt buộc" });
                }

                // Kiểm tra câu hỏi có tồn tại không
                var consultation = await _context.Consultations.FindAsync(id);
                if (consultation == null)
                {
                    return NotFound(new { message = "Không tìm thấy câu hỏi" });
                }

                // Kiểm tra người trả lời có tồn tại không
                var responder = await _context.Users.FindAsync(request.ResponderId);
                if (responder == null)
                {
                    return NotFound(new { message = "Không tìm thấy người trả lời" });
                }

                // Tạo câu trả lời mới
                var newAnswer = new Answer
                {
                    Id = Guid.NewGuid().ToString(),
                    ConsultationId = id,
                    ResponderId = request.ResponderId,
                    ResponderName = $"{responder.FirstName} {responder.LastName}",
                    Content = request.Content,
                    CreatedAt = DateTime.UtcNow
                };

                // Cập nhật trạng thái câu hỏi
                consultation.Status = "answered";
                consultation.UpdatedAt = DateTime.UtcNow;

                _context.Answers.Add(newAnswer);
                await _context.SaveChangesAsync();

                // Trả về thông tin câu hỏi đã được trả lời
                var result = new ConsultationDto
                {
                    Id = consultation.Id,
                    PatientId = consultation.PatientId,
                    Title = consultation.Title,
                    Question = consultation.Question,
                    Category = consultation.Category,
                    Topic = consultation.Category,
                    Status = consultation.Status,
                    CreatedAt = consultation.CreatedAt.ToString("o"),
                    Response = newAnswer.Content,
                    ResponderId = newAnswer.ResponderId,
                    ResponderName = newAnswer.ResponderName,
                    AnsweredAt = newAnswer.CreatedAt.ToString("o")
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi trả lời câu hỏi: {ex.Message}" });
            }
        }


    }

    // DTO
    public class ConsultationDto
    {
        public string Id { get; set; }
        public string PatientId { get; set; }
        public string PatientName { get; set; }
        public string Title { get; set; }
        public string Question { get; set; }
        public string Category { get; set; }
        public string Topic { get; set; }
        public string Status { get; set; }
        public string CreatedAt { get; set; }
        public string Response { get; set; }
        public string ResponderId { get; set; }
        public string ResponderName { get; set; }
        public string AnsweredAt { get; set; }
    }

    // Request models
    public class CreateConsultationRequest
    {
        public string PatientId { get; set; }
        public string Title { get; set; }
        public string Question { get; set; }
        public string Category { get; set; }
    }

    public class AnswerConsultationRequest
    {
        public string Content { get; set; }
        public string ResponderId { get; set; }
    }
}