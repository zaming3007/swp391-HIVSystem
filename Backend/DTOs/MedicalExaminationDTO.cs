using System;

namespace HIVHealthcareSystem.DTOs
{
    public class MedicalExaminationDTO
    {
        public int ExaminationID { get; set; }
        public int AppointmentID { get; set; }
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        public DateTime ExaminationDate { get; set; }
        public string ChiefComplaint { get; set; }
        public string VitalSigns { get; set; }
        public string PhysicalExamination { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentPlan { get; set; }
        public string Prescription { get; set; }
        public string FollowUpInstructions { get; set; }
        public string AdditionalNotes { get; set; }
        public string Status { get; set; }

        // Additional information for display
        public string PatientName { get; set; }
        public string DoctorName { get; set; }
        public string AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
    }

    public class CreateMedicalExaminationDTO
    {
        public int AppointmentID { get; set; }
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        public string ChiefComplaint { get; set; }
        public string VitalSigns { get; set; }
        public string PhysicalExamination { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentPlan { get; set; }
        public string Prescription { get; set; }
        public string FollowUpInstructions { get; set; }
        public string AdditionalNotes { get; set; }
    }

    public class UpdateMedicalExaminationDTO
    {
        public string ChiefComplaint { get; set; }
        public string VitalSigns { get; set; }
        public string PhysicalExamination { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentPlan { get; set; }
        public string Prescription { get; set; }
        public string FollowUpInstructions { get; set; }
        public string AdditionalNotes { get; set; }
        public string Status { get; set; }
    }
} 