using System;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuthApi.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<ApplicationDbContext>>();

            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                await context.Database.MigrateAsync();
                await SeedUsersAsync(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }

        private static async Task SeedUsersAsync(ApplicationDbContext context)
        {
            // Kiểm tra xem đã có dữ liệu người dùng chưa
            if (await context.Users.AnyAsync())
            {
                return; // Đã có dữ liệu, không cần seed
            }

            // Hash của "password" được tạo trước để tránh dynamic values
            const string passwordHash = "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm";
            var createdAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Tạo dữ liệu mẫu
            var users = new[]
            {
                new User
                {
                    Id = "1",
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@example.com",
                    PasswordHash = passwordHash,
                    Role = "admin",
                    ProfileImage = "/admin-avatar.jpg",
                    DateOfBirth = "1990-01-01",
                    Gender = "Male",
                    Phone = "0123456789",
                    CreatedAt = createdAt
                },
                new User
                {
                    Id = "2",
                    FirstName = "Doctor",
                    LastName = "User",
                    Email = "doctor@example.com",
                    PasswordHash = passwordHash,
                    Role = "doctor",
                    ProfileImage = "/doctor-avatar.jpg",
                    DateOfBirth = "1985-05-15",
                    Gender = "Female",
                    Phone = "0987654321",
                    CreatedAt = createdAt
                },
                new User
                {
                    Id = "3",
                    FirstName = "Staff",
                    LastName = "User",
                    Email = "staff@example.com",
                    PasswordHash = passwordHash,
                    Role = "staff",
                    ProfileImage = "/staff-avatar.jpg",
                    DateOfBirth = "1992-10-20",
                    Gender = "Male",
                    Phone = "0123498765",
                    CreatedAt = createdAt
                },
                new User
                {
                    Id = "4",
                    FirstName = "Customer",
                    LastName = "User",
                    Email = "customer@example.com",
                    PasswordHash = passwordHash,
                    Role = "customer",
                    ProfileImage = "/customer-avatar.jpg",
                    DateOfBirth = "1995-03-25",
                    Gender = "Female",
                    Phone = "0987612345",
                    CreatedAt = createdAt
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
} 