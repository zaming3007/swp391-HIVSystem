using AuthApi.Models;

namespace AuthApi.Services
{
    public interface IUserManagerService
    {
        Task<User?> FindByIdAsync(string userId);
        Task<User?> FindByEmailAsync(string email);
        Task<bool> UpdateAsync(User user);
        Task<bool> CreateAsync(User user);
        Task<bool> DeleteAsync(User user);
    }
}
