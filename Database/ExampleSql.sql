USE HIVHealthcareSystem;
GO

-- Thêm dữ liệu vào bảng Roles
INSERT INTO Roles (RoleName, Description, IsActive) VALUES 
('Admin', N'Quản trị viên hệ thống', 1),
('Doctor', N'Bác sĩ điều trị', 1),
('Patient', N'Bệnh nhân', 1),
('Anonymous', N'Người dùng ẩn danh', 1);

-- Thêm dữ liệu vào bảng Users
-- Trong thực tế, bạn nên mã hóa mật khẩu bằng bcrypt hoặc một thuật toán mã hóa an toàn khác
INSERT INTO Users (Username, PasswordHash, Email, FullName, PhoneNumber, DateOfBirth, Gender, Address, RoleID, IsActive) VALUES 
('admin', 'admin123', 'admin@hivsystem.com', N'Nguyễn Quản Trị', '0901234567', '1985-05-15', 'Male', N'Hà Nội', 1, 1),
('doctor1', 'doctor123', 'doctor1@hivsystem.com', N'Trần Bác Sĩ', '0912345678', '1980-10-20', 'Male', N'Hà Nội', 2, 1),
('doctor2', 'doctor123', 'doctor2@hivsystem.com', N'Lê Thị Bác Sĩ', '0923456789', '1982-03-25', 'Female', N'Hồ Chí Minh', 2, 1),
('patient1', 'patient123', 'patient1@example.com', N'Phạm Văn Bệnh', '0934567890', '1990-07-12', 'Male', N'Đà Nẵng', 3, 1),
('patient2', 'patient123', 'patient2@example.com', N'Hoàng Thị Nhân', '0945678901', '1988-12-05', 'Female', N'Hồ Chí Minh', 3, 1),
('anonymous1', 'anon123', 'anon1@example.com', 'Anonymous User', NULL, NULL, NULL, NULL, 4, 1);

-- Thêm dữ liệu vào bảng Facilities (Cơ sở y tế)
INSERT INTO Facilities (FacilityName, Address, City, PhoneNumber, Email, Description, IsActive) VALUES 
(N'Trung tâm Y tế Quận 1', N'123 Nguyễn Huệ', N'Hồ Chí Minh', '0283123456', 'ttyt.quan1@hcm.gov.vn', N'Trung tâm y tế chuyên về điều trị HIV/AIDS', 1);

-- Thêm dữ liệu vào bảng Doctors
INSERT INTO Doctors (UserID, Specialty, Qualification, LicenseNumber, Biography, YearsOfExperience, IsAvailable) VALUES 
(2, N'Bác sĩ chuyên khoa HIV/AIDS', N'Tiến sĩ Y khoa, Đại học Y Hà Nội', 'MD12345', N'Chuyên gia về điều trị HIV với hơn 15 năm kinh nghiệm', 15, 1),
(3, N'Bác sĩ nội khoa, chuyên HIV', N'Thạc sĩ Y khoa, Đại học Y Dược TP.HCM', 'MD67890', N'Chuyên về điều trị ARV và quản lý tác dụng phụ', 10, 1);

-- Thêm dữ liệu vào bảng Patients
INSERT INTO Patients (UserID, PatientCode, EmergencyContact, EmergencyPhone, RegistrationDate) VALUES 
(4, 'P001', N'Phạm Văn Hùng', '0956789012', '2022-01-15'),
(5, 'P002', N'Hoàng Văn Nam', '0967890123', '2022-02-20');

-- Tiếp tục từ phần trước

-- Thêm cài đặt hệ thống
INSERT INTO SystemSettings (SettingKey, SettingValue, SettingGroup, Description, IsPublic) VALUES
('SiteName', N'Hệ thống Quản lý Điều trị HIV', 'General', N'Tên hệ thống', 1),
('SiteDescription', N'Hệ thống quản lý điều trị HIV cho cơ sở y tế', 'General', N'Mô tả hệ thống', 1),
('AdminEmail', 'admin@hivsystem.com', 'Contact', N'Email liên hệ quản trị viên', 0),
('DefaultPasswordPolicy', 'MinLength:8;RequireDigit:true;RequireLowercase:true;RequireUppercase:true', 'Security', N'Chính sách mật khẩu mặc định', 0),
('LoginAttempts', '5', 'Security', N'Số lần đăng nhập sai tối đa', 0),
('SessionTimeout', '30', 'Security', N'Thời gian hết hạn phiên (phút)', 0);

-- Thêm dữ liệu câu hỏi bảo mật
INSERT INTO SecurityQuestions (QuestionText) VALUES
(N'Tên trường tiểu học đầu tiên của bạn là gì?'),
(N'Họ và tên đệm của mẹ bạn là gì?'),
(N'Thành phố mà bạn sinh ra là gì?'),
(N'Tên thú cưng đầu tiên của bạn là gì?'),
(N'Món ăn yêu thích của bạn là gì?');

-- Thêm câu trả lời bảo mật cho users (giả định)
INSERT INTO UserSecurityAnswers (UserID, QuestionID, AnswerHash) VALUES
(1, 1, 'answer123'), -- admin
(2, 2, 'answer123'), -- doctor1
(3, 3, 'answer123'), -- doctor2
(4, 4, 'answer123'), -- patient1
(5, 5, 'answer123'); -- patient2