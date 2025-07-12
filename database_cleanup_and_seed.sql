-- =====================================================
-- HIV TREATMENT SYSTEM - DATABASE CLEANUP & SEED DATA
-- =====================================================

-- 1. CLEANUP EXISTING DATA (Keep essential structure)
-- =====================================================

-- Clear all data except migrations
DELETE FROM public."PatientAdherences";
DELETE FROM public."PatientRegimenHistories";
DELETE FROM public."PatientRegimens";
DELETE FROM public."ARVRegimenDrugs";
DELETE FROM public."ARVRegimens";
DELETE FROM public."ARVDrugs";
DELETE FROM public."BlogComments";
DELETE FROM public."BlogPosts";
DELETE FROM public."Answers";
DELETE FROM public."Consultations";
DELETE FROM public."ConsultationTopics";
DELETE FROM public."Reminders";
DELETE FROM public."Appointments";
DELETE FROM public."DoctorServices";
DELETE FROM public."TimeSlots";
DELETE FROM public."Doctors";
DELETE FROM public."Services";
DELETE FROM public."Users";

-- 2. INSERT CORE SYSTEM USERS (Admin, Staff, Doctor templates)
-- =====================================================

INSERT INTO public."Users" (id, first_name, last_name, email, password_hash, phone, gender, date_of_birth, role, profile_image, created_at, updated_at) VALUES
-- System Admin (password: admin123)
('admin-001', 'System', 'Admin', 'admin@gmail.com', '$2a$11$JjHwy5KBMat81lSPF4pAI.3kihjCLGmOUxsvEjm43Ztb5RvaM8ylq', '0123456789', 'male', '1985-01-15', 'admin', '/avatars/admin.jpg', '2025-01-01 00:00:00+00', NULL),

-- System Staff (password: staff123)
('staff-001', 'System', 'Staff', 'staff@gmail.com', '$2a$11$SWN2rQw.uuzE9IabJCBOTerEHZoMseCWDgg.eQTab0y.N2Q9IHUC2', '0123456788', 'female', '1990-05-20', 'staff', '/avatars/staff.jpg', '2025-01-01 00:00:00+00', NULL),

-- Doctor Accounts (3 HIV specialists) (password: doctor123)
('doctor-001', 'Minh', 'Nguyễn', 'doctor@gmail.com', '$2a$11$7bOTuLldeMv/8OYRL5mob.693ClIhwBV0XetcX22AvaKww8Y9m/pm', '0901234567', 'male', '1980-03-10', 'doctor', '/avatars/doctor1.jpg', '2025-01-01 00:00:00+00', NULL),

('doctor-002', 'Hoa', 'Trần', 'doctor2@gmail.com', '$2a$11$7bOTuLldeMv/8OYRL5mob.693ClIhwBV0XetcX22AvaKww8Y9m/pm', '0912345678', 'female', '1982-07-25', 'doctor', '/avatars/doctor2.jpg', '2025-01-01 00:00:00+00', NULL),

('doctor-003', 'Tuấn', 'Lê', 'doctor3@gmail.com', '$2a$11$7bOTuLldeMv/8OYRL5mob.693ClIhwBV0XetcX22AvaKww8Y9m/pm', '0923456789', 'male', '1978-11-12', 'doctor', '/avatars/doctor3.jpg', '2025-01-01 00:00:00+00', NULL);

-- 3. INSERT CUSTOMER ACCOUNTS (10 realistic customers) (password: customer123)
-- =====================================================

INSERT INTO public."Users" (id, first_name, last_name, email, password_hash, phone, gender, date_of_birth, role, profile_image, created_at, updated_at) VALUES
('customer-001', 'Anh', 'Nguyễn Văn', 'customer1@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0987654321', 'male', '1995-06-15', 'customer', '/avatars/customer1.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-002', 'Bình', 'Trần Thị', 'customer2@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0976543210', 'female', '1988-09-22', 'customer', '/avatars/customer2.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-003', 'Cường', 'Lê Văn', 'customer3@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0965432109', 'male', '1992-12-08', 'customer', '/avatars/customer3.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-004', 'Dung', 'Phạm Thị', 'customer4@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0954321098', 'female', '1990-04-18', 'customer', '/avatars/customer4.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-005', 'Em', 'Hoàng Văn', 'customer5@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0943210987', 'male', '1987-08-30', 'customer', '/avatars/customer5.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-006', 'Giang', 'Vũ Thị', 'customer6@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0932109876', 'female', '1993-01-25', 'customer', '/avatars/customer6.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-007', 'Hùng', 'Đỗ Văn', 'customer7@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0921098765', 'male', '1991-10-14', 'customer', '/avatars/customer7.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-008', 'Lan', 'Bùi Thị', 'customer8@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0910987654', 'female', '1989-03-07', 'customer', '/avatars/customer8.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-009', 'Minh', 'Đinh Văn', 'customer9@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0909876543', 'male', '1994-07-19', 'customer', '/avatars/customer9.jpg', '2025-01-01 00:00:00+00', NULL),

('customer-010', 'Nga', 'Lý Thị', 'customer10@gmail.com', '$2a$11$vs4y1P6qz/ZEs19o0jaUmu.ZwftqhsQhVBEKJwllU91WBZbkh3ANa', '0898765432', 'female', '1986-11-03', 'customer', '/avatars/customer10.jpg', '2025-01-01 00:00:00+00', NULL);

-- 4. INSERT DOCTOR PROFILES (HIV Specialists)
-- =====================================================

INSERT INTO public."Doctors" (id, first_name, last_name, specialization, email, phone, profile_image, available, bio, experience, created_at, updated_at) VALUES
('doctor-001', 'Minh', 'Nguyễn', 'HIV/AIDS Specialist', 'doctor@gmail.com', '0901234567', '/doctor-profiles/dr-minh-nguyen.jpg', true, 'Bác sĩ Minh có hơn 12 năm kinh nghiệm chuyên sâu về điều trị HIV/AIDS. Từng công tác tại Bệnh viện Nhiệt đới Trung ương và có nhiều nghiên cứu về phác đồ ARV.', 12, '2025-01-01 00:00:00+00', NULL),

('doctor-002', 'Hoa', 'Trần', 'Infectious Disease Specialist', 'doctor2@gmail.com', '0912345678', '/doctor-profiles/dr-hoa-tran.jpg', true, 'Bác sĩ Hoa chuyên về bệnh nhiễm trùng và có 10 năm kinh nghiệm điều trị HIV. Chuyên gia về tư vấn tâm lý và hỗ trợ bệnh nhân HIV.', 10, '2025-01-01 00:00:00+00', NULL),

('doctor-003', 'Tuấn', 'Lê', 'Internal Medicine - HIV Focus', 'doctor3@gmail.com', '0923456789', '/doctor-profiles/dr-tuan-le.jpg', true, 'Bác sĩ Tuấn là chuyên gia nội khoa với 15 năm kinh nghiệm, chuyên sâu về điều trị HIV và các bệnh lý kèm theo. Hiện là trưởng khoa HIV tại bệnh viện.', 15, '2025-01-01 00:00:00+00', NULL);

-- 5. INSERT HIV-RELATED SERVICES
-- =====================================================

INSERT INTO public."Services" (id, name, description, duration, price, category, image_url, created_at, updated_at) VALUES
('service-001', 'Tư vấn trước xét nghiệm HIV', 'Tư vấn về quy trình xét nghiệm HIV, giải thích về các phương pháp xét nghiệm và lợi ích của việc biết tình trạng nhiễm HIV', 30, 200000.0, 'hiv-testing', '/services/counseling.svg', '2025-01-01 00:00:00+00', NULL),

('service-002', 'Xét nghiệm HIV nhanh', 'Xét nghiệm HIV nhanh với kết quả trong vòng 20 phút, được thực hiện bởi nhân viên y tế có chuyên môn', 30, 300000.0, 'hiv-testing', '/services/rapid-test.svg', '2025-01-01 00:00:00+00', NULL),

('service-003', 'Tư vấn sau xét nghiệm HIV', 'Tư vấn kết quả xét nghiệm HIV, hỗ trợ tâm lý và hướng dẫn các bước tiếp theo', 45, 250000.0, 'hiv-testing', '/services/post-test.svg', '2025-01-01 00:00:00+00', NULL),

('service-004', 'Điều trị ARV định kỳ', 'Khám định kỳ, theo dõi điều trị thuốc kháng virus (ARV) và quản lý tác dụng phụ', 45, 500000.0, 'hiv-treatment', '/services/arv-treatment.svg', '2025-01-01 00:00:00+00', NULL),

('service-005', 'Tư vấn tuân thủ điều trị', 'Tư vấn về tầm quan trọng của việc tuân thủ điều trị ARV và các chiến lược để duy trì tuân thủ điều trị', 60, 350000.0, 'hiv-treatment', '/services/adherence.svg', '2025-01-01 00:00:00+00', NULL),

('service-006', 'Hỗ trợ tâm lý cho người nhiễm HIV', 'Tư vấn tâm lý chuyên sâu giúp đối phó với các vấn đề tâm lý, căng thẳng và kỳ thị liên quan đến HIV', 60, 400000.0, 'mental-health', '/services/mental-health.svg', '2025-01-01 00:00:00+00', NULL),

('service-007', 'Xét nghiệm tải lượng virus HIV', 'Xét nghiệm định lượng để đo mức độ virus HIV trong máu, giúp đánh giá hiệu quả điều trị', 30, 700000.0, 'hiv-testing', '/services/viral-load.svg', '2025-01-01 00:00:00+00', NULL),

('service-008', 'Xét nghiệm CD4', 'Xét nghiệm đếm tế bào CD4 để đánh giá tình trạng hệ miễn dịch của người nhiễm HIV', 30, 500000.0, 'hiv-testing', '/services/cd4-test.svg', '2025-01-01 00:00:00+00', NULL),

('service-009', 'Tư vấn dinh dưỡng cho người nhiễm HIV', 'Tư vấn về chế độ dinh dưỡng phù hợp để tăng cường sức khỏe và hỗ trợ điều trị HIV', 45, 300000.0, 'hiv-care', '/services/nutrition.svg', '2025-01-01 00:00:00+00', NULL),

('service-010', 'Tư vấn PrEP (Dự phòng trước phơi nhiễm)', 'Tư vấn và đánh giá khả năng sử dụng thuốc PrEP để dự phòng HIV trước phơi nhiễm', 45, 350000.0, 'hiv-prevention', '/services/prep.svg', '2025-01-01 00:00:00+00', NULL);

-- 6. INSERT DOCTOR TIME SLOTS (Working Schedule)
-- =====================================================

INSERT INTO public."TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
-- Dr. Minh Nguyễn (Monday, Wednesday, Friday)
('slot-001', 'doctor-001', 1, '08:00', '12:00'),
('slot-002', 'doctor-001', 1, '13:00', '17:00'),
('slot-003', 'doctor-001', 3, '08:00', '12:00'),
('slot-004', 'doctor-001', 3, '13:00', '17:00'),
('slot-005', 'doctor-001', 5, '08:00', '12:00'),
('slot-006', 'doctor-001', 5, '13:00', '17:00'),

-- Dr. Hoa Trần (Tuesday, Thursday, Saturday)
('slot-007', 'doctor-002', 2, '08:00', '12:00'),
('slot-008', 'doctor-002', 2, '13:00', '17:00'),
('slot-009', 'doctor-002', 4, '08:00', '12:00'),
('slot-010', 'doctor-002', 4, '13:00', '17:00'),
('slot-011', 'doctor-002', 6, '08:00', '12:00'),

-- Dr. Tuấn Lê (Monday to Friday)
('slot-012', 'doctor-003', 1, '08:00', '12:00'),
('slot-013', 'doctor-003', 2, '08:00', '12:00'),
('slot-014', 'doctor-003', 3, '08:00', '12:00'),
('slot-015', 'doctor-003', 4, '08:00', '12:00'),
('slot-016', 'doctor-003', 5, '08:00', '12:00'),
('slot-017', 'doctor-003', 1, '13:00', '17:00'),
('slot-018', 'doctor-003', 2, '13:00', '17:00'),
('slot-019', 'doctor-003', 3, '13:00', '17:00'),
('slot-020', 'doctor-003', 4, '13:00', '17:00'),
('slot-021', 'doctor-003', 5, '13:00', '17:00');

-- 7. INSERT ARV DRUGS (HIV Treatment Medications)
-- =====================================================

INSERT INTO public."ARVDrugs" ("Id", "Name", "GenericName", "BrandName", "DrugClass", "Description", "Dosage", "Form", "SideEffects", "Contraindications", "Instructions", "IsActive", "IsPregnancySafe", "IsPediatricSafe", "MinAge", "MinWeight", "CreatedAt", "UpdatedAt", "CreatedBy", "UpdatedBy") VALUES
(1, 'Efavirenz', 'Efavirenz', 'Sustiva', 'NNRTI', 'Non-nucleoside reverse transcriptase inhibitor', '600mg', 'Tablet', 'Dizziness, drowsiness, trouble concentrating, unusual dreams', 'Pregnancy (first trimester), severe liver disease', 'Take once daily at bedtime on empty stomach', true, false, true, 3, 10.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-001', 'doctor-001'),

(2, 'Tenofovir/Emtricitabine', 'Tenofovir DF/Emtricitabine', 'Truvada', 'NRTI', 'Nucleoside reverse transcriptase inhibitor combination', '300mg/200mg', 'Tablet', 'Nausea, diarrhea, headache, fatigue', 'Severe kidney disease, lactic acidosis', 'Take once daily with or without food', true, true, true, 12, 35.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-001', 'doctor-001'),

(3, 'Dolutegravir', 'Dolutegravir', 'Tivicay', 'INSTI', 'Integrase strand transfer inhibitor', '50mg', 'Tablet', 'Headache, insomnia, fatigue', 'Hypersensitivity to dolutegravir', 'Take once daily with or without food', true, true, true, 6, 20.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-001', 'doctor-001'),

(4, 'Rilpivirine', 'Rilpivirine', 'Edurant', 'NNRTI', 'Non-nucleoside reverse transcriptase inhibitor', '25mg', 'Tablet', 'Depression, insomnia, headache', 'Concurrent use with proton pump inhibitors', 'Take once daily with a meal', true, true, false, 18, 50.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-002', 'doctor-002'),

(5, 'Darunavir/Ritonavir', 'Darunavir/Ritonavir', 'Prezista/Norvir', 'PI', 'Protease inhibitor with booster', '800mg/100mg', 'Tablet', 'Diarrhea, nausea, headache, rash', 'Severe liver impairment', 'Take once daily with food', true, false, true, 3, 15.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-003', 'doctor-003');

-- 8. INSERT ARV REGIMENS (Treatment Protocols)
-- =====================================================

INSERT INTO public."ARVRegimens" ("Id", "Name", "Description", "RegimenType", "TargetPopulation", "Instructions", "Monitoring", "IsActive", "IsPregnancySafe", "IsPediatricSafe", "MinAge", "MinWeight", "CreatedAt", "UpdatedAt", "CreatedBy", "UpdatedBy") VALUES
(1, 'TDF/FTC + DTG', 'First-line regimen for adults and adolescents - preferred option', 'FirstLine', 'Adult', 'Take all medications once daily, preferably at the same time each day. Can be taken with or without food.', 'Monitor viral load at 3, 6, and 12 months, then every 6 months. Check kidney function every 6 months.', true, true, false, 18, 50.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-001', 'doctor-001'),

(2, 'TDF/FTC + EFV', 'Alternative first-line regimen', 'FirstLine', 'Adult', 'Take TDF/FTC in morning with or without food. Take EFV at bedtime on empty stomach.', 'Monitor viral load and liver function regularly. Check for CNS side effects.', true, false, false, 18, 50.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-001', 'doctor-001'),

(3, 'TDF/FTC + RPV', 'Alternative regimen for patients with low viral load', 'FirstLine', 'Adult', 'Take all medications once daily with a meal. Avoid antacids 2 hours before and after.', 'Monitor viral load closely. Suitable for patients with VL < 100,000 copies/ml.', true, true, false, 18, 50.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-002', 'doctor-002'),

(4, 'DRV/r + TDF/FTC', 'Second-line regimen for treatment-experienced patients', 'SecondLine', 'Adult', 'Take all medications once daily with food. Ensure adequate food intake.', 'Monitor viral load, liver function, and lipid profile regularly.', true, false, true, 18, 50.0, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'doctor-003', 'doctor-003');

-- 9. INSERT ARV REGIMEN DRUGS (Drug combinations in regimens)
-- =====================================================

INSERT INTO public."ARVRegimenDrugs" ("Id", "RegimenId", "DrugId", "Dosage", "Frequency", "Timing", "SpecialInstructions", "SortOrder", "CreatedAt") VALUES
-- TDF/FTC + DTG regimen
(1, 1, 2, '300mg/200mg', 'Once daily', 'With or without food', 'Take at the same time every day', 1, '2025-01-01 00:00:00+00'),
(2, 1, 3, '50mg', 'Once daily', 'With or without food', 'Can be taken with TDF/FTC', 2, '2025-01-01 00:00:00+00'),

-- TDF/FTC + EFV regimen
(3, 2, 2, '300mg/200mg', 'Once daily', 'Morning with food', 'Take in the morning', 1, '2025-01-01 00:00:00+00'),
(4, 2, 1, '600mg', 'Once daily', 'Bedtime on empty stomach', 'Take 2-3 hours after dinner', 2, '2025-01-01 00:00:00+00'),

-- TDF/FTC + RPV regimen
(5, 3, 2, '300mg/200mg', 'Once daily', 'With meal', 'Take with substantial meal', 1, '2025-01-01 00:00:00+00'),
(6, 3, 4, '25mg', 'Once daily', 'With meal', 'Take with TDF/FTC and food', 2, '2025-01-01 00:00:00+00'),

-- DRV/r + TDF/FTC regimen
(7, 4, 5, '800mg/100mg', 'Once daily', 'With food', 'Take with substantial meal', 1, '2025-01-01 00:00:00+00'),
(8, 4, 2, '300mg/200mg', 'Once daily', 'With food', 'Take with DRV/r and food', 2, '2025-01-01 00:00:00+00');

-- 10. INSERT REALISTIC APPOINTMENTS (From July 13, 2025 onwards)
-- =====================================================

INSERT INTO public."Appointments" (id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name, date, start_time, end_time, status, notes, created_at, updated_at, appointment_type, meeting_link) VALUES
-- Dr. Minh Nguyễn appointments
('apt-001', 'customer-001', 'Anh Nguyễn Văn', 'doctor-001', 'Minh Nguyễn', 'service-002', 'Xét nghiệm HIV nhanh', '2025-07-14 00:00:00+00', '09:00', '09:30', 1, 'Xét nghiệm HIV định kỳ', '2025-07-13 08:00:00+00', NULL, 0, NULL),

('apt-002', 'customer-003', 'Cường Lê Văn', 'doctor-001', 'Minh Nguyễn', 'service-004', 'Điều trị ARV định kỳ', '2025-07-16 00:00:00+00', '10:00', '10:45', 1, 'Tái khám điều trị ARV tháng thứ 3', '2025-07-13 09:30:00+00', NULL, 0, NULL),

('apt-003', 'customer-005', 'Em Hoàng Văn', 'doctor-001', 'Minh Nguyễn', 'service-007', 'Xét nghiệm tải lượng virus HIV', '2025-07-18 00:00:00+00', '14:00', '14:30', 0, 'Kiểm tra hiệu quả điều trị sau 6 tháng', '2025-07-13 10:15:00+00', NULL, 0, NULL),

('apt-004', 'customer-007', 'Hùng Đỗ Văn', 'doctor-001', 'Minh Nguyễn', 'service-001', 'Tư vấn trước xét nghiệm HIV', '2025-07-19 00:00:00+00', '15:30', '16:00', 0, 'Tư vấn trước xét nghiệm lần đầu', '2025-07-13 11:00:00+00', NULL, 0, NULL),

-- Dr. Hoa Trần appointments
('apt-005', 'customer-002', 'Bình Trần Thị', 'doctor-002', 'Hoa Trần', 'service-006', 'Hỗ trợ tâm lý cho người nhiễm HIV', '2025-07-15 00:00:00+00', '09:00', '10:00', 1, 'Tư vấn tâm lý sau chẩn đoán HIV', '2025-07-13 08:30:00+00', NULL, 0, NULL),

('apt-006', 'customer-004', 'Dung Phạm Thị', 'doctor-002', 'Hoa Trần', 'service-005', 'Tư vấn tuân thủ điều trị', '2025-07-17 00:00:00+00', '14:00', '15:00', 1, 'Tư vấn về tuân thủ điều trị ARV', '2025-07-13 09:00:00+00', NULL, 0, NULL),

('apt-007', 'customer-006', 'Giang Vũ Thị', 'doctor-002', 'Hoa Trần', 'service-003', 'Tư vấn sau xét nghiệm HIV', '2025-07-19 00:00:00+00', '10:30', '11:15', 0, 'Tư vấn kết quả xét nghiệm HIV dương tính', '2025-07-13 10:45:00+00', NULL, 0, NULL),

('apt-008', 'customer-008', 'Lan Bùi Thị', 'doctor-002', 'Hoa Trần', 'service-009', 'Tư vấn dinh dưỡng cho người nhiễm HIV', '2025-07-20 00:00:00+00', '08:30', '09:15', 0, 'Tư vấn chế độ dinh dưỡng phù hợp', '2025-07-13 11:30:00+00', NULL, 0, NULL),

-- Dr. Tuấn Lê appointments
('apt-009', 'customer-009', 'Minh Đinh Văn', 'doctor-003', 'Tuấn Lê', 'service-008', 'Xét nghiệm CD4', '2025-07-14 00:00:00+00', '08:30', '09:00', 1, 'Xét nghiệm CD4 định kỳ', '2025-07-13 08:15:00+00', NULL, 0, NULL),

('apt-010', 'customer-010', 'Nga Lý Thị', 'doctor-003', 'Tuấn Lê', 'service-010', 'Tư vấn PrEP (Dự phòng trước phơi nhiễm)', '2025-07-16 00:00:00+00', '09:30', '10:15', 1, 'Tư vấn về PrEP cho nhóm nguy cơ cao', '2025-07-13 09:45:00+00', NULL, 0, NULL),

('apt-011', 'customer-001', 'Anh Nguyễn Văn', 'doctor-003', 'Tuấn Lê', 'service-004', 'Điều trị ARV định kỳ', '2025-07-18 00:00:00+00', '11:00', '11:45', 0, 'Tái khám điều trị ARV', '2025-07-13 10:30:00+00', NULL, 0, NULL),

('apt-012', 'customer-003', 'Cường Lê Văn', 'doctor-003', 'Tuấn Lê', 'service-007', 'Xét nghiệm tải lượng virus HIV', '2025-07-21 00:00:00+00', '14:30', '15:00', 0, 'Theo dõi hiệu quả điều trị', '2025-07-13 12:00:00+00', NULL, 0, NULL);

-- 11. INSERT PATIENT ARV REGIMENS (HIV Treatment Assignments)
-- =====================================================

INSERT INTO public."PatientRegimens" ("Id", "PatientId", "RegimenId", "PrescribedBy", "PrescribedDate", "StartDate", "EndDate", "Status", "Notes", "DiscontinuationReason", "LastReviewDate", "NextReviewDate", "ReviewedBy", "CreatedAt", "UpdatedAt") VALUES
(1, 'customer-001', 1, 'doctor-001', '2025-01-15 00:00:00+00', '2025-01-20 00:00:00+00', NULL, 'Active', 'Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ đáng kể', '', '2025-07-10 00:00:00+00', '2025-10-10 00:00:00+00', 'doctor-001', '2025-01-15 00:00:00+00', '2025-07-10 00:00:00+00'),

(2, 'customer-002', 3, 'doctor-002', '2025-02-20 00:00:00+00', '2025-02-25 00:00:00+00', NULL, 'Active', 'Bệnh nhân có viral load thấp, phù hợp với regimen RPV', '', '2025-07-05 00:00:00+00', '2025-10-05 00:00:00+00', 'doctor-002', '2025-02-20 00:00:00+00', '2025-07-05 00:00:00+00'),

(3, 'customer-003', 1, 'doctor-001', '2025-03-10 00:00:00+00', '2025-03-15 00:00:00+00', NULL, 'Active', 'Điều trị hiệu quả, viral load không phát hiện được', '', '2025-07-08 00:00:00+00', '2025-10-08 00:00:00+00', 'doctor-001', '2025-03-10 00:00:00+00', '2025-07-08 00:00:00+00'),

(4, 'customer-005', 2, 'doctor-001', '2025-04-05 00:00:00+00', '2025-04-10 00:00:00+00', '2025-06-30 00:00:00+00', 'Discontinued', 'Chuyển sang regimen khác do tác dụng phụ CNS từ EFV', 'CNS side effects from Efavirenz', '2025-06-25 00:00:00+00', NULL, 'doctor-001', '2025-04-05 00:00:00+00', '2025-06-30 00:00:00+00'),

(5, 'customer-005', 1, 'doctor-001', '2025-07-01 00:00:00+00', '2025-07-05 00:00:00+00', NULL, 'Active', 'Chuyển sang TDF/FTC + DTG, bệnh nhân dung nạp tốt', '', NULL, '2025-10-05 00:00:00+00', 'doctor-001', '2025-07-01 00:00:00+00', '2025-07-05 00:00:00+00'),

(6, 'customer-006', 4, 'doctor-003', '2025-05-15 00:00:00+00', '2025-05-20 00:00:00+00', NULL, 'Active', 'Bệnh nhân kháng thuốc tuyến 1, chuyển sang tuyến 2', '', '2025-07-12 00:00:00+00', '2025-10-12 00:00:00+00', 'doctor-003', '2025-05-15 00:00:00+00', '2025-07-12 00:00:00+00');

-- 12. INSERT CONSULTATION TOPICS
-- =====================================================

INSERT INTO public."ConsultationTopics" (id, name, description, created_at, updated_at) VALUES
('topic-001', 'ARV', 'Thuốc kháng virus và phác đồ điều trị', '2025-01-01 00:00:00+00', NULL),
('topic-002', 'CD4', 'Xét nghiệm CD4 và ý nghĩa', '2025-01-01 00:00:00+00', NULL),
('topic-003', 'Tải lượng virus', 'Xét nghiệm tải lượng virus và ý nghĩa', '2025-01-01 00:00:00+00', NULL),
('topic-004', 'Tác dụng phụ', 'Tác dụng phụ của thuốc ARV và cách xử lý', '2025-01-01 00:00:00+00', NULL),
('topic-005', 'Dinh dưỡng', 'Chế độ dinh dưỡng cho người sống chung với HIV', '2025-01-01 00:00:00+00', NULL),
('topic-006', 'Sức khỏe tinh thần', 'Sức khỏe tinh thần và tâm lý', '2025-01-01 00:00:00+00', NULL),
('topic-007', 'Phòng ngừa', 'Phòng ngừa lây nhiễm và tái nhiễm', '2025-01-01 00:00:00+00', NULL),
('topic-008', 'Khác', 'Các chủ đề khác', '2025-01-01 00:00:00+00', NULL);

-- 13. INSERT CONSULTATIONS (Online Q&A)
-- =====================================================

INSERT INTO public."Consultations" (id, patient_id, title, question, category, topic, status, created_at, updated_at) VALUES
('consult-001', 'customer-004', 'Tác dụng phụ của thuốc ARV', 'Tôi đang uống thuốc ARV được 2 tuần nhưng thường xuyên bị buồn nôn và chóng mặt. Đây có phải là tác dụng phụ bình thường không? Tôi có nên ngừng uống thuốc không?', 'Tác dụng phụ của thuốc', 'topic-004', 'assigned', '2025-07-13 08:30:00+00', NULL),

('consult-002', 'customer-007', 'Kết quả xét nghiệm CD4', 'Kết quả xét nghiệm CD4 của tôi là 350 cells/μL. Con số này có nghĩa là gì? Tôi có cần bắt đầu điều trị ARV ngay không?', 'Xét nghiệm và chẩn đoán', 'topic-002', 'assigned', '2025-07-13 09:15:00+00', NULL),

('consult-003', 'customer-008', 'Chế độ dinh dưỡng cho người HIV', 'Tôi vừa được chẩn đoán HIV. Bác sĩ có thể tư vấn chế độ ăn uống như thế nào để tăng cường sức khỏe và hỗ trợ điều trị không?', 'Dinh dưỡng và lối sống', 'topic-005', 'assigned', '2025-07-13 10:00:00+00', NULL),

('consult-004', 'customer-009', 'Tuân thủ điều trị ARV', 'Tôi thỉnh thoảng quên uống thuốc ARV. Điều này có ảnh hưởng nghiêm trọng đến hiệu quả điều trị không? Làm thế nào để nhớ uống thuốc đều đặn?', 'Điều trị và tuân thủ', 'topic-001', 'answered', '2025-07-12 14:20:00+00', '2025-07-13 09:30:00+00'),

('consult-005', 'customer-010', 'Phòng ngừa lây nhiễm cho bạn đời', 'Tôi đang điều trị HIV và có bạn đời chưa nhiễm. Làm thế nào để bảo vệ bạn đời khỏi bị lây nhiễm? PrEP có phù hợp không?', 'Phòng ngừa lây nhiễm', 'topic-007', 'assigned', '2025-07-13 11:45:00+00', NULL);

-- 14. INSERT CONSULTATION ANSWERS
-- =====================================================

INSERT INTO public."Answers" (id, consultation_id, responder_id, responder_name, content, created_at, updated_at) VALUES
('answer-001', 'consult-004', 'doctor-001', 'Minh Nguyễn', 'Việc quên uống thuốc ARV có thể ảnh hưởng nghiêm trọng đến hiệu quả điều trị. Để duy trì tuân thủ điều trị tốt, bạn có thể: 1) Đặt báo thức hàng ngày, 2) Sử dụng hộp thuốc theo ngày, 3) Liên kết việc uống thuốc với hoạt động hàng ngày khác. Nếu quên uống, hãy uống ngay khi nhớ ra (trừ khi gần giờ uống liều tiếp theo).', '2025-07-13 09:30:00+00', NULL);

-- 15. INSERT PATIENT ADHERENCE RECORDS
-- =====================================================

INSERT INTO public."PatientAdherences" ("Id", "PatientRegimenId", "RecordDate", "AdherencePercentage", "Period", "Notes", "Challenges", "RecordedBy", "CreatedAt") VALUES
(1, 1, '2025-07-01 00:00:00+00', 95.0, 'Monthly', 'Bệnh nhân tuân thủ điều trị tốt, chỉ quên uống 2 liều trong tháng', 'Thỉnh thoảng quên uống thuốc khi đi công tác', 'doctor-001', '2025-07-01 00:00:00+00'),

(2, 2, '2025-07-01 00:00:00+00', 98.0, 'Monthly', 'Tuân thủ điều trị rất tốt, không có vấn đề gì', 'Không có', 'doctor-002', '2025-07-01 00:00:00+00'),

(3, 3, '2025-07-01 00:00:00+00', 92.0, 'Monthly', 'Bệnh nhân có cải thiện trong tuân thủ điều trị', 'Ban đầu khó nhớ giờ uống thuốc', 'doctor-001', '2025-07-01 00:00:00+00'),

(4, 5, '2025-07-10 00:00:00+00', 100.0, 'Weekly', 'Tuân thủ hoàn hảo với regimen mới', 'Không có', 'doctor-001', '2025-07-10 00:00:00+00'),

(5, 6, '2025-07-01 00:00:00+00', 88.0, 'Monthly', 'Cần theo dõi chặt chẽ hơn về tuân thủ điều trị', 'Khó khăn với việc uống thuốc nhiều viên', 'doctor-003', '2025-07-01 00:00:00+00');

-- 16. INSERT PATIENT REGIMEN HISTORIES
-- =====================================================

INSERT INTO public."PatientRegimenHistories" ("Id", "PatientRegimenId", "Action", "Details", "Reason", "PerformedBy", "PerformedAt", "Notes") VALUES
(1, 1, 'Started', 'Bắt đầu điều trị với TDF/FTC + DTG', 'Chẩn đoán HIV mới, bắt đầu điều trị tuyến 1', 'doctor-001', '2025-01-20 00:00:00+00', 'Bệnh nhân được tư vấn đầy đủ về điều trị'),

(2, 2, 'Started', 'Bắt đầu điều trị với TDF/FTC + RPV', 'Viral load thấp, phù hợp với RPV', 'doctor-002', '2025-02-25 00:00:00+00', 'Lựa chọn regimen phù hợp với tình trạng bệnh nhân'),

(3, 4, 'Discontinued', 'Ngừng TDF/FTC + EFV', 'Tác dụng phụ CNS nghiêm trọng', 'doctor-001', '2025-06-30 00:00:00+00', 'Bệnh nhân không dung nạp được EFV'),

(4, 5, 'Started', 'Chuyển sang TDF/FTC + DTG', 'Thay thế regimen do tác dụng phụ', 'doctor-001', '2025-07-05 00:00:00+00', 'Bệnh nhân dung nạp tốt regimen mới'),

(5, 6, 'Started', 'Bắt đầu điều trị tuyến 2 với DRV/r + TDF/FTC', 'Kháng thuốc tuyến 1', 'doctor-003', '2025-05-20 00:00:00+00', 'Kết quả xét nghiệm kháng thuốc cho thấy cần chuyển tuyến 2');

-- =====================================================
-- END OF DATABASE SEED SCRIPT
-- =====================================================
