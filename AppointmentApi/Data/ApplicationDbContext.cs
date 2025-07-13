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

        // ARV Management
        public DbSet<ARVDrug> ARVDrugs { get; set; }
        public DbSet<ARVRegimen> ARVRegimens { get; set; }
        public DbSet<ARVMedication> ARVMedications { get; set; }
        public DbSet<PatientRegimen> PatientRegimens { get; set; }
        public DbSet<AdherenceRecord> AdherenceRecords { get; set; }
        public DbSet<SideEffectRecord> SideEffectRecords { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed ARV Drugs - Temporarily commented out for migration
            /*modelBuilder.Entity<ARVDrug>().HasData(
                new ARVDrug
                {
                    Id = "drug-001",
                    Name = "Tenofovir/Emtricitabine",
                    GenericName = "Tenofovir disoproxil fumarate + Emtricitabine",
                    BrandName = "Truvada",
                    DrugClass = "NRTI",
                    Description = "Thuốc kết hợp 2 NRTI, thường dùng trong phác đồ tuyến 1",
                    Dosage = "300mg/200mg",
                    Form = "Viên nén",
                    SideEffects = "Buồn nôn, đau đầu, mệt mỏi, rối loạn thận",
                    Instructions = "Uống 1 viên/ngày, có thể uống cùng hoặc không cùng thức ăn",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = false,
                    MinAge = 18,
                    MinWeight = 35,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVDrug
                {
                    Id = "drug-002",
                    Name = "Efavirenz",
                    GenericName = "Efavirenz",
                    BrandName = "Sustiva",
                    DrugClass = "NNRTI",
                    Description = "NNRTI thế hệ 1, hiệu quả cao trong điều trị HIV",
                    Dosage = "600mg",
                    Form = "Viên nén",
                    SideEffects = "Chóng mặt, mơ mộng bất thường, rối loạn tâm thần",
                    Instructions = "Uống 1 viên/ngày vào buổi tối, tránh uống cùng thức ăn nhiều chất béo",
                    IsActive = true,
                    IsPregnancySafe = false,
                    IsPediatricSafe = false,
                    MinAge = 18,
                    MinWeight = 40,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVDrug
                {
                    Id = "drug-003",
                    Name = "Dolutegravir",
                    GenericName = "Dolutegravir",
                    BrandName = "Tivicay",
                    DrugClass = "INSTI",
                    Description = "Thuốc ức chế integrase thế hệ 2, ít tác dụng phụ",
                    Dosage = "50mg",
                    Form = "Viên nén",
                    SideEffects = "Đau đầu, buồn nôn nhẹ, mất ngủ",
                    Instructions = "Uống 1 viên/ngày, có thể uống cùng hoặc không cùng thức ăn",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = true,
                    MinAge = 12,
                    MinWeight = 30,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVDrug
                {
                    Id = "drug-004",
                    Name = "Lopinavir/Ritonavir",
                    GenericName = "Lopinavir + Ritonavir",
                    BrandName = "Kaletra",
                    DrugClass = "PI",
                    Description = "Thuốc ức chế protease, thường dùng trong phác đồ tuyến 2",
                    Dosage = "200mg/50mg",
                    Form = "Viên nén",
                    SideEffects = "Tiêu chảy, buồn nôn, tăng cholesterol",
                    Instructions = "Uống 2 viên x 2 lần/ngày cùng thức ăn",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = true,
                    MinAge = 6,
                    MinWeight = 15,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVDrug
                {
                    Id = "drug-005",
                    Name = "Zidovudine",
                    GenericName = "Zidovudine",
                    BrandName = "Retrovir",
                    DrugClass = "NRTI",
                    Description = "NRTI thế hệ đầu, vẫn sử dụng trong một số trường hợp đặc biệt",
                    Dosage = "300mg",
                    Form = "Viên nang",
                    SideEffects = "Thiếu máu, giảm bạch cầu, mệt mỏi",
                    Instructions = "Uống 1 viên x 2 lần/ngày, tránh uống cùng thức ăn nhiều chất béo",
                    IsActive = true,
                    IsPregnancySafe = true,
                    IsPediatricSafe = true,
                    MinAge = 3,
                    MinWeight = 10,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );*/

            // Seed ARV Regimens - Temporarily commented out for migration
            /*modelBuilder.Entity<ARVRegimen>().HasData(
                new ARVRegimen
                {
                    Id = "regimen-001",
                    Name = "TDF/FTC + DTG",
                    Description = "Phác đồ tuyến 1 cho người lớn và thanh thiếu niên",
                    Category = "Điều trị ban đầu",
                    LineOfTreatment = "Tuyến 1",
                    IsActive = true,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVRegimen
                {
                    Id = "regimen-002",
                    Name = "TDF/FTC + EFV",
                    Description = "Phác đồ tuyến 1 thay thế cho người lớn",
                    Category = "Điều trị ban đầu",
                    LineOfTreatment = "Tuyến 1",
                    IsActive = true,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ARVRegimen
                {
                    Id = "regimen-003",
                    Name = "AZT/3TC + LPV/r",
                    Description = "Phác đồ tuyến 2 cho người lớn",
                    Category = "Điều trị thay thế",
                    LineOfTreatment = "Tuyến 2",
                    IsActive = true,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed ARV Medications
            modelBuilder.Entity<ARVMedication>().HasData(
                // Regimen 1: TDF/FTC + DTG
                new ARVMedication
                {
                    Id = "med-001",
                    RegimenId = "regimen-001",
                    MedicationName = "Tenofovir/Emtricitabine",
                    ActiveIngredient = "Tenofovir disoproxil fumarate 300mg + Emtricitabine 200mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống cùng hoặc không cùng thức ăn",
                    SideEffects = "Buồn nôn, đau đầu, mệt mỏi",
                    SortOrder = 1
                },
                new ARVMedication
                {
                    Id = "med-002",
                    RegimenId = "regimen-001",
                    MedicationName = "Dolutegravir",
                    ActiveIngredient = "Dolutegravir 50mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống cùng hoặc không cùng thức ăn",
                    SideEffects = "Đau đầu, buồn nôn nhẹ",
                    SortOrder = 2
                },
                // Regimen 2: TDF/FTC + EFV
                new ARVMedication
                {
                    Id = "med-003",
                    RegimenId = "regimen-002",
                    MedicationName = "Tenofovir/Emtricitabine",
                    ActiveIngredient = "Tenofovir disoproxil fumarate 300mg + Emtricitabine 200mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống cùng hoặc không cùng thức ăn",
                    SideEffects = "Buồn nôn, đau đầu, mệt mỏi",
                    SortOrder = 1
                },
                new ARVMedication
                {
                    Id = "med-004",
                    RegimenId = "regimen-002",
                    MedicationName = "Efavirenz",
                    ActiveIngredient = "Efavirenz 600mg",
                    Dosage = "1 viên",
                    Frequency = "1 lần/ngày",
                    Instructions = "Uống vào buổi tối, tránh thức ăn nhiều chất béo",
                    SideEffects = "Chóng mặt, mơ mộng bất thường",
                    SortOrder = 2
                },
                // Regimen 3: AZT/3TC + LPV/r
                new ARVMedication
                {
                    Id = "med-005",
                    RegimenId = "regimen-003",
                    MedicationName = "Zidovudine",
                    ActiveIngredient = "Zidovudine 300mg",
                    Dosage = "1 viên",
                    Frequency = "2 lần/ngày",
                    Instructions = "Uống cách nhau 12 tiếng",
                    SideEffects = "Thiếu máu, mệt mỏi",
                    SortOrder = 1
                },
                new ARVMedication
                {
                    Id = "med-006",
                    RegimenId = "regimen-003",
                    MedicationName = "Lopinavir/Ritonavir",
                    ActiveIngredient = "Lopinavir 200mg + Ritonavir 50mg",
                    Dosage = "2 viên",
                    Frequency = "2 lần/ngày",
                    Instructions = "Uống cùng thức ăn",
                    SideEffects = "Tiêu chảy, buồn nôn",
                    SortOrder = 2
                }
            );*/

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