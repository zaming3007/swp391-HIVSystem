using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        // GET: api/Blog/published
        [HttpGet("published")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BlogPostDto>>> GetPublishedPosts()
        {
            try
            {
                var posts = await _blogService.GetAllPublishedPostsAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách bài viết: {ex.Message}" });
            }
        }

        // GET: api/Blog/all (Staff only)
        [HttpGet("all")]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult<List<BlogPostDto>>> GetAllPosts()
        {
            try
            {
                var posts = await _blogService.GetAllPostsAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách bài viết: {ex.Message}" });
            }
        }

        // GET: api/Blog/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogPostDto>> GetPost(string id)
        {
            try
            {
                var post = await _blogService.GetPostByIdAsync(id);
                if (post == null)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết" });
                }

                // Only allow viewing published posts for non-staff users
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (post.Status != BlogPostStatus.Published && userRole != "staff")
                {
                    return NotFound(new { message = "Không tìm thấy bài viết" });
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy bài viết: {ex.Message}" });
            }
        }

        // POST: api/Blog/{id}/view
        [HttpPost("{id}/view")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogPostDto>> IncrementViewCount(string id)
        {
            try
            {
                var post = await _blogService.IncrementViewCountAsync(id);
                if (post == null)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết" });
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật lượt xem: {ex.Message}" });
            }
        }

        // GET: api/Blog/search?query=...
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BlogPostDto>>> SearchPosts([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest(new { message = "Từ khóa tìm kiếm không được để trống" });
                }

                var posts = await _blogService.SearchPostsAsync(query);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tìm kiếm bài viết: {ex.Message}" });
            }
        }

        // POST: api/Blog (Staff only)
        [HttpPost]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult<BlogPostDto>> CreatePost([FromBody] BlogPostCreateDto createDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var post = await _blogService.CreatePostAsync(createDto, userId, userName);
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo bài viết: {ex.Message}" });
            }
        }

        // PUT: api/Blog/{id} (Staff only)
        [HttpPut("{id}")]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult<BlogPostDto>> UpdatePost(string id, [FromBody] BlogPostUpdateDto updateDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var post = await _blogService.UpdatePostAsync(id, updateDto, userId);
                if (post == null)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc không có quyền chỉnh sửa" });
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật bài viết: {ex.Message}" });
            }
        }

        // DELETE: api/Blog/{id} (Staff only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult> DeletePost(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var success = await _blogService.DeletePostAsync(id, userId);
                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc không có quyền xóa" });
                }

                return Ok(new { message = "Xóa bài viết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa bài viết: {ex.Message}" });
            }
        }

        // POST: api/Blog/{id}/publish (Staff only)
        [HttpPost("{id}/publish")]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult> PublishPost(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var success = await _blogService.PublishPostAsync(id, userId);
                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc không có quyền xuất bản" });
                }

                return Ok(new { message = "Xuất bản bài viết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xuất bản bài viết: {ex.Message}" });
            }
        }

        // POST: api/Blog/{id}/unpublish (Staff only)
        [HttpPost("{id}/unpublish")]
        [Authorize(Roles = "staff")]
        public async Task<ActionResult> UnpublishPost(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var success = await _blogService.UnpublishPostAsync(id, userId);
                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc không có quyền hủy xuất bản" });
                }

                return Ok(new { message = "Hủy xuất bản bài viết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi hủy xuất bản bài viết: {ex.Message}" });
            }
        }

        // GET: api/Blog/{postId}/comments
        [HttpGet("{postId}/comments")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BlogCommentDto>>> GetComments(string postId)
        {
            try
            {
                var comments = await _blogService.GetCommentsByPostIdAsync(postId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách bình luận: {ex.Message}" });
            }
        }

        // POST: api/Blog/{postId}/comments
        [HttpPost("{postId}/comments")]
        [Authorize]
        public async Task<ActionResult<BlogCommentDto>> CreateComment(string postId, [FromBody] BlogCommentCreateDto createDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var comment = await _blogService.CreateCommentAsync(postId, createDto, userId, userName);
                return CreatedAtAction(nameof(GetComments), new { postId }, comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo bình luận: {ex.Message}" });
            }
        }

        // DELETE: api/Blog/comments/{commentId}
        [HttpDelete("comments/{commentId}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(string commentId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không thể xác định thông tin người dùng" });
                }

                var success = await _blogService.DeleteCommentAsync(commentId, userId);
                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy bình luận hoặc không có quyền xóa" });
                }

                return Ok(new { message = "Xóa bình luận thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa bình luận: {ex.Message}" });
            }
        }
    }
}
