# 🔔 HIV System - Automatic Notification System

## Tổng quan
Hệ thống thông báo tự động cho HIV Healthcare System, tự động gửi thông báo khi có các sự kiện liên quan đến lịch hẹn.

## 🚀 Các tính năng chính

### 1. **Thông báo tự động cho các sự kiện lịch hẹn:**
- ✅ **Tạo lịch hẹn mới** - Thông báo cho bệnh nhân và bác sĩ
- ✅ **Hủy lịch hẹn** - Thông báo với lý do hủy
- ✅ **Xác nhận lịch hẹn** - Thông báo khi staff/doctor xác nhận
- ✅ **Thay đổi lịch hẹn** - Thông báo khi reschedule
- ✅ **Nhắc nhở lịch hẹn** - Tự động nhắc trước 1-2 ngày
- ✅ **Thay đổi lịch làm việc bác sĩ** - Thông báo cho bệnh nhân bị ảnh hưởng

### 2. **Background Service:**
- ✅ **AppointmentReminderService** - Chạy mỗi giờ để gửi reminder
- ✅ **Tự động phát hiện** lịch hẹn sắp tới
- ✅ **Tránh gửi duplicate** notifications

### 3. **Real-time với SignalR:**
- ✅ **NotificationHub** - Gửi thông báo real-time
- ✅ **Tích hợp** với frontend notification bell

## 📋 API Endpoints

### **Notification Management:**
```http
# Lấy thông báo của user
GET /api/Notification/user/{userId}
GET /api/Notification/user/{userId}?unreadOnly=true

# Đánh dấu đã đọc
PUT /api/Notification/{id}/read
PUT /api/Notification/mark-all-read

# Xóa thông báo
DELETE /api/Notification/{id}

# Tạo thông báo thủ công (admin/staff only)
POST /api/Notification
```

### **Appointment Event Triggers:**
```http
# Trigger thông báo tạo lịch hẹn
POST /api/Notification/appointment/{appointmentId}/created

# Trigger thông báo hủy lịch hẹn
POST /api/Notification/appointment/{appointmentId}/cancelled
Body: { "cancelledBy": "doctor|patient|staff|admin" }

# Trigger thông báo xác nhận lịch hẹn
POST /api/Notification/appointment/{appointmentId}/confirmed

# Trigger thông báo thay đổi lịch hẹn
POST /api/Notification/appointment/{appointmentId}/rescheduled
Body: { "oldDateTime": "14/07/2025 09:00", "newDateTime": "15/07/2025 10:00" }

# Trigger thông báo thay đổi lịch bác sĩ
POST /api/Notification/doctor/{doctorId}/schedule-changed
Body: { "changeDetails": "Lịch làm việc đã được cập nhật" }
```

### **Demo & Testing:**
```http
# Tạo demo notifications
GET /api/Notification/demo

# Test notification
GET /api/Notification/test
```

## 🔧 Cách sử dụng trong code

### **1. Tự động gửi thông báo khi tạo appointment:**
```csharp
// Trong AppointmentService.CreateAsync()
var appointment = await _appointmentService.CreateAsync(patientId, patientName, appointmentDto);

// Notification được gửi tự động sau khi tạo thành công
// Không cần gọi thêm code nào
```

### **2. Tự động gửi thông báo khi cập nhật appointment:**
```csharp
// Trong AppointmentService.UpdateAsync()
await _appointmentService.UpdateAsync(appointmentId, new AppointmentUpdateDto 
{
    Status = AppointmentStatus.Confirmed
});

// Notification được gửi tự động dựa trên status change
```

### **3. Manual trigger notifications:**
```csharp
// Inject INotificationService
private readonly INotificationService _notificationService;

// Gửi thông báo custom
await _notificationService.CreateNotificationAsync(new CreateNotificationRequest
{
    UserId = "customer-001",
    Title = "Thông báo quan trọng",
    Message = "Nội dung thông báo...",
    Type = NotificationTypes.APPOINTMENT,
    Priority = NotificationPriorities.HIGH,
    ActionUrl = "/appointments",
    ActionText = "Xem chi tiết"
});
```

### **4. Gửi thông báo cho specific events:**
```csharp
// Thông báo hủy lịch hẹn
await _notificationService.NotifyAppointmentCancelledAsync(appointmentId, "doctor");

// Thông báo xác nhận lịch hẹn
await _notificationService.NotifyAppointmentConfirmedAsync(appointmentId);

// Thông báo thay đổi lịch bác sĩ
await _notificationService.NotifyDoctorScheduleChangedAsync(doctorId, "Lịch làm việc đã thay đổi");
```

## 📊 Database Schema

### **Notifications Table:**
```sql
CREATE TABLE "Notifications" (
    "Id" text PRIMARY KEY,
    "UserId" varchar(50) NOT NULL,           -- Người nhận
    "Title" varchar(100) NOT NULL,           -- Tiêu đề
    "Message" varchar(500) NOT NULL,         -- Nội dung
    "Type" varchar(50) NOT NULL,             -- appointment, consultation, arv, etc.
    "Priority" varchar(50) DEFAULT 'normal', -- low, normal, high, urgent
    "ActionUrl" varchar(200),                -- URL để navigate
    "ActionText" varchar(100),               -- Text cho action button
    "RelatedEntityId" varchar(50),           -- ID của entity liên quan
    "RelatedEntityType" varchar(50),         -- appointment, consultation, etc.
    "IsRead" boolean DEFAULT false,
    "IsDeleted" boolean DEFAULT false,
    "CreatedAt" timestamptz NOT NULL,
    "ReadAt" timestamptz,
    "DeletedAt" timestamptz,
    "CreatedBy" varchar(50),                 -- Người tạo
    "Metadata" varchar(1000)                 -- JSON metadata
);
```

## 🎯 Notification Types & Priorities

### **Types:**
- `appointment` - Thông báo lịch hẹn
- `consultation` - Thông báo tư vấn
- `arv` - Thông báo ARV/thuốc
- `blog` - Thông báo blog
- `system` - Thông báo hệ thống
- `reminder` - Thông báo nhắc nhở
- `test_result` - Thông báo kết quả xét nghiệm

### **Priorities:**
- `low` - Thông báo thông thường
- `normal` - Thông báo bình thường (default)
- `high` - Thông báo quan trọng
- `urgent` - Thông báo khẩn cấp

## 🔄 Workflow tự động

### **1. Khi tạo lịch hẹn:**
```
User tạo appointment → AppointmentService.CreateAsync() 
→ Lưu vào database → NotificationService.NotifyAppointmentCreatedAsync()
→ Tạo notification cho patient & doctor → SignalR broadcast
```

### **2. Khi hủy lịch hẹn:**
```
User hủy appointment → AppointmentService.UpdateAsync(Status=Cancelled)
→ NotificationService.NotifyAppointmentCancelledAsync()
→ Tạo notification với lý do hủy → SignalR broadcast
```

### **3. Background reminder:**
```
AppointmentReminderService (chạy mỗi giờ)
→ Tìm appointments trong 1-2 ngày tới
→ Kiểm tra chưa gửi reminder
→ NotificationService.NotifyAppointmentReminderAsync()
→ Tạo reminder notification
```

## 🧪 Testing

### **1. Test demo notifications:**
```bash
# Tạo demo notifications
curl http://localhost:5002/api/Notification/demo

# Xem notifications
curl http://localhost:5002/api/Notification/user/customer-001

# Xem chỉ unread
curl http://localhost:5002/api/Notification/user/customer-001?unreadOnly=true
```

### **2. Test appointment workflow:**
```bash
# Tạo appointment (sẽ tự động gửi notification)
POST /api/Appointments

# Hủy appointment với lý do
POST /api/Appointments/{id}/cancel-with-reason
Body: { "reason": "Bệnh nhân không thể đến" }

# Xác nhận appointment
POST /api/Appointments/{id}/confirm
```

## 🚀 Production Deployment

### **1. Environment Variables:**
```bash
DATABASE_URL=postgresql://...
ASPNETCORE_URLS=http://localhost:5002
```

### **2. Background Service:**
- AppointmentReminderService sẽ tự động start
- Chạy mỗi giờ để check reminders
- Log errors nhưng không crash app

### **3. SignalR Configuration:**
- Đã cấu hình CORS cho frontend
- Hub endpoint: `/notificationHub`
- Auto-reconnect enabled

## 📝 Notes

- ✅ **Error Handling:** Notification errors không làm crash main workflow
- ✅ **Performance:** Batch operations và pagination
- ✅ **Scalability:** Background service có thể scale horizontal
- ✅ **Monitoring:** Comprehensive logging cho debugging
- ✅ **Security:** Role-based authorization cho admin functions

**Hệ thống notification đã sẵn sàng cho production!** 🎉
