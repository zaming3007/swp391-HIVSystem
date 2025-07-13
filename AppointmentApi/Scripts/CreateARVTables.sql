-- Tạo bảng ARVRegimens (Phác đồ ARV)
CREATE TABLE IF NOT EXISTS "ARVRegimens" (
    "Id" text NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" character varying(1000),
    "Category" character varying(100) NOT NULL,
    "LineOfTreatment" character varying(50) NOT NULL,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ARVRegimens" PRIMARY KEY ("Id")
)

-- Tạo bảng ARVMedications (Thuốc trong phác đồ)
CREATE TABLE IF NOT EXISTS "ARVMedications" (
    "Id" text NOT NULL,
    "RegimenId" text NOT NULL,
    "MedicationName" character varying(200) NOT NULL,
    "ActiveIngredient" character varying(100) NOT NULL,
    "Dosage" character varying(100) NOT NULL,
    "Frequency" character varying(100) NOT NULL,
    "Instructions" character varying(200),
    "SideEffects" character varying(500),
    "SortOrder" integer NOT NULL DEFAULT 0,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_ARVMedications" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ARVMedications_ARVRegimens_RegimenId" FOREIGN KEY ("RegimenId") REFERENCES "ARVRegimens" ("Id") ON DELETE CASCADE
);

-- Tạo bảng PatientRegimens (Phác đồ được chỉ định cho bệnh nhân)
CREATE TABLE IF NOT EXISTS "PatientRegimens" (
    "Id" text NOT NULL,
    "PatientId" text NOT NULL,
    "PatientName" text NOT NULL,
    "DoctorId" text NOT NULL,
    "DoctorName" text NOT NULL,
    "RegimenId" text NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone,
    "Status" character varying(50) NOT NULL DEFAULT 'Đang điều trị',
    "Notes" character varying(1000),
    "Reason" character varying(1000),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_PatientRegimens" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_PatientRegimens_ARVRegimens_RegimenId" FOREIGN KEY ("RegimenId") REFERENCES "ARVRegimens" ("Id") ON DELETE CASCADE
);

-- Tạo bảng AdherenceRecords (Ghi nhận tuân thủ điều trị)
CREATE TABLE IF NOT EXISTS "AdherenceRecords" (
    "Id" text NOT NULL,
    "PatientRegimenId" text NOT NULL,
    "RecordDate" timestamp with time zone NOT NULL,
    "TotalDoses" integer NOT NULL,
    "TakenDoses" integer NOT NULL,
    "AdherencePercentage" numeric(5,2) NOT NULL,
    "Notes" character varying(500),
    "RecordedBy" character varying(200),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_AdherenceRecords" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AdherenceRecords_PatientRegimens_PatientRegimenId" FOREIGN KEY ("PatientRegimenId") REFERENCES "PatientRegimens" ("Id") ON DELETE CASCADE
);

-- Tạo bảng SideEffectRecords (Ghi nhận tác dụng phụ)
CREATE TABLE IF NOT EXISTS "SideEffectRecords" (
    "Id" text NOT NULL,
    "PatientRegimenId" text NOT NULL,
    "SideEffect" character varying(200) NOT NULL,
    "Severity" character varying(50) NOT NULL,
    "OnsetDate" timestamp with time zone NOT NULL,
    "ResolvedDate" timestamp with time zone,
    "Description" character varying(1000),
    "Treatment" character varying(500),
    "Status" character varying(50) NOT NULL DEFAULT 'Đang theo dõi',
    "ReportedBy" character varying(200),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_SideEffectRecords" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_SideEffectRecords_PatientRegimens_PatientRegimenId" FOREIGN KEY ("PatientRegimenId") REFERENCES "PatientRegimens" ("Id") ON DELETE CASCADE
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS "IX_ARVMedications_RegimenId" ON "ARVMedications" ("RegimenId");
CREATE INDEX IF NOT EXISTS "IX_PatientRegimens_PatientId" ON "PatientRegimens" ("PatientId");
CREATE INDEX IF NOT EXISTS "IX_PatientRegimens_DoctorId" ON "PatientRegimens" ("DoctorId");
CREATE INDEX IF NOT EXISTS "IX_PatientRegimens_RegimenId" ON "PatientRegimens" ("RegimenId");
CREATE INDEX IF NOT EXISTS "IX_PatientRegimens_Status" ON "PatientRegimens" ("Status");
CREATE INDEX IF NOT EXISTS "IX_AdherenceRecords_PatientRegimenId" ON "AdherenceRecords" ("PatientRegimenId");
CREATE INDEX IF NOT EXISTS "IX_AdherenceRecords_RecordDate" ON "AdherenceRecords" ("RecordDate");
CREATE INDEX IF NOT EXISTS "IX_SideEffectRecords_PatientRegimenId" ON "SideEffectRecords" ("PatientRegimenId");
CREATE INDEX IF NOT EXISTS "IX_SideEffectRecords_Status" ON "SideEffectRecords" ("Status");

-- Insert dữ liệu mẫu cho ARV Regimens
INSERT INTO "ARVRegimens" ("Id", "Name", "Description", "Category", "LineOfTreatment", "IsActive", "CreatedAt") VALUES
('regimen-1', 'TDF/3TC/EFV', 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
('regimen-2', 'AZT/3TC/NVP', 'Phác đồ điều trị với Zidovudine + Lamivudine + Nevirapine', 'Điều trị ban đầu', 'Tuyến 1', true, CURRENT_TIMESTAMP),
('regimen-3', 'ABC/3TC/DTG', 'Phác đồ điều trị với Abacavir + Lamivudine + Dolutegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP),
('regimen-4', 'TAF/FTC/BIC', 'Phác đồ điều trị với Tenofovir Alafenamide + Emtricitabine + Bictegravir', 'Điều trị thay thế', 'Tuyến 2', true, CURRENT_TIMESTAMP);

-- Insert dữ liệu mẫu cho ARV Medications
INSERT INTO "ARVMedications" ("Id", "RegimenId", "MedicationName", "ActiveIngredient", "Dosage", "Frequency", "Instructions", "SideEffects", "SortOrder", "CreatedAt") VALUES
-- Phác đồ TDF/3TC/EFV
('med-1-1', 'regimen-1', 'Tenofovir DF', 'Tenofovir Disoproxil Fumarate', '300mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu, mệt mỏi', 1, CURRENT_TIMESTAMP),
('med-1-2', 'regimen-1', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
('med-1-3', 'regimen-1', 'Efavirenz', 'Efavirenz', '600mg', '1 lần/ngày', 'Uống trước khi đi ngủ, tránh thức ăn nhiều chất béo', 'Chóng mặt, mơ mộng bất thường, mất ngủ', 3, CURRENT_TIMESTAMP),

-- Phác đồ AZT/3TC/NVP
('med-2-1', 'regimen-2', 'Zidovudine', 'Zidovudine', '300mg', '2 lần/ngày', 'Uống cùng bữa ăn', 'Thiếu máu, buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
('med-2-2', 'regimen-2', 'Lamivudine', 'Lamivudine', '150mg', '2 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
('med-2-3', 'regimen-2', 'Nevirapine', 'Nevirapine', '200mg', '2 lần/ngày', 'Bắt đầu với 1 lần/ngày trong 2 tuần đầu', 'Phát ban da, sốt, đau gan', 3, CURRENT_TIMESTAMP),

-- Phác đồ ABC/3TC/DTG
('med-3-1', 'regimen-3', 'Abacavir', 'Abacavir', '600mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Phản ứng dị ứng, buồn nôn, mệt mỏi', 1, CURRENT_TIMESTAMP),
('med-3-2', 'regimen-3', 'Lamivudine', 'Lamivudine', '300mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Buồn nôn, đau bụng, mệt mỏi', 2, CURRENT_TIMESTAMP),
('med-3-3', 'regimen-3', 'Dolutegravir', 'Dolutegravir', '50mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, mất ngủ, tăng cân', 3, CURRENT_TIMESTAMP),

-- Phác đồ TAF/FTC/BIC
('med-4-1', 'regimen-4', 'Tenofovir AF', 'Tenofovir Alafenamide', '25mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Buồn nôn, đau đầu', 1, CURRENT_TIMESTAMP),
('med-4-2', 'regimen-4', 'Emtricitabine', 'Emtricitabine', '200mg', '1 lần/ngày', 'Có thể uống với hoặc không có thức ăn', 'Đau đầu, tiêu chảy, phát ban', 2, CURRENT_TIMESTAMP),
('med-4-3', 'regimen-4', 'Bictegravir', 'Bictegravir', '50mg', '1 lần/ngày', 'Uống cùng bữa ăn', 'Đau đầu, buồn nôn, mệt mỏi', 3, CURRENT_TIMESTAMP);

-- Thông báo hoàn thành
SELECT 'ARV Management tables created successfully!' as message;
