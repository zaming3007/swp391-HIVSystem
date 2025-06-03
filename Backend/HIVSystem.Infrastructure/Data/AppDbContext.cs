using Microsoft.EntityFrameworkCore;
using HIVSystem.Core.Entities;

namespace HIVSystem.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Define your DbSets (tables) here
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<FacilityDoctor> FacilityDoctors { get; set; }
        public DbSet<AppointmentReminder> AppointmentReminders { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure your entity mappings here
            
            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserID);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(15);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.ProfileImage).HasMaxLength(255);
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");
                
                entity.HasOne(e => e.Role)
                    .WithMany(r => r.Users)
                    .HasForeignKey(e => e.RoleID);
            });

            // Doctor entity configuration
            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.HasKey(e => e.DoctorID);
                entity.Property(e => e.Specialty).HasMaxLength(100);
                entity.Property(e => e.Qualification).HasMaxLength(255);
                entity.Property(e => e.LicenseNumber).HasMaxLength(50);
                entity.Property(e => e.VerificationStatus).HasMaxLength(20).HasDefaultValue("Pending");
                entity.Property(e => e.ConsultationFee).HasColumnType("decimal(10,2)");
                
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Doctor)
                    .HasForeignKey<Doctor>(e => e.UserID);
                    
                entity.HasOne(e => e.VerifiedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.VerifiedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Patient entity configuration
            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasKey(e => e.PatientID);
                entity.Property(e => e.PatientCode).HasMaxLength(20);
                entity.Property(e => e.BloodType).HasMaxLength(5);
                entity.Property(e => e.EmergencyContact).HasMaxLength(100);
                entity.Property(e => e.EmergencyPhone).HasMaxLength(15);
                entity.Property(e => e.EmergencyRelationship).HasMaxLength(50);
                entity.Property(e => e.InsuranceInfo).HasMaxLength(255);
                entity.Property(e => e.Height).HasColumnType("decimal(5,2)");
                entity.Property(e => e.Weight).HasColumnType("decimal(5,2)");
                
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Patient)
                    .HasForeignKey<Patient>(e => e.UserID);
            });

            // DoctorSchedule entity configuration
            modelBuilder.Entity<DoctorSchedule>(entity =>
            {
                entity.HasKey(e => e.ScheduleID);
                entity.Property(e => e.SlotDuration).HasDefaultValue(30);
                entity.Property(e => e.Notes).HasMaxLength(255);
                
                entity.HasOne(e => e.Doctor)
                    .WithMany(d => d.Schedules)
                    .HasForeignKey(e => e.DoctorID);
            });

            // DoctorAvailability entity configuration
            modelBuilder.Entity<DoctorAvailability>(entity =>
            {
                entity.HasKey(e => e.AvailabilityID);
                entity.Property(e => e.Reason).HasMaxLength(255);
                
                entity.HasOne(e => e.Doctor)
                    .WithMany(d => d.Availabilities)
                    .HasForeignKey(e => e.DoctorID);
            });

            // Appointment entity configuration
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.AppointmentID);
                entity.Property(e => e.AppointmentDate).IsRequired();
                entity.Property(e => e.AppointmentTime).IsRequired();
                entity.Property(e => e.AppointmentType).HasMaxLength(50);
                entity.Property(e => e.Purpose).HasMaxLength(255);
                entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Scheduled");
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");
                
                entity.HasOne(e => e.Patient)
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(e => e.PatientID);
                    
                entity.HasOne(e => e.Doctor)
                    .WithMany(d => d.Appointments)
                    .HasForeignKey(e => e.DoctorID);
                    
                entity.HasOne(e => e.Facility)
                    .WithMany(f => f.Appointments)
                    .HasForeignKey(e => e.FacilityID);
                    
                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.CreatedAppointments)
                    .HasForeignKey(e => e.CreatedBy);
            });

            // Role entity configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleID);
                entity.Property(e => e.RoleName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(255);
            });

            // Facility entity configuration
            modelBuilder.Entity<Facility>(entity =>
            {
                entity.HasKey(e => e.FacilityID);
                entity.Property(e => e.FacilityName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.City).HasMaxLength(50);
                entity.Property(e => e.State).HasMaxLength(50);
                entity.Property(e => e.ZipCode).HasMaxLength(20);
                entity.Property(e => e.PhoneNumber).HasMaxLength(15);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Website).HasMaxLength(255);
                entity.Property(e => e.OpeningHours).HasMaxLength(255);
            });
        }
    }
} 