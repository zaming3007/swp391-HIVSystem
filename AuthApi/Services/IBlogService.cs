using System.Collections.Generic;
using System.Threading.Tasks;
using AuthApi.Models;

namespace AuthApi.Services
{
    public interface IBlogService
    {
        Task<List<object>> GetAllPostsAsync(string status = null);
        Task<object> GetPostByIdAsync(string id);
        Task<object> CreatePostAsync(object request, string authorId);
        Task<object> UpdatePostAsync(object request);
        Task<bool> DeletePostAsync(string id);
        Task<object> IncrementViewCountAsync(string id);
        Task<List<object>> SearchPostsAsync(string searchTerm);
    }
} 