using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AuthApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AuthApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Cors;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DebugController> _logger;

        public DebugController(ApplicationDbContext context, ILogger<DebugController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Debug
        [HttpGet]
        [EnableCors("AllowAll")]
        public ActionResult<object> GetStatus()
        {
            try
            {
                _logger.LogInformation("Debug API status check called");
                
                return Ok(new
                {
                    Status = "API is running",
                    Timestamp = DateTime.Now,
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                    ServerInfo = new
                    {
                        OSVersion = Environment.OSVersion.ToString(),
                        ProcessorCount = Environment.ProcessorCount,
                        MachineName = Environment.MachineName
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Debug API");
                return StatusCode(500, new { Error = ex.Message, StackTrace = ex.StackTrace });
            }
        }

        // GET: api/Debug/db
        [HttpGet("db")]
        [EnableCors("AllowAll")]
        public ActionResult<object> CheckDatabase()
        {
            try
            {
                _logger.LogInformation("Debug database check called");
                
                bool canConnect = _context.Database.CanConnect();
                string provider = _context.Database.ProviderName;
                
                var tables = new List<string>();
                try
                {
                    // Try to get table names - this might not work with all providers
                    var conn = _context.Database.GetDbConnection();
                    if (conn.State != System.Data.ConnectionState.Open)
                        conn.Open();
                        
                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
                    
                    using var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        tables.Add(reader.GetString(0));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not retrieve table names");
                }
                
                return Ok(new
                {
                    CanConnect = canConnect,
                    Provider = provider,
                    Tables = tables,
                    ConnectionString = "***REDACTED***" // Don't expose actual connection string
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking database");
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // GET: api/Debug/cors-test
        [HttpGet("cors-test")]
        [EnableCors("AllowAll")]
        public ActionResult<object> CorsTest()
        {
            return Ok(new
            {
                Message = "CORS test successful",
                Headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
                Origin = Request.Headers.ContainsKey("Origin") ? Request.Headers["Origin"].ToString() : "No Origin header"
            });
        }

        // GET: api/Debug/blog-status
        [HttpGet("blog-status")]
        public async Task<ActionResult> GetBlogStatus()
        {
            try
            {
                // Kiểm tra kết nối đến database
                var canConnect = await _context.Database.CanConnectAsync();
                
                // Kiểm tra bảng BlogPosts có tồn tại không
                bool tableExists = false;
                try {
                    await _context.BlogPosts.FirstOrDefaultAsync();
                    tableExists = true;
                }
                catch (Exception ex) {
                    _logger.LogError(ex, "Error checking BlogPosts table");
                }
                
                // Đếm số lượng bài viết
                int postCount = 0;
                try {
                    postCount = await _context.BlogPosts.CountAsync();
                }
                catch (Exception ex) {
                    _logger.LogError(ex, "Error counting blog posts");
                }
                
                // Lấy thông tin các bảng trong database
                var tables = new List<string>();
                try {
                    var conn = _context.Database.GetDbConnection();
                    if (conn.State != System.Data.ConnectionState.Open)
                        await conn.OpenAsync();
                        
                    using (var command = conn.CreateCommand())
                    {
                        command.CommandText = "SELECT name FROM sqlite_master WHERE type='table'";
                        using (var result = await command.ExecuteReaderAsync())
                        {
                            while (await result.ReadAsync())
                            {
                                tables.Add(result.GetString(0));
                            }
                        }
                    }
                }
                catch (Exception ex) {
                    _logger.LogError(ex, "Error getting database tables");
                }
                
                return Ok(new {
                    DatabaseConnection = canConnect,
                    BlogPostsTableExists = tableExists,
                    BlogPostCount = postCount,
                    DatabaseTables = tables,
                    ServerTime = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetBlogStatus");
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
        
        // POST: api/Debug/test-blog-create
        [HttpPost("test-blog-create")]
        [Authorize(Roles = "admin,staff")]
        public async Task<ActionResult> TestBlogCreate()
        {
            try
            {
                // Lấy thông tin người dùng hiện tại
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userEmail = User.FindFirstValue(ClaimTypes.Email);
                var userRole = User.FindFirstValue(ClaimTypes.Role);
                
                // Tạo bài viết test
                var blogPost = new BlogPost
                {
                    Title = "Test Blog Post " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    Content = "<p>This is a test blog post created at " + DateTime.Now.ToString() + "</p>",
                    Summary = "Test blog post summary",
                    Status = "draft",
                    AuthorId = userId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                
                // Lưu vào database
                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();
                
                // Kiểm tra xem đã lưu thành công chưa
                var savedPost = await _context.BlogPosts.FindAsync(blogPost.Id);
                
                return Ok(new {
                    Success = savedPost != null,
                    Post = new {
                        Id = savedPost?.Id,
                        Title = savedPost?.Title,
                        Status = savedPost?.Status,
                        AuthorId = savedPost?.AuthorId
                    },
                    User = new {
                        Id = userId,
                        Email = userEmail,
                        Role = userRole
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestBlogCreate");
                return StatusCode(500, new { 
                    error = ex.Message, 
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        // GET: api/Debug/blog-test
        [HttpGet("blog-test")]
        [EnableCors("AllowAll")]
        public ActionResult<IEnumerable<object>> GetBlogTest()
        {
            try
            {
                _logger.LogInformation("Debug Blog Test API called");
                
                // Return mock data for testing frontend
                var posts = new List<object>
                {
                    new {
                        Id = "1",
                        Title = "Debug Test Blog Post 1",
                        Summary = "This is a test blog post from Debug controller",
                        Content = "<p>Test content</p>",
                        Status = "published",
                        ViewCount = 10,
                        AuthorName = "Debug Test Author",
                        CreatedAt = DateTime.Now.ToString("yyyy-MM-dd'T'HH:mm:ss")
                    },
                    new {
                        Id = "2",
                        Title = "Debug Test Blog Post 2",
                        Summary = "This is another test blog post from Debug controller",
                        Content = "<p>More test content</p>",
                        Status = "published",
                        ViewCount = 5,
                        AuthorName = "Debug Test Author",
                        CreatedAt = DateTime.Now.ToString("yyyy-MM-dd'T'HH:mm:ss")
                    }
                };
                
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Debug Blog Test API: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
} 