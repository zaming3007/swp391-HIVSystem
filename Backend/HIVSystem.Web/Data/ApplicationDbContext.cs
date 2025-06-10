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

        public DbSet<HIVHealthcareSystem.Models.User> Users { get; set; }
        public DbSet<HIVHealthcareSystem.Models.Doctor> Doctors { get; set; }
        public DbSet<HIVHealthcareSystem.Models.Appointment> Appointments { get; set; }
        public DbSet<HIVHealthcareSystem.Models.Facility> Facilities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HIVHealthcareSystem.Models.User>(entity =>
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

            modelBuilder.Entity<HIVHealthcareSystem.Models.Doctor>(entity =>
            {
                entity.ToTable("Doctors");
                
                entity.Property(e => e.Specialty)
                    .HasMaxLength(100);
                
                entity.Property(e => e.Qualification)
                    .HasMaxLength(255);
                
                entity.Property(e => e.LicenseNumber)
                    .HasMaxLength(50);
                
                entity.Property(e => e.VerificationStatus)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValue("Pending");
                
                entity.Property(e => e.IsAvailable)
                    .HasDefaultValue(true);
                
                entity.Property(e => e.ConsultationFee)
                    .HasColumnType("decimal(10,2)");

                // Configure relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.VerifiedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.VerifiedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<HIVHealthcareSystem.Models.Facility>(entity =>
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



            modelBuilder.Entity<HIVHealthcareSystem.Models.Appointment>(entity =>
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

                // Temporarily disable Doctor navigation property relationship
                // entity.HasOne(e => e.Doctor)
                //     .WithMany(d => d.Appointments)
                //     .HasForeignKey(e => e.DoctorID)
                //     .OnDelete(DeleteBehavior.Restrict);

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