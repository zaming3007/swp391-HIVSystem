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
);

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
