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
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Facility> Facilities { get; set; }

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

            modelBuilder.Entity<Facility>(entity =>
            {
                entity.ToTable("Facilities");
                
                entity.Property(e => e.FacilityName)
                    .IsRequired()
                    .HasMaxLength(100);
                
                entity.Property(e => e.Address)
                    .HasMaxLength(255);
                
                entity.Property(e => e.City)
                    .HasMaxLength(50);
                
                entity.Property(e => e.State)
                    .HasMaxLength(50);
                
                entity.Property(e => e.ZipCode)
                    .HasMaxLength(20);
                
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15);
                
                entity.Property(e => e.Email)
                    .HasMaxLength(100);
                
                entity.Property(e => e.Website)
                    .HasMaxLength(255);
                
                entity.Property(e => e.OpeningHours)
                    .HasMaxLength(255);
                
                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("Appointments");
                
                // Cấu hình các trường bắt buộc
                entity.Property(e => e.DoctorID)
                    .IsRequired();
                
                entity.Property(e => e.AppointmentDate)
                    .IsRequired();
                
                entity.Property(e => e.AppointmentTime)
                    .IsRequired();
                
                entity.Property(e => e.AppointmentType)
                    .HasMaxLength(50);
                
                entity.Property(e => e.Purpose)
                    .HasMaxLength(255);
                
                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValue("Scheduled");
                
                // Cấu hình các trường nullable
                entity.Property(e => e.PatientName)
                    .HasMaxLength(255);
                
                entity.Property(e => e.PatientPhone)
                    .HasMaxLength(20);
                
                entity.Property(e => e.PatientEmail)
                    .HasMaxLength(255);
                
                entity.Property(e => e.ConsultationFee)
                    .HasColumnType("decimal(10,2)");
                
                // Cấu hình default values
                entity.Property(e => e.IsAnonymous)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.ReminderSent)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.CreatedDate)
                    .HasDefaultValueSql("GETDATE()");

                // Cấu hình relationships
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientID)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Doctor)
                    .WithMany()
                    .HasForeignKey(e => e.DoctorID)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Facility)
                    .WithMany()
                    .HasForeignKey(e => e.FacilityID)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Creator)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
} 