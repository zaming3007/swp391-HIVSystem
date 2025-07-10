using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Logging;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogSimpleController : ControllerBase
    {
        private readonly ILogger<BlogSimpleController> _logger;

        public BlogSimpleController(ILogger<BlogSimpleController> logger)
        {
            _logger = logger;
        }

        // GET: api/BlogSimple
        [HttpGet]
        [EnableCors("AllowAll")]
        public ActionResult<IEnumerable<object>> GetAll()
        {
            try
            {
                _logger.LogInformation("BlogSimple GetAll called");
                
                var posts = new List<object>
                {
                    new {
                        Id = "1",
                        Title = "Blog Simple Post 1",
                        Summary = "This is a test blog post from simple controller",
                        Content = "<p>Test content</p>",
                        Status = "published",
                        ViewCount = 10,
                        AuthorName = "Simple Test Author",
                        CreatedAt = "2025-07-07T20:00:00"
                    },
                    new {
                        Id = "2",
                        Title = "Blog Simple Post 2",
                        Summary = "This is another test blog post from simple controller",
                        Content = "<p>More test content</p>",
                        Status = "published",
                        ViewCount = 5,
                        AuthorName = "Simple Test Author",
                        CreatedAt = "2025-07-07T20:00:00"
                    }
                };
                
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in BlogSimple GetAll: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/BlogSimple/test
        [HttpGet("test")]
        [EnableCors("AllowAll")]
        public ActionResult<IEnumerable<object>> GetTest()
        {
            try
            {
                _logger.LogInformation("BlogSimple GetTest called");
                
                var posts = new List<object>
                {
                    new {
                        Id = "1",
                        Title = "Blog Simple Test Post 1",
                        Summary = "This is a test post",
                        Content = "<p>Simple test content</p>",
                        Status = "published",
                        ViewCount = 10,
                        AuthorName = "Simple Test Author",
                        CreatedAt = "2025-07-07T20:00:00"
                    }
                };
                
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in BlogSimple GetTest: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
} 