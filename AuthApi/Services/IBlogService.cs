using AuthApi.Models;

namespace AuthApi.Services
{
    public interface IBlogService
    {
        // Blog Post operations
        Task<List<BlogPostDto>> GetAllPublishedPostsAsync();
        Task<List<BlogPostDto>> GetAllPostsAsync(); // For staff only
        Task<BlogPostDto?> GetPostByIdAsync(string id);
        Task<BlogPostDto> CreatePostAsync(BlogPostCreateDto createDto, string authorId, string authorName);
        Task<BlogPostDto?> UpdatePostAsync(string id, BlogPostUpdateDto updateDto, string userId);
        Task<bool> DeletePostAsync(string id, string userId);
        Task<bool> PublishPostAsync(string id, string userId);
        Task<bool> UnpublishPostAsync(string id, string userId);
        Task<BlogPostDto?> IncrementViewCountAsync(string id);
        Task<List<BlogPostDto>> SearchPostsAsync(string query);

        // Blog Comment operations
        Task<List<BlogCommentDto>> GetCommentsByPostIdAsync(string postId);
        Task<BlogCommentDto> CreateCommentAsync(string postId, BlogCommentCreateDto createDto, string userId, string userName);
        Task<bool> DeleteCommentAsync(string commentId, string userId);
    }
}
