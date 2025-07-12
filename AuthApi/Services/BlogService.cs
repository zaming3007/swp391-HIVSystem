using AuthApi.Data;
using AuthApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Services
{
    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;

        public BlogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<BlogPostDto>> GetAllPublishedPostsAsync()
        {
            var posts = await _context.BlogPosts
                .Where(p => p.Status == BlogPostStatus.Published)
                .OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
                .Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    Summary = p.Summary,
                    AuthorId = p.AuthorId,
                    AuthorName = p.AuthorName,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    CommentCount = p.CommentCount,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    PublishedAt = p.PublishedAt
                })
                .ToListAsync();

            return posts;
        }

        public async Task<List<BlogPostDto>> GetAllPostsAsync()
        {
            var posts = await _context.BlogPosts
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    Summary = p.Summary,
                    AuthorId = p.AuthorId,
                    AuthorName = p.AuthorName,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    CommentCount = p.CommentCount,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    PublishedAt = p.PublishedAt
                })
                .ToListAsync();

            return posts;
        }

        public async Task<BlogPostDto?> GetPostByIdAsync(string id)
        {
            var post = await _context.BlogPosts
                .Where(p => p.Id == id)
                .Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    Summary = p.Summary,
                    AuthorId = p.AuthorId,
                    AuthorName = p.AuthorName,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    CommentCount = p.CommentCount,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    PublishedAt = p.PublishedAt
                })
                .FirstOrDefaultAsync();

            return post;
        }

        public async Task<BlogPostDto> CreatePostAsync(BlogPostCreateDto createDto, string authorId, string authorName)
        {
            var post = new BlogPost
            {
                Id = Guid.NewGuid().ToString(),
                Title = createDto.Title,
                Content = createDto.Content,
                Summary = createDto.Summary,
                AuthorId = authorId,
                AuthorName = authorName,
                Status = createDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            if (createDto.Status == BlogPostStatus.Published)
            {
                post.PublishedAt = DateTime.UtcNow;
            }

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return new BlogPostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Summary = post.Summary,
                AuthorId = post.AuthorId,
                AuthorName = post.AuthorName,
                Status = post.Status,
                ViewCount = post.ViewCount,
                CommentCount = post.CommentCount,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                PublishedAt = post.PublishedAt
            };
        }

        public async Task<BlogPostDto?> UpdatePostAsync(string id, BlogPostUpdateDto updateDto, string userId)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return null;

            // Check if user is staff or the author
            var user = await _context.Users.FindAsync(userId);
            if (user == null || (user.Role != "staff" && post.AuthorId != userId))
            {
                return null;
            }

            var wasPublished = post.Status == BlogPostStatus.Published;
            
            post.Title = updateDto.Title;
            post.Content = updateDto.Content;
            post.Summary = updateDto.Summary;
            post.Status = updateDto.Status;
            post.UpdatedAt = DateTime.UtcNow;

            // Set published date if changing from draft to published
            if (!wasPublished && updateDto.Status == BlogPostStatus.Published)
            {
                post.PublishedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return new BlogPostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Summary = post.Summary,
                AuthorId = post.AuthorId,
                AuthorName = post.AuthorName,
                Status = post.Status,
                ViewCount = post.ViewCount,
                CommentCount = post.CommentCount,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                PublishedAt = post.PublishedAt
            };
        }

        public async Task<bool> DeletePostAsync(string id, string userId)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return false;

            // Check if user is staff or the author
            var user = await _context.Users.FindAsync(userId);
            if (user == null || (user.Role != "staff" && post.AuthorId != userId))
            {
                return false;
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PublishPostAsync(string id, string userId)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return false;

            // Check if user is staff or the author
            var user = await _context.Users.FindAsync(userId);
            if (user == null || (user.Role != "staff" && post.AuthorId != userId))
            {
                return false;
            }

            post.Status = BlogPostStatus.Published;
            post.PublishedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnpublishPostAsync(string id, string userId)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return false;

            // Check if user is staff or the author
            var user = await _context.Users.FindAsync(userId);
            if (user == null || (user.Role != "staff" && post.AuthorId != userId))
            {
                return false;
            }

            post.Status = BlogPostStatus.Draft;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<BlogPostDto?> IncrementViewCountAsync(string id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return null;

            post.ViewCount++;
            await _context.SaveChangesAsync();

            return new BlogPostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Summary = post.Summary,
                AuthorId = post.AuthorId,
                AuthorName = post.AuthorName,
                Status = post.Status,
                ViewCount = post.ViewCount,
                CommentCount = post.CommentCount,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                PublishedAt = post.PublishedAt
            };
        }

        public async Task<List<BlogPostDto>> SearchPostsAsync(string query)
        {
            var posts = await _context.BlogPosts
                .Where(p => p.Status == BlogPostStatus.Published && 
                           (p.Title.ToLower().Contains(query.ToLower()) || 
                            p.Content.ToLower().Contains(query.ToLower()) ||
                            p.Summary.ToLower().Contains(query.ToLower())))
                .OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
                .Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    Summary = p.Summary,
                    AuthorId = p.AuthorId,
                    AuthorName = p.AuthorName,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    CommentCount = p.CommentCount,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    PublishedAt = p.PublishedAt
                })
                .ToListAsync();

            return posts;
        }

        public async Task<List<BlogCommentDto>> GetCommentsByPostIdAsync(string postId)
        {
            var comments = await _context.BlogComments
                .Where(c => c.BlogPostId == postId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new BlogCommentDto
                {
                    Id = c.Id,
                    BlogPostId = c.BlogPostId,
                    UserId = c.UserId,
                    UserName = c.UserName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return comments;
        }

        public async Task<BlogCommentDto> CreateCommentAsync(string postId, BlogCommentCreateDto createDto, string userId, string userName)
        {
            var comment = new BlogComment
            {
                Id = Guid.NewGuid().ToString(),
                BlogPostId = postId,
                UserId = userId,
                UserName = userName,
                Content = createDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogComments.Add(comment);

            // Update comment count
            var post = await _context.BlogPosts.FindAsync(postId);
            if (post != null)
            {
                post.CommentCount++;
            }

            await _context.SaveChangesAsync();

            return new BlogCommentDto
            {
                Id = comment.Id,
                BlogPostId = comment.BlogPostId,
                UserId = comment.UserId,
                UserName = comment.UserName,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            };
        }

        public async Task<bool> DeleteCommentAsync(string commentId, string userId)
        {
            var comment = await _context.BlogComments.FindAsync(commentId);
            if (comment == null) return false;

            // Check if user is staff or the comment author
            var user = await _context.Users.FindAsync(userId);
            if (user == null || (user.Role != "staff" && comment.UserId != userId))
            {
                return false;
            }

            _context.BlogComments.Remove(comment);

            // Update comment count
            var post = await _context.BlogPosts.FindAsync(comment.BlogPostId);
            if (post != null && post.CommentCount > 0)
            {
                post.CommentCount--;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
