# HIV Treatment System - Appointment Booking Feature

## Overview

This document describes the implementation of the appointment booking functionality for the HIV Treatment and Medical Services System. This feature allows users to register for HIV treatment and examination appointments, with the ability to specify their preferred doctor.

## Features Implemented

### Core Functionality
- ✅ **Appointment Booking**: Users can book appointments with available doctors
- ✅ **Doctor Selection**: Users can choose their preferred doctor for treatment
- ✅ **Anonymous Booking**: Support for anonymous appointments to reduce stigma
- ✅ **Time Slot Management**: Real-time availability checking and slot booking
- ✅ **Appointment Management**: View, update, and cancel appointments
- ✅ **Search & Filter**: Advanced search functionality for appointments

### Key Features
1. **User-Friendly Booking Process**
   - Select from available doctors
   - Choose appointment date and time
   - Specify appointment type (Regular, Follow-up, Emergency, Consultation)
   - Add purpose and notes
   - Anonymous booking option

2. **Doctor Management**
   - View available doctors with their specialties
   - Filter doctors by specialty (HIV, Internal Medicine, etc.)
   - Doctor verification status checking
   - Consultation fee display

3. **Availability Management**
   - Real-time doctor availability checking
   - Time slot visualization
   - Conflict prevention
   - Schedule-based availability

4. **Privacy & Anonymity**
   - Anonymous appointment booking
   - Privacy-focused design for HIV patients
   - Secure data handling

## Technical Architecture

### Project Structure
```
HIVSystem/
├── HIVSystem.Core/
│   ├── Entities/           # Domain models
│   ├── DTOs/              # Data transfer objects
│   └── Interfaces/        # Service and repository contracts
├── HIVSystem.Infrastructure/
│   ├── Data/              # Database context and configurations
│   ├── Repositories/      # Data access implementations
│   └── Services/          # Business logic implementations
└── HIVSystem.API/
    └── Controllers/       # API endpoints
```

### Database Schema

#### Core Tables
- **Users**: User account information
- **Roles**: User role definitions
- **Patients**: Patient-specific information
- **Doctors**: Doctor profiles and qualifications
- **Facilities**: Medical facility information
- **Appointments**: Appointment records
- **DoctorSchedules**: Doctor working schedules
- **DoctorAvailability**: Doctor availability overrides
- **AppointmentReminders**: Reminder notifications

### API Endpoints

#### Appointment Management
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/{id}` - Get appointment by ID
- `PUT /api/appointments/{id}` - Update appointment
- `POST /api/appointments/{id}/cancel` - Cancel appointment
- `POST /api/appointments/search` - Search appointments

#### Doctor & Availability
- `GET /api/appointments/doctors/available` - Get available doctors
- `GET /api/appointments/doctors/{doctorId}/availability` - Get doctor availability
- `POST /api/appointments/validate` - Validate appointment time

#### Patient Views
- `GET /api/appointments/patient/{patientId}` - Get patient appointments
- `GET /api/appointments/doctor/{doctorId}` - Get doctor appointments

## Data Models

### CreateAppointmentDto
```csharp
public class CreateAppointmentDto
{
    public int? PatientID { get; set; }           // Optional for anonymous
    public int DoctorID { get; set; }             // Required
    public int? FacilityID { get; set; }          // Optional
    public DateTime AppointmentDate { get; set; } // Required
    public TimeSpan AppointmentTime { get; set; } // Required
    public string? AppointmentType { get; set; }  // Regular, Follow-up, etc.
    public string? Purpose { get; set; }          // Reason for visit
    public string? Notes { get; set; }            // Additional notes
    public bool IsAnonymous { get; set; }         // Privacy flag
}
```

### AppointmentDto
```csharp
public class AppointmentDto
{
    public int AppointmentID { get; set; }
    public int? PatientID { get; set; }
    public int? DoctorID { get; set; }
    public int? FacilityID { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public string? AppointmentType { get; set; }
    public string? Purpose { get; set; }
    public string Status { get; set; }
    public string? Notes { get; set; }
    public bool IsAnonymous { get; set; }
    public bool ReminderSent { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Navigation properties
    public string? PatientName { get; set; }
    public string? DoctorName { get; set; }
    public string? FacilityName { get; set; }
}
```

## Business Logic

### Appointment Validation
1. **Time Validation**: Ensures appointment is not in the past
2. **Doctor Availability**: Checks for scheduling conflicts
3. **Doctor Verification**: Ensures doctor is verified to accept appointments
4. **Schedule Compliance**: Validates against doctor's working hours
5. **Facility Constraints**: Checks facility-doctor relationships

### Availability Algorithm
1. **Base Schedule**: Uses doctor's weekly schedule
2. **Availability Overrides**: Applies specific date availability rules
3. **Existing Appointments**: Excludes already booked time slots
4. **Time Slot Generation**: Creates available time slots based on duration

### Privacy Features
- Anonymous appointments don't require patient ID
- Sensitive information is properly protected
- Audit trails for data access

## Demo & Testing

### HTML Demo Page
A comprehensive demo page (`appointment-booking-demo.html`) is provided with:
- Interactive appointment booking form
- Doctor selection interface
- Availability checking
- Appointment search functionality
- Real-time validation

### Sample Usage
1. **Book Appointment**:
   ```javascript
   const appointmentData = {
       patientID: null,  // Anonymous booking
       doctorID: 1,
       appointmentDate: "2024-01-15",
       appointmentTime: "09:00",
       appointmentType: "Regular",
       purpose: "HIV consultation",
       isAnonymous: true
   };
   ```

2. **Search Appointments**:
   ```javascript
   const searchCriteria = {
       fromDate: "2024-01-01",
       toDate: "2024-01-31",
       status: "Scheduled",
       pageNumber: 1,
       pageSize: 10
   };
   ```

## Setup Instructions

### Prerequisites
- .NET 6.0 or later
- SQL Server
- Visual Studio or VS Code

### Database Setup
1. Update connection string in `appsettings.json`
2. Run database migrations:
   ```bash
   dotnet ef database update
   ```
3. Seed initial data (roles, facilities, sample doctors)

### Running the Application
1. **Start API**:
   ```bash
   cd HIVSystem.API
   dotnet run
   ```

2. **Access Demo**:
   - Open `appointment-booking-demo.html` in browser
   - Update API_BASE_URL if needed
   - Test appointment booking functionality

### Sample Data
For testing, create sample data:
- Roles: Patient, Doctor, Admin
- Facilities: Main HIV Treatment Center
- Doctors: HIV specialists with schedules
- Patients: Test patient accounts

## Security Considerations

### Data Protection
- Patient information encryption
- Anonymous booking support
- Secure API endpoints
- Input validation and sanitization

### Access Control
- Role-based permissions
- Patient data privacy
- Doctor verification requirements
- Audit logging

## Future Enhancements

### Planned Features
1. **Reminder System**: Automated appointment reminders
2. **Integration**: SMS and email notifications
3. **Mobile App**: React Native mobile application
4. **Telemedicine**: Video consultation support
5. **AI Scheduling**: Intelligent appointment scheduling
6. **Multi-language**: Support for multiple languages

### Technical Improvements
1. **Caching**: Redis for performance optimization
2. **Real-time**: SignalR for live updates
3. **Monitoring**: Application performance monitoring
4. **Testing**: Comprehensive unit and integration tests

## Support & Documentation

### API Documentation
- Swagger UI available at `/swagger`
- Comprehensive endpoint documentation
- Request/response examples

### Error Handling
- Standardized error responses
- Validation error details
- User-friendly error messages

### Logging
- Structured logging with Serilog
- Request/response logging
- Error tracking and monitoring

## Compliance

### Healthcare Standards
- HIPAA compliance considerations
- Data privacy regulations
- Medical record standards
- Audit trail requirements

### HIV-Specific Considerations
- Stigma reduction features
- Anonymous access options
- Privacy-first design
- Confidentiality protection

---

**Note**: This implementation provides a solid foundation for the appointment booking requirement. The system is designed to be scalable, maintainable, and user-friendly while addressing the specific needs of HIV treatment services. 