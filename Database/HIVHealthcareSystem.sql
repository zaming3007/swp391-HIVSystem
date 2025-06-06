CREATE DATABASE HIVHealthcareSystem;

USE HIVHealthcareSystem;
GO

-- Tạo bảng Roles (Vai trò người dùng)
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Users (Người dùng)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) UNIQUE,
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(15),
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    Address NVARCHAR(255),
    ProfileImage NVARCHAR(255),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    IsAnonymous BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    LastLoginDate DATETIME,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME
);

-- Tạo bảng SecurityQuestions (Câu hỏi bảo mật)
CREATE TABLE SecurityQuestions (
    QuestionID INT PRIMARY KEY IDENTITY(1,1),
    QuestionText NVARCHAR(255) NOT NULL
);

-- Tạo bảng UserSecurityAnswers (Câu trả lời bảo mật của người dùng)
CREATE TABLE UserSecurityAnswers (
    AnswerID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    QuestionID INT FOREIGN KEY REFERENCES SecurityQuestions(QuestionID),
    AnswerHash NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng UserLoginHistory (Lịch sử đăng nhập)
CREATE TABLE UserLoginHistory (
    LoginID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    LoginTime DATETIME DEFAULT GETDATE(),
    IPAddress NVARCHAR(50),
    UserAgent NVARCHAR(255),
    IsSuccessful BIT DEFAULT 1
);

-- Tạo bảng Patients (Bệnh nhân)
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE FOREIGN KEY REFERENCES Users(UserID),
    PatientCode NVARCHAR(20) UNIQUE,
    BloodType NVARCHAR(5),
    Height DECIMAL(5,2),
    Weight DECIMAL(5,2),
    EmergencyContact NVARCHAR(100),
    EmergencyPhone NVARCHAR(15),
    EmergencyRelationship NVARCHAR(50),
    InsuranceInfo NVARCHAR(255),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    Notes NTEXT
);

-- Tạo bảng PatientMedicalHistory (Tiền sử bệnh của bệnh nhân)
CREATE TABLE PatientMedicalHistory (
    HistoryID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    Condition NVARCHAR(100) NOT NULL,
    DiagnosisDate DATE,
    Treatment NVARCHAR(255),
    IsActive BIT DEFAULT 1,
    Notes NTEXT,
    RecordedBy INT FOREIGN KEY REFERENCES Users(UserID),
    RecordedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng PatientAllergies (Dị ứng của bệnh nhân)
CREATE TABLE PatientAllergies (
    AllergyID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    AllergyType NVARCHAR(100) NOT NULL,
    Severity NVARCHAR(20),
    Reaction NVARCHAR(255),
    DiagnosisDate DATE,
    Notes NTEXT,
    RecordedBy INT FOREIGN KEY REFERENCES Users(UserID),
    RecordedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Doctors (Bác sĩ)
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE FOREIGN KEY REFERENCES Users(UserID),
    Specialty NVARCHAR(100),
    Qualification NVARCHAR(255),
    LicenseNumber NVARCHAR(50),
    Biography NTEXT,
    YearsOfExperience INT,
    IsAvailable BIT DEFAULT 1,
    ConsultationFee DECIMAL(10,2),
    VerificationStatus NVARCHAR(20) DEFAULT 'Pending', -- Pending, Verified, Rejected
    VerificationDate DATETIME,
    VerifiedBy INT FOREIGN KEY REFERENCES Users(UserID)
);

-- Tạo bảng DoctorEducation (Học vấn của bác sĩ)
CREATE TABLE DoctorEducation (
    EducationID INT PRIMARY KEY IDENTITY(1,1),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    Degree NVARCHAR(100) NOT NULL,
    Institution NVARCHAR(255) NOT NULL,
    StartYear INT,
    EndYear INT,
    Description NTEXT
);

-- Tạo bảng DoctorCertifications (Chứng chỉ của bác sĩ)
CREATE TABLE DoctorCertifications (
    CertificationID INT PRIMARY KEY IDENTITY(1,1),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    CertificationName NVARCHAR(100) NOT NULL,
    IssuedBy NVARCHAR(255) NOT NULL,
    IssuedDate DATE,
    ExpiryDate DATE,
    CertificationDocument NVARCHAR(255)
);

-- Tạo bảng DoctorSchedules (Lịch làm việc của bác sĩ)
CREATE TABLE DoctorSchedules (
    ScheduleID INT PRIMARY KEY IDENTITY(1,1),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    DayOfWeek INT, -- 1-7 tương ứng với Thứ 2 - Chủ nhật
    StartTime TIME,
    EndTime TIME,
    SlotDuration INT DEFAULT 30, -- Thời gian mỗi lượt khám (phút)
    MaxPatients INT, -- Số bệnh nhân tối đa trong ngày
    IsAvailable BIT DEFAULT 1,
    Notes NVARCHAR(255)
);

-- Tạo bảng DoctorAvailability (Tình trạng sẵn sàng của bác sĩ)
CREATE TABLE DoctorAvailability (
    AvailabilityID INT PRIMARY KEY IDENTITY(1,1),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    AvailabilityDate DATE,
    StartTime TIME,
    EndTime TIME,
    IsAvailable BIT DEFAULT 1,
    Reason NVARCHAR(255)
);

-- Tạo bảng Facilities (Cơ sở y tế)
CREATE TABLE Facilities (
    FacilityID INT PRIMARY KEY IDENTITY(1,1),
    FacilityName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(255),
    City NVARCHAR(50),
    State NVARCHAR(50),
    ZipCode NVARCHAR(20),
    PhoneNumber NVARCHAR(15),
    Email NVARCHAR(100),
    Website NVARCHAR(255),
    OpeningHours NVARCHAR(255),
    Description NTEXT,
    IsActive BIT DEFAULT 1
);

-- Tạo bảng FacilityDoctors (Bác sĩ làm việc tại cơ sở)
CREATE TABLE FacilityDoctors (
    FacilityDoctorID INT PRIMARY KEY IDENTITY(1,1),
    FacilityID INT FOREIGN KEY REFERENCES Facilities(FacilityID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    StartDate DATE,
    EndDate DATE,
    IsActive BIT DEFAULT 1
);

-- Tạo bảng Appointments (Lịch hẹn)
CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    FacilityID INT FOREIGN KEY REFERENCES Facilities(FacilityID),
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    EndTime TIME,
    AppointmentType NVARCHAR(50), -- Regular, Follow-up, Emergency
    Purpose NVARCHAR(255),
    Status NVARCHAR(20) DEFAULT 'Scheduled', -- Scheduled, Confirmed, Completed, Cancelled, No-show
    Notes NTEXT,
    IsAnonymous BIT DEFAULT 0,
    ReminderSent BIT DEFAULT 0,
    CreatedBy INT FOREIGN KEY REFERENCES Users(UserID),
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME,
    ConsultationFee DECIMAL(10,2) NULL,
    PatientName NVARCHAR(255) NULL,
    PatientPhone NVARCHAR(20) NULL,
    PatientEmail NVARCHAR(255) NULL
);

-- Tạo bảng AppointmentReminders (Nhắc nhở lịch hẹn)
CREATE TABLE AppointmentReminders (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    AppointmentID INT FOREIGN KEY REFERENCES Appointments(AppointmentID),
    ReminderType NVARCHAR(20), -- Email, SMS, Push
    ReminderTime DATETIME,
    Status NVARCHAR(20), -- Pending, Sent, Failed
    SentDate DATETIME
);

-- Tạo bảng ARVMedications (Thuốc ARV)
CREATE TABLE ARVMedications (
    MedicationID INT PRIMARY KEY IDENTITY(1,1),
    MedicationName NVARCHAR(100) NOT NULL,
    GenericName NVARCHAR(100),
    Description NTEXT,
    Category NVARCHAR(50),
    DosageForm NVARCHAR(50), -- Viên, nước, v.v.
    Strength NVARCHAR(50),
    StandardDosage NVARCHAR(100),
    AdministrationRoute NVARCHAR(50),
    SideEffects NTEXT,
    Contraindications NTEXT,
    DrugInteractions NTEXT,
    StorageInstructions NVARCHAR(255),
    ManufacturerName NVARCHAR(100),
    IsActive BIT DEFAULT 1
);

-- Tạo bảng MedicationInventory (Kho thuốc)
CREATE TABLE MedicationInventory (
    InventoryID INT PRIMARY KEY IDENTITY(1,1),
    MedicationID INT FOREIGN KEY REFERENCES ARVMedications(MedicationID),
    FacilityID INT FOREIGN KEY REFERENCES Facilities(FacilityID),
    BatchNumber NVARCHAR(50),
    ExpiryDate DATE,
    QuantityInStock INT,
    UnitPrice DECIMAL(10,2),
    LastRestockDate DATETIME,
    ReorderLevel INT
);

-- Tạo bảng TestTypes (Loại xét nghiệm)
CREATE TABLE TestTypes (
    TestTypeID INT PRIMARY KEY IDENTITY(1,1),
    TestName NVARCHAR(100) NOT NULL,
    Description NTEXT,
    NormalRange NVARCHAR(100),
    Unit NVARCHAR(20),
    TestProcedure NTEXT,
    PreparationInstructions NTEXT,
    Category NVARCHAR(50),
    IsActive BIT DEFAULT 1
);

-- Tạo bảng TestResults (Kết quả xét nghiệm)
CREATE TABLE TestResults (
    TestResultID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    TestTypeID INT FOREIGN KEY REFERENCES TestTypes(TestTypeID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    FacilityID INT FOREIGN KEY REFERENCES Facilities(FacilityID),
    TestDate DATE NOT NULL,
    Result NVARCHAR(100) NOT NULL,
    ResultInterpretation NTEXT,
    AbnormalFlag NVARCHAR(20), -- Normal, Low, High, Critical
    LabReferenceNumber NVARCHAR(50),
    Notes NTEXT,
    RecordedBy INT FOREIGN KEY REFERENCES Users(UserID),
    RecordedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng TreatmentPlans (Phác đồ điều trị)
CREATE TABLE TreatmentPlans (
    PlanID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    PlanName NVARCHAR(100),
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(20) DEFAULT 'Active', -- Active, Completed, Discontinued
    DiscontinuationReason NTEXT,
    FollowUpDate DATE,
    FollowUpNotes NTEXT,
    Notes NTEXT,
    CreatedBy INT FOREIGN KEY REFERENCES Users(UserID),
    CreatedDate DATETIME DEFAULT GETDATE(),
    LastUpdated DATETIME DEFAULT GETDATE(),
    LastUpdatedBy INT FOREIGN KEY REFERENCES Users(UserID)
);

-- Tạo bảng TreatmentPlanMedications (Chi tiết thuốc trong phác đồ)
CREATE TABLE TreatmentPlanMedications (
    PlanMedicationID INT PRIMARY KEY IDENTITY(1,1),
    PlanID INT FOREIGN KEY REFERENCES TreatmentPlans(PlanID),
    MedicationID INT FOREIGN KEY REFERENCES ARVMedications(MedicationID),
    Dosage NVARCHAR(50),
    Frequency NVARCHAR(50), -- Số lần uống mỗi ngày
    SpecificTimes NVARCHAR(255), -- Ví dụ: "08:00,20:00"
    WithFood BIT,
    Instructions NVARCHAR(255),
    Duration INT, -- Số ngày
    StartDate DATE,
    EndDate DATE,
    Notes NTEXT,
    IsActive BIT DEFAULT 1,
    CreatedBy INT FOREIGN KEY REFERENCES Users(UserID),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng TreatmentPlanTests (Xét nghiệm trong phác đồ)
CREATE TABLE TreatmentPlanTests (
    PlanTestID INT PRIMARY KEY IDENTITY(1,1),
    PlanID INT FOREIGN KEY REFERENCES TreatmentPlans(PlanID),
    TestTypeID INT FOREIGN KEY REFERENCES TestTypes(TestTypeID),
    ScheduledDate DATE,
    Frequency NVARCHAR(50), -- Weekly, Monthly, Quarterly, etc.
    Instructions NTEXT,
    Status NVARCHAR(20) DEFAULT 'Scheduled', -- Scheduled, Completed, Missed
    Notes NTEXT
);

-- Tạo bảng MedicationReminders (Nhắc nhở uống thuốc)
CREATE TABLE MedicationReminders (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    PlanMedicationID INT FOREIGN KEY REFERENCES TreatmentPlanMedications(PlanMedicationID),
    ReminderTime TIME,
    ReminderDays NVARCHAR(20), -- 1234567 (thứ 2 đến chủ nhật)
    ReminderType NVARCHAR(20), -- Push, SMS, Email
    IsEnabled BIT DEFAULT 1,
    Notes NVARCHAR(255)
);

-- Tạo bảng MedicationAdherence (Tuân thủ uống thuốc)
CREATE TABLE MedicationAdherence (
    AdherenceID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    PlanMedicationID INT FOREIGN KEY REFERENCES TreatmentPlanMedications(PlanMedicationID),
    ScheduledDateTime DATETIME,
    TakenDateTime DATETIME,
    IsTaken BIT DEFAULT 0,
    Delay INT, -- Số phút trễ
    Reason NVARCHAR(255), -- Lý do nếu không uống
    Notes NVARCHAR(255),
    RecordedTime DATETIME DEFAULT GETDATE()
);

-- Tạo bảng AdherenceStats (Thống kê tuân thủ)
CREATE TABLE AdherenceStats (
    StatID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    PlanID INT FOREIGN KEY REFERENCES TreatmentPlans(PlanID),
    PeriodStart DATE,
    PeriodEnd DATE,
    TotalDoses INT,
    TakenDoses INT,
    MissedDoses INT,
    DelayedDoses INT,
    AdherenceRate DECIMAL(5,2), -- Tỷ lệ phần trăm
    GeneratedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng SideEffectReports (Báo cáo tác dụng phụ)
CREATE TABLE SideEffectReports (
    ReportID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    PlanMedicationID INT FOREIGN KEY REFERENCES TreatmentPlanMedications(PlanMedicationID),
    ReportDate DATE DEFAULT GETDATE(),
    OnsetDate DATE,
    Symptoms NTEXT,
    Severity NVARCHAR(20), -- Mild, Moderate, Severe
    Duration NVARCHAR(50),
    ActionTaken NTEXT,
    OutcomeNotes NTEXT,
    DoctorNotes NTEXT,
    Status NVARCHAR(20) DEFAULT 'Reported', -- Reported, Reviewed, Addressed
    ReviewedBy INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    ReviewedDate DATETIME
);

-- Tạo bảng MedicalNotes (Ghi chú y tế)
CREATE TABLE MedicalNotes (
    NoteID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    AppointmentID INT FOREIGN KEY REFERENCES Appointments(AppointmentID),
    NoteType NVARCHAR(50), -- Consultation, Treatment, Follow-up
    NoteText NTEXT NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    IsPrivate BIT DEFAULT 0
);

-- Tạo bảng Notifications (Thông báo)
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(100) NOT NULL,
    Message NTEXT NOT NULL,
    NotificationType NVARCHAR(50), -- Appointment, Medication, System, Test
    ReferenceID INT, -- ID tham chiếu đến đối tượng liên quan
    ReferenceType NVARCHAR(50), -- Loại đối tượng tham chiếu
    IsRead BIT DEFAULT 0,
    IsDeleted BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ExpiryDate DATETIME
);

-- Tạo bảng BlogCategories (Danh mục blog)
CREATE TABLE BlogCategories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Slug NVARCHAR(100),
    Description NTEXT,
    ParentCategoryID INT FOREIGN KEY REFERENCES BlogCategories(CategoryID),
    DisplayOrder INT,
    IsActive BIT DEFAULT 1
);

-- Tạo bảng BlogPosts (Bài viết blog)
CREATE TABLE BlogPosts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES BlogCategories(CategoryID),
    Title NVARCHAR(255) NOT NULL,
    Slug NVARCHAR(255),
    Summary NVARCHAR(500),
    Content NTEXT NOT NULL,
    FeaturedImage NVARCHAR(255),
    AuthorID INT FOREIGN KEY REFERENCES Users(UserID),
    PublishDate DATETIME DEFAULT GETDATE(),
    IsPublished BIT DEFAULT 1,
    ViewCount INT DEFAULT 0,
    Tags NVARCHAR(255),
    MetaTitle NVARCHAR(255),
    MetaDescription NVARCHAR(500),
    LastModifiedDate DATETIME,
    LastModifiedBy INT FOREIGN KEY REFERENCES Users(UserID)
);

-- Tạo bảng BlogComments (Bình luận blog)
CREATE TABLE BlogComments (
    CommentID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT FOREIGN KEY REFERENCES BlogPosts(PostID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ParentCommentID INT FOREIGN KEY REFERENCES BlogComments(CommentID),
    CommentText NTEXT NOT NULL,
    CommentDate DATETIME DEFAULT GETDATE(),
    IsApproved BIT DEFAULT 0,
    IsDeleted BIT DEFAULT 0
);

-- Tạo bảng EducationalResourceCategories (Danh mục tài liệu giáo dục)
CREATE TABLE EducationalResourceCategories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NTEXT,
    IsActive BIT DEFAULT 1
);

-- Tạo bảng EducationalResources (Tài liệu giáo dục)
CREATE TABLE EducationalResources (
    ResourceID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES EducationalResourceCategories(CategoryID),
    Title NVARCHAR(255) NOT NULL,
    Description NTEXT,
    ContentType NVARCHAR(50), -- Article, Video, PDF, Infographic
    ContentURL NVARCHAR(255),
    FileSize INT, -- Kích thước tệp (KB)
    Duration INT, -- Thời lượng (giây) cho video
    IsPublished BIT DEFAULT 1,
    ViewCount INT DEFAULT 0,
    PublishDate DATETIME DEFAULT GETDATE(),
    AuthorID INT FOREIGN KEY REFERENCES Users(UserID),
    LastModifiedDate DATETIME,
    Tags NVARCHAR(255)
);

-- Tạo bảng ConsultationSessions (Phiên tư vấn)
CREATE TABLE ConsultationSessions (
    SessionID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patients(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    SessionType NVARCHAR(50), -- Chat, Video, Voice
    StartTime DATETIME,
    EndTime DATETIME,
    Status NVARCHAR(20), -- Scheduled, InProgress, Completed, Cancelled
    IsAnonymous BIT DEFAULT 0,
    Summary NTEXT,
    Rating INT,
    Feedback NTEXT,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng ConsultationMessages (Tin nhắn tư vấn)
CREATE TABLE ConsultationMessages (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    SessionID INT FOREIGN KEY REFERENCES ConsultationSessions(SessionID),
    SenderID INT FOREIGN KEY REFERENCES Users(UserID),
    ReceiverID INT FOREIGN KEY REFERENCES Users(UserID),
    MessageContent NTEXT NOT NULL,
    AttachmentURL NVARCHAR(255),
    AttachmentType NVARCHAR(50),
    SentTime DATETIME DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0,
    ReadTime DATETIME,
    IsDeleted BIT DEFAULT 0
);

-- Tạo bảng AnonymousConsultations (Tư vấn ẩn danh)
CREATE TABLE AnonymousConsultations (
    ConsultationID INT PRIMARY KEY IDENTITY(1,1),
    AnonymousUserID NVARCHAR(50), -- ID ẩn danh
    DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
    Question NTEXT NOT NULL,
    Answer NTEXT,
    QuestionDate DATETIME DEFAULT GETDATE(),
    AnswerDate DATETIME,
    Status NVARCHAR(20), -- Pending, Answered, Closed
    Category NVARCHAR(50),
    IsPublic BIT DEFAULT 0 -- Có cho phép hiển thị công khai không
);

-- Tạo bảng FacilityInfo (Thông tin cơ sở)
CREATE TABLE FacilityInfo (
    InfoID INT PRIMARY KEY IDENTITY(1,1),
    FacilityID INT FOREIGN KEY REFERENCES Facilities(FacilityID),
    ServiceType NVARCHAR(100),
    Description NTEXT,
    OperatingHours NVARCHAR(255),
    ContactPerson NVARCHAR(100),
    ContactPhone NVARCHAR(15),
    ContactEmail NVARCHAR(100),
    PhotoURL NVARCHAR(255),
    LastUpdated DATETIME DEFAULT GETDATE(),
    UpdatedBy INT FOREIGN KEY REFERENCES Users(UserID)
);

-- Tạo bảng DashboardConfigs (Cấu hình Dashboard)
CREATE TABLE DashboardConfigs (
    ConfigID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ConfigName NVARCHAR(100),
    ConfigData NTEXT, -- JSON config
    IsDefault BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    LastModified DATETIME
);

-- Tạo bảng Reports (Báo cáo)
CREATE TABLE Reports (
    ReportID INT PRIMARY KEY IDENTITY(1,1),
    ReportName NVARCHAR(100) NOT NULL,
    ReportType NVARCHAR(50), -- Patient, Treatment, Adherence, etc.
    ReportData NTEXT, -- JSON data
    GeneratedBy INT FOREIGN KEY REFERENCES Users(UserID),
    GeneratedDate DATETIME DEFAULT GETDATE(),
    StartDate DATE,
    EndDate DATE,
    Parameters NTEXT, -- JSON parameters
    IsPublic BIT DEFAULT 0
);

-- Tạo bảng AuditLogs (Nhật ký hệ thống)
CREATE TABLE AuditLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Action NVARCHAR(255) NOT NULL,
    EntityType NVARCHAR(50), -- User, Patient, Doctor, Appointment, etc.
    EntityID INT,
    OldValue NTEXT,
    NewValue NTEXT,
    IPAddress NVARCHAR(50),
    UserAgent NVARCHAR(255),
    LogTime DATETIME DEFAULT GETDATE()
);

-- Tạo bảng SystemSettings (Cài đặt hệ thống)
CREATE TABLE SystemSettings (
    SettingID INT PRIMARY KEY IDENTITY(1,1),
    SettingKey NVARCHAR(100) NOT NULL UNIQUE,
    SettingValue NTEXT,
    SettingGroup NVARCHAR(50),
    Description NVARCHAR(255),
    IsPublic BIT DEFAULT 0,
    LastModified DATETIME DEFAULT GETDATE(),
    ModifiedBy INT FOREIGN KEY REFERENCES Users(UserID)
);

-- Tạo bảng FeedbackSurveys (Khảo sát phản hồi)
CREATE TABLE FeedbackSurveys (
    SurveyID INT PRIMARY KEY IDENTITY(1,1),
    SurveyName NVARCHAR(100) NOT NULL,
    Description NTEXT,
    StartDate DATETIME,
    EndDate DATETIME,
    IsActive BIT DEFAULT 1,
    CreatedBy INT FOREIGN KEY REFERENCES Users(UserID),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng SurveyQuestions (Câu hỏi khảo sát)
CREATE TABLE SurveyQuestions (
    QuestionID INT PRIMARY KEY IDENTITY(1,1),
    SurveyID INT FOREIGN KEY REFERENCES FeedbackSurveys(SurveyID),
    QuestionText NTEXT NOT NULL,
    QuestionType NVARCHAR(50), -- Text, Rating, MultipleChoice, etc.
    Options NTEXT, -- JSON options for multiple choice
    IsRequired BIT DEFAULT 0,
    DisplayOrder INT
);

-- Tạo bảng SurveyResponses (Phản hồi khảo sát)
CREATE TABLE SurveyResponses (
    ResponseID INT PRIMARY KEY IDENTITY(1,1),
    SurveyID INT FOREIGN KEY REFERENCES FeedbackSurveys(SurveyID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    SubmitDate DATETIME DEFAULT GETDATE()
);

-- Tạo bảng SurveyAnswers (Câu trả lời khảo sát)
CREATE TABLE SurveyAnswers (
    AnswerID INT PRIMARY KEY IDENTITY(1,1),
    ResponseID INT FOREIGN KEY REFERENCES SurveyResponses(ResponseID),
    QuestionID INT FOREIGN KEY REFERENCES SurveyQuestions(QuestionID),
    AnswerText NTEXT,
    AnswerValue INT, -- For rating questions
    SubmitDate DATETIME DEFAULT GETDATE()
);

