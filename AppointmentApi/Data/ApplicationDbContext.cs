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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình các ràng buộc và mối quan hệ
            modelBuilder.Entity<Doctor>()
                .ToTable("Doctors")
                .HasMany(d => d.WorkingHours)
                .WithOne(t => t.Doctor)
                .HasForeignKey(t => t.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<Appointment>()
                .ToTable("Appointments")
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Service>()
                .ToTable("Services");

            modelBuilder.Entity<TimeSlot>()
                .ToTable("TimeSlots");

            // Seed dữ liệu mẫu
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed doctors
            var doctors = new List<Doctor>
            {
                new Doctor
                {
                    Id = "1",
                    FirstName = "Minh",
                    LastName = "Nguyễn",
                    Specialization = "Nhi khoa",
                    Email = "minh.nguyen@example.com",
                    Phone = "0901234567",
                    ProfileImage = "/doctor-profiles/minh-nguyen.jpg",
                    Available = true,
                    Bio = "Bác sĩ Minh có hơn 10 năm kinh nghiệm trong lĩnh vực nhi khoa.",
                    Experience = 10,
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                },
                new Doctor
                {
                    Id = "2",
                    FirstName = "Hoa",
                    LastName = "Trần",
                    Specialization = "Da liễu",
                    Email = "hoa.tran@example.com",
                    Phone = "0912345678",
                    ProfileImage = "/doctor-profiles/hoa-tran.jpg",
                    Available = true,
                    Bio = "Bác sĩ Hoa chuyên về các vấn đề da liễu và thẩm mỹ.",
                    Experience = 8,
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                },
                new Doctor
                {
                    Id = "3",
                    FirstName = "Tuấn",
                    LastName = "Lê",
                    Specialization = "Tim mạch",
                    Email = "tuan.le@example.com",
                    Phone = "0923456789",
                    ProfileImage = "/doctor-profiles/tuan-le.jpg",
                    Available = true,
                    Bio = "Bác sĩ Tuấn là chuyên gia hàng đầu về bệnh tim mạch.",
                    Experience = 15,
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                }
            };
            modelBuilder.Entity<Doctor>().HasData(doctors);

            // Seed services
            var services = new List<Service>
            {
                new Service
                {
                    Id = "1",
                    Name = "Khám tổng quát",
                    Description = "Khám sức khỏe tổng quát định kỳ",
                    Duration = 60,
                    Price = 300000,
                    Category = "Khám tổng quát",
                    ImageUrl = "/services/general-checkup.jpg",
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                },
                new Service
                {
                    Id = "2",
                    Name = "Tư vấn dinh dưỡng",
                    Description = "Tư vấn chế độ dinh dưỡng phù hợp",
                    Duration = 45,
                    Price = 250000,
                    Category = "Dinh dưỡng",
                    ImageUrl = "/services/nutrition-consulting.jpg",
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                },
                new Service
                {
                    Id = "3",
                    Name = "Khám da liễu",
                    Description = "Khám và điều trị các vấn đề về da",
                    Duration = 30,
                    Price = 350000,
                    Category = "Da liễu",
                    ImageUrl = "/services/dermatology.jpg",
                    CreatedAt = new System.DateTime(2025, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                }
            };
            modelBuilder.Entity<Service>().HasData(services);

            // Seed appointments
            var appointments = new List<Appointment>
            {
                new Appointment
                {
                    Id = "1",
                    PatientId = "patient1",
                    PatientName = "Khách hàng Mẫu",
                    DoctorId = "1",
                    DoctorName = "Minh Nguyễn",
                    ServiceId = "1",
                    ServiceName = "Khám tổng quát",
                    Date = new System.DateTime(2025, 1, 4, 0, 0, 0, System.DateTimeKind.Utc),
                    StartTime = "09:00",
                    EndTime = "10:00",
                    Status = AppointmentStatus.Confirmed,
                    Notes = "Khám sức khỏe định kỳ hàng năm",
                    CreatedAt = new System.DateTime(2024, 12, 27, 0, 0, 0, System.DateTimeKind.Utc)
                },
                new Appointment
                {
                    Id = "2",
                    PatientId = "patient1",
                    PatientName = "Khách hàng Mẫu",
                    DoctorId = "2",
                    DoctorName = "Hoa Trần",
                    ServiceId = "3",
                    ServiceName = "Khám da liễu",
                    Date = new System.DateTime(2025, 1, 8, 0, 0, 0, System.DateTimeKind.Utc),
                    StartTime = "14:00",
                    EndTime = "14:30",
                    Status = AppointmentStatus.Pending,
                    Notes = "Khám tình trạng dị ứng da",
                    CreatedAt = new System.DateTime(2024, 12, 30, 0, 0, 0, System.DateTimeKind.Utc)
                }
            };
            modelBuilder.Entity<Appointment>().HasData(appointments);

            // Seed time slots
            var timeSlots = new List<TimeSlot>
            {
                new TimeSlot
                {
                    Id = "1",
                    DoctorId = "1",
                    DayOfWeek = 1,
                    StartTime = "08:00",
                    EndTime = "12:00"
                },
                new TimeSlot
                {
                    Id = "2",
                    DoctorId = "1",
                    DayOfWeek = 3,
                    StartTime = "13:00",
                    EndTime = "17:00"
                },
                new TimeSlot
                {
                    Id = "3",
                    DoctorId = "2",
                    DayOfWeek = 2,
                    StartTime = "08:00",
                    EndTime = "12:00"
                },
                new TimeSlot
                {
                    Id = "4",
                    DoctorId = "2",
                    DayOfWeek = 4,
                    StartTime = "13:00",
                    EndTime = "17:00"
                },
                new TimeSlot
                {
                    Id = "5",
                    DoctorId = "3",
                    DayOfWeek = 5,
                    StartTime = "08:00",
                    EndTime = "17:00"
                }
            };
            modelBuilder.Entity<TimeSlot>().HasData(timeSlots);
        }
    }
} 