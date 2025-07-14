using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentApi.Models
{
    [Table("TestResults")]
    public class TestResult
    {
        [Key]
        [Column("Id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [Column("PatientId")]
        public string PatientId { get; set; } = string.Empty;

        [Required]
        [Column("DoctorId")]
        public string DoctorId { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("TestType")]
        public string TestType { get; set; } = string.Empty; // 'CD4', 'ViralLoad', 'Other'

        [Required]
        [MaxLength(200)]
        [Column("TestName")]
        public string TestName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        [Column("Result")]
        public string Result { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("Unit")]
        public string? Unit { get; set; }

        [MaxLength(200)]
        [Column("ReferenceRange")]
        public string? ReferenceRange { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("Status")]
        public string Status { get; set; } = string.Empty; // 'Normal', 'Abnormal', 'Critical'

        [Required]
        [Column("TestDate")]
        public DateTime TestDate { get; set; }

        [MaxLength(200)]
        [Column("LabName")]
        public string? LabName { get; set; }

        [MaxLength(1000)]
        [Column("Notes")]
        public string? Notes { get; set; }

        [Required]
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("UpdatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }

    // DTO for API responses
    public class TestResultDto
    {
        public string Id { get; set; } = string.Empty;
        public string PatientId { get; set; } = string.Empty;
        public string DoctorId { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string TestName { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public string? Unit { get; set; }
        public string? ReferenceRange { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime TestDate { get; set; }
        public string? LabName { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // DTO for creating new test results
    public class CreateTestResultDto
    {
        [Required]
        public string PatientId { get; set; } = string.Empty;

        [Required]
        public string DoctorId { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string TestType { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string TestName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Result { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Unit { get; set; }

        [MaxLength(200)]
        public string? ReferenceRange { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;

        [Required]
        public DateTime TestDate { get; set; }

        [MaxLength(200)]
        public string? LabName { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    // DTO for updating test results
    public class UpdateTestResultDto
    {
        [MaxLength(500)]
        public string? Result { get; set; }

        [MaxLength(50)]
        public string? Unit { get; set; }

        [MaxLength(200)]
        public string? ReferenceRange { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        public DateTime? TestDate { get; set; }

        [MaxLength(200)]
        public string? LabName { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    // DTO for patient test results summary
    public class PatientTestSummaryDto
    {
        public string PatientId { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public TestResultDto? LatestCD4 { get; set; }
        public TestResultDto? LatestViralLoad { get; set; }
        public List<TestResultDto> RecentTests { get; set; } = new();
        public int TotalTestsCount { get; set; }
    }
}
