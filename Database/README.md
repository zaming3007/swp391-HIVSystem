# HIV Healthcare System Database

## Mô tả
Đây là database cho hệ thống quản lý chăm sóc sức khỏe HIV, bao gồm:
- Quản lý người dùng (admin, bác sĩ, bệnh nhân, nhân viên)
- Quản lý cuộc hẹn và lịch làm việc của bác sĩ
- Quản lý thuốc ARV và phác đồ điều trị
- Theo dõi tuân thủ uống thuốc
- Quản lý kết quả xét nghiệm
- Hệ thống tư vấn trực tuyến
- Blog và tài liệu giáo dục
- Báo cáo và thống kê

## Cấu trúc file

### 1. HIVHealthcareSystem.sql
File tạo database và các bảng chính của hệ thống.

**Cách chạy:**
```sql
-- Mở SQL Server Management Studio
-- Chạy toàn bộ nội dung file HIVHealthcareSystem.sql
```

### 2. HIVHealthcareSystem_SampleData.sql
File chứa dữ liệu mẫu để test hệ thống.

**Cách chạy:**
```sql
-- Sau khi đã chạy file HIVHealthcareSystem.sql
-- Chạy toàn bộ nội dung file HIVHealthcareSystem_SampleData.sql
```

## Dữ liệu mẫu bao gồm

### Users & Roles
- **Admin**: `admin` / `hashed_password_admin`
- **Doctors**: 
  - `dr.nguyen` - HIV/AIDS Specialist
  - `dr.tran` - Internal Medicine
  - `dr.le` - Infectious Disease
- **Patients**: 
  - `patient001` - Nguyen Thi D
  - `patient002` - Tran Van E  
  - `patient003` - Le Thi F
  - `patient004` - Pham Van G
- **Staff**: Nurse, Pharmacist, Lab Technician

### Medical Data
- **4 Patients** với tiền sử bệnh HIV và điều trị ARV
- **5 Thuốc ARV** phổ biến (Efavirenz, Tenofovir/Emtricitabine, Atazanavir, Ritonavir, Dolutegravir)
- **4 Phác đồ điều trị** active
- **Kết quả xét nghiệm** CD4, Viral Load
- **Lịch hẹn** và **lịch làm việc bác sĩ**

### Additional Features
- **3 Cơ sở y tế** tại TP.HCM
- **Blog posts** về phòng chống HIV
- **Tài liệu giáo dục** cho bệnh nhân
- **Tư vấn ẩn danh** 
- **Notifications** và **reminders**
- **Survey** đánh giá dịch vụ

## Cấu trúc Database chính

### Core Tables
- **Users**: Quản lý tài khoản người dùng
- **Roles**: Phân quyền hệ thống
- **Patients**: Thông tin bệnh nhân
- **Doctors**: Thông tin bác sĩ
- **Facilities**: Cơ sở y tế

### Medical Management
- **Appointments**: Quản lý lịch hẹn
- **TreatmentPlans**: Phác đồ điều trị
- **ARVMedications**: Thuốc ARV
- **TestResults**: Kết quả xét nghiệm
- **MedicationAdherence**: Tuân thủ uống thuốc

### Communication
- **ConsultationSessions**: Phiên tư vấn
- **AnonymousConsultations**: Tư vấn ẩn danh
- **Notifications**: Thông báo

### Content Management
- **BlogPosts**: Bài viết blog
- **EducationalResources**: Tài liệu giáo dục

### System
- **AuditLogs**: Nhật ký hệ thống
- **SystemSettings**: Cài đặt hệ thống

## Testing
Sau khi import dữ liệu mẫu, bạn có thể test các chức năng:

1. **Login**: Sử dụng các tài khoản mẫu
2. **Appointment booking**: Đặt lịch hẹn với bác sĩ
3. **Treatment monitoring**: Xem phác đồ điều trị và kết quả xét nghiệm
4. **Medication adherence**: Theo dõi việc uống thuốc
5. **Consultation**: Tư vấn trực tuyến
6. **Educational content**: Đọc blog và tài liệu

## Lưu ý quan trọng
- Tất cả password trong dữ liệu mẫu đều đã được hash
- Dữ liệu mẫu chỉ dùng để test, không dùng trong production
- Cần cấu hình connection string phù hợp trong ứng dụng
- Backup database thường xuyên

## Môi trường phát triển
- **Database**: SQL Server 2019+
- **Compatibility**: SQL Server Express, LocalDB
- **Character Set**: Unicode (NVARCHAR) để hỗ trợ tiếng Việt 