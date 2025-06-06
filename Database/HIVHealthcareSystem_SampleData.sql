-- HIVHealthcareSystem Sample Data
-- File này chứa dữ liệu mẫu để test hệ thống HIV Healthcare
-- Chạy file này sau khi đã tạo database và các bảng từ file HIVHealthcareSystem.sql

USE HIVHealthcareSystem;
GO

-- 1. Insert Roles
INSERT INTO Roles (RoleName, Description, IsActive, CreatedDate) VALUES
('Admin', 'System Administrator with full access', 1, GETDATE()),
('Doctor', 'Medical Doctor providing healthcare services', 1, GETDATE()),
('Patient', 'Patient receiving healthcare services', 1, GETDATE()),
('Nurse', 'Nursing staff supporting patient care', 1, GETDATE()),
('Pharmacist', 'Pharmacy staff managing medications', 1, GETDATE()),
('Lab Technician', 'Laboratory staff conducting tests', 1, GETDATE());

-- 2. Insert Users
INSERT INTO Users (Username, PasswordHash, Email, FullName, PhoneNumber, DateOfBirth, Gender, Address, ProfileImage, RoleID, IsAnonymous, IsActive, LastLoginDate, CreatedDate) VALUES
-- Admin users
('admin', 'hashed_password_admin', 'admin@hivhealthcare.com', 'System Administrator', '0123456789', '1985-01-15', 'Male', '123 Admin Street, Ho Chi Minh City', NULL, 1, 0, 1, GETDATE(), GETDATE()),

-- Doctor users
('dr.nguyen', 'hashed_password_doctor1', 'dr.nguyen@hivhealthcare.com', 'Dr. Nguyen Van A', '0987654321', '1980-05-20', 'Male', '456 Medical Center, District 1, Ho Chi Minh City', NULL, 2, 0, 1, GETDATE(), GETDATE()),
('dr.tran', 'hashed_password_doctor2', 'dr.tran@hivhealthcare.com', 'Dr. Tran Thi B', '0912345678', '1975-08-10', 'Female', '789 Hospital Street, District 3, Ho Chi Minh City', NULL, 2, 0, 1, GETDATE(), GETDATE()),
('dr.le', 'hashed_password_doctor3', 'dr.le@hivhealthcare.com', 'Dr. Le Van C', '0967890123', '1982-03-25', 'Male', '321 Clinic Avenue, District 7, Ho Chi Minh City', NULL, 2, 0, 1, GETDATE(), GETDATE()),

-- Patient users
('patient001', 'hashed_password_patient1', 'patient1@email.com', 'Nguyen Thi D', '0934567890', '1990-12-05', 'Female', '567 Patient Street, District 5, Ho Chi Minh City', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('patient002', 'hashed_password_patient2', 'patient2@email.com', 'Tran Van E', '0945678901', '1988-07-18', 'Male', '890 Resident Road, District 2, Ho Chi Minh City', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('patient003', 'hashed_password_patient3', 'patient3@email.com', 'Le Thi F', '0956789012', '1992-11-30', 'Female', '234 Living Lane, District 4, Ho Chi Minh City', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('patient004', 'hashed_password_patient4', 'patient4@email.com', 'Pham Van G', '0967890123', '1985-04-22', 'Male', '345 Home Street, District 6, Ho Chi Minh City', NULL, 3, 0, 1, GETDATE(), GETDATE()),

-- Staff users
('nurse001', 'hashed_password_nurse1', 'nurse1@hivhealthcare.com', 'Nurse Vo Thi H', '0978901234', '1987-09-14', 'Female', '678 Nursing Street, District 8, Ho Chi Minh City', NULL, 4, 0, 1, GETDATE(), GETDATE()),
('pharmacist001', 'hashed_password_pharm1', 'pharm1@hivhealthcare.com', 'Pharmacist Dao Van I', '0989012345', '1983-06-08', 'Male', '789 Pharmacy Road, District 9, Ho Chi Minh City', NULL, 5, 0, 1, GETDATE(), GETDATE()),
('labtech001', 'hashed_password_lab1', 'lab1@hivhealthcare.com', 'Lab Tech Bui Thi J', '0990123456', '1989-02-28', 'Female', '890 Laboratory Lane, District 10, Ho Chi Minh City', NULL, 6, 0, 1, GETDATE(), GETDATE());

-- 3. Insert Security Questions
INSERT INTO SecurityQuestions (QuestionText) VALUES
('What was the name of your first pet?'),
('What is your mother''s maiden name?'),
('What city were you born in?'),
('What was the name of your elementary school?'),
('What is your favorite color?');

-- 4. Insert User Security Answers
INSERT INTO UserSecurityAnswers (UserID, QuestionID, AnswerHash, CreatedDate) VALUES
(1, 1, 'hashed_answer_admin_1', GETDATE()),
(2, 2, 'hashed_answer_doctor1_2', GETDATE()),
(3, 3, 'hashed_answer_doctor2_3', GETDATE()),
(5, 1, 'hashed_answer_patient1_1', GETDATE()),
(6, 2, 'hashed_answer_patient2_2', GETDATE());

-- 5. Insert Patients
INSERT INTO Patients (UserID, PatientCode, BloodType, Height, Weight, EmergencyContact, EmergencyPhone, EmergencyRelationship, InsuranceInfo, RegistrationDate, Notes) VALUES
(5, 'P001', 'A+', 165.00, 55.50, 'Nguyen Van K', '0901234567', 'Husband', 'Social Insurance 123456789', GETDATE(), 'Regular checkup patient'),
(6, 'P002', 'B+', 175.00, 70.00, 'Tran Thi L', '0912345678', 'Wife', 'Private Insurance ABC123', GETDATE(), 'New patient enrollment'),
(7, 'P003', 'O+', 158.00, 48.00, 'Le Van M', '0923456789', 'Father', 'Social Insurance 987654321', GETDATE(), 'Follow-up treatment required'),
(8, 'P004', 'AB+', 180.00, 85.00, 'Pham Thi N', '0934567890', 'Mother', 'Private Insurance XYZ789', GETDATE(), 'High-risk patient');

-- 6. Insert Patient Medical History
INSERT INTO PatientMedicalHistory (PatientID, Condition, DiagnosisDate, Treatment, IsActive, Notes, RecordedBy, RecordedDate) VALUES
(1, 'HIV Positive', '2020-01-15', 'ARV Treatment initiated', 1, 'Patient diagnosed with HIV-1, started on first-line ARV therapy', 2, GETDATE()),
(1, 'Hypertension', '2021-03-10', 'Antihypertensive medication', 1, 'Secondary condition managed with medication', 2, GETDATE()),
(2, 'HIV Positive', '2019-08-22', 'ARV Treatment ongoing', 1, 'Patient on stable ARV regimen, good adherence', 3, GETDATE()),
(3, 'HIV Positive', '2022-05-18', 'ARV Treatment started', 1, 'Recently diagnosed, treatment education provided', 2, GETDATE()),
(4, 'HIV Positive', '2018-12-05', 'ARV Treatment - second line', 1, 'Switched to second-line therapy due to resistance', 3, GETDATE());

-- 7. Insert Patient Allergies
INSERT INTO PatientAllergies (PatientID, AllergyType, Severity, Reaction, DiagnosisDate, Notes, RecordedBy, RecordedDate) VALUES
(1, 'Penicillin', 'Moderate', 'Skin rash, itching', '2020-01-15', 'Avoid all penicillin-based antibiotics', 2, GETDATE()),
(2, 'Sulfonamides', 'Severe', 'Anaphylaxis', '2019-08-22', 'Emergency protocol required, carry epinephrine', 3, GETDATE()),
(4, 'Efavirenz', 'Mild', 'Dizziness, sleep disturbances', '2019-01-10', 'Monitor for CNS side effects', 3, GETDATE());

-- 8. Insert Doctors
INSERT INTO Doctors (UserID, Specialty, Qualification, LicenseNumber, Biography, YearsOfExperience, IsAvailable, ConsultationFee, VerificationStatus, VerificationDate, VerifiedBy) VALUES
(2, 'HIV/AIDS Specialist', 'MD, PhD in Infectious Diseases', 'MD12345', 'Specializing in HIV/AIDS treatment with over 15 years of experience', 15, 1, 500000.00, 'Verified', GETDATE(), 1),
(3, 'Internal Medicine', 'MD, Board Certified Internal Medicine', 'MD23456', 'Internal medicine physician with expertise in chronic disease management', 12, 1, 400000.00, 'Verified', GETDATE(), 1),
(4, 'Infectious Disease', 'MD, Fellowship in Infectious Diseases', 'MD34567', 'Infectious disease specialist focusing on HIV care and prevention', 8, 1, 450000.00, 'Verified', GETDATE(), 1);

-- 9. Insert Doctor Education
INSERT INTO DoctorEducation (DoctorID, Degree, Institution, StartYear, EndYear, Description) VALUES
(1, 'MD', 'University of Medicine Ho Chi Minh City', 2000, 2006, 'Doctor of Medicine degree'),
(1, 'PhD', 'University of Medicine Ho Chi Minh City', 2007, 2011, 'PhD in Infectious Diseases'),
(2, 'MD', 'Hanoi Medical University', 1998, 2004, 'Doctor of Medicine degree'),
(2, 'Board Certification', 'Vietnam Medical Board', 2005, 2005, 'Internal Medicine Board Certification'),
(3, 'MD', 'Hue University of Medicine', 2005, 2011, 'Doctor of Medicine degree'),
(3, 'Fellowship', 'Cho Ray Hospital', 2012, 2014, 'Infectious Disease Fellowship');

-- 10. Insert Doctor Certifications
INSERT INTO DoctorCertifications (DoctorID, CertificationName, IssuedBy, IssuedDate, ExpiryDate, CertificationDocument) VALUES
(1, 'HIV Treatment Certification', 'Ministry of Health Vietnam', '2020-01-01', '2025-01-01', 'cert_hiv_treatment_001.pdf'),
(1, 'Advanced Life Support', 'Vietnam Emergency Medicine Association', '2022-06-01', '2024-06-01', 'cert_als_001.pdf'),
(2, 'Internal Medicine Board', 'Vietnam Medical Board', '2005-12-01', '2025-12-01', 'cert_internal_med_002.pdf'),
(3, 'Infectious Disease Specialist', 'Vietnam Infectious Disease Society', '2014-08-01', '2024-08-01', 'cert_infectious_003.pdf');

-- 11. Insert Facilities
INSERT INTO Facilities (FacilityName, Address, City, State, ZipCode, PhoneNumber, Email, Website, OpeningHours, Description, IsActive) VALUES
('Central HIV Treatment Center', '123 Medical Center Street, District 1', 'Ho Chi Minh City', 'Ho Chi Minh', '70000', '028-1234-5678', 'info@centralhiv.com', 'www.centralhiv.com', 'Mon-Fri: 8:00-17:00, Sat: 8:00-12:00', 'Main HIV treatment facility with comprehensive services', 1),
('District 3 Health Clinic', '456 Health Street, District 3', 'Ho Chi Minh City', 'Ho Chi Minh', '70000', '028-2345-6789', 'info@d3clinic.com', 'www.d3clinic.com', 'Mon-Sat: 7:00-18:00', 'Community health clinic providing HIV care', 1),
('Cho Ray Hospital HIV Department', '201B Nguyen Chi Thanh Street, District 5', 'Ho Chi Minh City', 'Ho Chi Minh', '70000', '028-3456-7890', 'hiv@choray.vn', 'www.choray.vn/hiv', '24/7', 'Major hospital with specialized HIV department', 1);

-- 12. Insert Facility Doctors
INSERT INTO FacilityDoctors (FacilityID, DoctorID, StartDate, EndDate, IsActive) VALUES
(1, 1, '2020-01-01', NULL, 1),
(1, 3, '2021-06-01', NULL, 1),
(2, 2, '2019-03-01', NULL, 1),
(3, 1, '2020-01-01', NULL, 1),
(3, 2, '2019-03-01', NULL, 1);

-- 13. Insert Doctor Schedules
INSERT INTO DoctorSchedules (DoctorID, DayOfWeek, StartTime, EndTime, SlotDuration, MaxPatients, IsAvailable, Notes) VALUES
(1, 1, '08:00:00', '17:00:00', 30, 18, 1, 'Monday schedule'),
(1, 2, '08:00:00', '17:00:00', 30, 18, 1, 'Tuesday schedule'),
(1, 3, '08:00:00', '17:00:00', 30, 18, 1, 'Wednesday schedule'),
(1, 4, '08:00:00', '17:00:00', 30, 18, 1, 'Thursday schedule'),
(1, 5, '08:00:00', '17:00:00', 30, 18, 1, 'Friday schedule'),
(2, 1, '09:00:00', '16:00:00', 45, 12, 1, 'Monday schedule'),
(2, 3, '09:00:00', '16:00:00', 45, 12, 1, 'Wednesday schedule'),
(2, 5, '09:00:00', '16:00:00', 45, 12, 1, 'Friday schedule'),
(3, 2, '08:30:00', '17:30:00', 30, 16, 1, 'Tuesday schedule'),
(3, 4, '08:30:00', '17:30:00', 30, 16, 1, 'Thursday schedule'),
(3, 6, '08:30:00', '12:30:00', 30, 8, 1, 'Saturday schedule');

-- 14. Insert ARV Medications
INSERT INTO ARVMedications (MedicationName, GenericName, Description, Category, DosageForm, Strength, StandardDosage, AdministrationRoute, SideEffects, Contraindications, DrugInteractions, StorageInstructions, ManufacturerName, IsActive) VALUES
('Efavirenz', 'Efavirenz', 'Non-nucleoside reverse transcriptase inhibitor (NNRTI)', 'NNRTI', 'Tablet', '600mg', '600mg once daily', 'Oral', 'Dizziness, sleep disturbances, psychiatric symptoms', 'Severe hepatic impairment', 'CYP3A4 substrates', 'Store at room temperature, protect from moisture', 'Mylan Pharmaceuticals', 1),
('Tenofovir/Emtricitabine', 'Tenofovir DF/Emtricitabine', 'Fixed-dose combination NRTI', 'NRTI', 'Tablet', '300mg/200mg', 'One tablet once daily', 'Oral', 'Nausea, headache, fatigue', 'Severe renal impairment', 'Nephrotoxic agents', 'Store at room temperature', 'Gilead Sciences', 1),
('Atazanavir', 'Atazanavir', 'Protease inhibitor', 'PI', 'Capsule', '300mg', '300mg once daily with ritonavir', 'Oral', 'Jaundice, kidney stones, nausea', 'Severe hepatic impairment', 'Proton pump inhibitors', 'Store at room temperature', 'Bristol-Myers Squibb', 1),
('Ritonavir', 'Ritonavir', 'Protease inhibitor/Booster', 'PI', 'Tablet', '100mg', '100mg once daily', 'Oral', 'GI intolerance, hepatotoxicity', 'Severe hepatic impairment', 'Multiple drug interactions', 'Store at room temperature', 'AbbVie', 1),
('Dolutegravir', 'Dolutegravir', 'Integrase strand transfer inhibitor', 'INSTI', 'Tablet', '50mg', '50mg once daily', 'Oral', 'Headache, insomnia', 'Hypersensitivity', 'Metformin, dofetilide', 'Store at room temperature', 'ViiV Healthcare', 1);

-- 15. Insert Medication Inventory
INSERT INTO MedicationInventory (MedicationID, FacilityID, BatchNumber, ExpiryDate, QuantityInStock, UnitPrice, LastRestockDate, ReorderLevel) VALUES
(1, 1, 'EFV001', '2025-12-31', 500, 25000.00, GETDATE(), 100),
(2, 1, 'TDF001', '2025-08-15', 300, 45000.00, GETDATE(), 50),
(3, 1, 'ATV001', '2024-11-30', 200, 35000.00, GETDATE(), 40),
(4, 1, 'RTV001', '2025-06-20', 400, 15000.00, GETDATE(), 80),
(5, 1, 'DTG001', '2025-10-10', 250, 55000.00, GETDATE(), 50),
(1, 2, 'EFV002', '2025-09-25', 150, 25000.00, GETDATE(), 30),
(2, 2, 'TDF002', '2025-07-18', 100, 45000.00, GETDATE(), 20),
(1, 3, 'EFV003', '2025-11-12', 300, 25000.00, GETDATE(), 60),
(2, 3, 'TDF003', '2025-09-05', 200, 45000.00, GETDATE(), 40);

-- 16. Insert Test Types
INSERT INTO TestTypes (TestName, Description, NormalRange, Unit, TestProcedure, PreparationInstructions, Category, IsActive) VALUES
('CD4 Count', 'CD4+ T-lymphocyte count', '500-1600', 'cells/μL', 'Flow cytometry analysis of blood sample', 'No special preparation required', 'Immunology', 1),
('Viral Load', 'HIV-1 RNA quantification', '<50', 'copies/mL', 'PCR-based quantitative assay', 'No special preparation required', 'Virology', 1),
('Complete Blood Count', 'Full blood count analysis', 'Various by component', 'Various', 'Automated hematology analyzer', 'No special preparation required', 'Hematology', 1),
('Liver Function Test', 'Hepatic enzyme panel', 'ALT: 7-56 U/L, AST: 10-40 U/L', 'U/L', 'Automated chemistry analyzer', '8-hour fasting recommended', 'Chemistry', 1),
('Kidney Function Test', 'Renal function assessment', 'Creatinine: 0.6-1.2 mg/dL', 'mg/dL', 'Automated chemistry analyzer', 'No special preparation required', 'Chemistry', 1),
('Lipid Profile', 'Cholesterol and triglycerides', 'Total cholesterol <200 mg/dL', 'mg/dL', 'Automated chemistry analyzer', '12-hour fasting required', 'Chemistry', 1);

-- 17. Insert Appointments
INSERT INTO Appointments (PatientID, DoctorID, FacilityID, AppointmentDate, AppointmentTime, EndTime, AppointmentType, Purpose, Status, Notes, IsAnonymous, ReminderSent, CreatedBy, CreatedDate, ConsultationFee) VALUES
(1, 1, 1, '2024-01-15', '09:00:00', '09:30:00', 'Follow-up', 'Routine HIV monitoring', 'Completed', 'Patient doing well on current regimen', 0, 1, 2, GETDATE(), 500000.00),
(1, 1, 1, '2024-02-15', '09:00:00', '09:30:00', 'Follow-up', 'Quarterly check-up', 'Scheduled', 'Continue current treatment plan', 0, 0, 2, GETDATE(), 500000.00),
(2, 2, 2, '2024-01-20', '10:00:00', '10:45:00', 'Regular', 'Annual comprehensive exam', 'Completed', 'All parameters stable', 0, 1, 3, GETDATE(), 400000.00),
(3, 1, 1, '2024-01-25', '14:00:00', '14:30:00', 'Follow-up', 'Treatment adherence counseling', 'Completed', 'Improved adherence noted', 0, 1, 2, GETDATE(), 500000.00),
(4, 3, 3, '2024-01-30', '11:00:00', '11:30:00', 'Regular', 'Second-line therapy monitoring', 'Confirmed', 'Check for resistance markers', 0, 1, 4, GETDATE(), 450000.00);

-- 18. Insert Test Results
INSERT INTO TestResults (PatientID, TestTypeID, DoctorID, FacilityID, TestDate, Result, ResultInterpretation, AbnormalFlag, LabReferenceNumber, Notes, RecordedBy, RecordedDate) VALUES
(1, 1, 1, 1, '2024-01-15', '650', 'Good immune function', 'Normal', 'LAB001-2024', 'Stable CD4 count', 2, GETDATE()),
(1, 2, 1, 1, '2024-01-15', '<50', 'Undetectable viral load', 'Normal', 'LAB002-2024', 'Excellent treatment response', 2, GETDATE()),
(2, 1, 2, 2, '2024-01-20', '580', 'Good immune function', 'Normal', 'LAB003-2024', 'Stable CD4 count', 3, GETDATE()),
(2, 2, 2, 2, '2024-01-20', '<50', 'Undetectable viral load', 'Normal', 'LAB004-2024', 'Continued treatment success', 3, GETDATE()),
(3, 1, 1, 1, '2024-01-25', '420', 'Moderate immune function', 'Low', 'LAB005-2024', 'Monitor closely', 2, GETDATE()),
(4, 2, 3, 3, '2024-01-30', '150', 'Detectable viral load', 'High', 'LAB006-2024', 'Consider resistance testing', 4, GETDATE());

-- 19. Insert Treatment Plans
INSERT INTO TreatmentPlans (PatientID, DoctorID, PlanName, StartDate, EndDate, Status, FollowUpDate, FollowUpNotes, Notes, CreatedBy, CreatedDate, LastUpdated, LastUpdatedBy) VALUES
(1, 1, 'Standard First-Line ARV', '2020-01-15', NULL, 'Active', '2024-04-15', 'Continue current regimen if stable', 'Patient responding well to treatment', 2, '2020-01-15', GETDATE(), 2),
(2, 2, 'Standard First-Line ARV', '2019-08-22', NULL, 'Active', '2024-04-20', 'Annual comprehensive review', 'Long-term stable patient', 3, '2019-08-22', GETDATE(), 3),
(3, 1, 'First-Line ARV with Counseling', '2022-05-18', NULL, 'Active', '2024-02-25', 'Focus on adherence improvement', 'New patient, requires close monitoring', 2, '2022-05-18', GETDATE(), 2),
(4, 3, 'Second-Line ARV Therapy', '2019-01-01', NULL, 'Active', '2024-03-30', 'Monitor for resistance development', 'Switched due to first-line failure', 4, '2019-01-01', GETDATE(), 4);

-- 20. Insert Treatment Plan Medications
INSERT INTO TreatmentPlanMedications (PlanID, MedicationID, Dosage, Frequency, SpecificTimes, WithFood, Instructions, Duration, StartDate, EndDate, Notes, IsActive, CreatedBy, CreatedDate) VALUES
(1, 1, '600mg', 'Once daily', '22:00', 0, 'Take on empty stomach, preferably at bedtime', 365, '2020-01-15', NULL, 'Bedtime dosing to minimize CNS effects', 1, 2, '2020-01-15'),
(1, 2, '1 tablet', 'Once daily', '08:00', 0, 'Take with or without food', 365, '2020-01-15', NULL, 'Fixed-dose combination', 1, 2, '2020-01-15'),
(2, 5, '50mg', 'Once daily', '08:00', 0, 'Take with or without food', 365, '2019-08-22', NULL, 'INSTI-based regimen', 1, 3, '2019-08-22'),
(2, 2, '1 tablet', 'Once daily', '08:00', 0, 'Take with food', 365, '2019-08-22', NULL, 'Backbone therapy', 1, 3, '2019-08-22'),
(4, 3, '300mg', 'Once daily', '08:00', 1, 'Take with food and ritonavir', 365, '2019-01-01', NULL, 'Boosted PI regimen', 1, 4, '2019-01-01'),
(4, 4, '100mg', 'Once daily', '08:00', 1, 'Take with atazanavir', 365, '2019-01-01', NULL, 'Booster dose', 1, 4, '2019-01-01');

-- 21. Insert Medication Adherence Records
INSERT INTO MedicationAdherence (PatientID, PlanMedicationID, ScheduledDateTime, TakenDateTime, IsTaken, Delay, Reason, Notes, RecordedTime) VALUES
(1, 1, '2024-01-14 22:00:00', '2024-01-14 22:15:00', 1, 15, NULL, 'Taken with slight delay', GETDATE()),
(1, 2, '2024-01-15 08:00:00', '2024-01-15 08:05:00', 1, 5, NULL, 'Taken on time', GETDATE()),
(1, 1, '2024-01-15 22:00:00', '2024-01-15 22:00:00', 1, 0, NULL, 'Taken exactly on time', GETDATE()),
(2, 3, '2024-01-15 08:00:00', '2024-01-15 08:30:00', 1, 30, 'Forgot morning routine', 'Patient reminded to set alarm', GETDATE()),
(2, 4, '2024-01-15 08:00:00', '2024-01-15 08:30:00', 1, 30, 'Took together with other medication', 'Both medications taken together', GETDATE());

-- 22. Insert System Settings
INSERT INTO SystemSettings (SettingKey, SettingValue, SettingGroup, Description, IsPublic, LastModified, ModifiedBy) VALUES
('app_name', 'HIV Healthcare System', 'General', 'Application name', 1, GETDATE(), 1),
('max_appointment_days_advance', '90', 'Appointments', 'Maximum days in advance for booking appointments', 0, GETDATE(), 1),
('reminder_hours_before', '24', 'Notifications', 'Hours before appointment to send reminder', 0, GETDATE(), 1),
('adherence_threshold', '95', 'Treatment', 'Minimum adherence percentage threshold', 0, GETDATE(), 1),
('viral_load_threshold', '50', 'Laboratory', 'Viral load threshold for undetectable status', 0, GETDATE(), 1);

-- 23. Insert Blog Categories
INSERT INTO BlogCategories (CategoryName, Slug, Description, ParentCategoryID, DisplayOrder, IsActive) VALUES
('HIV Prevention', 'hiv-prevention', 'Articles about HIV prevention strategies', NULL, 1, 1),
('Treatment Updates', 'treatment-updates', 'Latest information on HIV treatment', NULL, 2, 1),
('Living with HIV', 'living-with-hiv', 'Lifestyle and wellness for people with HIV', NULL, 3, 1),
('Research News', 'research-news', 'Latest HIV research and clinical trials', NULL, 4, 1),
('Support & Community', 'support-community', 'Community support and resources', NULL, 5, 1);

-- 24. Insert Blog Posts
INSERT INTO BlogPosts (CategoryID, Title, Slug, Summary, Content, FeaturedImage, AuthorID, PublishDate, IsPublished, ViewCount, Tags, MetaTitle, MetaDescription) VALUES
(1, 'Understanding PrEP: Your Guide to HIV Prevention', 'understanding-prep-guide', 'Learn about Pre-Exposure Prophylaxis (PrEP) and how it can help prevent HIV infection.', 'Pre-Exposure Prophylaxis (PrEP) is a highly effective way to prevent HIV infection when taken consistently...', NULL, 2, GETDATE(), 1, 156, 'PrEP, prevention, HIV', 'Understanding PrEP - HIV Prevention Guide', 'Comprehensive guide to PrEP for HIV prevention'),
(2, 'New HIV Treatment Guidelines 2024', 'new-hiv-treatment-guidelines-2024', 'Overview of the latest HIV treatment guidelines and recommendations.', 'The latest HIV treatment guidelines have been updated with new recommendations for both treatment-naive and experienced patients...', NULL, 3, GETDATE(), 1, 89, 'treatment, guidelines, ARV', 'HIV Treatment Guidelines 2024', 'Latest HIV treatment guidelines and recommendations'),
(3, 'Nutrition and HIV: Eating Well for Better Health', 'nutrition-hiv-eating-well', 'Tips for maintaining good nutrition while living with HIV.', 'Good nutrition plays a crucial role in maintaining health for people living with HIV...', NULL, 2, GETDATE(), 1, 234, 'nutrition, health, HIV', 'Nutrition and HIV - Eating Well Guide', 'Nutrition tips for people living with HIV');

-- 25. Insert Educational Resource Categories
INSERT INTO EducationalResourceCategories (CategoryName, Description, IsActive) VALUES
('Patient Education', 'Educational materials for patients', 1),
('Healthcare Provider Resources', 'Training and reference materials for healthcare providers', 1),
('Prevention Materials', 'HIV prevention education resources', 1),
('Treatment Information', 'Information about HIV treatment options', 1);

-- 26. Insert Educational Resources
INSERT INTO EducationalResources (CategoryID, Title, Description, ContentType, ContentURL, FileSize, Duration, IsPublished, ViewCount, PublishDate, AuthorID, Tags) VALUES
(1, 'HIV Basics: What You Need to Know', 'Comprehensive guide covering HIV basics for newly diagnosed patients', 'PDF', '/resources/hiv-basics.pdf', 2048, NULL, 1, 45, GETDATE(), 2, 'HIV, basics, education'),
(1, 'Taking Your HIV Medications', 'Video guide on proper medication adherence', 'Video', '/resources/medication-adherence.mp4', 15360, 300, 1, 78, GETDATE(), 3, 'medication, adherence, video'),
(3, 'HIV Prevention Strategies', 'Infographic showing various HIV prevention methods', 'Infographic', '/resources/prevention-infographic.png', 512, NULL, 1, 123, GETDATE(), 2, 'prevention, infographic'),
(4, 'Understanding Viral Load Results', 'Article explaining viral load test results', 'Article', '/resources/viral-load-explained.html', 256, NULL, 1, 67, GETDATE(), 3, 'viral load, testing, results');

-- 27. Insert Notifications
INSERT INTO Notifications (UserID, Title, Message, NotificationType, ReferenceID, ReferenceType, IsRead, IsDeleted, CreatedDate, ExpiryDate) VALUES
(5, 'Upcoming Appointment', 'You have an appointment tomorrow at 9:00 AM with Dr. Nguyen Van A', 'Appointment', 2, 'Appointment', 0, 0, GETDATE(), DATEADD(day, 7, GETDATE())),
(6, 'Test Results Available', 'Your recent lab test results are now available', 'Test', 4, 'TestResult', 0, 0, GETDATE(), DATEADD(day, 30, GETDATE())),
(7, 'Medication Reminder', 'Don''t forget to take your evening medication', 'Medication', 1, 'MedicationReminder', 1, 0, GETDATE(), DATEADD(day, 1, GETDATE())),
(5, 'Treatment Plan Updated', 'Your treatment plan has been updated by your doctor', 'Treatment', 1, 'TreatmentPlan', 0, 0, GETDATE(), DATEADD(day, 14, GETDATE()));

-- 28. Insert Consultation Sessions
INSERT INTO ConsultationSessions (PatientID, DoctorID, SessionType, StartTime, EndTime, Status, IsAnonymous, Summary, Rating, Feedback, CreatedDate) VALUES
(1, 1, 'Video', '2024-01-10 14:00:00', '2024-01-10 14:30:00', 'Completed', 0, 'Patient consultation regarding treatment adherence', 5, 'Very helpful session, doctor was thorough', GETDATE()),
(2, 2, 'Chat', '2024-01-12 10:00:00', '2024-01-12 10:15:00', 'Completed', 0, 'Quick consultation about side effects', 4, 'Quick response and helpful advice', GETDATE()),
(3, 1, 'Video', '2024-01-15 16:00:00', '2024-01-15 16:45:00', 'Completed', 0, 'Comprehensive review of new patient treatment plan', 5, 'Excellent explanation of treatment options', GETDATE());

-- 29. Insert Anonymous Consultations
INSERT INTO AnonymousConsultations (AnonymousUserID, DoctorID, Question, Answer, QuestionDate, AnswerDate, Status, Category, IsPublic) VALUES
('ANON001', 1, 'What are the side effects of HIV medications?', 'HIV medications can have various side effects including nausea, fatigue, and liver problems. Most side effects are manageable and tend to improve over time.', GETDATE(), DATEADD(hour, 2, GETDATE()), 'Answered', 'Treatment', 1),
('ANON002', 2, 'How often should I get tested if I am at risk?', 'For individuals at high risk, HIV testing should be done every 3-6 months. Your healthcare provider can recommend the best testing schedule for your situation.', GETDATE(), DATEADD(hour, 4, GETDATE()), 'Answered', 'Prevention', 1),
('ANON003', 3, 'Can I live a normal life with HIV?', 'Yes, with proper treatment and care, people with HIV can live long, healthy lives. Modern HIV treatments are very effective at controlling the virus.', GETDATE(), DATEADD(hour, 1, GETDATE()), 'Answered', 'Living with HIV', 1);

-- 30. Insert Medication Reminders
INSERT INTO MedicationReminders (PatientID, PlanMedicationID, ReminderTime, ReminderDays, ReminderType, IsEnabled, Notes) VALUES
(1, 1, '22:00:00', '1234567', 'Push', 1, 'Daily evening reminder for Efavirenz'),
(1, 2, '08:00:00', '1234567', 'Push', 1, 'Daily morning reminder for TDF/FTC'),
(2, 3, '08:00:00', '1234567', 'SMS', 1, 'Daily morning reminder for Dolutegravir'),
(2, 4, '08:00:00', '1234567', 'SMS', 1, 'Daily morning reminder for TDF/FTC');

-- 31. Insert Side Effect Reports
INSERT INTO SideEffectReports (PatientID, PlanMedicationID, ReportDate, OnsetDate, Symptoms, Severity, Duration, ActionTaken, OutcomeNotes, DoctorNotes, Status, ReviewedBy, ReviewedDate) VALUES
(1, 1, GETDATE(), '2024-01-10', 'Dizziness and sleep disturbances', 'Mild', '2-3 hours after taking', 'Take at bedtime, reduce caffeine', 'Symptoms improved with bedtime dosing', 'Common side effect, manageable with timing adjustment', 'Addressed', 1, GETDATE()),
(4, 5, GETDATE(), '2024-01-20', 'Nausea and headache', 'Moderate', 'Daily for 1 week', 'Take with food, monitor symptoms', 'Symptoms persisting, consider medication change', 'May need to switch to alternative regimen', 'Reviewed', 3, GETDATE());

-- 32. Insert Medical Notes
INSERT INTO MedicalNotes (PatientID, DoctorID, AppointmentID, NoteType, NoteText, CreatedDate, IsPrivate) VALUES
(1, 1, 1, 'Consultation', 'Patient reports excellent adherence to current ARV regimen. CD4 count stable at 650. Viral load undetectable. Continue current treatment plan. Next visit in 3 months.', GETDATE(), 0),
(2, 2, 3, 'Follow-up', 'Annual comprehensive exam completed. All parameters within normal limits. Patient educated on importance of continued adherence. Lifestyle counseling provided.', GETDATE(), 0),
(3, 1, 4, 'Treatment', 'New patient counseling session completed. Treatment plan explained in detail. Patient demonstrates good understanding of medication regimen. Adherence support resources provided.', GETDATE(), 0);

-- 33. Insert Facility Info
INSERT INTO FacilityInfo (FacilityID, ServiceType, Description, OperatingHours, ContactPerson, ContactPhone, ContactEmail, PhotoURL, LastUpdated, UpdatedBy) VALUES
(1, 'HIV Treatment', 'Comprehensive HIV care including testing, counseling, and treatment', 'Mon-Fri: 8:00-17:00, Sat: 8:00-12:00', 'Dr. Nguyen Van A', '028-1234-5678', 'dr.nguyen@centralhiv.com', NULL, GETDATE(), 2),
(2, 'Community Health', 'Primary care with specialized HIV services', 'Mon-Sat: 7:00-18:00', 'Dr. Tran Thi B', '028-2345-6789', 'dr.tran@d3clinic.com', NULL, GETDATE(), 3),
(3, 'Hospital HIV Department', 'Specialized HIV department within major hospital', '24/7', 'Dr. Le Van C', '028-3456-7890', 'dr.le@choray.vn', NULL, GETDATE(), 4);

-- 34. Insert Audit Logs
INSERT INTO AuditLogs (UserID, Action, EntityType, EntityID, OldValue, NewValue, IPAddress, UserAgent, LogTime) VALUES
(2, 'CREATE', 'TreatmentPlan', 1, NULL, '{"PatientID":1,"PlanName":"Standard First-Line ARV"}', '192.168.1.100', 'Mozilla/5.0', GETDATE()),
(3, 'UPDATE', 'Patient', 2, '{"Weight":65.0}', '{"Weight":70.0}', '192.168.1.101', 'Mozilla/5.0', GETDATE()),
(1, 'CREATE', 'User', 5, NULL, '{"Username":"patient001","RoleID":3}', '192.168.1.102', 'Mozilla/5.0', GETDATE()),
(2, 'UPDATE', 'Appointment', 1, '{"Status":"Scheduled"}', '{"Status":"Completed"}', '192.168.1.100', 'Mozilla/5.0', GETDATE());

-- 35. Insert Feedback Surveys
INSERT INTO FeedbackSurveys (SurveyName, Description, StartDate, EndDate, IsActive, CreatedBy, CreatedDate) VALUES
('Patient Satisfaction Survey', 'Quarterly patient satisfaction and feedback collection', GETDATE(), DATEADD(month, 3, GETDATE()), 1, 1, GETDATE()),
('Treatment Experience Survey', 'Survey about patient experience with HIV treatment', GETDATE(), DATEADD(month, 6, GETDATE()), 1, 1, GETDATE());

-- 36. Insert Survey Questions
INSERT INTO SurveyQuestions (SurveyID, QuestionText, QuestionType, Options, IsRequired, DisplayOrder) VALUES
(1, 'How satisfied are you with your overall care?', 'Rating', '{"scale": 1-5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 1, 1),
(1, 'Would you recommend our services to others?', 'Rating', '{"scale": 1-5, "labels": ["Definitely Not", "Probably Not", "Neutral", "Probably Yes", "Definitely Yes"]}', 1, 2),
(1, 'What could we improve?', 'Text', NULL, 0, 3),
(2, 'How easy is it to follow your medication schedule?', 'Rating', '{"scale": 1-5, "labels": ["Very Difficult", "Difficult", "Moderate", "Easy", "Very Easy"]}', 1, 1),
(2, 'Have you experienced any side effects?', 'MultipleChoice', '{"options": ["None", "Mild", "Moderate", "Severe"]}', 1, 2);

PRINT 'Sample data insertion completed successfully!'; 