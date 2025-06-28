using Microsoft.EntityFrameworkCore;
using AuthApi.Models;

namespace AuthApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình các ràng buộc và mối quan hệ
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Seed dữ liệu mẫu
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed dữ liệu mẫu cho User với password hash cố định
            // Hash của "password" được tạo trước để tránh dynamic values
            const string passwordHash = "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm";
            
            modelBuilder.Entity<User>().HasData(
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
                    Phone = "0123456789"
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
                    Phone = "0987654321"
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
                    Phone = "0123498765"
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
                    Phone = "0987612345"
                }
            );
        }
    }
} 