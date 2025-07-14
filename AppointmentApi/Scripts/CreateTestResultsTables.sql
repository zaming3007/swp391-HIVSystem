-- Tạo bảng TestResults (Kết quả xét nghiệm)
CREATE TABLE IF NOT EXISTS "TestResults" (
    "Id" text NOT NULL,
    "PatientId" text NOT NULL,
    "DoctorId" text NOT NULL,
    "TestType" character varying(50) NOT NULL, -- 'CD4', 'ViralLoad', 'Other'
    "TestName" character varying(200) NOT NULL,
    "Result" character varying(500) NOT NULL,
    "Unit" character varying(50),
    "ReferenceRange" character varying(200),
    "Status" character varying(50) NOT NULL, -- 'Normal', 'Abnormal', 'Critical'
    "TestDate" timestamp with time zone NOT NULL,
    "LabName" character varying(200),
    "Notes" character varying(1000),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TestResults" PRIMARY KEY ("Id")
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS "IX_TestResults_PatientId" ON "TestResults" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_TestResults_DoctorId" ON "TestResults" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_TestResults_TestType" ON "TestResults" ("TestType");
CREATE INDEX IF NOT EXISTS "IX_TestResults_TestDate" ON "TestResults" ("TestDate");

-- Insert dữ liệu mẫu cho Test Results
INSERT INTO "TestResults" ("Id", "PatientId", "DoctorId", "TestType", "TestName", "Result", "Unit", "ReferenceRange", "Status", "TestDate", "LabName", "Notes", "CreatedAt") VALUES
-- CD4 Tests
('test-001', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '450', 'cells/μL', '500-1600', 'Abnormal', '2025-07-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Cần theo dõi và điều chỉnh phác đồ điều trị', CURRENT_TIMESTAMP),
('test-002', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '520', 'cells/μL', '500-1600', 'Normal', '2025-06-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả tốt, tiếp tục điều trị hiện tại', CURRENT_TIMESTAMP),
('test-003', 'customer-002', 'doctor-002', 'CD4', 'CD4 Count', '380', 'cells/μL', '500-1600', 'Abnormal', '2025-07-08 14:30:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Cần tăng cường điều trị', CURRENT_TIMESTAMP),

-- Viral Load Tests  
('test-004', 'customer-001', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', 'Undetectable', 'copies/mL', '<50', 'Normal', '2025-07-10 09:30:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả rất tốt, virus không phát hiện được', CURRENT_TIMESTAMP),
('test-005', 'customer-001', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', '45', 'copies/mL', '<50', 'Normal', '2025-06-10 09:30:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Tải lượng virus thấp, điều trị hiệu quả', CURRENT_TIMESTAMP),
('test-006', 'customer-002', 'doctor-002', 'ViralLoad', 'HIV RNA Viral Load', '1250', 'copies/mL', '<50', 'Abnormal', '2025-07-08 15:00:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Tải lượng virus cao, cần điều chỉnh phác đồ', CURRENT_TIMESTAMP),

-- Other Tests
('test-007', 'customer-001', 'doctor-001', 'Other', 'Hemoglobin', '12.5', 'g/dL', '12.0-15.5', 'Normal', '2025-07-10 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Chỉ số bình thường', CURRENT_TIMESTAMP),
('test-008', 'customer-001', 'doctor-001', 'Other', 'ALT (SGPT)', '35', 'U/L', '7-56', 'Normal', '2025-07-10 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Chức năng gan bình thường', CURRENT_TIMESTAMP),
('test-009', 'customer-002', 'doctor-002', 'Other', 'Creatinine', '1.1', 'mg/dL', '0.7-1.3', 'Normal', '2025-07-08 15:30:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Chức năng thận bình thường', CURRENT_TIMESTAMP);

-- Insert thêm dữ liệu cho customer khác
INSERT INTO "TestResults" ("Id", "PatientId", "DoctorId", "TestType", "TestName", "Result", "Unit", "ReferenceRange", "Status", "TestDate", "LabName", "Notes", "CreatedAt") VALUES
-- Customer 003
('test-010', 'customer-003', 'doctor-001', 'CD4', 'CD4 Count', '680', 'cells/μL', '500-1600', 'Normal', '2025-07-12 08:00:00+00', 'Phòng xét nghiệm Bệnh viện Bình Dân', 'Kết quả tốt', CURRENT_TIMESTAMP),
('test-011', 'customer-003', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', 'Undetectable', 'copies/mL', '<50', 'Normal', '2025-07-12 08:30:00+00', 'Phòng xét nghiệm Bệnh viện Bình Dân', 'Điều trị hiệu quả', CURRENT_TIMESTAMP),

-- Customer 004
('test-012', 'customer-004', 'doctor-003', 'CD4', 'CD4 Count', '320', 'cells/μL', '500-1600', 'Abnormal', '2025-07-11 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Thống Nhất', 'Cần theo dõi chặt chẽ', CURRENT_TIMESTAMP),
('test-013', 'customer-004', 'doctor-003', 'ViralLoad', 'HIV RNA Viral Load', '850', 'copies/mL', '<50', 'Abnormal', '2025-07-11 10:30:00+00', 'Phòng xét nghiệm Bệnh viện Thống Nhất', 'Cần điều chỉnh điều trị', CURRENT_TIMESTAMP);

-- Insert dữ liệu PatientRegimens mẫu (nếu chưa có)
INSERT INTO "PatientRegimens" ("Id", "PatientId", "DoctorId", "RegimenId", "StartDate", "EndDate", "Status", "Notes", "CreatedAt") VALUES
('patient-regimen-001', 'customer-001', 'doctor-001', 'regimen-1', '2025-01-15 00:00:00+00', NULL, 'Active', 'Bệnh nhân tuân thủ điều trị tốt', CURRENT_TIMESTAMP),
('patient-regimen-002', 'customer-002', 'doctor-002', 'regimen-2', '2025-02-20 00:00:00+00', NULL, 'Active', 'Cần theo dõi tác dụng phụ', CURRENT_TIMESTAMP),
('patient-regimen-003', 'customer-003', 'doctor-001', 'regimen-3', '2025-03-10 00:00:00+00', NULL, 'Active', 'Phác đồ thay thế do dị ứng', CURRENT_TIMESTAMP),
('patient-regimen-004', 'customer-004', 'doctor-003', 'regimen-1', '2025-04-05 00:00:00+00', NULL, 'Active', 'Bắt đầu điều trị', CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO NOTHING;

-- Insert dữ liệu AdherenceRecords mẫu
INSERT INTO "AdherenceRecords" ("Id", "PatientRegimenId", "RecordDate", "TotalDoses", "TakenDoses", "AdherencePercentage", "Notes", "RecordedBy", "CreatedAt") VALUES
('adherence-001', 'patient-regimen-001', '2025-07-01 00:00:00+00', 30, 28, 93.33, 'Quên uống 2 lần trong tháng', 'customer-001', CURRENT_TIMESTAMP),
('adherence-002', 'patient-regimen-001', '2025-06-01 00:00:00+00', 30, 30, 100.00, 'Tuân thủ hoàn toàn', 'customer-001', CURRENT_TIMESTAMP),
('adherence-003', 'patient-regimen-002', '2025-07-01 00:00:00+00', 30, 25, 83.33, 'Gặp khó khăn trong việc nhớ uống thuốc', 'customer-002', CURRENT_TIMESTAMP),
('adherence-004', 'patient-regimen-003', '2025-07-01 00:00:00+00', 30, 29, 96.67, 'Tuân thủ tốt', 'customer-003', CURRENT_TIMESTAMP),
('adherence-005', 'patient-regimen-004', '2025-07-01 00:00:00+00', 30, 27, 90.00, 'Đang làm quen với việc uống thuốc', 'customer-004', CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO NOTHING;
