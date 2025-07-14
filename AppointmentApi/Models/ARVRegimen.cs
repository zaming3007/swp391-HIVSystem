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
        // PatientRegimens navigation removed due to schema mismatch (int vs string ID)
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

        // Navigation properties removed due to schema mismatch
    }

    // Phác đồ được chỉ định cho bệnh nhân
    public class PatientRegimen
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; } // Match database integer type

        [Required]
        [Column("PatientId")]
        [StringLength(50)]
        public required string PatientId { get; set; } // ID bệnh nhân

        [Required]
        [Column("RegimenId")]
        public int RegimenId { get; set; } // ID phác đồ - integer to match database

        [Required]
        [Column("PrescribedBy")]
        [StringLength(50)]
        public required string PrescribedBy { get; set; } // ID bác sĩ kê đơn

        [Required]
        [Column("PrescribedDate")]
        public DateTime PrescribedDate { get; set; } // Ngày kê đơn

        [Column("StartDate")]
        public DateTime? StartDate { get; set; } // Ngày bắt đầu

        [Column("EndDate")]
        public DateTime? EndDate { get; set; } // Ngày kết thúc (nếu có)

        [Required]
        [Column("Status")]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Match database schema

        [Required]
        [Column("Notes")]
        [StringLength(1000)]
        public string Notes { get; set; } = ""; // Ghi chú của bác sĩ

        [Required]
        [Column("DiscontinuationReason")]
        [StringLength(500)]
        public string DiscontinuationReason { get; set; } = ""; // Lý do ngừng điều trị

        [Column("LastReviewDate")]
        public DateTime? LastReviewDate { get; set; }

        [Column("NextReviewDate")]
        public DateTime? NextReviewDate { get; set; }

        [Required]
        [Column("ReviewedBy")]
        [StringLength(50)]
        public string ReviewedBy { get; set; } = "";

        [Required]
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties removed due to schema mismatch
        // RegimenId (int) cannot link to ARVRegimen.Id (string)
        // Use manual joins when needed
    }

    // Ghi nhận tuân thủ điều trị
    public class AdherenceRecord
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public int PatientRegimenId { get; set; }

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

        // Navigation properties removed due to schema mismatch
    }

    // Ghi nhận tác dụng phụ
    public class SideEffectRecord
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public int PatientRegimenId { get; set; }

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

        // Navigation properties removed due to schema mismatch
    }

    // ARV Regimen Drugs mapping table (matches database schema)
    public class ARVRegimenDrug
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [Column("RegimenId")]
        public int RegimenId { get; set; }

        [Required]
        [Column("DrugId")]
        public int DrugId { get; set; }

        [Required]
        [Column("Dosage")]
        [StringLength(100)]
        public string Dosage { get; set; } = "";

        [Required]
        [Column("Frequency")]
        [StringLength(50)]
        public string Frequency { get; set; } = "";

        [Required]
        [Column("Timing")]
        [StringLength(50)]
        public string Timing { get; set; } = "";

        [Required]
        [Column("SpecialInstructions")]
        [StringLength(500)]
        public string SpecialInstructions { get; set; } = "";

        [Required]
        [Column("SortOrder")]
        public int SortOrder { get; set; }

        [Required]
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
