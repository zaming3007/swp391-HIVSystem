using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HIVHealthcareSystem.Data;
using HIVHealthcareSystem.Models;
using HIVHealthcareSystem.DTOs;

namespace HIVHealthcareSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalExaminationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicalExaminationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MedicalExamination
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalExaminationDTO>>> GetMedicalExaminations()
        {
            var examinations = await _context.MedicalExaminations
                .Include(e => e.Patient)
                .Include(e => e.Doctor)
                .Include(e => e.Appointment)
                .Select(e => new MedicalExaminationDTO
                {
                    ExaminationID = e.ExaminationID,
                    AppointmentID = e.AppointmentID,
                    PatientID = e.PatientID,
                    DoctorID = e.DoctorID,
                    ExaminationDate = e.ExaminationDate,
                    ChiefComplaint = e.ChiefComplaint,
                    VitalSigns = e.VitalSigns,
                    PhysicalExamination = e.PhysicalExamination,
                    Diagnosis = e.Diagnosis,
                    TreatmentPlan = e.TreatmentPlan,
                    Prescription = e.Prescription,
                    FollowUpInstructions = e.FollowUpInstructions,
                    AdditionalNotes = e.AdditionalNotes,
                    Status = e.Status,
                    PatientName = e.Patient.User.FullName,
                    DoctorName = e.Doctor.User.FullName,
                    AppointmentDate = e.Appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                    AppointmentTime = e.Appointment.AppointmentTime.ToString(@"hh\:mm")
                })
                .ToListAsync();

            return examinations;
        }

        // GET: api/MedicalExamination/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalExaminationDTO>> GetMedicalExamination(int id)
        {
            var examination = await _context.MedicalExaminations
                .Include(e => e.Patient)
                .Include(e => e.Doctor)
                .Include(e => e.Appointment)
                .Where(e => e.ExaminationID == id)
                .Select(e => new MedicalExaminationDTO
                {
                    ExaminationID = e.ExaminationID,
                    AppointmentID = e.AppointmentID,
                    PatientID = e.PatientID,
                    DoctorID = e.DoctorID,
                    ExaminationDate = e.ExaminationDate,
                    ChiefComplaint = e.ChiefComplaint,
                    VitalSigns = e.VitalSigns,
                    PhysicalExamination = e.PhysicalExamination,
                    Diagnosis = e.Diagnosis,
                    TreatmentPlan = e.TreatmentPlan,
                    Prescription = e.Prescription,
                    FollowUpInstructions = e.FollowUpInstructions,
                    AdditionalNotes = e.AdditionalNotes,
                    Status = e.Status,
                    PatientName = e.Patient.User.FullName,
                    DoctorName = e.Doctor.User.FullName,
                    AppointmentDate = e.Appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                    AppointmentTime = e.Appointment.AppointmentTime.ToString(@"hh\:mm")
                })
                .FirstOrDefaultAsync();

            if (examination == null)
            {
                return NotFound();
            }

            return examination;
        }

        // POST: api/MedicalExamination
        [HttpPost]
        public async Task<ActionResult<MedicalExaminationDTO>> CreateMedicalExamination(CreateMedicalExaminationDTO dto)
        {
            var examination = new MedicalExamination
            {
                AppointmentID = dto.AppointmentID,
                PatientID = dto.PatientID,
                DoctorID = dto.DoctorID,
                ExaminationDate = DateTime.Now,
                ChiefComplaint = dto.ChiefComplaint,
                VitalSigns = dto.VitalSigns,
                PhysicalExamination = dto.PhysicalExamination,
                Diagnosis = dto.Diagnosis,
                TreatmentPlan = dto.TreatmentPlan,
                Prescription = dto.Prescription,
                FollowUpInstructions = dto.FollowUpInstructions,
                AdditionalNotes = dto.AdditionalNotes,
                Status = "Completed",
                CreatedBy = dto.DoctorID,
                CreatedDate = DateTime.Now
            };

            _context.MedicalExaminations.Add(examination);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedicalExamination), new { id = examination.ExaminationID }, examination);
        }

        // PUT: api/MedicalExamination/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalExamination(int id, UpdateMedicalExaminationDTO dto)
        {
            var examination = await _context.MedicalExaminations.FindAsync(id);

            if (examination == null)
            {
                return NotFound();
            }

            examination.ChiefComplaint = dto.ChiefComplaint;
            examination.VitalSigns = dto.VitalSigns;
            examination.PhysicalExamination = dto.PhysicalExamination;
            examination.Diagnosis = dto.Diagnosis;
            examination.TreatmentPlan = dto.TreatmentPlan;
            examination.Prescription = dto.Prescription;
            examination.FollowUpInstructions = dto.FollowUpInstructions;
            examination.AdditionalNotes = dto.AdditionalNotes;
            examination.Status = dto.Status;
            examination.ModifiedDate = DateTime.Now;
            examination.ModifiedBy = examination.DoctorID;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicalExaminationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/MedicalExamination/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalExamination(int id)
        {
            var examination = await _context.MedicalExaminations.FindAsync(id);
            if (examination == null)
            {
                return NotFound();
            }

            _context.MedicalExaminations.Remove(examination);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicalExaminationExists(int id)
        {
            return _context.MedicalExaminations.Any(e => e.ExaminationID == id);
        }
    }
} 