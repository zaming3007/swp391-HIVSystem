
USE HIVHealthcareSystem;
GO

ALTER TABLE [Appointments] ADD [ConsultationFee] decimal(10,2) NULL;
ALTER TABLE [Appointments] ADD [PatientName] nvarchar(255) NULL;
ALTER TABLE [Appointments] ADD [PatientPhone] nvarchar(20) NULL;
ALTER TABLE [Appointments] ADD [PatientEmail] nvarchar(255) NULL;