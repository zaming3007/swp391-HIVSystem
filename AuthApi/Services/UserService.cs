using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Data;
using AuthApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Services
{
    public class UserService : IUserService
    {
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public UserService(ITokenService tokenService, ApplicationDbContext context)
        {
            _tokenService = tokenService;
            _context = context;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Print login attempt for debugging
            Console.WriteLine($"Login attempt - Email: {request.Email}");
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                Console.WriteLine("Login failed: User not found");
                throw new Exception("Email hoặc mật khẩu không chính xác");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                Console.WriteLine("Login failed: Password incorrect");
                throw new Exception("Email hoặc mật khẩu không chính xác");
            }

            // Generate JWT token
            var token = _tokenService.GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = MapUserToDto(user)
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Print register attempt for debugging
                Console.WriteLine($"Register attempt - Email: {request.Email}");
                
                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    throw new Exception("Email đã được sử dụng");
                }

                // Generate a new unique ID
                string userId = Guid.NewGuid().ToString();
                
                // Create new user with explicit ID
                var user = new User
                {
                    Id = userId,
                    FirstName = request.FirstName ?? string.Empty,
                    LastName = request.LastName ?? string.Empty,
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Phone = request.Phone ?? string.Empty,
                    Gender = request.Gender ?? "Unspecified",
                    DateOfBirth = request.DateOfBirth ?? DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    Role = "customer", // Default role for new registrations
                    CreatedAt = DateTime.UtcNow,
                    ProfileImage = string.Empty
                };

                Console.WriteLine($"Creating user with ID: {userId}");
                
                // Add to database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"User created successfully: {user.Id}");

                // Generate JWT token
                var token = _tokenService.GenerateJwtToken(user);

                return new AuthResponse
                {
                    Token = token,
                    User = MapUserToDto(user)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            return MapUserToDto(user);
        }

        public async Task<UserDto> UpdateProfileAsync(string userId, UpdateProfileRequest request)
        {
            try
            {
                Console.WriteLine($"Updating profile for user ID: {userId}");
                
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                // Update user properties
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Phone = request.Phone ?? user.Phone;
                user.Gender = request.Gender ?? user.Gender;
                user.DateOfBirth = request.DateOfBirth ?? user.DateOfBirth;
                if (!string.IsNullOrEmpty(request.ProfileImage))
                {
                    user.ProfileImage = request.ProfileImage;
                }
                
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                Console.WriteLine($"Profile updated successfully for user ID: {userId}");
                
                return MapUserToDto(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating profile: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private UserDto MapUserToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                ProfileImage = user.ProfileImage
            };
        }
    }
} 