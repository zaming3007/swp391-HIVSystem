using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVHealthcareSystem.Models
{
    public class MedicalExamination
    {
        [Key]
        public int ExaminationID { get; set; }

        [Required]
        public int AppointmentID { get; set; }

        [Required]
        public int PatientID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        public DateTime ExaminationDate { get; set; }

        [StringLength(500)]
        public string ChiefComplaint { get; set; }

        [StringLength(500)]
        public string VitalSigns { get; set; }

        public string PhysicalExamination { get; set; }

        [StringLength(500)]
        public string Diagnosis { get; set; }

        public string TreatmentPlan { get; set; }

        [StringLength(500)]
        public string Prescription { get; set; }

        public string FollowUpInstructions { get; set; }

        public string AdditionalNotes { get; set; }

        [StringLength(20)]
        public string Status { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        // Navigation properties
        [ForeignKey("AppointmentID")]
        public virtual Appointment Appointment { get; set; }

        [ForeignKey("PatientID")]
        public virtual Patient Patient { get; set; }

        [ForeignKey("DoctorID")]
        public virtual Doctor Doctor { get; set; }
    }
} 