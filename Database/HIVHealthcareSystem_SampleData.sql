-- HIV Healthcare System - Sample Data  
-- Database: HIVHealthcareSystem
-- Version: 1.0
-- Created: January 2024
-- Encoding: UTF-8

USE HIVHealthcareSystem;
GO

-- Clear existing data (in reverse order of dependencies)
DELETE FROM Notifications WHERE UserID IS NOT NULL;
DELETE FROM UserSecurityAnswers WHERE UserID IS NOT NULL;
DELETE FROM SecurityQuestions WHERE QuestionID IS NOT NULL;
DELETE FROM Patients WHERE UserID IS NOT NULL;
DELETE FROM Doctors WHERE UserID IS NOT NULL;
DELETE FROM Facilities WHERE FacilityID IS NOT NULL;
DELETE FROM Users WHERE UserID IS NOT NULL;
DELETE FROM Roles WHERE RoleID IS NOT NULL;

-- 1. Insert Roles (Simplified to 3 roles only)
INSERT INTO Roles (RoleName, Description, IsActive, CreatedDate) VALUES
('Admin', 'Quản trị viên hệ thống với quyền truy cập đầy đủ', 1, GETDATE()),
('Doctor', 'Bác sĩ cung cấp dịch vụ chăm sóc sức khỏe', 1, GETDATE()),
('Customer', 'Khách hàng sử dụng dịch vụ chăm sóc sức khỏe', 1, GETDATE());

-- 2. Insert Users
INSERT INTO Users (Username, PasswordHash, Email, FullName, PhoneNumber, DateOfBirth, Gender, Address, ProfileImage, RoleID, IsAnonymous, IsActive, LastLoginDate, CreatedDate) VALUES
-- Admin user
('admin', 'hashed_password_admin', 'admin@hivhealthcare.com', N'Quản trị viên hệ thống', '0123456789', '1985-01-15', N'Nam', N'123 Đường Quản trị, Quận 1, TP. Hồ Chí Minh', NULL, 1, 0, 1, GETDATE(), GETDATE()),

-- Doctor users  
('dr.nguyen', 'hashed_password_doctor1', 'dr.nguyen@hivhealthcare.com', N'BS. Nguyễn Văn An', '0987654321', '1980-05-20', N'Nam', N'456 Trung tâm Y tế, Quận 1, TP. Hồ Chí Minh', NULL, 2, 0, 1, GETDATE(), GETDATE()),
('dr.tran', 'hashed_password_doctor2', 'dr.tran@hivhealthcare.com', N'BS. Trần Thị Bình', '0912345678', '1975-08-10', N'Nữ', N'789 Đường Bệnh viện, Quận 3, TP. Hồ Chí Minh', NULL, 2, 0, 1, GETDATE(), GETDATE()),
('dr.le', 'hashed_password_doctor3', 'dr.le@hivhealthcare.com', N'BS. Lê Văn Cường', '0967890123', '1982-03-25', N'Nam', N'321 Đại lộ Phòng khám, Quận 7, TP. Hồ Chí Minh', NULL, 2, 0, 1, GETDATE(), GETDATE()),

-- Customer users
('customer001', 'hashed_password_customer1', 'customer1@email.com', N'Nguyễn Thị Dung', '0934567890', '1990-12-05', N'Nữ', N'567 Đường Khách hàng, Quận 5, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('customer002', 'hashed_password_customer2', 'customer2@email.com', N'Trần Văn Em', '0945678901', '1988-07-18', N'Nam', N'890 Đường Cư dân, Quận 2, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('customer003', 'hashed_password_customer3', 'customer3@email.com', N'Lê Thị Phương', '0956789012', '1992-11-30', N'Nữ', N'234 Đường Sinh sống, Quận 4, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('customer004', 'hashed_password_customer4', 'customer4@email.com', N'Phạm Văn Giang', '0967890123', '1985-04-22', N'Nam', N'345 Đường Gia đình, Quận 6, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('customer005', 'hashed_password_customer5', 'customer5@email.com', N'Võ Văn Hùng', '0978901234', '1987-09-14', N'Nam', N'678 Đường Khách hàng, Quận 8, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE()),
('customer006', 'hashed_password_customer6', 'customer6@email.com', N'Đào Thị Inh', '0989012345', '1983-06-08', N'Nữ', N'789 Đường Khách hàng, Quận 9, TP. Hồ Chí Minh', NULL, 3, 0, 1, GETDATE(), GETDATE());

-- 3. Insert Security Questions
INSERT INTO SecurityQuestions (QuestionText) VALUES
(N'Tên của thú cưng đầu tiên của bạn là gì?'),
(N'Họ tên khai sinh của mẹ bạn là gì?'),
(N'Bạn sinh ra ở thành phố nào?'),
(N'Tên trường tiểu học của bạn là gì?'),
(N'Màu sắc yêu thích của bạn là gì?');

-- 4. Insert User Security Answers
INSERT INTO UserSecurityAnswers (UserID, QuestionID, AnswerHash, CreatedDate) VALUES
(1, 1, 'hashed_answer_admin_1', GETDATE()),
(2, 2, 'hashed_answer_doctor1_2', GETDATE()),
(3, 3, 'hashed_answer_doctor2_3', GETDATE()),
(5, 1, 'hashed_answer_customer1_1', GETDATE()),
(6, 2, 'hashed_answer_customer2_2', GETDATE());

-- 5. Insert Doctors (Map from Users with RoleID = 2)
INSERT INTO Doctors (UserID, Specialty, Qualification, LicenseNumber, Biography, YearsOfExperience, IsAvailable, ConsultationFee, VerificationStatus, VerificationDate) VALUES
(2, N'Bệnh học nhiễm trùng', N'Thạc sĩ Y học - Chuyên khoa Nhiễm', 'BS001-HCMC', N'Bác sĩ chuyên khoa với hơn 15 năm kinh nghiệm điều trị HIV/AIDS', 15, 1, 500000, 'Verified', GETDATE()),
(3, N'Nội khoa tổng hợp', N'Tiến sĩ Y học - Chuyên khoa Nội', 'BS002-HCMC', N'Bác sĩ chuyên khoa nội với chuyên môn sâu về HIV/AIDS', 12, 1, 600000, 'Verified', GETDATE()),
(4, N'Tâm lý học lâm sàng', N'Thạc sĩ Tâm lý học - Chuyên khoa Tâm thần', 'BS003-HCMC', N'Bác sĩ tâm lý chuyên hỗ trợ bệnh nhân HIV/AIDS', 8, 1, 450000, 'Verified', GETDATE());

-- 6. Insert Patients (All customers using healthcare services)
INSERT INTO Patients (UserID, PatientCode, BloodType, Height, Weight, EmergencyContact, EmergencyPhone, EmergencyRelationship, InsuranceInfo, RegistrationDate, Notes) VALUES
(5, 'KH001', 'A+', 165.00, 55.50, N'Nguyễn Văn Khang', '0901234567', N'Chồng', N'Bảo hiểm xã hội 123456789', GETDATE(), N'Khách hàng khám định kỳ'),
(6, 'KH002', 'B+', 175.00, 70.00, N'Trần Thị Lan', '0912345678', N'Vợ', N'Bảo hiểm tư nhân ABC123', GETDATE(), N'Khách hàng mới đăng ký'),
(7, 'KH003', 'O+', 158.00, 48.00, N'Lê Văn Minh', '0923456789', N'Cha', N'Bảo hiểm xã hội 987654321', GETDATE(), N'Cần theo dõi điều trị'),
(8, 'KH004', 'AB+', 180.00, 85.00, N'Phạm Thị Nga', '0934567890', N'Mẹ', N'Bảo hiểm tư nhân XYZ789', GETDATE(), N'Khách hàng có nguy cơ cao'),
(9, 'KH005', 'O-', 172.00, 68.00, N'Võ Thị Oanh', '0945678901', N'Chị gái', N'Bảo hiểm tư nhân DEF456', GETDATE(), N'Khách hàng khám sức khỏe'),
(10, 'KH006', 'A-', 160.00, 52.00, N'Đào Văn Phú', '0956789012', N'Anh trai', N'Bảo hiểm xã hội 456789123', GETDATE(), N'Khách hàng chăm sóc phòng ngừa');

-- 7. Insert Facilities (Medical facilities)
INSERT INTO Facilities (FacilityName, Address, City, State, ZipCode, PhoneNumber, Email, Website, OpeningHours, Description, IsActive) VALUES
(N'Trung tâm Điều trị HIV/AIDS Trung ương', N'123 Đường Võ Văn Kiệt, Quận 1', N'TP. Hồ Chí Minh', N'Hồ Chí Minh', '70000', '028-3123-4567', 'info@hivcenter.vn', 'https://hivcenter.vn', N'T2-T6: 7:30-17:30, T7: 7:30-11:30', N'Trung tâm chuyên khoa điều trị HIV/AIDS hàng đầu', 1),
(N'Bệnh viện Nhiệt đới TP.HCM', N'764 Võ Văn Kiệt, Quận 5', N'TP. Hồ Chí Minh', N'Hồ Chí Minh', '70000', '028-3855-4269', 'bvnd@hcm.vnn.vn', 'https://benhviennhietdoi.com.vn', N'T2-CN: 24/7', N'Bệnh viện chuyên khoa nhiệt đới và truyền nhiễm', 1);

-- 8. Insert Notifications
INSERT INTO Notifications (UserID, Title, Message, NotificationType, ReferenceID, ReferenceType, IsRead, IsDeleted, CreatedDate, ExpiryDate) VALUES
(5, N'Cuộc hẹn sắp tới', N'Bạn có cuộc hẹn vào ngày mai lúc 9:00 sáng với BS. Nguyễn Văn An', 'Appointment', 2, 'Appointment', 0, 0, GETDATE(), DATEADD(day, 7, GETDATE())),
(6, N'Kết quả xét nghiệm có sẵn', N'Kết quả xét nghiệm gần đây của bạn đã có', 'Test', 4, 'TestResult', 0, 0, GETDATE(), DATEADD(day, 30, GETDATE())),
(7, N'Nhắc nhở thuốc', N'Đừng quên uống thuốc buổi tối', 'Medication', 1, 'MedicationReminder', 1, 0, GETDATE(), DATEADD(day, 1, GETDATE())),
(5, N'Kế hoạch điều trị đã cập nhật', N'Kế hoạch điều trị của bạn đã được bác sĩ cập nhật', 'Treatment', 1, 'TreatmentPlan', 0, 0, GETDATE(), DATEADD(day, 14, GETDATE()));

PRINT 'Dữ liệu mẫu đã được tải thành công! Đã sửa lỗi encoding tiếng Việt và Foreign Key constraint.'; 