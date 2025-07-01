using Microsoft.EntityFrameworkCore;
using AppointmentApi.Models;
using System.Collections.Generic;

namespace AppointmentApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Models.DoctorService> DoctorServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình các ràng buộc và mối quan hệ
            modelBuilder.Entity<Doctor>()
                .ToTable("Doctors", t => t.ExcludeFromMigrations())
                .HasMany(d => d.WorkingHours)
                .WithOne(t => t.Doctor)
                .HasForeignKey(t => t.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Đảm bảo rằng Doctor.Id và TimeSlot.DoctorId đều được coi là kiểu string
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Id)
                .HasColumnType("text");

            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.DoctorId)
                .HasColumnType("text");

            // Cấu hình thuộc tính với tên cột snake_case cho Doctor
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Available)
                .HasColumnName("available");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.FirstName)
                .HasColumnName("first_name");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.LastName)
                .HasColumnName("last_name");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Specialization)
                .HasColumnName("specialization");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Email)
                .HasColumnName("email");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Bio)
                .HasColumnName("bio");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Phone)
                .HasColumnName("phone");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.ProfileImage)
                .HasColumnName("profile_image");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.Experience)
                .HasColumnName("experience");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.CreatedAt)
                .HasColumnName("created_at");
                
            modelBuilder.Entity<Doctor>()
                .Property(d => d.UpdatedAt)
                .HasColumnName("updated_at");
                
            modelBuilder.Entity<Appointment>()
                .ToTable("Appointments", t => t.ExcludeFromMigrations())
                .Property(a => a.Status)
                .HasConversion<int>();
            
            // Cấu hình thuộc tính với tên cột snake_case cho Appointment
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Id)
                .HasColumnName("id");
            
            modelBuilder.Entity<Appointment>()
                .Property(a => a.PatientId)
                .HasColumnName("patient_id");
            
            modelBuilder.Entity<Appointment>()
                .Property(a => a.PatientName)
                .HasColumnName("patient_name");
            
            modelBuilder.Entity<Appointment>()
                .Property(a => a.DoctorId)
                .HasColumnName("doctor_id");
            
            modelBuilder.Entity<Appointment>()
                .Property(a => a.DoctorName)
                .HasColumnName("doctor_name");
            
            modelBuilder.Entity<Appointment>()
                .Property(a => a.ServiceId)
                .HasColumnName("service_id");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.ServiceName)
                .HasColumnName("service_name");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Date)
                .HasColumnName("date");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.StartTime)
                .HasColumnName("start_time");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.EndTime)
                .HasColumnName("end_time");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasColumnName("status");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Notes)
                .HasColumnName("notes");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.AppointmentType)
                .HasColumnName("appointment_type")
                .HasConversion<int>();
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.MeetingLink)
                .HasColumnName("meeting_link");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.CreatedAt)
                .HasColumnName("created_at");
                
            modelBuilder.Entity<Appointment>()
                .Property(a => a.UpdatedAt)
                .HasColumnName("updated_at");

            // Clear the existing Service configuration and set up a new one
            modelBuilder.Entity<Service>()
                .ToTable("Services", t => t.ExcludeFromMigrations());
            
            // Cấu hình thuộc tính với tên cột snake_case cho Service
            modelBuilder.Entity<Service>()
                .Property(s => s.Id)
                .HasColumnName("id");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.Category)
                .HasColumnName("category");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.Name)
                .HasColumnName("name");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.Description)
                .HasColumnName("description");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasColumnName("price");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.Duration)
                .HasColumnName("duration");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.ImageUrl)
                .HasColumnName("image_url");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.CreatedAt)
                .HasColumnName("created_at");
                
            modelBuilder.Entity<Service>()
                .Property(s => s.UpdatedAt)
                .HasColumnName("updated_at");

            modelBuilder.Entity<TimeSlot>()
                .ToTable("TimeSlots", t => t.ExcludeFromMigrations());
            
            // Cấu hình thuộc tính với tên cột snake_case cho TimeSlot
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.Id)
                .HasColumnName("id");
            
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.DoctorId)
                .HasColumnName("doctor_id");
                
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.DayOfWeek)
                .HasColumnName("day_of_week");
                
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.StartTime)
                .HasColumnName("start_time");
                
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.EndTime)
                .HasColumnName("end_time");
                
            // Cấu hình cho DoctorService
            modelBuilder.Entity<Models.DoctorService>()
                .ToTable("DoctorServices", t => t.ExcludeFromMigrations());
                
            modelBuilder.Entity<Models.DoctorService>()
                .Property(ds => ds.Id)
                .HasColumnName("id");
                
            modelBuilder.Entity<Models.DoctorService>()
                .Property(ds => ds.DoctorId)
                .HasColumnName("doctor_id");
                
            modelBuilder.Entity<Models.DoctorService>()
                .Property(ds => ds.ServiceId)
                .HasColumnName("service_id");
        }

        // Thêm phương thức để lấy options cho việc tạo context mới
        public DbContextOptions<ApplicationDbContext> GetDbContextOptions()
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            
            // Sử dụng chuỗi kết nối hiện tại
            var connectionString = this.Database.GetConnectionString();
            
            if (!string.IsNullOrEmpty(connectionString))
            {
                optionsBuilder.UseNpgsql(connectionString);
            }
            else
            {
                // Fallback - nếu không lấy được connection string từ context hiện tại
                throw new InvalidOperationException("Không thể lấy connection string từ context hiện tại");
            }
            
            return optionsBuilder.Options;
        }
    }
} 