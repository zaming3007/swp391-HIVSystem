using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    // ARV Drug - Thuốc ARV cơ bản
    public class ARVDrug
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(200)]
        public required string Name { get; set; } // Tên thuốc

        [Required]
        [StringLength(200)]
        public required string GenericName { get; set; } // Tên hoạt chất

        [StringLength(200)]
        public string? BrandName { get; set; } // Tên thương mại

        [Required]
        [StringLength(100)]
        public required string DrugClass { get; set; } // Nhóm thuốc: NRTI, NNRTI, PI, INSTI

        [StringLength(1000)]
        public string? Description { get; set; } // Mô tả

        [Required]
        [StringLength(100)]
        public required string Dosage { get; set; } // Liều dùng

        [Required]
        [StringLength(50)]
        public required string Form { get; set; } // Dạng bào chế: viên nén, viên nang

        [StringLength(1000)]
        public string? SideEffects { get; set; } // Tác dụng phụ

        [StringLength(1000)]
        public string? Contraindications { get; set; } // Chống chỉ định

        [StringLength(500)]
        public string? Instructions { get; set; } // Hướng dẫn sử dụng

        public bool IsActive { get; set; } = true;
        public bool IsPregnancySafe { get; set; } = false;
        public bool IsPediatricSafe { get; set; } = false;
        public int MinAge { get; set; } = 18;
        public decimal MinWeight { get; set; } = 50;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<ARVMedication> Medications { get; set; } = new List<ARVMedication>();
    }
    // Phác đồ ARV chuẩn
    public class ARVRegimen
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(200)]
        public required string Name { get; set; } // Tên phác đồ (VD: TDF/3TC/EFV)

        [StringLength(1000)]
        public required string Description { get; set; } // Mô tả chi tiết

        [Required]
        [StringLength(100)]
        public required string Category { get; set; } // Loại: "Điều trị ban đầu", "Điều trị thay thế"

        [Required]
        [StringLength(50)]
        public required string LineOfTreatment { get; set; } // "Tuyến 1", "Tuyến 2", "Tuyến 3"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<ARVMedication> Medications { get; set; } = new List<ARVMedication>();
        public virtual ICollection<PatientRegimen> PatientRegimens { get; set; } = new List<PatientRegimen>();
    }

    // Thuốc trong phác đồ
    public class ARVMedication
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public required string RegimenId { get; set; }

        [Required]
        [StringLength(200)]
        public required string MedicationName { get; set; } // Tên thuốc

        [Required]
        [StringLength(100)]
        public required string ActiveIngredient { get; set; } // Hoạt chất

        [Required]
        [StringLength(100)]
        public required string Dosage { get; set; } // Liều lượng (VD: "600mg")

        [Required]
        [StringLength(100)]
        public required string Frequency { get; set; } // Tần suất (VD: "1 lần/ngày")

        [StringLength(200)]
        public required string Instructions { get; set; } // Hướng dẫn sử dụng

        [StringLength(500)]
        public required string SideEffects { get; set; } // Tác dụng phụ thường gặp

        public int SortOrder { get; set; } // Thứ tự hiển thị

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("RegimenId")]
        public virtual ARVRegimen? Regimen { get; set; }
    }

    // Phác đồ được chỉ định cho bệnh nhân
    public class PatientRegimen
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public required string PatientId { get; set; } // ID bệnh nhân

        [Required]
        public required string PatientName { get; set; } // Tên bệnh nhân

        [Required]
        public required string DoctorId { get; set; } // ID bác sĩ kê đơn

        [Required]
        public required string DoctorName { get; set; } // Tên bác sĩ

        [Required]
        public required string RegimenId { get; set; } // ID phác đồ

        [Required]
        public DateTime StartDate { get; set; } // Ngày bắt đầu

        public DateTime? EndDate { get; set; } // Ngày kết thúc (nếu có)

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Đang điều trị"; // "Đang điều trị", "Hoàn thành", "Ngừng điều trị"

        [StringLength(1000)]
        public required string Notes { get; set; } // Ghi chú của bác sĩ

        [StringLength(1000)]
        public required string Reason { get; set; } // Lý do kê đơn

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("RegimenId")]
        public virtual ARVRegimen? Regimen { get; set; }

        public virtual ICollection<AdherenceRecord> AdherenceRecords { get; set; } = new List<AdherenceRecord>();
        public virtual ICollection<SideEffectRecord> SideEffectRecords { get; set; } = new List<SideEffectRecord>();
    }

    // Ghi nhận tuân thủ điều trị
    public class AdherenceRecord
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public required string PatientRegimenId { get; set; }

        [Required]
        public DateTime RecordDate { get; set; } // Ngày ghi nhận

        [Required]
        public int TotalDoses { get; set; } // Tổng số liều cần uống

        [Required]
        public int TakenDoses { get; set; } // Số liều đã uống

        [Range(0, 100)]
        public decimal AdherencePercentage { get; set; } // Tỷ lệ tuân thủ (%)

        [StringLength(50)]
        public string Period { get; set; } = "Daily"; // Kỳ báo cáo

        [StringLength(500)]
        public required string Notes { get; set; } // Ghi chú

        [StringLength(500)]
        public string Challenges { get; set; } = ""; // Khó khăn gặp phải

        [StringLength(200)]
        public required string RecordedBy { get; set; } // Người ghi nhận (bệnh nhân/bác sĩ)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PatientRegimenId")]
        public virtual PatientRegimen? PatientRegimen { get; set; }
    }

    // Ghi nhận tác dụng phụ
    public class SideEffectRecord
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public required string PatientRegimenId { get; set; }

        [Required]
        [StringLength(200)]
        public required string SideEffect { get; set; } // Tác dụng phụ

        [Required]
        [StringLength(50)]
        public required string Severity { get; set; } // "Nhẹ", "Trung bình", "Nặng"

        [Required]
        public DateTime OnsetDate { get; set; } // Ngày xuất hiện

        public DateTime? ResolvedDate { get; set; } // Ngày hết

        [StringLength(1000)]
        public required string Description { get; set; } // Mô tả chi tiết

        [StringLength(500)]
        public required string Treatment { get; set; } // Cách xử lý

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Đang theo dõi"; // "Đang theo dõi", "Đã hết", "Cần can thiệp"

        [StringLength(200)]
        public required string ReportedBy { get; set; } // Người báo cáo

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("PatientRegimenId")]
        public virtual PatientRegimen? PatientRegimen { get; set; }
    }
}
