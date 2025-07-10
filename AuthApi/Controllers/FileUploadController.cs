using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public FileUploadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("upload/{type}")]
        [Authorize]
        public async Task<IActionResult> Upload(string type, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không tìm thấy file tải lên");

            if (file.Length > _maxFileSize)
                return BadRequest("Kích thước file vượt quá 5MB");

            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(fileExtension))
                return BadRequest("Định dạng file không được hỗ trợ. Chỉ chấp nhận .jpg, .jpeg, .png, .gif, .webp");

            try
            {
                // Tạo tên file duy nhất
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

                // Đường dẫn thư mục lưu trữ tùy theo loại
                string uploadFolder;
                string urlPrefix;

                switch (type.ToLower())
                {
                    case "blog-cover":
                        uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "blog");
                        urlPrefix = "/uploads/blog/";
                        break;
                    case "profile":
                        uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profile");
                        urlPrefix = "/uploads/profile/";
                        break;
                    default:
                        uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "misc");
                        urlPrefix = "/uploads/misc/";
                        break;
                }

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                // Lưu file
                string filePath = Path.Combine(uploadFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn URL
                var url = $"{urlPrefix}{uniqueFileName}";

                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tải file lên: {ex.Message}");
            }
        }
    }
} 