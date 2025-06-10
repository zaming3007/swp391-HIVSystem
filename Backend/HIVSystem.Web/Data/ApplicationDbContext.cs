using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Models;

namespace HIVHealthcareSystem.Data
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

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                
                // Cấu hình các trường bắt buộc
                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50);
                
                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(100);
                
                // Cấu hình các trường nullable
                entity.Property(e => e.Email)
                    .HasMaxLength(100);
                
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15);
                
                entity.Property(e => e.Gender)
                    .HasMaxLength(10);
                
                entity.Property(e => e.Address)
                    .HasMaxLength(255);
                
                entity.Property(e => e.ProfileImage)
                    .HasMaxLength(255);
                    
                // Cấu hình default values
                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
                
                entity.Property(e => e.IsAnonymous)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.CreatedDate)
                    .HasDefaultValueSql("GETDATE()");
            });
        }
    }
} 