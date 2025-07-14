-- Create TestResults table
CREATE TABLE IF NOT EXISTS "TestResults" (
    "Id" text NOT NULL,
    "PatientId" text NOT NULL,
    "DoctorId" text NOT NULL,
    "TestType" character varying(50) NOT NULL,
    "TestName" character varying(200) NOT NULL,
    "Result" character varying(500) NOT NULL,
    "Unit" character varying(50),
    "ReferenceRange" character varying(200),
    "Status" character varying(50) NOT NULL,
    "TestDate" timestamp with time zone NOT NULL,
    "LabName" character varying(200),
    "Notes" character varying(1000),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TestResults" PRIMARY KEY ("Id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "IX_TestResults_PatientId" ON "TestResults" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_TestResults_DoctorId" ON "TestResults" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_TestResults_TestType" ON "TestResults" ("TestType");
CREATE INDEX IF NOT EXISTS "IX_TestResults_TestDate" ON "TestResults" ("TestDate");

-- Insert sample data
INSERT INTO "TestResults" ("Id", "PatientId", "DoctorId", "TestType", "TestName", "Result", "Unit", "ReferenceRange", "Status", "TestDate", "LabName", "Notes", "CreatedAt") VALUES
('test-001', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '450', 'cells/μL', '500-1600', 'Abnormal', '2025-07-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Cần theo dõi và điều chỉnh phác đồ điều trị', CURRENT_TIMESTAMP),
('test-002', 'customer-001', 'doctor-001', 'CD4', 'CD4 Count', '520', 'cells/μL', '500-1600', 'Normal', '2025-06-10 09:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả tốt, tiếp tục điều trị hiện tại', CURRENT_TIMESTAMP),
('test-003', 'customer-002', 'doctor-002', 'CD4', 'CD4 Count', '380', 'cells/μL', '500-1600', 'Abnormal', '2025-07-08 14:30:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Cần tăng cường điều trị', CURRENT_TIMESTAMP),
('test-004', 'customer-001', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', 'Undetectable', 'copies/mL', '<50', 'Normal', '2025-07-10 09:30:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Kết quả rất tốt, virus không phát hiện được', CURRENT_TIMESTAMP),
('test-005', 'customer-001', 'doctor-001', 'ViralLoad', 'HIV RNA Viral Load', '45', 'copies/mL', '<50', 'Normal', '2025-06-10 09:30:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Tải lượng virus thấp, điều trị hiệu quả', CURRENT_TIMESTAMP),
('test-006', 'customer-002', 'doctor-002', 'ViralLoad', 'HIV RNA Viral Load', '1250', 'copies/mL', '<50', 'Abnormal', '2025-07-08 15:00:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Tải lượng virus cao, cần điều chỉnh phác đồ', CURRENT_TIMESTAMP),
('test-007', 'customer-001', 'doctor-001', 'Other', 'Hemoglobin', '12.5', 'g/dL', '12.0-15.5', 'Normal', '2025-07-10 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Chỉ số bình thường', CURRENT_TIMESTAMP),
('test-008', 'customer-001', 'doctor-001', 'Other', 'ALT (SGPT)', '35', 'U/L', '7-56', 'Normal', '2025-07-10 10:00:00+00', 'Phòng xét nghiệm Bệnh viện Đại học Y Dược', 'Chức năng gan bình thường', CURRENT_TIMESTAMP),
('test-009', 'customer-002', 'doctor-002', 'Other', 'Creatinine', '1.1', 'mg/dL', '0.7-1.3', 'Normal', '2025-07-08 15:30:00+00', 'Phòng xét nghiệm Bệnh viện Chợ Rẫy', 'Chức năng thận bình thường', CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO NOTHING;
