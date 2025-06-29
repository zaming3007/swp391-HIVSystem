-- Script để gộp các bảng trùng lặp trong cơ sở dữ liệu
-- Chuyển dữ liệu từ bảng viết thường sang bảng PascalCase

-- 1. Chuyển dữ liệu từ bảng doctors sang Doctors (nếu chưa tồn tại)
INSERT INTO "Doctors" ("Id", "FirstName", "LastName", "Specialization", "Email", "Phone", "ProfileImage", "Available", "Bio", "Experience", "CreatedAt", "UpdatedAt")
SELECT d."id", d."first_name", d."last_name", d."specialization", d."email", d."phone", d."profile_image", d."available", d."bio", d."experience", d."created_at", d."updated_at"
FROM "doctors" d
WHERE NOT EXISTS (SELECT 1 FROM "Doctors" D WHERE D."Id" = d."id");

-- 2. Chuyển dữ liệu từ bảng services sang Services (nếu chưa tồn tại)
INSERT INTO "Services" ("Id", "Name", "Description", "Duration", "Price", "Category", "ImageUrl", "CreatedAt", "UpdatedAt")
SELECT s."id", s."name", s."description", s."duration", s."price", s."category", s."image_url", s."created_at", s."updated_at"
FROM "services" s
WHERE NOT EXISTS (SELECT 1 FROM "Services" S WHERE S."Id" = s."id");

-- 3. Chuyển dữ liệu từ bảng time_slots sang TimeSlots (nếu chưa tồn tại)
INSERT INTO "TimeSlots" ("Id", "DoctorId", "DayOfWeek", "StartTime", "EndTime")
SELECT ts."id", ts."doctor_id", ts."day_of_week", ts."start_time", ts."end_time"
FROM "time_slots" ts
WHERE NOT EXISTS (SELECT 1 FROM "TimeSlots" TS WHERE TS."Id" = ts."id");

-- 4. Chuyển dữ liệu từ bảng appointments sang Appointments (nếu chưa tồn tại)
INSERT INTO "Appointments" ("Id", "PatientId", "PatientName", "DoctorId", "DoctorName", "ServiceId", "ServiceName", "Date", "StartTime", "EndTime", "Status", "Notes", "CreatedAt", "UpdatedAt")
SELECT a."id", a."patient_id", a."patient_name", a."doctor_id", a."doctor_name", a."service_id", a."service_name", a."date", a."start_time", a."end_time", a."status", a."notes", a."created_at", a."updated_at"
FROM "appointments" a
WHERE NOT EXISTS (SELECT 1 FROM "Appointments" A WHERE A."Id" = a."id");

-- 5. Chuyển dữ liệu từ bảng doctor_services sang DoctorServices (nếu chưa tồn tại)
INSERT INTO "DoctorServices" ("Id", "DoctorId", "ServiceId")
SELECT ds."id", ds."doctor_id", ds."service_id"
FROM "doctor_services" ds
WHERE NOT EXISTS (SELECT 1 FROM "DoctorServices" DS WHERE DS."Id" = ds."id");

-- 6. Xóa các bảng viết thường sau khi đã chuyển dữ liệu
DROP TABLE IF EXISTS "doctor_services";
DROP TABLE IF EXISTS "appointments";
DROP TABLE IF EXISTS "time_slots";
DROP TABLE IF EXISTS "services";
DROP TABLE IF EXISTS "doctors";

-- Cập nhật các ràng buộc khóa ngoại
ALTER TABLE "Appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_doctors_doctor_id";
ALTER TABLE "Appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_services_service_id";
ALTER TABLE "Appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_users_patient_id";

ALTER TABLE "Appointments" ADD CONSTRAINT "FK_Appointments_Doctors_DoctorId" FOREIGN KEY ("DoctorId") REFERENCES "Doctors" ("Id") ON DELETE RESTRICT;
ALTER TABLE "Appointments" ADD CONSTRAINT "FK_Appointments_Services_ServiceId" FOREIGN KEY ("ServiceId") REFERENCES "Services" ("Id") ON DELETE RESTRICT;
ALTER TABLE "Appointments" ADD CONSTRAINT "FK_Appointments_Users_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Users" ("id") ON DELETE RESTRICT;

ALTER TABLE "TimeSlots" DROP CONSTRAINT IF EXISTS "FK_time_slots_doctors_doctor_id";
ALTER TABLE "TimeSlots" ADD CONSTRAINT "FK_TimeSlots_Doctors_DoctorId" FOREIGN KEY ("DoctorId") REFERENCES "Doctors" ("Id") ON DELETE CASCADE;

ALTER TABLE "DoctorServices" DROP CONSTRAINT IF EXISTS "FK_doctor_services_doctors_doctor_id";
ALTER TABLE "DoctorServices" DROP CONSTRAINT IF EXISTS "FK_doctor_services_services_service_id";
ALTER TABLE "DoctorServices" ADD CONSTRAINT "FK_DoctorServices_Doctors_DoctorId" FOREIGN KEY ("DoctorId") REFERENCES "Doctors" ("Id") ON DELETE CASCADE;
ALTER TABLE "DoctorServices" ADD CONSTRAINT "FK_DoctorServices_Services_ServiceId" FOREIGN KEY ("ServiceId") REFERENCES "Services" ("Id") ON DELETE CASCADE;

-- Cập nhật các chỉ mục
DROP INDEX IF EXISTS "IX_appointments_doctor_id";
DROP INDEX IF EXISTS "IX_appointments_patient_id";
DROP INDEX IF EXISTS "IX_appointments_service_id";
DROP INDEX IF EXISTS "IX_doctor_services_doctor_id";
DROP INDEX IF EXISTS "IX_doctor_services_service_id";
DROP INDEX IF EXISTS "IX_time_slots_doctor_id";

CREATE INDEX IF NOT EXISTS "IX_Appointments_DoctorId" ON "Appointments" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_PatientId" ON "Appointments" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_ServiceId" ON "Appointments" ("ServiceId");
CREATE INDEX IF NOT EXISTS "IX_DoctorServices_DoctorId" ON "DoctorServices" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_DoctorServices_ServiceId" ON "DoctorServices" ("ServiceId");
CREATE INDEX IF NOT EXISTS "IX_TimeSlots_DoctorId" ON "TimeSlots" ("DoctorId"); 