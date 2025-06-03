-- Script khắc phục bảng Appointments
-- Thêm các cột còn thiếu

-- Kiểm tra và thêm cột FacilityID
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'FacilityID')
BEGIN
    ALTER TABLE [Appointments] ADD [FacilityID] int NULL;
    PRINT 'Đã thêm cột FacilityID';
END

-- Kiểm tra và thêm cột EndTime
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'EndTime')
BEGIN
    ALTER TABLE [Appointments] ADD [EndTime] time NULL;
    PRINT 'Đã thêm cột EndTime';
END

-- Kiểm tra và thêm cột AppointmentType
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'AppointmentType')
BEGIN
    ALTER TABLE [Appointments] ADD [AppointmentType] nvarchar(50) NULL;
    PRINT 'Đã thêm cột AppointmentType';
END

-- Kiểm tra và thêm cột Purpose
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'Purpose')
BEGIN
    ALTER TABLE [Appointments] ADD [Purpose] nvarchar(255) NULL;
    PRINT 'Đã thêm cột Purpose';
END

-- Kiểm tra và thêm cột ReminderSent
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'ReminderSent')
BEGIN
    ALTER TABLE [Appointments] ADD [ReminderSent] bit NOT NULL DEFAULT 0;
    PRINT 'Đã thêm cột ReminderSent';
END

-- Kiểm tra và thêm cột CreatedBy
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'CreatedBy')
BEGIN
    ALTER TABLE [Appointments] ADD [CreatedBy] int NULL;
    PRINT 'Đã thêm cột CreatedBy';
END

-- Kiểm tra và thêm cột ConsultationFee
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'ConsultationFee')
BEGIN
    ALTER TABLE [Appointments] ADD [ConsultationFee] decimal(10,2) NULL;
    PRINT 'Đã thêm cột ConsultationFee';
END

-- Kiểm tra và thêm cột PatientName
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientName')
BEGIN
    ALTER TABLE [Appointments] ADD [PatientName] nvarchar(255) NULL;
    PRINT 'Đã thêm cột PatientName';
END

-- Kiểm tra và thêm cột PatientPhone
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientPhone')
BEGIN
    ALTER TABLE [Appointments] ADD [PatientPhone] nvarchar(20) NULL;
    PRINT 'Đã thêm cột PatientPhone';
END

-- Kiểm tra và thêm cột PatientEmail
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Appointments' AND COLUMN_NAME = 'PatientEmail')
BEGIN
    ALTER TABLE [Appointments] ADD [PatientEmail] nvarchar(255) NULL;
    PRINT 'Đã thêm cột PatientEmail';
END

-- Tạo bảng Facilities nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Facilities')
BEGIN
    CREATE TABLE [Facilities] (
        [FacilityID] int NOT NULL IDENTITY(1,1),
        [FacilityName] nvarchar(100) NOT NULL,
        [Address] nvarchar(255) NULL,
        [City] nvarchar(50) NULL,
        [State] nvarchar(50) NULL,
        [ZipCode] nvarchar(20) NULL,
        [PhoneNumber] nvarchar(15) NULL,
        [Email] nvarchar(100) NULL,
        [Website] nvarchar(255) NULL,
        [OpeningHours] nvarchar(255) NULL,
        [Description] ntext NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Facilities] PRIMARY KEY ([FacilityID])
    );
    PRINT 'Đã tạo bảng Facilities';
END

-- Thêm facility mặc định nếu chưa có
IF NOT EXISTS (SELECT * FROM [Facilities])
BEGIN
    INSERT INTO [Facilities] ([FacilityName], [Address], [City], [PhoneNumber], [Email], [OpeningHours], [Description], [IsActive])
    VALUES (N'Trung tâm Điều trị HIV/AIDS', N'123 Đường ABC, Quận 1', N'TP. Hồ Chí Minh', '028-1234-5678', 'info@hivcenter.vn', N'8:00 - 17:30 (Thứ 2 - Thứ 6)', N'Trung tâm chuyên khoa điều trị HIV/AIDS', 1);
    PRINT 'Đã thêm facility mặc định';
END

-- Thêm foreign key constraint nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Appointments_Facilities_FacilityID')
BEGIN
    ALTER TABLE [Appointments] 
    ADD CONSTRAINT [FK_Appointments_Facilities_FacilityID] 
    FOREIGN KEY ([FacilityID]) REFERENCES [Facilities] ([FacilityID]) ON DELETE SET NULL;
    PRINT 'Đã thêm foreign key constraint';
END

PRINT 'Hoàn thành khắc phục bảng Appointments!'; 