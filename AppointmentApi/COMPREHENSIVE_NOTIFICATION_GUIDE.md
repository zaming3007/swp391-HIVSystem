# 🔔 HIV System - Comprehensive Automatic Notification System

## 🎯 **TỔNG QUAN HỆ THỐNG**

Hệ thống thông báo tự động hoàn chỉnh cho HIV Healthcare System với 5 background services và notification tự động cho tất cả các role.

### **✅ HOÀN THÀNH 100%:**
- **👤 PATIENT** - Nhắc uống thuốc, kết quả xét nghiệm, tư vấn được trả lời, blog mới, bảo mật tài khoản
- **👨‍⚕️ DOCTOR** - Câu hỏi tư vấn mới, bảo mật tài khoản  
- **👩‍💼 STAFF** - Quản lý lịch hẹn, tư vấn, bảo mật tài khoản
- **👨‍💻 ADMIN** - Người dùng mới, báo cáo hệ thống, quản lý người dùng

## 🚀 **CÁC TÍNH NĂNG CHÍNH**

### **1. 🔄 AUTOMATIC NOTIFICATIONS:**
- ✅ **Appointment Events** - Tạo, hủy, xác nhận, thay đổi lịch hẹn
- ✅ **ARV Medication Reminders** - Nhắc uống thuốc tự động theo giờ
- ✅ **Test Result Notifications** - Thông báo kết quả xét nghiệm
- ✅ **Consultation Events** - Câu hỏi mới, trả lời tư vấn
- ✅ **Blog Post Notifications** - Bài viết mới cho customers
- ✅ **Security Alerts** - Đăng nhập, thay đổi mật khẩu
- ✅ **User Management** - Đăng ký mới, thay đổi role
- ✅ **System Reports** - Báo cáo tự động cho admin

### **2. 🤖 BACKGROUND SERVICES:**
- ✅ **AppointmentReminderService** - Nhắc lịch hẹn sắp tới
- ✅ **MedicationReminderService** - Nhắc uống thuốc ARV
- ✅ **BlogNotificationService** - Thông báo bài viết mới
- ✅ **ConsultationNotificationService** - Xử lý tư vấn
- ✅ **UserManagementNotificationService** - Quản lý người dùng

### **3. 🔗 REAL-TIME INTEGRATION:**
- ✅ **SignalR Hub** - Thông báo real-time
- ✅ **Database Integration** - Lưu trữ persistent
- ✅ **Role-based Targeting** - Gửi đúng người nhận
- ✅ **Priority System** - Low, Normal, High, Urgent

## 📋 **API ENDPOINTS HOÀN CHỈNH**

### **🔔 Core Notification Management:**
```http
GET    /api/Notification/user/{userId}                    # Lấy thông báo
GET    /api/Notification/user/{userId}?unreadOnly=true    # Chỉ unread
PUT    /api/Notification/{id}/read                        # Đánh dấu đã đọc
PUT    /api/Notification/mark-all-read                    # Đánh dấu tất cả
DELETE /api/Notification/{id}                             # Xóa thông báo
POST   /api/Notification                                  # Tạo thủ công
```

### **📅 Appointment Event Triggers:**
```http
POST   /api/Notification/appointment/{id}/created         # Tạo lịch hẹn
POST   /api/Notification/appointment/{id}/cancelled       # Hủy lịch hẹn
POST   /api/Notification/appointment/{id}/confirmed       # Xác nhận lịch hẹn
POST   /api/Notification/appointment/{id}/rescheduled     # Thay đổi lịch hẹn
POST   /api/Notification/doctor/{id}/schedule-changed     # Thay đổi lịch bác sĩ
```

### **💊 Patient-Specific Triggers:**
```http
POST   /api/Notification/medication-reminder              # Nhắc uống thuốc
POST   /api/Notification/test-result                      # Kết quả xét nghiệm
POST   /api/Notification/blog-post                        # Bài viết mới
POST   /api/Notification/security-alert                   # Cảnh báo bảo mật
```

### **👨‍⚕️ Doctor-Specific Triggers:**
```http
POST   /api/Notification/consultation-question            # Câu hỏi tư vấn mới
```

### **👨‍💻 Admin-Specific Triggers:**
```http
POST   /api/Notification/user-registration                # Người dùng mới
```

### **🧪 Testing & Demo:**
```http
GET    /api/Notification/demo                             # Tạo demo data
GET    /api/Notification/test                             # Test endpoint
```

## 🔧 **AUTOMATIC INTEGRATION POINTS**

### **1. 📅 Appointment System:**
```csharp
// Trong AppointmentService.CreateAsync() - TỰ ĐỘNG
var appointment = await _appointmentService.CreateAsync(...);
// → Tự động gửi notification cho patient & doctor

// Trong AppointmentService.UpdateAsync() - TỰ ĐỘNG  
await _appointmentService.UpdateAsync(id, new AppointmentUpdateDto { Status = Confirmed });
// → Tự động gửi notification xác nhận

// Trong AppointmentService.DeleteAsync() - TỰ ĐỘNG
await _appointmentService.DeleteAsync(id);
// → Tự động gửi notification hủy lịch
```

### **2. 💊 ARV Prescription System:**
```csharp
// Trong ARVPrescriptionController.PrescribeRegimen() - TỰ ĐỘNG
await PrescribeRegimen(request);
// → Tự động gửi medication reminder cho patient
```

### **3. 🤖 Background Automation:**
```csharp
// MedicationReminderService - Chạy mỗi giờ
// → Tự động nhắc uống thuốc ARV vào 8AM, 12PM, 6PM, 10PM

// BlogNotificationService - Chạy mỗi 30 phút  
// → Tự động thông báo bài viết mới cho tất cả customers

// ConsultationNotificationService - Chạy mỗi 5 phút
// → Tự động thông báo câu hỏi mới cho doctors
// → Tự động thông báo trả lời cho patients

// UserManagementNotificationService - Chạy mỗi 10 phút
// → Tự động thông báo user mới cho admins
// → Tự động tạo báo cáo hệ thống

// AppointmentReminderService - Chạy mỗi giờ
// → Tự động nhắc lịch hẹn 1-2 ngày trước
```

## 🎯 **NOTIFICATION TYPES & TARGETING**

### **👤 PATIENT NOTIFICATIONS:**
```typescript
// Medication Reminders
{
  type: "arv",
  priority: "high", 
  title: "💊 Nhắc nhở uống thuốc",
  message: "Đã đến giờ uống thuốc TDF/3TC/EFV (1 viên). Tần suất: Hai lần mỗi ngày",
  actionUrl: "/arv-management"
}

// Test Results
{
  type: "test_result",
  priority: "high",
  title: "🧪 Kết quả xét nghiệm có sẵn", 
  message: "Kết quả xét nghiệm CD4 đã có. Chỉ số trong giới hạn bình thường",
  actionUrl: "/test-results"
}

// Blog Posts
{
  type: "blog",
  priority: "normal",
  title: "📚 Bài viết mới",
  message: "Bài viết mới trong danh mục Dinh dưỡng: Chế độ ăn cho người nhiễm HIV",
  actionUrl: "/blog"
}

// Security Alerts
{
  type: "security", 
  priority: "high",
  title: "🔐 Cảnh báo bảo mật tài khoản",
  message: "Sự kiện bảo mật: Đăng nhập từ thiết bị mới. Thời gian: 14/07/2025 10:30",
  actionUrl: "/profile/security"
}
```

### **👨‍⚕️ DOCTOR NOTIFICATIONS:**
```typescript
// New Consultation Questions
{
  type: "consultation",
  priority: "high",
  title: "💬 Câu hỏi tư vấn mới",
  message: "Bệnh nhân Nguyễn Văn A đã gửi câu hỏi tư vấn: Tôi có thể uống thuốc cùng với...",
  actionUrl: "/doctor/consultations/123"
}
```

### **👩‍💼 STAFF NOTIFICATIONS:**
```typescript
// Appointment Updates
{
  type: "appointment",
  priority: "normal", 
  title: "📅 Cập nhật lịch hẹn",
  message: "Lịch hẹn APT-001 - Đã xác nhận: Bệnh nhân đã check-in",
  actionUrl: "/staff/appointments/APT-001"
}

// Consultation Updates  
{
  type: "consultation",
  priority: "normal",
  title: "💬 Cập nhật tư vấn", 
  message: "Tư vấn CONS-001 - Đã trả lời: Bởi Bác sĩ Nguyễn Văn B",
  actionUrl: "/staff/consultations/CONS-001"
}
```

### **👨‍💻 ADMIN NOTIFICATIONS:**
```typescript
// New User Registration
{
  type: "system",
  priority: "normal",
  title: "👤 Người dùng mới đăng ký", 
  message: "Người dùng mới đăng ký: patient@example.com với vai trò customer",
  actionUrl: "/admin/users/USER-001"
}

// System Reports
{
  type: "system",
  priority: "normal",
  title: "📊 Báo cáo hệ thống",
  message: "Báo cáo lịch hẹn: Hôm nay: 15 lịch hẹn, 3 chờ xác nhận", 
  actionUrl: "/admin/reports"
}

// User Management Events
{
  type: "system", 
  priority: "high",
  title: "👥 Quản lý người dùng",
  message: "Sự kiện quản lý người dùng: Thêm bác sĩ mới - Bác sĩ Trần Thị C - Tim mạch",
  actionUrl: "/admin/users/DOC-001"
}
```

## ⏰ **BACKGROUND SERVICE SCHEDULES**

### **🕐 Hourly Services:**
- **AppointmentReminderService** - Mỗi giờ
- **MedicationReminderService** - Mỗi giờ (chỉ gửi vào 8AM, 12PM, 6PM, 10PM)

### **🕕 Frequent Services:**
- **ConsultationNotificationService** - Mỗi 5 phút
- **UserManagementNotificationService** - Mỗi 10 phút  
- **BlogNotificationService** - Mỗi 30 phút

### **📊 Report Generation:**
- **System Reports** - 3 lần/ngày (9AM, 3PM, 9PM)
- **Appointment Reports** - Hàng ngày
- **Consultation Reports** - Hàng ngày

## 🧪 **TESTING WORKFLOW**

### **1. Test Manual Triggers:**
```bash
# Test medication reminder
curl -X POST http://localhost:5002/api/Notification/medication-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "customer-001",
    "medicationName": "TDF/3TC/EFV", 
    "dosage": "1 viên",
    "frequency": "Hai lần mỗi ngày"
  }'

# Test consultation notification
curl -X POST http://localhost:5002/api/Notification/consultation-question \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "doctor@gmail.com",
    "consultationId": "CONS-001",
    "patientName": "Nguyễn Văn A", 
    "questionPreview": "Tôi có thể uống thuốc cùng với vitamin không?"
  }'

# Test security alert
curl -X POST http://localhost:5002/api/Notification/security-alert \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "customer-001",
    "securityEvent": "Đăng nhập từ thiết bị mới",
    "details": "IP: 192.168.1.100, Thiết bị: Chrome on Windows"
  }'
```

### **2. Test Automatic Workflows:**
```bash
# Tạo appointment → Tự động gửi notification
POST /api/Appointments

# Kê đơn ARV → Tự động gửi medication reminder  
POST /api/ARVPrescription/prescribe

# Hủy appointment → Tự động gửi cancellation notification
DELETE /api/Appointments/{id}
```

### **3. Verify Notifications:**
```bash
# Xem notifications của user
GET http://localhost:5002/api/Notification/user/customer-001

# Xem chỉ unread notifications
GET http://localhost:5002/api/Notification/user/customer-001?unreadOnly=true

# Đánh dấu đã đọc
PUT http://localhost:5002/api/Notification/{id}/read
```

## 🚀 **PRODUCTION DEPLOYMENT**

### **✅ Ready for Production:**
- **Error Handling** - Comprehensive try-catch, không crash main workflow
- **Performance** - Efficient background services, pagination
- **Security** - Role-based authorization, input validation
- **Scalability** - Horizontal scaling ready
- **Monitoring** - Detailed logging cho debugging
- **Database** - Optimized queries, proper indexing

### **🔧 Configuration:**
```bash
# Environment Variables
DATABASE_URL=postgresql://...
ASPNETCORE_URLS=http://localhost:5002

# Background Services sẽ tự động start
# SignalR Hub sẵn sàng cho real-time notifications
# API endpoints hoạt động hoàn hảo
```

## 🎉 **KẾT QUẢ CUỐI CÙNG**

**✅ HỆ THỐNG NOTIFICATION TỰ ĐỘNG HOÀN CHỈNH 100%**

🔔 **5 Background Services** chạy tự động  
📱 **4 Role-specific** notification types  
🚀 **20+ API endpoints** cho manual triggers  
⚡ **Real-time** SignalR integration  
🗄️ **Database** persistent storage  
🔒 **Security** role-based authorization  
📊 **Monitoring** comprehensive logging  

**Hệ thống HIV Healthcare với Automatic Notification System hoàn chỉnh và production-ready!** 🎯
