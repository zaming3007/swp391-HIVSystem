using Microsoft.AspNetCore.Mvc;
using HIVSystem.Core.DTOs;
using HIVSystem.Core.Interfaces;

namespace HIVSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : BaseApiController
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        /// <summary>
        /// Create a new appointment
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment([FromBody] CreateAppointmentDto createAppointmentDto)
        {
            try
            {
                // For now, using a default createdBy value. In a real app, this would come from authentication
                var createdBy = 1; // This should be extracted from JWT token or session
                
                var appointment = await _appointmentService.CreateAppointmentAsync(createAppointmentDto, createdBy);
                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentID }, appointment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the appointment.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get appointment by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
                return Ok(appointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the appointment.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by patient ID
        /// </summary>
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> GetAppointmentsByPatient(int patientId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByPatientIdAsync(patientId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving patient appointments.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by doctor ID
        /// </summary>
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> GetAppointmentsByDoctor(int doctorId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctor appointments.", details = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing appointment
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto updateAppointmentDto)
        {
            try
            {
                var appointment = await _appointmentService.UpdateAppointmentAsync(id, updateAppointmentDto);
                return Ok(appointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the appointment.", details = ex.Message });
            }
        }

        /// <summary>
        /// Cancel an appointment
        /// </summary>
        [HttpPost("{id}/cancel")]
        public async Task<ActionResult> CancelAppointment(int id, [FromBody] CancelAppointmentRequest request)
        {
            try
            {
                var success = await _appointmentService.CancelAppointmentAsync(id, request.Reason ?? "No reason provided");
                if (success)
                {
                    return Ok(new { message = "Appointment cancelled successfully." });
                }
                return NotFound(new { message = "Appointment not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while cancelling the appointment.", details = ex.Message });
            }
        }

        /// <summary>
        /// Search appointments with filters
        /// </summary>
        [HttpPost("search")]
        public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> SearchAppointments([FromBody] AppointmentSearchDto searchDto)
        {
            try
            {
                var appointments = await _appointmentService.SearchAppointmentsAsync(searchDto);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching appointments.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get available doctors
        /// </summary>
        [HttpGet("doctors/available")]
        public async Task<ActionResult<IReadOnlyList<DoctorDto>>> GetAvailableDoctors([FromQuery] string? specialty = null)
        {
            try
            {
                var doctors = await _appointmentService.GetAvailableDoctorsAsync(specialty);
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available doctors.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get doctor availability for a date range
        /// </summary>
        [HttpGet("doctors/{doctorId}/availability")]
        public async Task<ActionResult<IReadOnlyList<DoctorAvailabilityDto>>> GetDoctorAvailability(
            int doctorId, 
            [FromQuery] DateTime fromDate, 
            [FromQuery] DateTime toDate)
        {
            try
            {
                if (fromDate == default || toDate == default)
                {
                    return BadRequest(new { message = "FromDate and ToDate are required." });
                }

                if (fromDate > toDate)
                {
                    return BadRequest(new { message = "FromDate cannot be greater than ToDate." });
                }

                var availability = await _appointmentService.GetDoctorAvailabilityAsync(doctorId, fromDate, toDate);
                return Ok(availability);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctor availability.", details = ex.Message });
            }
        }

        /// <summary>
        /// Validate appointment time
        /// </summary>
        [HttpPost("validate")]
        public async Task<ActionResult<bool>> ValidateAppointmentTime([FromBody] ValidateAppointmentRequest request)
        {
            try
            {
                var isValid = await _appointmentService.ValidateAppointmentTimeAsync(
                    request.DoctorId, 
                    request.AppointmentDate, 
                    request.AppointmentTime);
                
                return Ok(new { isValid, message = isValid ? "Time slot is available" : "Time slot is not available" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while validating the appointment time.", details = ex.Message });
            }
        }
    }

    // Request models for specific endpoints
    public class CancelAppointmentRequest
    {
        public string? Reason { get; set; }
    }

    public class ValidateAppointmentRequest
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
    }
} 