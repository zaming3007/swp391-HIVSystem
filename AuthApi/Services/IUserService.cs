using AuthApi.Models;
using System.Threading.Tasks;

namespace AuthApi.Services
{
    public interface IUserService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<UserDto> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    }
} 