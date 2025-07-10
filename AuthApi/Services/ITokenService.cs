using AuthApi.Models;

namespace AuthApi.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
        string GetUserIdFromToken(string authorizationHeader);
    }
} 