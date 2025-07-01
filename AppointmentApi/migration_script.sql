CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Doctors" (
        "Id" text NOT NULL,
        "FirstName" text NOT NULL,
        "LastName" text NOT NULL,
        "Specialization" text NOT NULL,
        "Email" text NOT NULL,
        "Phone" text NOT NULL,
        "ProfileImage" text NOT NULL,
        "Available" boolean NOT NULL,
        "Bio" text NOT NULL,
        "Experience" integer NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Doctors" PRIMARY KEY ("Id")
);

CREATE TABLE "Services" (
    "Id" text NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "Duration" integer NOT NULL,
    "Price" numeric NOT NULL,
    "Category" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Services" PRIMARY KEY ("Id")
);

CREATE TABLE "TimeSlots" (
    "Id" text NOT NULL,
    "DoctorId" text NOT NULL,
    "DayOfWeek" integer NOT NULL,
    "StartTime" text NOT NULL,
    "EndTime" text NOT NULL,
    CONSTRAINT "PK_TimeSlots" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TimeSlots_Doctors_DoctorId" FOREIGN KEY ("DoctorId") REFERENCES "Doctors" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Appointments" (
    "Id" text NOT NULL,
    "PatientId" text NOT NULL,
    "PatientName" text NOT NULL,
    "DoctorId" text NOT NULL,
    "DoctorName" text NOT NULL,
    "ServiceId" text NOT NULL,
    "ServiceName" text NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "StartTime" text NOT NULL,
    "EndTime" text NOT NULL,
    "Status" text NOT NULL,
    "Notes" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Appointments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Appointments_Doctors_DoctorId" FOREIGN KEY ("DoctorId") REFERENCES "Doctors" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Appointments_Services_ServiceId" FOREIGN KEY ("ServiceId") REFERENCES "Services" ("Id") ON DELETE CASCADE
);

INSERT INTO "Doctors" ("Id", "Available", "Bio", "CreatedAt", "Email", "Experience", "FirstName", "LastName", "Phone", "ProfileImage", "Specialization", "UpdatedAt")
VALUES ('1', TRUE, 'Bác sĩ Minh có hơn 10 năm kinh nghiệm trong lĩnh vực nhi khoa.', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'minh.nguyen@example.com', 10, 'Minh', 'Nguyễn', '0901234567', '/doctor-profiles/minh-nguyen.jpg', 'Nhi khoa', NULL);
INSERT INTO "Doctors" ("Id", "Available", "Bio", "CreatedAt", "Email", "Experience", "FirstName", "LastName", "Phone", "ProfileImage", "Specialization", "UpdatedAt")
VALUES ('2', TRUE, 'Bác sĩ Hoa chuyên về các vấn đề da liễu và thẩm mỹ.', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'hoa.tran@example.com', 8, 'Hoa', 'Trần', '0912345678', '/doctor-profiles/hoa-tran.jpg', 'Da liễu', NULL);
INSERT INTO "Doctors" ("Id", "Available", "Bio", "CreatedAt", "Email", "Experience", "FirstName", "LastName", "Phone", "ProfileImage", "Specialization", "UpdatedAt")
VALUES ('3', TRUE, 'Bác sĩ Tuấn là chuyên gia hàng đầu về bệnh tim mạch.', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'tuan.le@example.com', 15, 'Tuấn', 'Lê', '0923456789', '/doctor-profiles/tuan-le.jpg', 'Tim mạch', NULL);

INSERT INTO "Services" ("Id", "Category", "CreatedAt", "Description", "Duration", "ImageUrl", "Name", "Price", "UpdatedAt")
VALUES ('1', 'Khám tổng quát', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'Khám sức khỏe tổng quát định kỳ', 60, '/services/general-checkup.jpg', 'Khám tổng quát', 300000.0, NULL);
INSERT INTO "Services" ("Id", "Category", "CreatedAt", "Description", "Duration", "ImageUrl", "Name", "Price", "UpdatedAt")
VALUES ('2', 'Dinh dưỡng', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'Tư vấn chế độ dinh dưỡng phù hợp', 45, '/services/nutrition-consulting.jpg', 'Tư vấn dinh dưỡng', 250000.0, NULL);
INSERT INTO "Services" ("Id", "Category", "CreatedAt", "Description", "Duration", "ImageUrl", "Name", "Price", "UpdatedAt")
VALUES ('3', 'Da liễu', TIMESTAMPTZ '2025-01-01T00:00:00Z', 'Khám và điều trị các vấn đề về da', 30, '/services/dermatology.jpg', 'Khám da liễu', 350000.0, NULL);

INSERT INTO "Appointments" ("Id", "CreatedAt", "Date", "DoctorId", "DoctorName", "EndTime", "Notes", "PatientId", "PatientName", "ServiceId", "ServiceName", "StartTime", "Status", "UpdatedAt")
VALUES ('1', TIMESTAMPTZ '2024-12-27T00:00:00Z', TIMESTAMPTZ '2025-01-04T00:00:00Z', '1', 'Minh Nguyễn', '10:00', 'Khám sức khỏe định kỳ hàng năm', 'patient1', 'Khách hàng Mẫu', '1', 'Khám tổng quát', '09:00', 'Confirmed', NULL);
INSERT INTO "Appointments" ("Id", "CreatedAt", "Date", "DoctorId", "DoctorName", "EndTime", "Notes", "PatientId", "PatientName", "ServiceId", "ServiceName", "StartTime", "Status", "UpdatedAt")
VALUES ('2', TIMESTAMPTZ '2024-12-30T00:00:00Z', TIMESTAMPTZ '2025-01-08T00:00:00Z', '2', 'Hoa Trần', '14:30', 'Khám tình trạng dị ứng da', 'patient1', 'Khách hàng Mẫu', '3', 'Khám da liễu', '14:00', 'Pending', NULL);

INSERT INTO "TimeSlots" ("Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime")
VALUES ('1', 1, '1', '12:00', '08:00');
INSERT INTO "TimeSlots" ("Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime")
VALUES ('2', 3, '1', '17:00', '13:00');
INSERT INTO "TimeSlots" ("Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime")
VALUES ('3', 2, '2', '12:00', '08:00');
INSERT INTO "TimeSlots" ("Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime")
VALUES ('4', 4, '2', '17:00', '13:00');
INSERT INTO "TimeSlots" ("Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime")
VALUES ('5', 5, '3', '17:00', '08:00');

CREATE INDEX "IX_Appointments_DoctorId" ON "Appointments" ("DoctorId");

CREATE INDEX "IX_Appointments_ServiceId" ON "Appointments" ("ServiceId");

CREATE INDEX "IX_TimeSlots_DoctorId" ON "TimeSlots" ("DoctorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250629033511_InitialCreate', '9.0.6');

ALTER TABLE "Services" ALTER COLUMN "Price" TYPE numeric(18,2);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250629054621_CleanUpDuplicateTables', '9.0.6');

COMMIT;

