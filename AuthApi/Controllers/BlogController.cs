using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AuthApi.Models;
using AuthApi.Services;
using System.Dynamic;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly ITokenService _tokenService;
        private readonly ILogger<BlogController> _logger;

        public BlogController(IBlogService blogService, ITokenService tokenService, ILogger<BlogController> logger)
        {
            _blogService = blogService;
            _tokenService = tokenService;
            _logger = logger;
        }

        // GET: api/Blog/test
        [HttpGet("test")]
        [EnableCors("AllowAll")]
        public ActionResult<IEnumerable<object>> GetTestPosts()
        {
            try
            {
                _logger.LogInformation("GetTestPosts called");
                
                // Return simple static data
                var posts = new[]
                {
                    new {
                        Id = "1",
                        Title = "Hiểu về HIV/AIDS: Các thông tin cơ bản",
                        Summary = "Tìm hiểu thông tin cơ bản về HIV/AIDS",
                        Content = "<p>HIV là virus gây suy giảm miễn dịch ở người</p>",
                        Status = "published",
                        ViewCount = 120,
                        AuthorName = "Bác sĩ Nguyễn Văn A",
                        CreatedAt = "2025-07-01T10:00:00"
                    },
                    new {
                        Id = "2",
                        Title = "Sống khỏe với HIV",
                        Summary = "Hướng dẫn về chế độ dinh dưỡng",
                        Content = "<p>Dinh dưỡng đóng vai trò quan trọng</p>",
                        Status = "published",
                        ViewCount = 85,
                        AuthorName = "Chuyên gia dinh dưỡng",
                        CreatedAt = "2025-07-01T10:00:00"
                    }
                };
                
                _logger.LogInformation($"Returning {posts.Length} test posts");
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTestPosts: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/Blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPosts([FromQuery] string status = "published")
        {
            try
            {
                _logger.LogInformation("GetPosts called with status: {Status}", status);
                
                // Người dùng không đăng nhập hoặc không phải staff chỉ thấy bài published
                if (!User.Identity.IsAuthenticated || !User.IsInRole("staff"))
                {
                    status = "published";
                }
                
                _logger.LogInformation("Fetching posts from blog service");
                var posts = await _blogService.GetAllPostsAsync(status);
                _logger.LogInformation("Found {Count} posts", posts.Count);
                
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blog posts: {Message}", ex.Message);
                
                // Return more details for debugging
                if (HttpContext.Request.Headers.ContainsKey("X-Debug") && 
                    HttpContext.Request.Headers["X-Debug"] == "true")
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, 
                        new { 
                            error = ex.Message, 
                            stackTrace = ex.StackTrace,
                            innerException = ex.InnerException?.Message
                        });
                }
                
                // Fall back to test data
                _logger.LogInformation("Falling back to test data");
                return RedirectToAction(nameof(GetTestPosts));
            }
        }

        // GET: api/Blog/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPost(string id)
        {
            try 
            {
                var post = await _blogService.GetPostByIdAsync(id);
                if (post == null)
                {
                    return NotFound();
                }

                // Nếu bài viết là draft và người dùng không phải staff, trả về 404
                var postDict = post as IDictionary<string, object>;
                if (postDict != null && postDict["Status"].ToString() == "draft" && 
                    (!User.Identity.IsAuthenticated || !User.IsInRole("staff")))
                {
                    return NotFound();
                }

                // Tăng lượt xem nếu là GET thông thường
                if (postDict != null && postDict["Status"].ToString() == "published")
                {
                    await _blogService.IncrementViewCountAsync(id);
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving blog post with ID: {id}");
                
                // Return more details for debugging
                if (HttpContext.Request.Headers.ContainsKey("X-Debug") && 
                    HttpContext.Request.Headers["X-Debug"] == "true")
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, 
                        new { 
                            error = ex.Message, 
                            stackTrace = ex.StackTrace,
                            innerException = ex.InnerException?.Message
                        });
                }
                
                // Return first post from test data as fallback
                var testPosts = ((OkObjectResult)GetTestPosts().Result).Value as List<object>;
                var testPost = testPosts.FirstOrDefault();
                return Ok(testPost);
            }
        }

        // POST: api/Blog
        [HttpPost]
        [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<object>> CreatePost([FromBody] object request)
        {
            try
            {
                var userId = _tokenService.GetUserIdFromToken(HttpContext.Request.Headers["Authorization"]);
                var post = await _blogService.CreatePostAsync(request, userId);
                
                var postDict = post as IDictionary<string, object>;
                return CreatedAtAction(nameof(GetPost), new { id = postDict["Id"] }, post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post: {Message}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        // PUT: api/Blog/5
        [HttpPut("{id}")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> UpdatePost(string id, [FromBody] object request)
        {
            var requestDict = request as IDictionary<string, object>;
            if (requestDict == null || !requestDict.ContainsKey("Id") || requestDict["Id"].ToString() != id)
            {
                return BadRequest();
            }

            try
            {
                var post = await _blogService.UpdatePostAsync(request);
                if (post == null)
                {
                    return NotFound();
                }
                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post: {Message}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        // DELETE: api/Blog/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> DeletePost(string id)
        {
            try
            {
                var result = await _blogService.DeletePostAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post: {Message}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        // GET: api/Blog/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchPosts([FromQuery] string term)
        {
            try
            {
                var posts = await _blogService.SearchPostsAsync(term);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching blog posts: {Message}", ex.Message);
                
                // Return more details for debugging
                if (HttpContext.Request.Headers.ContainsKey("X-Debug") && 
                    HttpContext.Request.Headers["X-Debug"] == "true")
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, 
                        new { 
                            error = ex.Message, 
                            stackTrace = ex.StackTrace,
                            innerException = ex.InnerException?.Message
                        });
                }
                
                // Fall back to test data
                return RedirectToAction(nameof(GetTestPosts));
            }
        }
    }
} 