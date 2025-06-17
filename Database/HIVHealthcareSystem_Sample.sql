USE HIVHealthcareSystem;
GO

-- Insert sample roles
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'System Administrator'),
('Doctor', 'Medical Doctor'),
('Patient', 'Patient'),
('Nurse', 'Medical Nurse');

-- Insert sample users
INSERT INTO Users (Username, PasswordHash, Email, FullName, PhoneNumber, RoleID) VALUES
('admin', 'hashed_password', 'admin@example.com', 'Admin User', '0123456789', 1),
('doctor1', 'hashed_password', 'doctor1@example.com', 'Dr. John Smith', '0123456781', 2),
('doctor2', 'hashed_password', 'doctor2@example.com', 'Dr. Sarah Johnson', '0123456782', 2),
('patient1', 'hashed_password', 'patient1@example.com', 'Patient One', '0123456783', 3),
('patient2', 'hashed_password', 'patient2@example.com', 'Patient Two', '0123456784', 3);

-- Insert sample doctors
INSERT INTO Doctors (UserID, Specialty, Qualification, LicenseNumber) VALUES
(2, 'HIV Specialist', 'MD, PhD', 'DOC123456'),
(3, 'General Medicine', 'MD', 'DOC789012');

-- Insert sample patients
INSERT INTO Patients (UserID, PatientCode, BloodType) VALUES
(4, 'P001', 'A+'),
(5, 'P002', 'O+');

-- Insert sample facilities
INSERT INTO Facilities (FacilityName, Address, City, PhoneNumber) VALUES
('Main Hospital', '123 Health Street', 'City A', '0123456789'),
('Branch Clinic', '456 Medical Road', 'City B', '0987654321');

-- Insert sample appointments
INSERT INTO Appointments (PatientID, DoctorID, FacilityID, AppointmentDate, AppointmentTime, Status) VALUES
(1, 1, 1, '2024-03-20', '09:00:00', 'Completed'),
(2, 2, 1, '2024-03-21', '10:00:00', 'Completed');

-- Insert sample medical examinations
INSERT INTO MedicalExaminations (
    AppointmentID, PatientID, DoctorID, 
    ChiefComplaint, VitalSigns, PhysicalExamination, 
    Diagnosis, TreatmentPlan, Prescription, 
    FollowUpInstructions, Status
) VALUES
(1, 1, 1, 
    'Fever and fatigue for 3 days', 
    'BP: 120/80, Temp: 38.5°C, HR: 85', 
    'Patient appears tired. No visible rashes. Lungs clear to auscultation.',
    'Acute viral infection',
    'Rest and symptomatic treatment',
    'Paracetamol 500mg 3 times daily for 3 days',
    'Follow up in 1 week if symptoms persist',
    'Completed'),
(2, 2, 2,
    'Regular check-up',
    'BP: 118/75, Temp: 37.0°C, HR: 72',
    'Patient in good general condition. No significant findings.',
    'Stable condition',
    'Continue current medication',
    'Maintain current ARV regimen',
    'Next appointment in 3 months',
    'Completed');

-- Insert sample ARV medications
INSERT INTO ARVMedications (
    MedicationName, GenericName, Description, Category, 
    DosageForm, Strength, StandardDosage, AdministrationRoute
) VALUES
('Truvada', 'Emtricitabine/Tenofovir', 'Combination medication for HIV treatment and prevention', 'NRTI',
    'Tablet', '200/300mg', 'One tablet daily', 'Oral'),
('Atripla', 'Efavirenz/Emtricitabine/Tenofovir', 'Combination medication for HIV treatment', 'NNRTI/NRTI',
    'Tablet', '600/200/300mg', 'One tablet daily', 'Oral');

-- Insert sample test types
INSERT INTO TestTypes (
    TestName, Description, NormalRange, Unit, Category
) VALUES
('CD4 Count', 'Measures CD4 T-cell count', '500-1500', 'cells/mm³', 'Immunology'),
('Viral Load', 'Measures HIV RNA in blood', '<50', 'copies/mL', 'Virology');

-- Insert sample test results
INSERT INTO TestResults (
    PatientID, TestTypeID, DoctorID, FacilityID, 
    TestDate, Result, ResultInterpretation, AbnormalFlag
) VALUES
(1, 1, 1, 1, '2024-03-20', '750', 'Normal CD4 count', 'Normal'),
(1, 2, 1, 1, '2024-03-20', '<50', 'Undetectable viral load', 'Normal');

-- Insert sample treatment plans
INSERT INTO TreatmentPlans (
    PatientID, DoctorID, PlanName, StartDate, Status
) VALUES
(1, 1, 'Initial ARV Treatment', '2024-03-20', 'Active'),
(2, 2, 'Maintenance Therapy', '2024-03-21', 'Active');

-- Insert sample treatment plan medications
INSERT INTO TreatmentPlanMedications (
    PlanID, MedicationID, Dosage, Frequency, Duration, StartDate
) VALUES
(1, 1, 'One tablet', 'Daily', 30, '2024-03-20'),
(2, 2, 'One tablet', 'Daily', 30, '2024-03-21');

-- Insert sample blog categories
INSERT INTO BlogCategories (CategoryName, Description) VALUES
('HIV Treatment', 'Information about HIV treatment options'),
('Living with HIV', 'Tips and advice for living with HIV');

-- Insert sample blog posts
INSERT INTO BlogPosts (
    CategoryID, Title, Summary, Content, AuthorID, PublishDate
) VALUES
(1, 'Understanding ARV Therapy', 'A comprehensive guide to antiretroviral therapy',
    'Detailed content about ARV therapy...', 2, '2024-03-20'),
(2, 'Healthy Living with HIV', 'Tips for maintaining a healthy lifestyle',
    'Detailed content about healthy living...', 3, '2024-03-21');

-- Insert sample educational resource categories
INSERT INTO EducationalResourceCategories (CategoryName, Description) VALUES
('Treatment Guides', 'Comprehensive guides for HIV treatment'),
('Lifestyle Management', 'Resources for managing daily life with HIV');

-- Insert sample educational resources
INSERT INTO EducationalResources (
    CategoryID, Title, Description, ContentType, ContentURL
) VALUES
(1, 'HIV Treatment Guide', 'Comprehensive guide to HIV treatment', 'PDF', '/resources/hiv-treatment-guide.pdf'),
(2, 'Living with HIV', 'Tips for daily life with HIV', 'Video', '/resources/living-with-hiv.mp4');

-- Insert sample notifications
INSERT INTO Notifications (
    UserID, Title, Message, NotificationType, ReferenceID, ReferenceType
) VALUES
(4, 'Appointment Reminder', 'Your appointment is tomorrow at 9:00 AM', 'Appointment', 1, 'Appointment'),
(5, 'Test Results Available', 'Your latest test results are now available', 'Test', 1, 'TestResult');

-- Insert sample system settings
INSERT INTO SystemSettings (
    SettingKey, SettingValue, SettingGroup, Description
) VALUES
('AppointmentReminderHours', '24', 'Notifications', 'Hours before appointment to send reminder'),
('MaxAppointmentsPerDay', '20', 'Appointments', 'Maximum number of appointments per day per doctor'); 