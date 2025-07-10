using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Logging;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        // GET: api/Test
        [HttpGet]
        [EnableCors("AllowAll")]
        public ActionResult<object> GetStatus()
        {
            return Ok(new
            {
                Status = "Test API is running",
                Timestamp = DateTime.Now
            });
        }

        // GET: api/Test/blog
        [HttpGet("blog")]
        [EnableCors("AllowAll")]
        public ActionResult<IEnumerable<object>> GetBlogPosts()
        {
            try
            {
                _logger.LogInformation("Test Blog API called");
                
                // Return mock data for testing frontend
                var posts = new List<object>
                {
                    new {
                        Id = "1",
                        Title = "Test Blog Post 1",
                        Summary = "This is a test blog post",
                        Content = "<p>Test content</p>",
                        Status = "published",
                        ViewCount = 10,
                        AuthorName = "Test Author",
                        CreatedAt = DateTime.Now.ToString("yyyy-MM-dd'T'HH:mm:ss")
                    },
                    new {
                        Id = "2",
                        Title = "Test Blog Post 2",
                        Summary = "This is another test blog post",
                        Content = "<p>More test content</p>",
                        Status = "published",
                        ViewCount = 5,
                        AuthorName = "Test Author",
                        CreatedAt = DateTime.Now.ToString("yyyy-MM-dd'T'HH:mm:ss")
                    }
                };
                
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Test Blog API: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
} 