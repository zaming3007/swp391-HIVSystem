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
        public DbSet<Consultation> Consultations { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<ConsultationTopic> ConsultationTopics { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<DoctorService> DoctorServices { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Reminder> Reminders { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<PasswordResetCode> PasswordResetCodes { get; set; }

        // ARV Management DbSets
        public DbSet<ARVDrug> ARVDrugs { get; set; }
        public DbSet<ARVRegimen> ARVRegimens { get; set; }
        public DbSet<ARVRegimenDrug> ARVRegimenDrugs { get; set; }
        public DbSet<PatientRegimen> PatientRegimens { get; set; }
        public DbSet<PatientRegimenHistory> PatientRegimenHistories { get; set; }
        public DbSet<PatientAdherence> PatientAdherences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình các bảng với tên PascalCase
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Consultation>().ToTable("Consultations");
            modelBuilder.Entity<Answer>().ToTable("Answers");
            modelBuilder.Entity<ConsultationTopic>().ToTable("ConsultationTopics");
            modelBuilder.Entity<MedicationReminder>().ToTable("MedicationReminders");
            modelBuilder.Entity<Doctor>().ToTable("Doctors");
            modelBuilder.Entity<TimeSlot>().ToTable("TimeSlots");
            modelBuilder.Entity<Service>().ToTable("Services");
            modelBuilder.Entity<DoctorService>().ToTable("DoctorServices");
            modelBuilder.Entity<Appointment>().ToTable("Appointments");
            modelBuilder.Entity<Reminder>().ToTable("Reminders");
            modelBuilder.Entity<BlogPost>().ToTable("BlogPosts");
            modelBuilder.Entity<BlogComment>().ToTable("BlogComments");

            // ARV Management Tables
            modelBuilder.Entity<ARVDrug>().ToTable("ARVDrugs");
            modelBuilder.Entity<ARVRegimen>().ToTable("ARVRegimens");
            modelBuilder.Entity<ARVRegimenDrug>().ToTable("ARVRegimenDrugs");
            modelBuilder.Entity<PatientRegimen>().ToTable("PatientRegimens");
            modelBuilder.Entity<PatientRegimenHistory>().ToTable("PatientRegimenHistories");
            modelBuilder.Entity<PatientAdherence>().ToTable("PatientAdherences");

            // Cấu hình các ràng buộc và mối quan hệ
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Cấu hình mối quan hệ cho các bảng hiện có
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Consultation)
                .WithMany(c => c.Answers)
                .HasForeignKey(a => a.ConsultationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MedicationReminder>()
                .HasOne(m => m.User)
                .WithMany()
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình mối quan hệ cho các bảng mới
            modelBuilder.Entity<TimeSlot>()
                .HasOne(t => t.Doctor)
                .WithMany(d => d.WorkingHours)
                .HasForeignKey(t => t.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DoctorService>()
                .HasOne(ds => ds.Doctor)
                .WithMany(d => d.DoctorServices)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DoctorService>()
                .HasOne(ds => ds.Service)
                .WithMany(s => s.DoctorServices)
                .HasForeignKey(ds => ds.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Thiết lập khóa ngoại
            modelBuilder.Entity<Reminder>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ARV Management Relationships
            modelBuilder.Entity<ARVRegimenDrug>()
                .HasOne(rd => rd.Regimen)
                .WithMany(r => r.RegimenDrugs)
                .HasForeignKey(rd => rd.RegimenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ARVRegimenDrug>()
                .HasOne(rd => rd.Drug)
                .WithMany(d => d.RegimenDrugs)
                .HasForeignKey(rd => rd.DrugId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientRegimen>()
                .HasOne(pr => pr.Regimen)
                .WithMany(r => r.PatientRegimens)
                .HasForeignKey(pr => pr.RegimenId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientRegimen>()
                .HasOne(pr => pr.Patient)
                .WithMany()
                .HasForeignKey(pr => pr.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientRegimen>()
                .HasOne(pr => pr.Doctor)
                .WithMany()
                .HasForeignKey(pr => pr.PrescribedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientRegimenHistory>()
                .HasOne(prh => prh.PatientRegimen)
                .WithMany(pr => pr.History)
                .HasForeignKey(prh => prh.PatientRegimenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientRegimenHistory>()
                .HasOne(prh => prh.PerformedByUser)
                .WithMany()
                .HasForeignKey(prh => prh.PerformedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientAdherence>()
                .HasOne(pa => pa.PatientRegimen)
                .WithMany(pr => pr.AdherenceRecords)
                .HasForeignKey(pa => pa.PatientRegimenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientAdherence>()
                .HasOne(pa => pa.RecordedByUser)
                .WithMany()
                .HasForeignKey(pa => pa.RecordedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed dữ liệu mẫu
            SeedData(modelBuilder);
            SeedARVData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed dữ liệu mẫu cho User với password hash cố định
            // Hash của "password" được tạo trước để tránh dynamic values
            const string passwordHash = "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm";
            // Sử dụng giá trị cố định cho ngày tháng với múi giờ UTC để tránh lỗi PostgreSQL
            var currentDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed Users
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
                    Phone = "0987612345",
                    CreatedAt = currentDate
                }
            );

            // Seed Consultations
            modelBuilder.Entity<Consultation>().HasData(
                new Consultation
                {
                    Id = "1",
                    PatientId = "4", // Customer user
                    Title = "Câu hỏi về liệu trình điều trị",
                    Question = "Tôi muốn biết thêm về các tác dụng phụ của phác đồ điều trị ARV hiện tại?",
                    Category = "Điều trị",
                    Status = "pending",
                    CreatedAt = currentDate.AddDays(-10)
                },
                new Consultation
                {
                    Id = "2",
                    PatientId = "4", // Customer user
                    Title = "Tư vấn về dinh dưỡng",
                    Question = "Tôi nên ăn gì để tăng cường hệ miễn dịch khi đang điều trị?",
                    Category = "Dinh dưỡng",
                    Status = "answered",
                    CreatedAt = currentDate.AddDays(-7)
                },
                new Consultation
                {
                    Id = "3",
                    PatientId = "4", // Customer user
                    Title = "Câu hỏi về tác dụng phụ thuốc",
                    Question = "Gần đây tôi bị mất ngủ sau khi uống thuốc, tôi nên làm gì?",
                    Category = "Điều trị",
                    Status = "answered",
                    CreatedAt = currentDate.AddDays(-5)
                }
            );

            // Seed Answers
            modelBuilder.Entity<Answer>().HasData(
                new Answer
                {
                    Id = "1",
                    ConsultationId = "2",
                    ResponderId = "2", // Doctor user
                    ResponderName = "Doctor User",
                    Content = "Chế độ ăn giàu protein, vitamin và khoáng chất sẽ giúp tăng cường hệ miễn dịch. Nên ăn nhiều rau xanh, trái cây, thịt nạc và cá. Hãy đảm bảo uống đủ nước và hạn chế đồ ăn nhiều dầu mỡ và đường.",
                    CreatedAt = currentDate.AddDays(-6)
                },
                new Answer
                {
                    Id = "2",
                    ConsultationId = "3",
                    ResponderId = "2", // Doctor user
                    ResponderName = "Doctor User",
                    Content = "Tình trạng mất ngủ có thể là tác dụng phụ của một số loại thuốc ARV. Tôi khuyên bạn nên uống thuốc vào buổi sáng thay vì buổi tối. Nếu tình trạng vẫn tiếp tục, hãy đặt lịch hẹn để chúng ta có thể đánh giá và điều chỉnh phác đồ nếu cần.",
                    CreatedAt = currentDate.AddDays(-4)
                }
            );

            // Seed ConsultationTopics
            modelBuilder.Entity<ConsultationTopic>().HasData(
                new ConsultationTopic
                {
                    Id = "1",
                    Name = "Điều trị",
                    Description = "Câu hỏi về điều trị ARV và các phác đồ điều trị",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new ConsultationTopic
                {
                    Id = "2",
                    Name = "Xét nghiệm",
                    Description = "Câu hỏi về các xét nghiệm CD4, viral load",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new ConsultationTopic
                {
                    Id = "3",
                    Name = "Tác dụng phụ",
                    Description = "Câu hỏi về tác dụng phụ của thuốc",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new ConsultationTopic
                {
                    Id = "4",
                    Name = "Dinh dưỡng",
                    Description = "Câu hỏi về chế độ ăn uống và dinh dưỡng",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new ConsultationTopic
                {
                    Id = "5",
                    Name = "Phòng ngừa",
                    Description = "Câu hỏi về phòng ngừa HIV và các biện pháp bảo vệ",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new ConsultationTopic
                {
                    Id = "6",
                    Name = "Khác",
                    Description = "Các câu hỏi khác liên quan đến HIV",
                    CreatedAt = currentDate.AddDays(-30)
                }
            );

            // Seed MedicationReminders
            modelBuilder.Entity<MedicationReminder>().HasData(
                new MedicationReminder
                {
                    Id = "1",
                    UserId = "4", // Customer user
                    MedicationName = "ARV Combo",
                    Dosage = "1 viên",
                    Frequency = "daily",
                    StartDate = currentDate.AddDays(-30),
                    ReminderTimes = "[\"08:00\"]",
                    Notes = "Uống sau khi ăn sáng",
                    CreatedAt = currentDate.AddDays(-30)
                },
                new MedicationReminder
                {
                    Id = "2",
                    UserId = "4", // Customer user
                    MedicationName = "Vitamin D",
                    Dosage = "2 viên",
                    Frequency = "daily",
                    StartDate = currentDate.AddDays(-15),
                    ReminderTimes = "[\"12:00\"]",
                    Notes = "Uống cùng bữa trưa",
                    CreatedAt = currentDate.AddDays(-15)
                }
            );

            // Seed Doctors
            modelBuilder.Entity<Doctor>().HasData(
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
                    CreatedAt = currentDate
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
                    CreatedAt = currentDate
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
                    CreatedAt = currentDate
                }
            );

            // Seed TimeSlots
            modelBuilder.Entity<TimeSlot>().HasData(
                new TimeSlot
                {
                    Id = "1",
                    DoctorId = "1", // Bác sĩ Minh
                    DayOfWeek = 1, // Thứ Hai
                    StartTime = "08:00",
                    EndTime = "12:00"
                },
                new TimeSlot
                {
                    Id = "2",
                    DoctorId = "1",
                    DayOfWeek = 3, // Thứ Tư
                    StartTime = "13:00",
                    EndTime = "17:00"
                },
                new TimeSlot
                {
                    Id = "3",
                    DoctorId = "2", // Bác sĩ Hoa
                    DayOfWeek = 2, // Thứ Ba
                    StartTime = "08:00",
                    EndTime = "12:00"
                },
                new TimeSlot
                {
                    Id = "4",
                    DoctorId = "2",
                    DayOfWeek = 4, // Thứ Năm
                    StartTime = "13:00",
                    EndTime = "17:00"
                },
                new TimeSlot
                {
                    Id = "5",
                    DoctorId = "3", // Bác sĩ Tuấn
                    DayOfWeek = 5, // Thứ Sáu
                    StartTime = "08:00",
                    EndTime = "17:00"
                }
            );

            // Seed Services
            modelBuilder.Entity<Service>().HasData(
                new Service
                {
                    Id = "1",
                    Name = "Khám tổng quát",
                    Description = "Khám sức khỏe tổng quát định kỳ",
                    Duration = 60,
                    Price = 300000,
                    Category = "Khám tổng quát",
                    ImageUrl = "/services/general-checkup.jpg",
                    CreatedAt = currentDate
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
                    CreatedAt = currentDate
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
                    CreatedAt = currentDate
                }
            );

            // Seed DoctorServices
            modelBuilder.Entity<DoctorService>().HasData(
                new DoctorService
                {
                    Id = "1",
                    DoctorId = "1",
                    ServiceId = "1"
                },
                new DoctorService
                {
                    Id = "2",
                    DoctorId = "1",
                    ServiceId = "2"
                },
                new DoctorService
                {
                    Id = "3",
                    DoctorId = "2",
                    ServiceId = "3"
                },
                new DoctorService
                {
                    Id = "4",
                    DoctorId = "3",
                    ServiceId = "1"
                }
            );

            // Seed Appointments
            modelBuilder.Entity<Appointment>().HasData(
                new Appointment
                {
                    Id = "1",
                    PatientId = "4", // Customer user
                    PatientName = "Customer User",
                    DoctorId = "1", // Bác sĩ Minh
                    DoctorName = "Minh Nguyễn",
                    ServiceId = "1", // Khám tổng quát
                    ServiceName = "Khám tổng quát",
                    Date = currentDate.AddDays(3),
                    StartTime = "09:00",
                    EndTime = "10:00",
                    Status = AppointmentStatus.Confirmed,
                    Notes = "Khám sức khỏe định kỳ hàng năm",
                    CreatedAt = currentDate.AddDays(-5)
                },
                new Appointment
                {
                    Id = "2",
                    PatientId = "4", // Customer user
                    PatientName = "Customer User",
                    DoctorId = "2", // Bác sĩ Hoa
                    DoctorName = "Hoa Trần",
                    ServiceId = "3", // Khám da liễu
                    ServiceName = "Khám da liễu",
                    Date = currentDate.AddDays(7),
                    StartTime = "14:00",
                    EndTime = "14:30",
                    Status = AppointmentStatus.Pending,
                    Notes = "Khám tình trạng dị ứng da",
                    CreatedAt = currentDate.AddDays(-2)
                }
            );
        }

        private void SeedARVData(ModelBuilder modelBuilder)
        {
            var currentDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed ARV Drugs
            modelBuilder.Entity<ARVDrug>().HasData(
                new ARVDrug
                {
                    Id = 1,
                    Name = "Efavirenz",
                    GenericName = "Efavirenz",
                    BrandName = "Sustiva",
                    DrugClass = "NNRTI",
                    Description = "Non-nucleoside reverse transcriptase inhibitor",
                    Dosage = "600mg",
                    Form = "Tablet",
                    SideEffects = "Dizziness, drowsiness, trouble concentrating, unusual dreams",
                    Contraindications = "Pregnancy (first trimester), severe liver disease",
                    Instructions = "Take once daily at bedtime on empty stomach",
                    IsActive = true,
                    IsPregnancySafe = false,
                    IsPediatricSafe = true,
                    MinAge = 3,
                    MinWeight = 10,
                    CreatedAt = currentDate,
                    UpdatedAt = currentDate,
                    CreatedBy = "1",
                    UpdatedBy = "1"
                },
                new ARVDrug
                {
                    Id = 2,
                    Name = "Tenofovir/Emtricitabine",
                    GenericName = "Tenofovir DF/Emtricitabine",
                    BrandName = "Truvada",
                    DrugClass = "NRTI",
                    Description = "Nucleoside reverse transcriptase inhibitor combination",
                    Dosage = "300mg/200mg",
                    Form = "Tablet",
                    SideEffects = "Nausea, diarrhea, headache, fatigue",
                    Contraindications = "Severe kidney disease, lactic acidosis",
                    Instructions = "Take once daily with or without food",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = true,
                    MinAge = 12,
                    MinWeight = 35,
                    CreatedAt = currentDate,
                    UpdatedAt = currentDate,
                    CreatedBy = "1",
                    UpdatedBy = "1"
                },
                new ARVDrug
                {
                    Id = 3,
                    Name = "Dolutegravir",
                    GenericName = "Dolutegravir",
                    BrandName = "Tivicay",
                    DrugClass = "INSTI",
                    Description = "Integrase strand transfer inhibitor",
                    Dosage = "50mg",
                    Form = "Tablet",
                    SideEffects = "Headache, insomnia, fatigue",
                    Contraindications = "Hypersensitivity to dolutegravir",
                    Instructions = "Take once daily with or without food",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = true,
                    MinAge = 6,
                    MinWeight = 20,
                    CreatedAt = currentDate,
                    UpdatedAt = currentDate,
                    CreatedBy = "1",
                    UpdatedBy = "1"
                }
            );

            // Seed ARV Regimens
            modelBuilder.Entity<ARVRegimen>().HasData(
                new ARVRegimen
                {
                    Id = 1,
                    Name = "TDF/FTC + DTG",
                    Description = "First-line regimen for adults and adolescents",
                    RegimenType = "FirstLine",
                    TargetPopulation = "Adult",
                    Instructions = "Take all medications once daily, preferably at the same time each day",
                    Monitoring = "Monitor viral load at 3, 6, and 12 months, then every 6 months",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = false,
                    MinAge = 18,
                    MinWeight = 50,
                    CreatedAt = currentDate,
                    UpdatedAt = currentDate,
                    CreatedBy = "1",
                    UpdatedBy = "1"
                },
                new ARVRegimen
                {
                    Id = 2,
                    Name = "TDF/FTC + EFV",
                    Description = "Alternative first-line regimen",
                    RegimenType = "FirstLine",
                    TargetPopulation = "Adult",
                    Instructions = "Take TDF/FTC in morning, EFV at bedtime",
                    Monitoring = "Monitor viral load and liver function regularly",
                    IsActive = true,
                    IsPregnancySafe = false,
                    IsPediatricSafe = false,
                    MinAge = 18,
                    MinWeight = 50,
                    CreatedAt = currentDate,
                    UpdatedAt = currentDate,
                    CreatedBy = "1",
                    UpdatedBy = "1"
                }
            );

            // Seed ARV Regimen Drugs
            modelBuilder.Entity<ARVRegimenDrug>().HasData(
                // TDF/FTC + DTG regimen
                new ARVRegimenDrug
                {
                    Id = 1,
                    RegimenId = 1,
                    DrugId = 2, // TDF/FTC
                    Dosage = "300mg/200mg",
                    Frequency = "Once daily",
                    Timing = "With or without food",
                    SpecialInstructions = "Take at the same time every day",
                    SortOrder = 1,
                    CreatedAt = currentDate
                },
                new ARVRegimenDrug
                {
                    Id = 2,
                    RegimenId = 1,
                    DrugId = 3, // DTG
                    Dosage = "50mg",
                    Frequency = "Once daily",
                    Timing = "With or without food",
                    SpecialInstructions = "Can be taken with TDF/FTC",
                    SortOrder = 2,
                    CreatedAt = currentDate
                },
                // TDF/FTC + EFV regimen
                new ARVRegimenDrug
                {
                    Id = 3,
                    RegimenId = 2,
                    DrugId = 2, // TDF/FTC
                    Dosage = "300mg/200mg",
                    Frequency = "Once daily",
                    Timing = "Morning with food",
                    SpecialInstructions = "Take in the morning",
                    SortOrder = 1,
                    CreatedAt = currentDate
                },
                new ARVRegimenDrug
                {
                    Id = 4,
                    RegimenId = 2,
                    DrugId = 1, // EFV
                    Dosage = "600mg",
                    Frequency = "Once daily",
                    Timing = "Bedtime on empty stomach",
                    SpecialInstructions = "Take 2-3 hours after dinner",
                    SortOrder = 2,
                    CreatedAt = currentDate
                }
            );
        }
    }
}