using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AuthApi.Data;
using AuthApi.Models;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace AuthApi.Services
{
    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BlogService> _logger;

        public BlogService(ApplicationDbContext context, ILogger<BlogService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<object>> GetAllPostsAsync(string status = null)
        {
            try
            {
                _logger.LogInformation($"GetAllPostsAsync called with status: {status}");
                
                // First check total posts in database
                var totalPostsCount = await _context.BlogPosts.CountAsync();
                _logger.LogInformation($"Total posts in database: {totalPostsCount}");
                
                // Get all posts without filtering to debug
                var allPosts = await _context.BlogPosts.ToListAsync();
                _logger.LogInformation($"Total posts retrieved from DB: {allPosts.Count}");
                foreach (var p in allPosts)
                {
                    _logger.LogInformation($"Post in DB: Id={p.Id}, Title={p.Title}, Status={p.Status}, CreatedAt={p.CreatedAt}");
                }
                
                var query = _context.BlogPosts
                    .Include(p => p.Author)
                    .AsQueryable();

                // Filter by status if provided
                if (!string.IsNullOrEmpty(status))
                {
                    _logger.LogInformation($"Filtering by status: {status}");
                    query = query.Where(p => p.Status == status);
                }

                _logger.LogInformation("Executing query to get posts");
                var posts = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new {
                        Id = p.Id,
                        Title = p.Title,
                        Summary = p.Summary ?? string.Empty,
                        CoverImage = p.CoverImage ?? string.Empty,
                        PublishedDate = p.PublishedDate,
                        Status = p.Status,
                        ViewCount = p.ViewCount,
                        AuthorName = p.Author != null ? p.Author.FirstName + " " + p.Author.LastName : "Anonymous",
                        CreatedAt = p.CreatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {posts.Count} posts");
                foreach (var p in posts)
                {
                    _logger.LogInformation($"Post retrieved: Title={p.Title}, Status={p.Status}, CreatedAt={p.CreatedAt}");
                }
                return posts.Cast<object>().ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blog posts");
                throw;
            }
        }

        public async Task<object> GetPostByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation($"GetPostByIdAsync called with id: {id}");
                
                var post = await _context.BlogPosts
                    .Include(p => p.Author)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    _logger.LogWarning($"Post with id {id} not found");
                    return null;
                }

                _logger.LogInformation($"Retrieved post: {post.Title}");
                
                return new {
                    Id = post.Id,
                    Title = post.Title,
                    Summary = post.Summary ?? string.Empty,
                    Content = post.Content,
                    CoverImage = post.CoverImage ?? string.Empty,
                    PublishedDate = post.PublishedDate,
                    Status = post.Status,
                    ViewCount = post.ViewCount,
                    AuthorId = post.AuthorId,
                    AuthorName = post.Author != null ? post.Author.FirstName + " " + post.Author.LastName : "Anonymous",
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving blog post with id: {id}");
                throw;
            }
        }

        public async Task<object> CreatePostAsync(object request, string authorId)
        {
            var requestDict = (IDictionary<string, object>)request;
            
            var post = new BlogPost
            {
                Title = (string)requestDict["Title"],
                Summary = requestDict.ContainsKey("Summary") ? (string)requestDict["Summary"] : string.Empty,
                Content = (string)requestDict["Content"],
                CoverImage = requestDict.ContainsKey("CoverImage") ? (string)requestDict["CoverImage"] : string.Empty,
                Status = (string)requestDict["Status"],
                AuthorId = !string.IsNullOrEmpty(authorId) ? authorId : null,
                CreatedAt = DateTime.UtcNow
            };

            if (post.Status == "published")
            {
                post.PublishedDate = DateTime.UtcNow;
            }

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return await GetPostByIdAsync(post.Id);
        }

        public async Task<object> UpdatePostAsync(object request)
        {
            var requestDict = (IDictionary<string, object>)request;
            var id = (string)requestDict["Id"];
            
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
            {
                return null;
            }

            post.Title = (string)requestDict["Title"];
            post.Summary = requestDict.ContainsKey("Summary") ? (string)requestDict["Summary"] : post.Summary;
            post.Content = (string)requestDict["Content"];
            post.CoverImage = requestDict.ContainsKey("CoverImage") ? (string)requestDict["CoverImage"] : post.CoverImage;
            post.UpdatedAt = DateTime.UtcNow;

            var newStatus = (string)requestDict["Status"];
            
            // If changing status to published and not previously published
            if (newStatus == "published" && post.Status != "published")
            {
                post.Status = "published";
                post.PublishedDate = DateTime.UtcNow;
            }
            else
            {
                post.Status = newStatus;
            }

            await _context.SaveChangesAsync();
            return await GetPostByIdAsync(post.Id);
        }

        public async Task<bool> DeletePostAsync(string id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
            {
                return false;
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> IncrementViewCountAsync(string id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
            {
                return null;
            }

            post.ViewCount++;
            await _context.SaveChangesAsync();
            return await GetPostByIdAsync(id);
        }

        public async Task<List<object>> SearchPostsAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return await GetAllPostsAsync("published");
            }

            var posts = await _context.BlogPosts
                .Include(p => p.Author)
                .Where(p => p.Status == "published" && 
                       (p.Title.Contains(searchTerm) || 
                        p.Content.Contains(searchTerm) || 
                        (p.Summary != null && p.Summary.Contains(searchTerm))))
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new {
                    Id = p.Id,
                    Title = p.Title,
                    Summary = p.Summary ?? string.Empty,
                    CoverImage = p.CoverImage ?? string.Empty,
                    PublishedDate = p.PublishedDate,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    AuthorName = p.Author != null ? p.Author.FirstName + " " + p.Author.LastName : "Anonymous",
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return posts.Cast<object>().ToList();
        }
    }
} 